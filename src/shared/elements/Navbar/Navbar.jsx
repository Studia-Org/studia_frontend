import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Tag } from '../Tag';
import { ReportBug } from './ReportBug';
import { useAuthContext } from "../../../context/AuthContext";
import { Notifications } from './Notifications';


export const Navbar = () => {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    return (
        <nav className="h-[8rem] w-full bg-white">
            <div className="container flex flex-wrap items-center ">

                <Link to={'/app/courses'}><h1 className='p-10 ml-6 text-3xl italic font-bold leading-none tracking-tight cursor-pointer sm:px-16'>Uptitude<span className='text-4xl text-pink-500 '>.</span></h1></Link>
                <div className='absolute right-0 flex items-center gap-x-6 md:gap-x-6'>
                    <ReportBug />
                    <Notifications />
                    <Tag className={'hidden lg:block'} User={user} />
                    {user && <p className='hidden font-medium lg:block'>{user['name']}</p>}
                    <button onClick={() => navigate(`/app/profile/${user.id}/`)} className='rounded mr-11'>
                        {user && user['profile_photo'] ? (
                            <img
                                src={user['profile_photo'].url}
                                className='object-cover rounded-lg cursor-pointer h-14 w-14'
                                alt=""
                            />
                        ) : (
                            null
                        )}
                    </button>
                </div>
            </div>
        </nav>
    )
}
