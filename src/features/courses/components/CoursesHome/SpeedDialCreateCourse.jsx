import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiChevronRight, FiPlus } from 'react-icons/fi';
import { Whisper, Popover } from 'rsuite';

export const SpeedDialCreateCourse = () => {
    const navigate = useNavigate()
    const [isExpanded, setIsExpanded] = useState(false)

    const speakerCourseTemplate = () => {
        return (
            <Popover>
                <p>Create a course from a given template</p>
            </Popover>
        )
    }

    const speakerCourse = () => {
        return (
            <Popover>
                <p>Create a course with no template </p>
            </Popover>
        )
    }

    return (
        <div className='fixed right-10 bottom-10'>
            <div
                id="speed-dial-menu-dropdown"
                className={`bg-white shadow rounded-2xl transform scale-0 opacity-0 mb-5 h-3 w-[24rem]  duration-200 ${isExpanded ? 'scale-100 h-[10rem] w-[20rem] opacity-100' : ''}`}
            >
                <div className='p-4 flex flex-col text-base font-medium space-y-4 '>
                    <div className='flex items-center'>
                        <Whisper placement="top" className='text-sm shadow-md' trigger="hover" controlId="control-id-hover" speaker={speakerCourseTemplate()}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                            </svg>
                        </Whisper>
                        <button className='flex items-center text-left'
                            onClick={() => navigate('create')}>

                            <div className='flex items-center hover:translate-x-2 duration-150'>
                                <p className='ml-2'>Create new course from a template</p>
                                <FiChevronRight className='ml-1' />
                            </div>
                        </button>
                    </div>

                    <div className='flex items-center'>
                        <Whisper placement="top" className='text-sm shadow-md' trigger="hover" controlId="control-id-hover" speaker={speakerCourse()}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                            </svg>
                        </Whisper>
                        <button className='flex items-center text-left'
                            onClick={() => navigate('create')}>

                            <div className='flex items-center hover:translate-x-2 duration-150'>
                                <p className='ml-2'>Create new course</p>
                                <FiChevronRight className='ml-1' />
                            </div>

                        </button>
                    </div>

                    <div className='absolute pb-2 bottom-0 pl-0 w-full'>
                        <hr className='mr-8 ml-0' />
                        <button className='font-light text-sm mt-2'>Do you need help?</button>
                    </div>
                </div>
            </div>
            <button
                type="button"
                data-dial-toggle="speed-dial-menu-dropdown"
                aria-controls="speed-dial-menu-dropdown"
                className="flex shadow-lg items-center transition  justify-center ml-auto text-white bg-blue-600 rounded-full w-14 h-14 hover:bg-blue-600 hover-scale active-scale  "
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <FiPlus size={26} />
                <span className="sr-only"></span>
            </button>
        </div>
    )
}
