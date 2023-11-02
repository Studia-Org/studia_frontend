import React from 'react'

export const EditCreateCourseSection = ({ setEditCourseSectionFlag, setCreateCourseSectionsList, sectionToEdit }) => {
    return (
        <div className='text-base font-normal'>
            <button onClick={() => setEditCourseSectionFlag(false)} className='flex items-center hover:-translate-x-1 duration-100'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                </svg>
                <p className='text-sm ml-1 '>Back to course setup</p>
            </button>
            <div className='flex'>
                <div className='w-1/2 pr-10 pl-5'>
                    <h1 className='font-bold text-2xl mt-5'>Edit Section</h1>
                    <h2 className='font-medium text-xl mt-5'>{sectionToEdit.name}</h2>
                    <p className='text-xs font-normal text-gray-400 mt-4 mb-2'>Course subsections</p>
                    <div className='bg-white p-5 rounded-md shadow-md'>
                    </div>
                </div>
                <div className='w-1/2'>
                    <p>Edit subsection</p>
                </div>
            </div>
        </div>
    )
}
