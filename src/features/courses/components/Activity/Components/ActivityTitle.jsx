import React from 'react'
import Chip from '@mui/material/Chip';


function ActivityTitle({ type, title, evaluated, qualification }) {
    return (
        <div className='relative flex items-center mb-6 bg-white rounded-md p-5 shadow-md mt-5'>
            <div className='flex items-center space-x-3 '>
                {
                    type === 'task' ?
                        <div className='w-14 h-14 bg-red-500 rounded-md items-center flex justify-center'>
                            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                        </div>
                        : type === 'Lecture' ?
                            <div className='w-14 h-14 bg-blue-500 rounded-md items-center flex justify-center'>
                                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52000-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                                </svg>
                            </div>
                            : type === 'Peer Review' ?
                                <div className='w-14 h-14 bg-yellow-500 rounded-md items-center flex justify-center'>
                                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                    </svg>

                                </div>
                                :
                                <div className='w-14 h-14 bg-red-800 rounded-md'></div>
                }
                <h3 className={`flex font-semibold text-2xl ${evaluated ? 'max-w-[calc(100%-7rem)]' : ''}  sm:max-w-[calc(100%-9.5rem)]`}>{title}</h3>

            </div>
            {
                evaluated ?
                    <div className='absolute right-0 bg-green-700 rounded-r-md max-w-[3.5rem] sm:max-w-[6rem] sm:w-24   w-14 ml-auto flex flex-col h-full justify-center text-center'>
                        <p className='text-white font-semibold max-w-[100%] text-xl'>{qualification}/10</p>
                    </div>

                    :
                    <Chip className='ml-auto' label="Not finished" color="primary" />
            }
        </div>
    )
}

export default ActivityTitle