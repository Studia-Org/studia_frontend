import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Tag } from '../Tag';
import { ReportBug } from './ReportBug';
import { useAuthContext } from "../../../context/AuthContext";
import { Notifications } from './Notifications';
import { CourseStatus } from './CourseStatus';


export const Navbar = () => {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    return (
        <nav className="h-[8rem]  bg-white flex items-center justify-between">
            <Link to={'/app/courses'}>
                <h1 className='pr-3 ml-16 text-3xl italic font-bold leading-none tracking-tight cursor-pointer '>Uptitude<span className='text-4xl text-pink-500 '>.</span></h1>
            </Link>

            <div className='flex items-center justify-end pr-2 md:pr-5 gap-x-6'>
                <ReportBug />
                <Notifications />
                <Tag className={'hidden lg:block'} User={user} />
                {user && <p className='hidden font-medium lg:block'>{user['name']}</p>}
                <button onClick={() => navigate(`/app/profile/${user.id}/`)} className='rounded '>
                    {user && user['profile_photo'] ? (
                        <img
                            src={user['profile_photo'].url}
                            className='object-cover rounded-lg cursor-pointer h-14 w-14'
                            alt="user profile "
                        />
                    ) : (
                        null
                    )}
                </button>
            </div>
        </nav>
    )
}
