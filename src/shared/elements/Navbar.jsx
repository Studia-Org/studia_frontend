import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiBell } from "react-icons/fi";
import { Tag } from './Tag';
import { useAuthContext } from "../../context/AuthContext";

export const Navbar = () => {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    console.log({ user })
    return (
        <nav className="h-[8rem] w-full bg-white">
            <div className="container flex flex-wrap items-center ">

                <Link to={'/app/courses'}><h1 className='p-10 sm:px-16 font-bold text-3xl italic leading-none tracking-tight cursor-pointer'>Uptitude<span className='text-pink-500 text-4xl '>.</span></h1></Link>
                <div className=' absolute right-0 flex items-center '>

                    <FiBell size={25} className="lg:mr-8 mr-4 cursor-pointer " />
                    <Tag className={'hidden lg:block'} User={user} />
                    {user && <p className='font-medium mr-5 hidden lg:block'>{user['name']}</p>}
                    <button onClick={() => navigate(`/app/profile/${user.id}/`)} className='rounded w-14 mr-9'>
                        {user && user['profile_photo'] ? (
                            <img
                                src={user['profile_photo'].url}
                                className='object-scale-down rounded-lg cursor-pointer'
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
