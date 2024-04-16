import React from 'react'
import { useNavigate } from 'react-router-dom';
import userStyles from '../styles/userStyles.css';

export const CoursesCardsProfile = ({ course, user }) => {
    const navigate = useNavigate();
    const isUserMember = course.students.some(student => student.id === user.id);

    function handleCourseNavigation() {
        if (isUserMember) {
            navigate(`/app/courses/${course.id}`);
        }
    }

    function handleButtonClick(event) {
        event.stopPropagation();
        navigate(`/app/profile/${course.professor.id}/`);
    }

    return (
        <div className="w-full p-3 " onClick={() => handleCourseNavigation()}>
            <div className={`w-full lg:max-w-full lg:flex ${isUserMember ? 'shadow2' : ''} cursor-pointer`}>
                <div
                    className="flex-none h-48 overflow-hidden text-center bg-cover rounded-l lg:h-auto lg:w-48"
                    style={{ backgroundImage: `url(${course?.cover?.url})` }}
                    title=""
                >
                </div>
                <div className="flex flex-col justify-between w-full p-4 leading-normal bg-white border-b border-l border-r border-gray-400 rounded-b lg:border-l-0 lg:border-t lg:border-gray-400 lg:rounded-b-none lg:rounded-r">
                    <div className="mb-8">
                        {!isUserMember && (
                            <p className="flex items-center text-sm text-gray-600">
                                <svg
                                    className="w-3 h-3 mr-2 text-gray-500 fill-current"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
                                </svg>
                                Members only
                            </p>
                        )}
                        <div className="mb-2 text-xl font-bold text-gray-900">
                            {course.title}
                        </div>
                        <p className="text-base text-gray-700">
                            {course.description}
                        </p>
                    </div>
                    <div className="flex items-center">
                        <button className='flex items-center' onClick={handleButtonClick}>
                            <img
                                className="w-10 h-10 mr-4 rounded-full"
                                src={course.professor?.profile_photo?.url}
                                alt="Avatar of Writer"
                            />
                            <div className="text-sm">
                                <p className="leading-none text-gray-900">{course.professor.name}</p>
                            </div>
                        </button>

                    </div>
                </div>
            </div>
        </div>
    )
}
