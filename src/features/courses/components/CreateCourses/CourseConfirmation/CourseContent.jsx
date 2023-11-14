import React, { useState } from 'react'
import { TaskComponentCard } from './TaskComponentCard'
import { Content } from './Content'

export const CourseContent = ({ createCourseSectionsList, sectionContentSelector, setVisibilityTask, selectedSubsection }) => {
    const [courseInsideSectionType, setcourseInsideSectionType] = useState('course');

    return (
        selectedSubsection && (
            <>
                <h2 className='mt-6 '>{selectedSubsection.title}</h2>
                <div className='flex flex-row mt-5  items-center space-x-8 ml-5'>
                    <button
                        className={`font-medium text-base hover:text-black pb-3 ${courseInsideSectionType === 'course' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}>
                        Course
                    </button>
                    <button
                        className={`font-medium text-base hover:text-black pb-3 ${courseInsideSectionType === 'files' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}>
                        Files
                    </button>
                </div>
                <hr className="h-px  bg-gray-600 border-0 mb-6"></hr>
                <div className='mt-5'>
                    {
                        selectedSubsection &&
                        <>
                            <TaskComponentCard task={selectedSubsection.task} setVisibilityTask={setVisibilityTask}/>
                            <hr className='mb-10 h-px  bg-gray-300' />
                            <Content selectedSubsection={selectedSubsection} />
                        </>
                    }
                </div>
            </>
        )
    )
}
