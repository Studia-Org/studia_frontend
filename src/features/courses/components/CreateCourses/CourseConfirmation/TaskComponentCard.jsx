import React from 'react'

export const TaskComponentCard = ({ task, setVisibilityTask }) => {
    const deadlineOnTime = new Date(task.deadline) > new Date()
    return (
        <button onClick={() => setVisibilityTask(true)} className='py-5 mb-5 bg-white border-l-[12px]  border-indigo-500 rounded-md p-5 w-full text-left shadow-md flex items-center'>
            <p className='font-medium text-xl mr-5'>{task.title}</p>
            {
                deadlineOnTime ?
                    <div className='ml-auto bg-green-700 rounded-md p-2 px-8 text-center '>
                        <p className='text-base font-medium text-white  '>{task.deadline}</p>
                    </div>
                    :
                    <div className='ml-auto bg-red-700 rounded-md p-2 px-8 text-center '>
                        <p className='text-base font-medium text-white  '>{task.deadline}</p>
                    </div>
            }
        </button>
    )
}
