import React, { useState } from 'react'
import { Sidebar } from '../../../shared/elements/Sidebar';
import { Navbar } from '../../../shared/elements/Navbar';
import { FiChevronRight } from 'react-icons/fi';
import draw2 from '../../../assets/draw2.png'


const CreateCourse = () => {
    return (
        <div className='h-screen w-screen bg-white '>
            <Navbar />
            <div className='flex flex-wrap-reverse h-[calc(100%-8rem)] w-full sm:flex-nowrap bg-white'>
                <Sidebar section={'courses'} />
                <div className='rounded-tl-3xl bg-[#e7eaf886] w-full max-h-full'>
                    <div className='pt-9 pl-12 h-full font-bold text-2xl w-full'>

                        <h1>Create new Course</h1>
                        <ol class="flex items-center  text-sm font-medium text-center text-gray-500 w-2/4 mt-5 sm:text-base">
                            <li class="flex md:w-full items-center text-blue-600 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 ">
                                <span class="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 ">
                                    <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                    </svg>
                                    Course <span class="hidden sm:inline-flex sm:ml-2">Info</span>
                                </span>
                            </li>
                            <li class="flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 ">
                                <span class="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 ">
                                    <span class="mr-2">2</span>
                                    Course <span class="hidden sm:inline-flex sm:ml-2">sections</span>
                                </span>
                            </li>
                            <li class="flex items-center">
                                <span class="mr-2">3</span>
                                Confirmation
                            </li>
                        </ol>
                        <p className='font-normal text-sm text-gray-400 mt-10'>First, give us some information about the new course</p>
                        <div className='flex justify-between mr-16 mt-5'>
                            <div className='w-2/4 flex flex-col'>
                                <label for="base-input" class="block mb-2 text-sm font-medium text-gray-900 ">Course name</label>
                                <input type="text" id="base-input" class="bg-gray-50 border border-gray-300 text-gray-900 font-normal text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " />
                                <label for="message" class="block mb-2 text-sm font-medium text-gray-900 mt-8">Description</label>
                                <textarea id="message" rows="4" class="block p-2.5 w-full text-sm text-gray-900 font-normal bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "></textarea>
                                <div className='flex mt-8 justify-between'>
                                    <div className='font-medium'>
                                        <label class="block mb-2 text-sm font-medium text-gray-900 " for="user_avatar">Background image</label>
                                        <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-2" aria-describedby="user_avatar_help" id="user_avatar" type="file" />
                                    </div>
                                    <div>
                                        <label class="block  text-sm font-medium text-gray-900 mb-4">Course type</label>
                                        <fieldset className='ml-4'>
                                            <legend class="sr-only">Course type</legend>
                                            <div class="flex items-center mb-4">
                                                <input id="country-option-1" type="radio" name="countries" value="USA" class="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 " />
                                                <label for="country-option-1" class="block ml-2 text-sm font-normal text-gray-900 ">
                                                    Required
                                                </label>
                                            </div>

                                            <div class="flex items-center mb-4">
                                                <input id="country-option-2" type="radio" name="countries" value="Germany" class="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 " />
                                                <label for="country-option-2" class="block ml-2 text-sm font-normal text-gray-900 ">
                                                    Optional
                                                </label>
                                            </div>

                                            <div class="flex items-center mb-4">
                                                <input id="country-option-3" type="radio" name="countries" value="Spain" class="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 " />
                                                <label for="country-option-3" class="block ml-2 text-sm font-normal text-gray-900 ">
                                                    Basic formation
                                                </label>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                                <button className=" inline-flex w-min items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 f">
                                    <span className="flex items-center justify-center gap-2 w-[10rem] py-3.5 transition-all ease-in duration-75 text-black hover:text-white bg-white  rounded-md group-hover:bg-opacity-0">
                                          Continue <FiChevronRight/>
                                    </span>
                                </button>
                            </div>
                            <img src={draw2} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateCourse