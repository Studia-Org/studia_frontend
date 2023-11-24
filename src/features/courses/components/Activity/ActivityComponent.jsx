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
import Swal from 'sweetalert2';
import ObjectivesTags from './ObjectivesTag';
import ActivityTitle from './Components/ActivityTitle';
import BackToCourse from './Components/BackToCourse';
import renderFiles from './utils/renderFIles';

registerPlugin(FilePondPluginImagePreview);


export const ActivityComponent = ({ activityData, idQualification }) => {
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





  return (
    <div className='flex flex-col 1.5xl:flex-row items-start 1.5xl:items-start 1.5xl:space-x-24 p-5 sm:p-10'>
      <div className='1.5xl:w-2/4 lg:w-10/12 w-full'>
        <BackToCourse navigate={navigate} courseId={courseId} />
        <ActivityTitle
          type={type}
          title={activityData.activity.data.attributes.title}
          evaluated={evaluated}
          qualification={activityData.qualification}
        />
        <ObjectivesTags USER_OBJECTIVES={USER_OBJECTIVES} categories={activityData?.activity.data.attributes.categories} />
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

        <p className='text-xs text-gray-400 mb-1 mt-5'>Task description</p>
        <hr />
        <div className='prose my-3 text-gray-600 ml-5 w-full box-content'>
          <ReactMarkdown>{activityData.activity.data.attributes.description}</ReactMarkdown>
        </div>

      </div >
      {
        evaluated ?
          <div className='flex flex-col '>
            <p className='text-xs text-gray-400 mb-1' > Evaluator</ p>
            <ProfessorData professor={{ attributes: activityData.evaluator.data.attributes }} evaluatorFlag={true} />
            <p className='text-xs text-gray-400 mb-1 mt-5'>Your submission</p>
            <div className='mb-14 '>
              {activityData.file?.data && activityData?.file?.data?.map(renderFiles)}
            </div>
          </div > :
          <div className='flex flex-col w-[30rem] mt-1'>
            <p className='text-xs text-gray-400 mb-1 mt-5'>Your submission</p>
            <div className='bg-white rounded-md shadow-md p-5 mb-3 space-y-3 md:w-[30rem]' >
              {activityData.file?.data && activityData?.file?.data?.map(renderFiles)}

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
