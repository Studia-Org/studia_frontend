import { useState } from 'react'
import { ProfessorData } from '../CoursesInside/ProfessorData';
import { getToken } from '../../../../helpers';
import ReactMarkdown from 'react-markdown';
import { API } from '../../../../constant';
import { useAuthContext } from '../../../../context/AuthContext';
import { useNavigate, useParams } from "react-router-dom";
import 'filepond/dist/filepond.min.css';
import '../..//styles/filepondStyles.css'
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import Chip from '@mui/material/Chip';
import Swal from 'sweetalert2';
import { ObjectivesTag } from './ObjectivesTag';
import { Empty, Button } from 'antd';
import MDEditor from '@uiw/react-md-editor';
import { SwitchEdit } from '../CoursesInside/SwitchEdit';


registerPlugin(FilePondPluginImagePreview);


export const ActivityComponent = ({ activityData, idQualification, setUserQualification }) => {
  console.log(activityData);
  const [subsectionContent, setSubsectionContent] = useState(activityData.activity.data.attributes.description);
  const [loading, setLoading] = useState(false);
  const [enableEdit, setEnableEdit] = useState(false);
  const evaluated = activityData.qualification ? true : false;
  const [formData, setFormData] = useState(new FormData());
  const { user } = useAuthContext();
  const { activityId } = useParams();
  let { courseId } = useParams();
  const navigate = useNavigate();
  const USER_OBJECTIVES = [...new Set(user?.user_objectives?.map((objective) => objective.categories.map((category) => category)).flat() || [])];

  function handleFileUpload(file) {
    const dataCopy = formData;
    dataCopy.append('files', file);
    setFormData(dataCopy);
    console.log(dataCopy.getAll('files').length);
    document.getElementById('submit-button-activity').disabled = false;
  }

  async function saveChanges() {
    setLoading(true);
    try {
      const response = await fetch(`${API}/activities/${activityId}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          data: {
            description: subsectionContent,
          }
        }),
      });
      if (response.ok) {
        const result = await response.json();
        setUserQualification({ ...activityData, activity: { activity: result } });
        setEnableEdit(false);
        setLoading(false);
      }
      else throw new Error('Error saving changes');
    } catch (error) {
      console.error(error);
    }
  }

  async function sendFile(result) {

    try {
      let response2 = undefined;
      let files = []
      if (activityData.file.data !== null) {
        files = activityData.file.data.map((file) => file.id);
      }
      files = files.concat(result.map((file) => file.id));
      const qualificationData = {
        data: {
          activity: activityId,
          file: files,
          user: user.id,
          delivered: true,
          delivered_data: new Date(),
          evaluator: activityData.activity.data.attributes.evaluators.data[0].id
        }
      };
      console.log(activityData?.delivered && !evaluated);
      if (activityData.delivered && !evaluated) {
        console.log('put');
        response2 =
          await fetch(`${API}/qualifications/${idQualification}`, {
            method: 'PUT',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(qualificationData),
          });
      }
      else if (!evaluated) {
        console.log('post');
        response2 =
          await fetch(`${API}/qualifications`, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(qualificationData),
          });

      }
      return response2;
    } catch (error) {
      console.error(error);
    }
  }
  async function sendData() {


    try {

      const response = await fetch(`${API}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });
      if (response.ok) {
        const result = await response.json();
        const response_upload = await sendFile(result);
        if (response_upload.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Files uploaded successfully',
          }).then((result) => {
            window.location.reload();

          })
        }
        else throw new Error('Error uploading files');
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        })
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      })
    }
  }

  function renderFiles(file) {
    return (
      <button key={file.id} onClick={() => downloadFile(file)} className='shadow-md rounded-md flex p-3 w-full bg-green-700 text-white'>
        <p className='max-w-[calc(100%-4rem)] overflow-hidden text-ellipsis'>{file.attributes.name}</p>
        <div className='ml-auto mr-2'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        </div>
      </button>
    )
  }

  const downloadFile = async (file) => {
    try {
      const response = await fetch(file.url);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Error al descargar el archivo');
      }
    } catch (error) {
      console.error('Error en la descarga: ', error);
    }
  };

  return (
    <div className='flex flex-col 1.5xl:flex-row items-start 1.5xl:items-start 1.5xl:space-x-24 p-5 sm:p-10'>
      <div className='1.5xl:w-2/4 lg:w-10/12 w-full'>
        <button className='text-sm flex items-center ' onClick={() => navigate(`/app/courses/${courseId}`)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
          <p className='ml-1'>Go back to course</p>
        </button>
        <div className='relative flex items-center mb-6 bg-white rounded-md p-5 shadow-md mt-5'>
          <div className='flex items-center space-x-3 '>
            {
              activityData.activity.data.attributes.type === 'task' ?
                <div className='w-14 h-14 bg-red-500 rounded-md items-center flex justify-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                : activityData.activity.data.attributes.type === 'Lecture' ?
                  <div className='w-14 h-14 bg-blue-500 rounded-md items-center flex justify-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52000-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                    </svg>
                  </div>
                  :
                  <div className='w-14 h-14 bg-red-800 rounded-md'></div>
            }
            <h3 className='font-semibold text-2xl max-w-[calc(100%-7rem)] sm:max-w-[calc(100%-9.5rem)]'>{activityData.activity.data.attributes.title}</h3>
          </div>
          {
            evaluated ?
              <div className='absolute right-0 bg-green-700 rounded-r-md w-14 sm:w-[6rem]  ml-auto flex flex-col h-full justify-center text-center'>

                <p className='text-white font-semibold text-xl'>{activityData.qualification}/10</p>
              </div>

              :
              <Chip className='ml-auto' label="Not finished" color="primary" />
          }
        </div>
        <section className="flex flex-wrap gap-x-2">
          {
            activityData?.activity.data.attributes.categories?.map((category) => {
              return (
                <ObjectivesTag key={category} category={category} USER_OBJECTIVES={USER_OBJECTIVES} />
              )
            })
          }
        </section>
        {
          evaluated ?
            <>

              <p className='text-xs text-gray-400 mb-1 mt-5'>Comments</p>
              <div className='w-full bg-white rounded-md shadow-md p-5'>
                {activityData.comments}
              </div>
            </>
            :
            null
        }
        <div className='flex ml-auto items-center'>
          <SwitchEdit enableEdit={enableEdit} setEnableEdit={setEnableEdit} />
        </div>

        <p className='text-xs text-gray-400 mb-1 mt-5'>Task description</p>
        <hr />
        <div className='prose my-3 text-gray-600 ml-5 w-full box-content'>
          {
            !enableEdit
              ?
              <ReactMarkdown className=''>{activityData.activity.data.attributes.description}</ReactMarkdown>
              :
              <div className="flex flex-col">
                <MDEditor height="30rem" className='mt-2 mb-8' data-color-mode='light' onChange={setSubsectionContent} value={subsectionContent} />
                <Button onClick={() => saveChanges()} type="primary" loading={loading} className=" ml-auto inline-flex justify-center rounded-md border border-transparent bg-blue-600  px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save Changes
                </Button>
              </div>
          }
        </div>

      </div >
      {
        user.role_str === 'professor' || user.role_str === 'admin' ?
          <>
            <div className='bg-white mb-5 rounded-md shadow-md p-5 max-w-[30rem]'>
              <p className='text-lg font-medium mb-4'>Files</p>
              {
                activityData.activity.data.attributes.file?.data === null || activityData.activity.data.attributes.file?.data?.length === 0 ?
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className='mt-6' description={
                    <span className='text-gray-400 font-normal '>
                      There are no files
                    </span>
                  } />
                  :
                  activityData.activity.data.attributes?.file?.data.map((file, index) => renderFiles(file, index))
              }
            </div>
          </> :
          evaluated ?
            <div className='flex flex-col '>
              <div className='bg-white mb-5 rounded-md shadow-md p-5 max-w-[30rem]'>
                <p className='text-lg font-medium mb-4'>Files</p>
                {
                  activityData.activity.data.attributes.file?.data === null || activityData.activity.data.attributes.file?.data?.length === 0 ?
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className='mt-6' description={
                      <span className='text-gray-400 font-normal '>
                        There are no files
                      </span>
                    } />
                    :
                    activityData.activity.data.attributes.file.data.map((file, index) => renderFiles(file, index))
                }
              </div>
              <p className='text-xs text-gray-400 mb-1' > Evaluator</ p>
              <ProfessorData professor={{ attributes: activityData.evaluator.data.attributes }} evaluatorFlag={true} />
              <p className='text-xs text-gray-400 mb-1 mt-5'>Your submission</p>
              <div className='mb-14 '>
                {activityData.file.data && activityData.file.data.map(renderFiles)}
              </div>
            </div > :
            <div className='flex flex-col w-[30rem] mt-1'>
              <p className='text-xs text-gray-400 mb-1 mt-5'>Your submission</p>
              <div className='bg-white rounded-md shadow-md p-5 mb-3 space-y-3 md:w-[30rem]' >
                {activityData?.file?.data && activityData?.file?.data.map(renderFiles)}
              </div>
              <FilePond
                allowMultiple={true}
                maxFiles={5}
                onaddfile={(err, item) => {
                  if (!err) {
                    handleFileUpload(item.file);
                  }
                }}
                onremovefile={(err, item) => {
                  if (!err) {
                    const dataCopy = formData;
                    console.log(formData.getAll('files').length);
                    dataCopy.forEach((value, key) => {
                      if (value.name === item.file.name) {
                        dataCopy.delete(key);
                      }
                    });
                    document.getElementById('submit-button-activity').disabled = formData.getAll('files').length === 0;
                    setFormData(dataCopy);
                  }
                }}
              />
              <button
                id='submit-button-activity'
                onClick={() => { sendData() }}
                className="bg-blue-500 text-white font-semibold py-2 px-4 
                            rounded ml-auto hover:bg-blue-800 duration-150">
                Submit
              </button>
            </div>
      }
    </div >
  )
}
