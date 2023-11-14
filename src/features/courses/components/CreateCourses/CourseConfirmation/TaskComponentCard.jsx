import React from 'react'

export const TaskComponentCard = ({ task, setVisibilityTask }) => {
    return (
        <button onClick={() => setVisibilityTask(true)} className='py-5 mb-5 bg-white border-l-[12px]  border-indigo-500 rounded-md p-5 w-full text-left'>
            <p className='font-medium text-xl'>{task.title}</p>
        </button>
    )
}
