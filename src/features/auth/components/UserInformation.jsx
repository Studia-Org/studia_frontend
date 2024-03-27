import React, { useState } from 'react'
import { BsFillArrowLeftSquareFill } from 'react-icons/bs'
import { Link } from 'react-router-dom';
import { message } from 'antd';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond/dist/filepond.min.css';
registerPlugin(FilePondPluginImagePreview);

export const UserInformation = ({ onChange, formData, username, email, university, password, repassword, name, setPageSelector, setProfilePhoto, profilePhoto }) => {

    function handleContinue() {
        if (!username || !email || !university || !password || !repassword || !name || profilePhoto.length === 0) {
            message.error('Please fill in all fields')
        }
        else if (password !== repassword) {
            message.error('Passwords do not match')
        }
        else {
            setPageSelector(2)
        }
    }

    return (
        <div class="bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden " style={{ maxWidth: '1000px' }} >
            <div className="w-full md:flex ">
                <div className="relative hidden w-1/2 px-10 py-10 md:block bg-image ">
                    <div className='w-[2rem]'>
                        <a href="/">
                            <BsFillArrowLeftSquareFill size={30} style={{ cursor: "pointer", color: "rgba(255, 255, 255, 1)" }} />
                        </a>
                    </div>
                    <div className='flex justify-center'>
                        <div className='absolute top-[16rem] w-2/4   '>
                            <h1 className='text-4xl font-medium text-white '>Learn from anywhere, anytime</h1>
                            <p className='my-5 text-white '>Register now and start acquiring new knowledge with our online courses. <br /> Learning has never been easier!</p>
                        </div>
                    </div>
                    <div className='absolute inset-x-0 flex flex-col items-center bottom-7'>
                        <p className='text-sm text-center text-white' >In case you have an account already</p>
                        <Link to="/auth/login" class="my-3 bg-white text-gray-800 font-bold rounded border-b-2 border-indigo-400  transition-all hover:border-indigo-400 hover:bg-indigo-400 hover:text-white shadow-md py-2 px-6 inline-flex items-center">
                            <span class="">Login</span>
                        </Link>
                    </div>
                </div>
                <div class="w-full md:w-1/2 py-10 px-5 md:px-10">
                    <div className="mb-10 text-center">
                        <h1 class="font-bold text-3xl text-gray-900">Register</h1>
                        <p>Enter your information to register</p>
                    </div>
                    <div>
                        <div class="flex -mx-3">
                            <div class="w-full px-3 mb-5">
                                <label for="" class="text-xs font-semibold px-1">Username *</label>
                                <div class="flex">
                                    <div class="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i class="mdi mdi-account text-gray-400 text-lg"></i></div>
                                    <input
                                        type="email"
                                        class="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                                        placeholder=""
                                        name='username'
                                        value={username}
                                        onChange={e => onChange(e)}
                                        required />
                                </div>
                            </div>
                        </div>
                        <div class="flex -mx-3">
                            <div class="w-full px-3 mb-5">
                                <label for="" class="text-xs font-semibold px-1">Name *</label>
                                <div class="flex">
                                    <div class="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i class="mdi mdi-account-group text-gray-400 text-lg"></i></div>
                                    <input
                                        type="email"
                                        class="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                                        placeholder=""
                                        name='name'
                                        value={name}
                                        onChange={e => onChange(e)}
                                        required />
                                </div>
                            </div>
                        </div>
                        <div class="flex -mx-3">
                            <div class="w-full px-3 mb-5">
                                <label for="" class="text-xs font-semibold px-1">Email *</label>
                                <div class="flex">
                                    <div class="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i class="mdi mdi-email-outline text-gray-400 text-lg"></i></div>
                                    <input
                                        type="email"
                                        class="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                                        placeholder=""
                                        name='email'
                                        value={email}
                                        onChange={e => onChange(e)}
                                        required />
                                </div>
                            </div>
                        </div>
                        <div class="flex -mx-3">
                            <div class="w-full px-3 mb-5">
                                <label for="" class="text-xs font-semibold px-1">University *</label>
                                <div class="flex">
                                    <div class="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i class="mdi mdi-school text-gray-400 text-lg"></i></div>
                                    <input
                                        type="email"
                                        class="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                                        placeholder=""
                                        name='university'
                                        value={university}
                                        onChange={e => onChange(e)}
                                        required />
                                </div>
                            </div>
                        </div>
                        <div className='flex -mx-3'>
                            <div className="w-full px-3 mb-5">
                                <label for="" className="px-1 text-xs font-semibold">Add a profile photo *</label>
                                <FilePond
                                    files={profilePhoto}
                                    onupdatefiles={setProfilePhoto}
                                    maxFiles={1}
                                />
                            </div>
                        </div>
                        <div class="flex -mx-3">
                            <div class="w-full px-3 mb-12 relative">
                                <label for="" class="text-xs font-semibold px-1">Password *</label>
                                <div class="flex">
                                    <div class="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i class="mdi mdi-lock-outline text-gray-400 text-lg"></i></div>
                                    <input
                                        type="password"
                                        class="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                                        placeholder=""
                                        name='password'
                                        value={password}
                                        onChange={e => onChange(e)}
                                        minLength='8'
                                        required />
                                </div>
                            </div>
                            <div class="w-full px-3 mb-12 relative">
                                <label for="" class="text-xs font-semibold px-1">Repeat Password *</label>
                                <div class="flex">
                                    <div class="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i class="mdi mdi-lock-outline text-gray-400 text-lg"></i></div>
                                    <input
                                        type="password"
                                        class="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                                        placeholder=""
                                        name='repassword'
                                        value={repassword}
                                        onChange={e => onChange(e)}
                                        minLength='8'
                                        required />
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-center pt-7 mb-5">
                            <div class="w-full  sm:ml-8 mb-5 text-center ml-auto">
                                <button type="button" onClick={() => handleContinue()}
                                    className="flex items-center gap-2 ml-auto justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2  focus:outline-none">Continue
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
