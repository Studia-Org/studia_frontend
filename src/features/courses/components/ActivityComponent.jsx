import React, { useEffect } from 'react'
import { ProfessorData } from './ProfessorData';
import TextField from '@mui/material/TextField';
import { getToken } from '../../../helpers';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { API } from '../../../constant';
import { useAuthContext } from '../../../context/AuthContext';

import 'filepond/dist/filepond.min.css';
import '../styles/filepondStyles.css'
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import Chip from '@mui/material/Chip';
registerPlugin(FilePondPluginImagePreview);


export const ActivityComponent = ({ activityData }) => {
  console.log(activityData)
  const evaluated = activityData.qualification ? true : false;
  const { user } = useAuthContext();

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('files', file);

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
        const qualificationData = {
          activity: activityData.activity.id,
          file: result[0].id,
          user: user.id
        }
        if (activityData.delivered && !evaluated) {
          const response2 = await fetch(`${API}/qualifications/${activityData.id}`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ data: qualificationData }),
          });
        } else if (!activityData.delivered && !evaluated) {
          const response2 = await fetch(`${API}/qualifications`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ data: qualificationData }),
          });
        }
      }
    } catch (error) {

    }
  };

  function renderFiles(file) {
    return (
      <button onClick={() => downloadFile(file)} className='shadow-md rounded-md flex p-3 w-full bg-green-700 text-white'>
        <p>{file.name}</p>
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
    <div className='flex flex-col md:flex-row mt-10 md:space-x-24  mx-5'>
      <div className='md:w-2/4'>
        <div className='relative flex items-center mb-6 bg-white rounded-md p-5 shadow-md mt-5'>
          <div className='flex items-center space-x-3'>
            {
              activityData.activity.type === 'Delivery' ?
                <div className='w-14 h-14 bg-red-500 rounded-md items-center flex justify-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                : activityData.activity.type === 'Lecture' ?
                  <div className='w-14 h-14 bg-blue-500 rounded-md items-center flex justify-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52000-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                    </svg>
                  </div>
                  :
                  <div className='w-14 h-14 bg-red-800 rounded-md'></div>
            }
            <h3 className='font-semibold text-2xl'>{activityData.activity.title}</h3>
          </div>
          {
            evaluated ?
              <div className='absolute right-0 bg-green-700 rounded-r-md w-[6rem]  ml-auto flex flex-col h-full justify-center text-center'>

                <p className='text-white font-semibold text-xl'>{activityData.qualification}/10</p>
              </div>

              :
              <Chip className='ml-auto' label="Not finished" color="primary" />
          }
        </div>
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
         <hr  />
        <div className='prose my-3 text-gray-600 ml-5 w-full'>
          <ReactMarkdown>{activityData.activity.description}</ReactMarkdown>
        </div>

      </div>
      {
        evaluated ?
          <div className='flex flex-col'>
            <p className='text-xs text-gray-400 mb-1'>Evaluator</p>
            <ProfessorData professor={{ attributes: activityData.evaluator }} evaluatorFlag={true} />
            <p className='text-xs text-gray-400 mb-1 mt-5'>Your submission</p>
            <div className='mb-14 '>
              {
                evaluated ?
                  <div className='bg-white rounded-md shadow-md p-5 space-y-3 md:w-[30rem]' >
                    {activityData.file && activityData.file.map(renderFiles)}
                  </div>
                  :
                  <FilePond
                    allowMultiple={true}
                    maxFiles={5}
                    onaddfile={(err, item) => {
                      if (!err) {
                        handleFileUpload(item.file);
                      }
                    }}
                  />
              }

            </div>
          </div> :
          <div className='flex flex-col w-[30rem] mt-5'>
            <FilePond
              allowMultiple={true}
              maxFiles={5}
              onaddfile={(err, item) => {
                if (!err) {
                  handleFileUpload(item.file);
                }
              }}
            />
          </div>
      }
    </div>
  )
}
