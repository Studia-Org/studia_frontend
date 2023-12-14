import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Tag } from '../Tag';
import { useAuthContext } from "../../../context/AuthContext";
import { Notifications } from './Notifications';


export const Navbar = () => {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    return (
        <nav className="h-[8rem] w-full bg-white">
            <div className="container flex flex-wrap items-center ">

                <Link to={'/app/courses'}><h1 className='p-10 sm:px-16 font-bold text-3xl italic leading-none tracking-tight cursor-pointer'>Uptitude<span className='text-pink-500 text-4xl '>.</span></h1></Link>
                <div className=' absolute right-0 flex items-center '>
                    <Notifications />

                    <Tag className={'hidden lg:block'} User={user} />
                    {user && <p className='font-medium mr-5 hidden lg:block'>{user['name']}</p>}
                    <button onClick={() => navigate(`/app/profile/${user.id}/`)} className='rounded  mr-9'>
                        {user && user['profile_photo'] ? (
                            <img
                                src={user['profile_photo'].url}
                                className='object-cover rounded-lg cursor-pointer h-14 w-14'
                                alt=""
                            />
                        ) : (
                            <div></div>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    )
}
