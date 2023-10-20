import React, { useEffect } from 'react'
import { ProfessorData } from './ProfessorData';
import TextField from '@mui/material/TextField';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import '../styles/filepondStyles.css'

export const ActivityComponent = ({ activityData }) => {
  console.log(activityData)
  return (
    <div className='flex flex-col'>
      <h3 className='font-semibold text-2xl mt-10 mb-5'>{activityData.activity.title}</h3>
      <p className='mb-10 w-3/4 text-gray-600 text-sm font-normal'>{activityData.activity.description}</p>
      <div className='flex'>


        <div className='my-6 w-2/4'>
          <FilePond allowMultiple={true} maxFiles={3} server="/api" />
        </div>

        <div className='mx-6 flex flex-col'>
          <p className='text-xs text-gray-400 mb-1'>Evaluator</p>
          <ProfessorData professor={{ attributes: activityData.evaluator }} evaluatorFlag={true} />
          <p className='text-xs text-gray-400 mb-1 mt-5'>Comments</p>
          <div className='p-4 bg-white rounded-md shadow-md w-[30rem]'>
            <p className='text-sm text-gray-700'>
              {activityData.comments}
            </p>
          </div>
          <p className='text-xs text-gray-400 mb-1 mt-5'>Grade</p>
          <div className='p-3 bg-white rounded-md shadow-md'>
            <p>{activityData.qualification}</p>
          </div>

        </div>
      </div>
    </div>
  )
}
