import React from 'react'
import { useAuthContext } from '../../../../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'

export const TaskComponentCard = ({ task, setVisibilityTask, context, courseId, setForumFlag }) => {
    const deadlineOnTime = new Date(task?.attributes?.deadline) > new Date()
    const { user } = useAuthContext()
    const navigate = useNavigate()

    function handleClickButton() {
        if (context === 'coursesInside') {
            if (task?.attributes?.type === 'forum') {
                setForumFlag(true)
            } else {
                navigate(`/app/courses/${courseId}/activity/${task.id}`)
            }
        } else {
            setVisibilityTask(true)
        }
    }

    function svgType(type) {
        switch (type) {
            case 'task':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white md:w-11 md:h-11">
                        <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
                        <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                    </svg>
                )
            case 'Peer Review':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white md:w-11 md:h-11">
                        <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                    </svg>
                )
            case 'forum':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white md:w-11 md:h-11">
                        <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
                        <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                    </svg>
                )
            default:
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white md:w-11 md:h-11">
                        <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
                        <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                    </svg>
                )
        }
    }

    function handleTaskTitle(title) {
        switch (title) {
            case 'task':
                return title
            case 'peerReview':
                return 'Peer review'
            case 'forum':
                return 'Forum discussion'
            default:
                return title
        }
    }

    if (context === 'coursesInside') {
        let deadlineFormatted = null
        try {
            deadlineFormatted = format(new Date(task?.attributes?.deadline), 'dd-MM-yyyy HH:mm:ss')
        } catch (error) {
            deadlineFormatted = 'No deadline'
        }
        return (
            <button onClick={() => handleClickButton()}
                className='relative flex items-center w-full p-5 py-5 mb-5 text-left duration-150 bg-white border border-[#DADADA] rounded-md hover:bg-gray-50'>
                <div className='absolute bg-indigo-500 h-full left-0 top-0 w-[3rem] md:w-[5rem] rounded-l-md flex items-center justify-center'>
                    {svgType(task?.attributes?.type)}
                </div>
                <p className='ml-10 text-xl font-medium md:ml-20'>{task?.attributes.title}</p>
                {user?.role_str !== 'professor' && user?.role_str !== 'admin' && (
                    deadlineOnTime ?
                        <div className='p-2 px-8 ml-auto text-center bg-green-700 rounded-md '>
                            <p className='text-base font-medium text-white'>{deadlineFormatted}</p>
                        </div>
                        :
                        <div className='p-2 px-8 ml-auto text-center bg-red-700 rounded-md '>
                            <p className='text-base font-medium text-white'>{deadlineFormatted}</p>
                        </div>
                )}
            </button>
        )
    } else {
        return (
            <button onClick={() => handleClickButton()}
                className='relative flex items-center w-full p-5 py-5 mb-5 text-left duration-100 bg-white rounded-md shadow-md hover:bg-gray-50'>
                <div className='absolute bg-indigo-500 h-full left-0 top-0 w-[5rem] rounded-l-md flex items-center justify-center'>
                    {svgType(task?.type)}
                </div>
                <p className='ml-10 text-xl font-medium md:ml-20'>{handleTaskTitle(task?.title)}</p>
            </button>
        )
    }


}
