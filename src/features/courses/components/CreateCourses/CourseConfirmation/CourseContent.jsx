import React, { useState } from 'react'
import { TaskComponentCard } from './TaskComponentCard'
import { Content } from './Content'
import { Tabs, Empty } from 'antd';
import { QuestionnaireConfirmation } from './QuestionnaireConfirmation';
import ImageDisplay from './ImageDisplay';
import { useTranslation } from 'react-i18next';

export const CourseContent = ({ createCourseSectionsList, sectionContentSelector, setVisibilityTask, selectedSubsection, sectionId, task }) => {
    const { t } = useTranslation()
    const CourseContent = () => {
        return (
            <div className='flex flex-row items-center w-full space-x-8'>
                <div className='w-full mr-5'>
                    {
                        selectedSubsection &&
                        <>
                            <p className='mb-1 text-xs font-normal text-gray-400'>{t("COURSEINSIDE.activity")}</p>
                            <hr className='mb-5' />
                            {
                                task[sectionId] &&
                                <TaskComponentCard task={selectedSubsection} setVisibilityTask={setVisibilityTask} />
                            }
                            <p className='mb-1 text-xs font-normal text-gray-400'>{t("COURSEINSIDE.course_content")}</p>
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
            <div className='flex flex-row items-center w-full space-x-8'>
                <div className='w-full mr-5'>
                    {
                        selectedSubsection &&
                        <>
                            {
                                selectedSubsection?.files?.length === 0 ?
                                    (
                                        <div>
                                            <Empty className='mt-6' description={
                                                <span className='font-normal text-gray-500 '>
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
                                                        <div key={index} className='p-3 mb-4 mr-4 bg-white border-l-8 border-indigo-500 rounded-md shadow-md cursor-pointer'>
                                                            <div className='flex space-x-2'>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                                </svg>
                                                                <p className='font-medium'>{file.name}</p>
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
            label: t("COURSEINSIDE.course"),
            children: <CourseContent />,
        },
        {
            key: '2',
            label: t("COURSEINSIDE.files"),
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
                    <h2 className='mt-4 text-xl font-medium'>{selectedSubsection.title}</h2>
                    <Tabs className='font-normal' tabBarStyle={
                        {
                            borderBottom: '1px solid black',
                        }
                    } defaultActiveKey="1" items={items} />
                </div>
        )
    )
}
