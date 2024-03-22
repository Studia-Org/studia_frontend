import React from 'react'
import { Link } from 'react-router-dom';
import { AvatarGroup, Avatar } from 'rsuite';
import { Badge, Tag } from 'antd';

export const CoursesCardHome = ({ course }) => {
    console.log(course.createdAt)

    const isCourseNew = () => {
        const courseDate = new Date(course.createdAt);
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate - courseDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    }


    function renderCourseTags(tag) {
        return (
            <Tag className='font-normal' color="#108ee9">{tag}</Tag>
        )
    }

    const CardContent = () => {
        return (
            <div className="2xl:w-[24rem] mb-8 2xl:h-[26rem] lg:w-[20rem] lg:min-h-[24rem] md:w-[16rem] md:min-h-[23rem] w-[22rem] min-h-[24rem] bg-white rounded-3xl shadow-md cursor-pointer shadow2 relative flex flex-col">
                <img className="rounded-t-3xl w-full min-h-[12rem] max-h-[12rem] object-cover" src={course.cover} alt="" />
                <div className="flex flex-col h-full p-3 ml-5 mr-5">
                    <div className='flex flex-wrap flex-grow '>
                        {course.tags?.map(renderCourseTags)}
                    </div>
                    <h3 className='items-center w-full mt-2 overflow-hidden text-xl font-bold text-left line-clamp-2'>{course.title}</h3>
                    <div className='flex items-center flex-grow mt-3' name='studentData'>
                        <img src={course.professor_profile_photo} className='w-8 h-8 rounded-full' alt="" />
                        <p className='ml-2 text-xs font-medium'>{course.professor_name}</p>
                        {
                            course.professor_name === 'Uptitude' && (
                                <span class="ml-3 inline-flex items-center justify-center w-6 h-6 me-2 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full ">
                                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill="currentColor" d="m18.774 8.245-.892-.893a1.5 1.5 0 0 1-.437-1.052V5.036a2.484 2.484 0 0 0-2.48-2.48H13.7a1.5 1.5 0 0 1-1.052-.438l-.893-.892a2.484 2.484 0 0 0-3.51 0l-.893.892a1.5 1.5 0 0 1-1.052.437H5.036a2.484 2.484 0 0 0-2.48 2.481V6.3a1.5 1.5 0 0 1-.438 1.052l-.892.893a2.484 2.484 0 0 0 0 3.51l.892.893a1.5 1.5 0 0 1 .437 1.052v1.264a2.484 2.484 0 0 0 2.481 2.481H6.3a1.5 1.5 0 0 1 1.052.437l.893.892a2.484 2.484 0 0 0 3.51 0l.893-.892a1.5 1.5 0 0 1 1.052-.437h1.264a2.484 2.484 0 0 0 2.481-2.48V13.7a1.5 1.5 0 0 1 .437-1.052l.892-.893a2.484 2.484 0 0 0 0-3.51Z" />
                                        <path fill="#fff" d="M8 13a1 1 0 0 1-.707-.293l-2-2a1 1 0 1 1 1.414-1.414l1.42 1.42 5.318-3.545a1 1 0 0 1 1.11 1.664l-6 4A1 1 0 0 1 8 13Z" />
                                    </svg>
                                    <span class="sr-only">Icon description</span>
                                </span>
                            )
                        }
                        <div className='flex items-center pb-3 ml-auto '>
                            {
                                course.studentManaged ?
                                    (
                                        <Badge
                                            className='mt-3'
                                            count='Self-managed'
                                            color='#3730a3'

                                        />
                                    )
                                    :
                                    (
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
                                    )
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }



    return (
        <>
            <Link to={`/app/courses/${course.id}`}>
                {
                    isCourseNew() ? (
                        <Badge.Ribbon className='font-normal' text="New">
                            <CardContent />
                        </Badge.Ribbon>
                    ) : (
                        <CardContent />
                    )
                }
            </Link>
        </>
    )
}
