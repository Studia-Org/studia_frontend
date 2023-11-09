import React, { useState, useEffect } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { QuestionnaireComponentEditable } from './QuestionnaireComponentEditable';
import TextField from '@mui/material/TextField';
import { CreateTask } from './CreateTask';
import { Collapse } from 'antd';
import MDEditor from '@uiw/react-md-editor';

import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import '../../styles/filePondNoBoxshadow.css'


registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)
const { Panel } = Collapse;

export const CreateCourseEditSubsection = ({ subsection, setEditSubsectionFlag, setCreateCourseSectionsList, createCourseSectionsList, setSubsectionEditing, task, setTask, sectionId }) => {
    const [content, setContent] = useState();
    const [isPanelOpen, setIsPanelOpen] = useState(true);

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
                subsection?.questionnaire ?? false ?
                    <>
                        <QuestionnaireComponentEditable subsection={subsection} setCreateCourseSectionsList={setCreateCourseSectionsList} createCourseSectionsList={createCourseSectionsList} />
                    </> :
                    <>
                        <h2 className='font-medium text-lg'>{subsection.title}</h2>
                        <div className='bg-white rounded-md shadow-md p-5 mt-4 mb-10 '>
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
                            <div className='mt-7 space-y-2'>
                                <label className='text-sm text-gray-500 mt-7 ' htmlFor="" >Subsection description</label>
                                <div className='flex w-full'>
                                    <TextField className=' flex w-full' id="outlined-basic" label={subsection.description} variant="outlined" />
                                </div>
                            </div>
                            <div className='mt-3 space-y-2'>
                                <label className='text-sm text-gray-500 ' htmlFor="" >Background Photo</label>
                                <FilePond
                                    allowMultiple={true}
                                    maxFiles={1} />
                            </div>
                            <label className='text-sm text-gray-500' htmlFor="" >Subsection content</label>
                            <MDEditor
                                className='mt-2 mb-8'
                                data-color-mode="light"
                                onChange={setContent}
                                value={content} />
                            <Collapse
                                onChange={() => setIsPanelOpen(!isPanelOpen)}
                            >
                                <Panel key="1" header="Task detail">
                                    <CreateTask task={task} setTask={setTask} sectionId={sectionId} subsection={subsection} setCreateCourseSectionsList={setCreateCourseSectionsList} />
                                </Panel>
                            </Collapse>
                        </div>
                    </>
            }
        </div >
    )
}
