import React, { useState, useEffect } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { QuestionnaireComponentEditable } from './QuestionnaireComponentEditable';
import TextField from '@mui/material/TextField';

export const CreateCourseEditSubsection = ({ subsection, setEditSubsectionFlag, setCreateCourseSectionsList, createCourseSectionsList, setSubsectionEditing }) => {
    
    useEffect(() => {
        const matchingSubsection = createCourseSectionsList
            .flatMap(section => section.subsections)
            .find(sub => sub.id === subsection.id);

        if (matchingSubsection) {
            setSubsectionEditing(matchingSubsection);
        }
    }, [createCourseSectionsList]);

    return (
        <div className='w-[45rem]'>
            <button className='text-sm flex items-center -translate-y-5 ' onClick={() => setEditSubsectionFlag(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                </svg>
                <p className='ml-1'>Add items to the sequence</p>
            </button>
            {
                subsection?.questionnaire !== null ?
                    <>
                        <QuestionnaireComponentEditable subsection={subsection} setCreateCourseSectionsList={setCreateCourseSectionsList} createCourseSectionsList={createCourseSectionsList} />
                    </> :
                    <>
                        <h2 className='font-medium text-lg'>{subsection.title}</h2>
                        <div className='bg-white rounded-md shadow-md p-5 mt-4 '>
                            <div className='flex items-center justify-between w-full '>
                                <div>
                                    <label className='text-sm text-gray-500' htmlFor="" >Start Date</label>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DatePicker']}>
                                            <DatePicker label={subsection.start_date} />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </div>
                                <div>
                                    <label className='text-sm text-gray-500' htmlFor="" >End Date</label>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DatePicker']}>
                                            <DatePicker label={subsection.end_date} />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </div>
                            </div>
                            <div className='mt-7'>
                                <label className='text-sm text-gray-500 mt-7' htmlFor="" >Description</label>
                                <div className='flex w-full'>
                                    <TextField className='mt-5 flex w-full' id="outlined-basic" label={subsection.description} variant="outlined" />
                                </div>
                            </div>
                        </div>F
                    </>
            }
        </div>
    )
}
