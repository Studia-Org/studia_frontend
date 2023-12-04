import { useEffect, useState } from 'react'
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
import Swal from 'sweetalert2';
import ObjectivesTags from './ObjectivesTag';
import ActivityTitle from './Components/ActivityTitle';
import BackToCourse from './Components/BackToCourse';
import renderFiles from './utils/renderFIles';
import { Empty, Button, message, Popconfirm } from 'antd';
import MDEditor from '@uiw/react-md-editor';
import { SwitchEdit } from '../CoursesInside/SwitchEdit';


registerPlugin(FilePondPluginImagePreview);


export const ActivityComponent = ({ activityData, idQualification, setUserQualification }) => {
  const [filesTask, setFilesTask] = useState();
  const [title, setTitle] = useState(activityData.activity.data.attributes.title)
  const [subsectionContent, setSubsectionContent] = useState(activityData.activity.data.attributes.description);
  const [loading, setLoading] = useState(false);
  const [enableEdit, setEnableEdit] = useState(false);
  const evaluated = activityData.qualification ? true : false;
  const type = activityData?.activity?.data?.attributes?.type;
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

  useEffect(() => {
    setFilesTask([]);
    setSubsectionContent(activityData.activity.data.attributes.description);
    setTitle(activityData.activity.data.attributes.title);
  }, [enableEdit])

  async function saveChanges() {
    setLoading(true);
    const formData = new FormData();
    let filesId = [];
    try {
      if (filesTask) {
        filesTask.forEach((file) => {
          formData.append('files', file.file);
        });
        const uploadFiles = await fetch(`${API}/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          body: formData,
        });
        if (uploadFiles.ok) {
          const result = await uploadFiles.json();
          filesId = result.map((file) => file.id);
        }
        filesId = filesId.concat(activityData.activity.data.attributes.file?.data.map((file) => file.id));
      }
      const response = await fetch(`${API}/activities/${activityId}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          data: {
            description: subsectionContent,
            title: title,
            file: filesId,
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

      if (activityData.file !== undefined && activityData?.file?.data !== null) {
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

  async function deleteFile(fileId) {
    setFilesTask((prev) => {
      const updatedFiles = prev.filter((file) => file.id !== fileId);
      return updatedFiles;
    });



    const reponse = await fetch(`${API}/upload/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      }
    })
    if (reponse.ok) {
      const result = await reponse.json();
      console.log(result);
      message.success('File deleted successfully, reload the page to see the changes');
    }
    else message.error('Something went wrong');
  }


  function renderFiles(file) {
    if (file.attributes) {
      return (
        <button key={file.id} onClick={() => downloadFile(file.attributes)} className='shadow-md rounded-md flex p-3 w-full bg-green-700 text-white active:translate-y-1 duration-150'>
          <p className='max-w-[calc(100%-4rem)] overflow-hidden text-ellipsis'>{file.attributes.name}</p>
          <div className='ml-auto mr-2'>
            {
              enableEdit ?
                <Popconfirm
                  title="Delete the file"
                  description="Are you sure to delete this file?"
                  okText="Yes"
                  okType="danger"
                  onConfirm={(e) => {
                    e.stopPropagation();
                    deleteFile(file.id);
                  }}
                  onCancel={(e) => {
                    e.stopPropagation();
                  }}
                  cancelText="No"
                >
                  <svg
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                  </svg>
                </Popconfirm>
                :
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
            }
          </div>
        </button>
      )
    } else {
      <button key={file.id} onClick={() => downloadFile(file)} className='shadow-md rounded-md flex p-3 w-full bg-green-700 text-white active:translate-y-1 duration-150'>
        <p className='max-w-[calc(100%-4rem)] overflow-hidden text-ellipsis'>{file.filenameWithoutExtension}</p>
        <div className='ml-auto mr-2'>
          {
            enableEdit ?
              <svg
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFile(file.id);
                }}
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
              </svg>
              :
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
          }
        </div>
      </button>
    }

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
        message.error('Something went wrong');
      }
    } catch (error) {
      message.error('Something went wrong: ', error);
    }
  };

  return (
    <div className='flex flex-col 1.5xl:flex-row items-start 1.5xl:items-start 1.5xl:space-x-24 p-5 sm:p-10'>
      <div className='1.5xl:w-2/4 lg:w-10/12 w-full'>
        <BackToCourse navigate={navigate} courseId={courseId} />
        <ActivityTitle
          type={type}
          title={activityData.activity.data.attributes.title}
          evaluated={evaluated}
          qualification={activityData.qualification}
          setTitle={setTitle}
          enableEdit={enableEdit}
          userRole={user.role_str}
        />
        <ObjectivesTags USER_OBJECTIVES={USER_OBJECTIVES} categories={activityData?.activity.data.attributes.categories} />

        <div className='flex ml-auto items-center'>
          <SwitchEdit enableEdit={enableEdit} setEnableEdit={setEnableEdit} />
        </div>

        <p className='text-xs text-gray-400 mb-1 mt-5'>Task description</p>
        <hr />
        <div className='prose my-3 text-gray-600 ml-5 w-full box-content mt-5 max-w-none'>
          {
            !enableEdit
              ?
              <ReactMarkdown className=''>{activityData.activity.data.attributes.description}</ReactMarkdown>
              :
              <div className="flex flex-col">
                <MDEditor height="30rem" className='mt-2 mb-8' data-color-mode='light' onChange={setSubsectionContent} value={subsectionContent} />
                <Button onClick={() => saveChanges()} type="primary" loading={loading}
                  className=" ml-auto inline-flex justify-center rounded-md border border-transparent bg-blue-600  
                px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 
                focus:ring-blue-500 focus:ring-offset-2">
                  Save Changes
                </Button>
              </div>
          }
        </div>

      </div >
      {
        user.role_str === 'professor' || user.role_str === 'admin' ?
          <>
            <div className='bg-white mb-5 mt-10 rounded-md shadow-md p-5 w-[30rem]'>
              <p className='text-lg font-medium mb-4'>Task Files</p>
              {(!activityData.activity.data.attributes.file?.data?.length || activityData.activity.data.attributes.file?.data?.length === 0) ? (
                enableEdit ? (
                  <FilePond allowMultiple={true} maxFiles={5} onupdatefiles={setFilesTask} />
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    className='mt-6'
                    description={
                      <span className='text-gray-400 font-normal'>
                        There are no files
                      </span>
                    }
                  />
                )
              ) : (
                enableEdit ? (
                  <>
                    <FilePond allowMultiple={true} maxFiles={5} onupdatefiles={setFilesTask} />
                    <div className='space-y-2'>
                      {activityData.activity.data.attributes.file?.data.map((file, index) => renderFiles(file, index))}
                    </div>

                  </>
                ) : (
                  <div className='space-y-2'>
                    {activityData.activity.data.attributes.file?.data.map((file, index) => renderFiles(file, index))}
                  </div>

                )
              )}
            </div>
          </> :
          evaluated ?
            <div className='flex flex-col '>
              <div className='bg-white mb-5 rounded-md shadow-md p-5 w-[30rem]'>
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
