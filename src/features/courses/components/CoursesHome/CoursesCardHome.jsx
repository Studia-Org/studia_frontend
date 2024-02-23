import React from 'react'
import { FiUser } from "react-icons/fi";
import { Link } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import { AvatarGroup, Avatar } from 'rsuite';

export const CoursesCardHome = ({ course }) => {

    function renderCourseTags(tag) {
        return (
            <div className=' bg-[#1677ff] p-1 h-6 rounded-md text-white my-1 mr-3 px-2'>
                <p className='text-xs font-normal'>{tag}</p>
            </div>
        )
    }

    return (
        <>
            <Link to={`/app/courses/${course.id}`}>
                <div className="2xl:w-[24rem] mb-8 2xl:h-[26rem] lg:w-[20rem] lg:min-h-[24rem] md:w-[16rem] md:min-h-[23rem] w-[22rem] min-h-[24rem] bg-white rounded-3xl shadow-md cursor-pointer shadow2 relative flex flex-col">
                    <img className="rounded-t-3xl w-full min-h-[12rem] max-h-[12rem] object-cover" src={course.cover} alt="" />
                    <div className="flex flex-col h-full p-3 ml-5 mr-5">
                        <div className='flex flex-wrap flex-grow '>
                            {course.tags?.map(renderCourseTags)}
                        </div>
                        <h3 className='items-center w-full mt-2 overflow-hidden text-xl font-bold text-left line-clamp-2'>{course.title}</h3>
                        <div className='flex items-center flex-grow mt-3' name='studentData'>
                            <img src={course.professor_profile_photo} className='w-8 h-8 rounded-full' alt="" />
                            <p className='ml-2 text-xs font-normal'>{course.professor_name}</p>
                            <div className='flex items-center pb-3 ml-auto '>
                                <AvatarGroup stack>
                                    {course.students
                                        .filter((user, i) => i < 2)
                                        .map(user => (
                                            <Avatar circle key={user.id} src={user.attributes ? user.attributes.profile_photo.data.attributes.url : user.profile_photo.url} alt={user.attributes ? user.attributes.username : user.username} style={{ width: '2rem', height: '2rem' }} />
                                        ))}
                                    {course.students.length > 2 && (
                                        <Avatar circle style={{ background: '#3730a3', width: '2rem', height: '2rem', fontSize: '0.75rem', fontWeight: '400' }}>
                                            +{course.students.length - 2}
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
