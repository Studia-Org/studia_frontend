import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Empty } from 'antd'
import { motion } from "framer-motion";
import { PeerReviewVisualization } from './PeerReviewVisualization';

export const TaskContent = ({ setVisibilityTask, task, evaluator }) => {

    function renderFiles(file, index) {
        return (
            <button className='shadow-md rounded-md flex p-3 w-full bg-green-700 text-white'>
                <p className='text-sm line-clamp-1 font-medium'>{file.name}</p>
                <div className='ml-auto mr-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                </div>
            </button>
        )
    }
    if (task.type === 'task') {
        return (
            <div className='mt-8'>
                <button className='text-base flex items-center duration-150 hover:-translate-x-2 font-medium' onClick={() => setVisibilityTask(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                    </svg>
                    <p className='ml-1 '>Course sections</p>
                </button>
                <motion.div
                    className='flex'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className='w-full '>
                        <div className='relative flex items-center mb-6 bg-white rounded-md p-5 shadow-md mt-5'>
                            <div className='flex items-center space-x-3 '>
                                <div className='h-14 px-3 bg-blue-500 rounded-md items-center flex justify-center'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52000-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                                    </svg>
                                </div>
                                <h3 className='font-semibold text-2xl line-clamp-1'>{task?.title}</h3>
                            </div>
                        </div>
                        <p className='text-xs font-normal text-gray-400 mb-1 mt-5'>Task description</p>
                        <hr />
                        <div className='prose max-w-none my-3 mt-7 text-gray-600 ml-5 w-full box-content font-normal'>
                            <ReactMarkdown>{task.description}</ReactMarkdown>
                        </div>
                    </div>

                    <div className='flex-shrink-0 w-[30rem] ml-10 mt-5 '>
                        <div className='bg-white mb-5 rounded-md shadow-md p-5 max-w-[30rem]'>
                            <p className='text-lg font-medium mb-4'>Files</p>
                            {
                                task?.files?.length === 0 ?
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className='mt-6' description={
                                        <span className='text-gray-400 font-normal '>
                                            There are no files
                                        </span>
                                    } />
                                    :
                                    task.files.map((file, index) => renderFiles(file, index))
                            }
                        </div>


                        <div className={`mt-0 flex flex-col bg-white rounded-lg px-5 py-5 max-w-[30rem] shadow-md sm:visible `}>
                            <div className='flex items-center'>
                                <p className='text-lg font-medium'>About the evaluator</p>
                            </div>
                            {
                                evaluator ? (
                                    <>
                                        <div className='flex my-4 items-center space-x-3'>
                                            <img className='w-[3rem] rounded' src={evaluator.avatar} alt="" />
                                            <p className='text-base font-medium'>{evaluator.name}</p>
                                        </div>
                                        <p className={`text-gray-700 text-sm font-normal`}>{evaluator.description}</p>
                                    </>
                                ) :
                                    (
                                        <>
                                            <Empty className='mt-6' description={
                                                <span className='text-gray-400 font-normal '>
                                                    There is no data about the evaluator
                                                </span>
                                            } />
                                        </>

                                    )
                            }
                        </div>
                    </div>
                </motion.div>
            </div >
        )
    } else {
        return (
            <PeerReviewVisualization activity={task} />
        )
    }

}
