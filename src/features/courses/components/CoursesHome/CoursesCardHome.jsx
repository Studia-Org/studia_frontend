import React from 'react'
import { FiUser } from "react-icons/fi";
import { Link } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import { AvatarGroup, Avatar } from 'rsuite';

export const CoursesCardHome = ({ course }) => {

    function renderCourseTags(tag) {
        return (
            <div className=' bg-blue-200 p-1 h-6 rounded-lg text-blue-800 my-1 mr-3'>
                <p className='font-medium text-xs'>{tag}</p>
            </div>
        )
    }

    return (
        <>
            <Link to={`/app/courses/${course.id}`}>
                <div className="2xl:w-[24rem] mb-8 2xl:h-[26rem] lg:w-[20rem] lg:h-[24rem] md:w-[16rem] md:h-[22rem] w-[22rem] h-[24rem] bg-white rounded-3xl shadow-md cursor-pointer shadow2 relative flex flex-col">
                    <img className="rounded-t-3xl w-full min-h-[12rem] max-h-[12rem] object-cover" src={course.cover} alt="" />
                    <div className="p-3 flex flex-col ml-5 mr-5 h-full">
                        <div className='flex flex-wrap flex-grow '>
                            {course.tags?.map(renderCourseTags)}
                        </div>
                        <h3 className='text-left text-xl font-bold w-full overflow-hidden line-clamp-2 mt-2 items-center'>{course.title}</h3>
                        <div className='flex items-center flex-grow mt-3' name='studentData'>
                            <img src={course.professor_profile_photo} className='w-8 h-8 rounded-full' alt="" />
                            <p className='font-normal text-xs ml-2'>{course.professor_name}</p>
                            <div className='ml-auto pb-3 flex items-center '>
                                <AvatarGroup stack>
                                    {course.students
                                        .filter((user, i) => i < 3)
                                        .map(user => (
                                            <Avatar circle key={user.id} src={user.attributes ? user.attributes.profile_photo.data.attributes.url : user.profile_photo.url} alt={user.attributes ? user.attributes.username : user.username} style={{ width: '2rem', height: '2rem' }} />
                                        ))}
                                    {course.students.length > 3 && (
                                        <Avatar circle style={{ background: '#3730a3', width: '2rem', height: '2rem', fontSize: '0.75rem', fontWeight: '400' }}>
                                            +{course.students.length - 3}
                                        </Avatar>
                                    )}
                                </AvatarGroup>
                            </div>
                        </div>
                    </div>
                </div>

            </Link>
        </>
    )
}
