import React from 'react'

export const EditSection = ({ setEditSectionFlag }) => {
    return (
        <>
            <button className='text-sm flex items-center mt-5 duration-150 hover:-translate-x-1 ' onClick={() => setEditSectionFlag(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                </svg>
                <p className='ml-1'>Go back to course</p>
            </button>
        </>
    )
}
