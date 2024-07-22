import React from 'react'
import Chip from '@mui/material/Chip';
import { useTranslation } from 'react-i18next';

function ActivityTitle({ type, title, evaluated, qualification, setTitle, enableEdit, userRole, titleState, passedDeadline }) {
    const { t } = useTranslation();
    return (
        <div className='relative flex items-center p-5 mt-5 mb-6 bg-white border rounded-md'>
            <div className='flex items-center w-full space-x-3'>
                {
                    type === 'task' ?
                        <div className='flex items-center justify-center bg-red-500 rounded-md w-14 h-14'>
                            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                        </div>
                        : type === 'Lecture' ?
                            <div className='flex items-center justify-center bg-blue-500 rounded-md w-14 h-14'>
                                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52000-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                                </svg>
                            </div>
                            : type === 'peerReview' ?
                                <div className='flex items-center justify-center bg-yellow-500 rounded-md w-14 h-14'>
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                                        <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
                                        <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                                    </svg>
                                </div>
                                : type === 'thinkAloud' ?
                                    <div className='flex items-center justify-center bg-green-500 rounded-md w-14 h-14'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                                        </svg>

                                    </div>
                                    :
                                    <div className='bg-red-800 rounded-md w-14 h-14'></div>
                }
                {
                    enableEdit ?
                        <input
                            type="text"
                            name="first-name"
                            value={titleState}
                            onChange={(e) => setTitle(e.target.value)}
                            id="first-name"
                            autoComplete="given-name"
                            className="block w-3/4 mt-1 rounded-md shadow-sm border-blue-gray-300 text-blue-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        :
                        <h3 className={`flex font-semibold  text-2xl ${evaluated ? 'max-w-[calc(100%-7rem)]' : ''}  sm:max-w-[calc(100%-9.5rem)]`}>{title}</h3>
                }
            </div>
            {
                !(userRole === 'professor' || userRole === 'admin' || type === 'Peer Review') && passedDeadline ?
                    evaluated ?
                        <div className='absolute right-0 bg-green-700 rounded-r-md w-14 sm:w-[6rem]  ml-auto flex flex-col h-full justify-center text-center'>
                            <p className='text-xl font-semibold text-white'>{qualification}/10</p>
                        </div>
                        :
                        <Chip className='ml-auto ' label={t("ACTIVITY.not_evaluated")} color="primary" />
                    : null

            }
        </div>
    )
}

export default ActivityTitle