import React, { useState } from 'react'
import { TaskComponentCard } from './TaskComponentCard'
import { Content } from './Content'
import { Tabs, Empty } from 'antd';
import { QuestionnaireConfirmation } from './QuestionnaireConfirmation';
import ImageDisplay from './ImageDisplay';
import { useTranslation } from 'react-i18next';

export const CourseContent = ({ setVisibilityTask, selectedSubsection, sectionId, task, setCreateCourseOption, createCourseOption}) => {
    const { t } = useTranslation()
    console.log('selectedSubsection', selectedSubsection)

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
        selectedSubsection ? (
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
        ) : (
            <>
                <div className='flex items-center justify-center w-full mt-[4.5rem] bg-white rounded p-5 border border-[#DADADA]'>
                    <div class="text-center">
                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                        <h3 class="mt-2 text-sm font-medium text-gray-900"> {t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.create_title")}</h3>
                        <p class="mt-1 text-sm font-medium text-gray-500"> {t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.create_text")} </p>
                        <div class="mt-6">
                            <button onClick={() => setCreateCourseOption(createCourseOption - 1)} type="button" class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-1">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" />
                                </svg>
                                {t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.title")}
                            </button>
                        </div>
                    </div>
                </div>
            </>
        )
    )
}
