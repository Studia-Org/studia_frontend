import React, { useState } from 'react'

export const CourseContent = () => {
    const [courseInsideSectionType, setcourseInsideSectionType] = useState('course');
    return (
        <div>
            <div className='flex flex-row mt-3  items-center space-x-8 ml-5'>
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
        </div>
    )
}
