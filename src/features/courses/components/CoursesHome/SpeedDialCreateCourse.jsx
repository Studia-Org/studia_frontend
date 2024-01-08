import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from 'antd';
import { FiChevronRight, FiPlus } from 'react-icons/fi';


export const SpeedDialCreateCourse = () => {
    const navigate = useNavigate()
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <div className='fixed right-10 bottom-10'>
            <div
                id="speed-dial-menu-dropdown"
                className={`bg-white shadow rounded-2xl transform scale-0 opacity-0 mb-5 h-3 w-[24rem]  duration-200 ${isExpanded ? 'scale-100 h-[10rem] w-[20rem] opacity-100' : ''}`}
            >
                <div className='p-4 flex flex-col text-base font-medium space-y-4 '>
                    <div className='flex items-center'>
                        <button disabled className='flex items-center text-left text-gray-400'
                            onClick={() => navigate('create')}>

                            <div className='flex items-center  duration-150'>
                                <p className='ml-2'>Create new course from a template</p>
                                <FiChevronRight className='ml-1' />
                            </div>
                        </button>
                    </div>
                    <div className='flex items-center'>
                        <button className='flex items-center text-left' onClick={() => navigate('create')}>
                            <div className='flex items-center hover:translate-x-2 duration-150'>
                                <p className='ml-2'>Create new course</p>
                                <FiChevronRight className='ml-1' />
                                <Badge className='ml-2' count={'Recommended'} color='#3b82f6' />
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
