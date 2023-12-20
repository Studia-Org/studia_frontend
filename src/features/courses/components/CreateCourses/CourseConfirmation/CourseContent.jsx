import React, { useState } from 'react'
import { TaskComponentCard } from './TaskComponentCard'
import { Content } from './Content'
import { Tabs, Empty } from 'antd';
import { QuestionnaireConfirmation } from './QuestionnaireConfirmation';
import ImageDisplay from './ImageDisplay';

export const CourseContent = ({ createCourseSectionsList, sectionContentSelector, setVisibilityTask, selectedSubsection, sectionId, task }) => {
    console.log(createCourseSectionsList)
    const CourseContent = () => {
        return (
            <div className='w-full flex flex-row items-center space-x-8'>
                <div className='w-full mr-5'>
                    {
                        selectedSubsection &&
                        <>
                            <p className='text-xs font-normal text-gray-400 mb-1'>Task</p>
                            <hr className='mb-5' />
                            {
                                task[sectionId] &&
                                <TaskComponentCard task={selectedSubsection.activity} setVisibilityTask={setVisibilityTask} />
                            }
                            <p className='text-xs font-normal text-gray-400 mb-1'>Course content</p>
                            <hr className='mb-5' />
                            <Content selectedSubsection={selectedSubsection} />
                        </>
                    }
                </div>
            </div>
        )
    }


    const CourseFiles = () => {
        return (
            <div className='w-full flex flex-row items-center space-x-8'>
                <div className='w-full mr-5'>
                    {
                        selectedSubsection &&
                        <>
                            {
                                selectedSubsection?.files?.length === 0 ?
                                    (
                                        <div>
                                            <Empty className='mt-6' description={
                                                <span className='text-gray-500 font-normal '>
                                                    There are no files
                                                </span>
                                            } />
                                        </div>
                                    )
                                    :
                                    (
                                        <div className='flex flex-wrap'>
                                            {selectedSubsection.files.map((file, index) => {
                                                return (
                                                    <>
                                                        <div key={index} className='rounded-md bg-white shadow-md p-3 border-l-8 border-indigo-500 cursor-pointer mb-4 mr-4'>
                                                            <div className='flex space-x-2'>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                                </svg>
                                                                <p className='font-medium'>{file.filenameWithoutExtension}</p>
                                                            </div>
                                                        </div>
                                                    </>
                                                )
                                            })}
                                        </div>
                                    )
                            }
                        </>
                    }
                </div>
            </div >
        )
    }


    const items = [
        {
            key: '1',
            label: 'Course',
            children: <CourseContent />,
        },
        {
            key: '2',
            label: 'Files',
            children: <CourseFiles />,
        }
    ];

    return (
        selectedSubsection && (
            selectedSubsection?.questionnaire ? (
                <div className='w-full text-base' >
                    <QuestionnaireConfirmation questionnaire={selectedSubsection?.questionnaire} />
                </div >
            ) :
                <div className='w-full'>
                    {
                        selectedSubsection?.landscape_photo[0] && (
                            <div className=''>
                                <ImageDisplay fileData={selectedSubsection?.landscape_photo[0]} />
                            </div>
                        )
                    }
                    <h2 className='mt-4 font-medium text-xl'>{selectedSubsection.title}</h2>
                    <Tabs className='font-normal' tabBarStyle={
                        {
                            borderBottom: '1px solid black',
                        }
                    } defaultActiveKey="1" items={items} />
                </div>
        )
    )
}
