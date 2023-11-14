import React from 'react'
import ReactMarkdown from 'react-markdown'

export const TaskContent = ({ setVisibilityTask, task }) => {
    return (
        <div className='flex mt-8'>
            <div className='w-full '>
                <button className='text-base flex items-center  font-medium' onClick={() => setVisibilityTask(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                    </svg>
                    <p className='ml-1 '>Course sections</p>
                </button>
                <div className='relative flex items-center mb-6 bg-white rounded-md p-5 shadow-md mt-5'>
                    <div className='flex items-center space-x-3 '>
                        <div className='w-14 h-14 bg-blue-500 rounded-md items-center flex justify-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52000-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                            </svg>
                        </div>
                        <h3 className='font-semibold text-2xl max-w-[calc(100%-7rem)] sm:max-w-[calc(100%-9.5rem)]'>{task.title}</h3>
                    </div>
                </div>
                <p className='text-xs font-normal text-gray-400 mb-1 mt-5'>Task description</p>
                <hr />
                <div className='prose my-3 text-gray-600 ml-5 w-full box-content'>
                    <ReactMarkdown>{task.description}</ReactMarkdown>
                </div>
            </div>

            <div className='flex-shrink-0 w-[30rem] ml-10 mt-11 '>
                <div className={`mt-0 flex flex-col bg-white rounded-lg  px-5 py-5  sm:mr-9 sm:right-0 max-w-[30rem] shadow-md sm:visible `}>
                    <div className='flex items-center'>
                        <p className='text-lg font-medium'>About the evaluator</p>
                    </div>

                    <div className='flex my-4 items-center space-x-3'>
                        <img className='w-[3rem] rounded' alt="" />
                        <p className='text-base font-medium'>{ }</p>
                    </div>
                    <p className={`text-gray-700 text-sm`}>{ }</p>
                </div>
            </div>


        </div>
    )
}
