import React from 'react'
import { FiUser } from "react-icons/fi";
import { Link } from 'react-router-dom';

export const CoursesCardHome = ({ course }) => {
    return (
        <>
            <Link to={`/app/courses/${course.id}`}>
                <div className="max-w-sm bg-white rounded-lg shadow cursor-pointer shadow2">
                    <img className="rounded-t-lg w-full h-[13rem] object-fill" src={course.cover.url} alt="" />
                    <div className="p-3 flex flex-col justify-between h-full">
                        <h3 className='text-center truncate w-full overflow-hidden'>{course.title}</h3>
                        <p className='text-xs font-normal text-center mt-2 text-gray-700'>{course.course_type}</p>
                        <div className='container bg-gray-100 py-1.5 my-6 rounded '>
                        </div>
                        <div className='container flex flex-row space-x-20 justify-center'>
                            <div className=' px-2 bg-gray-100 h-[3rem] flex justify-center text-center align-middle space-x-1 rounded items-center'>
                                <FiUser size={19} className='my-1 justify-center text-center align-middle' />
                                <p className=' text-base font-normal'>{course.students.length}</p>
                            </div>
                            <div className=' flex bg-gray-100 h-[3rem] rounded space-x-1 px-3 items-center'>
                                <img class="w-8 h-8 rounded-full mr-3" src={course.professor['profile_photo'].url} alt="Rounded avatar" />
                                <p className='text-base font-normal'>{course.professor['name']}</p>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </Link>
        </>
    )
}
