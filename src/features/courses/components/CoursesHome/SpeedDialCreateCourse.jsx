import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from 'antd';
import { FiChevronRight, FiPlus } from 'react-icons/fi';


export const SpeedDialCreateCourse = () => {
    const navigate = useNavigate()
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <div className='fixed right-[6.5rem] bottom-12'>
            <div
                id="speed-dial-menu-dropdown"
                className={`bg-white shadow rounded-t-2xl rounded-bl-2xl transform scale-0 -translate-x-6 opacity-0 mb-5 h-3 w-[24rem]  duration-200 ${isExpanded ? 'scale-100 h-[10rem] w-[20rem] opacity-100' : ''}`}
            >
                <div className='flex flex-col p-4 space-y-4 text-base font-medium '>
                    <div className='flex items-center'>
                        <button disabled className='flex items-center text-left text-gray-400'
                            onClick={() => navigate('create')}>

                            <div className='flex items-center duration-150'>
                                <p className='ml-2'>Create new course from a template</p>
                                <FiChevronRight className='ml-1' />
                            </div>
                        </button>
                    </div>
                    <div className='flex items-center'>
                        <button className='flex items-center text-left' onClick={() => navigate('create')}>
                            <div className='flex items-center duration-150 hover:translate-x-2'>
                                <p className='ml-2'>Create new course</p>
                                <FiChevronRight className='ml-1' />
                                <Badge className='ml-2' count={'Recommended'} color='#3b82f6' />
                            </div>
                        </button>
                    </div>
                    <div className='absolute bottom-0 w-full pb-2 pl-0'>
                        <hr className='ml-0 mr-8' />
                        <button className='mt-2 text-sm font-light'>Do you need help?</button>
                    </div>
                </div>
            </div>
            <button
                type="button"
                data-dial-toggle="speed-dial-menu-dropdown"
                aria-controls="speed-dial-menu-dropdown"
                className="flex items-center justify-center w-[3.2rem] h-[3.2rem] ml-auto text-white transition bg-[#3c3c3c] rounded-full shadow-xl hover:bg-[#4f4f4f] duration-100 hover-scale active-scale "
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <FiPlus size={26} />
                <span className="sr-only"></span>
            </button>
        </div>
    )
}
