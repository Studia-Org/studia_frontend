import React from 'react'
import { Button } from 'antd'

export const CardCreateCourse = ({ courseData, setCustomizeCourse, setSeletedCourse }) => {

    function handleClick() {
        setCustomizeCourse(true)
        setSeletedCourse(courseData)
    }

    return (
        <div className="w-full max-w-sm overflow-hidden rounded-lg shadow-md bg-gray-50 ">
            <div className='relative'>
                <div className='absolute w-full h-full bg-black opacity-20 '></div>
                {
                    courseData.new && (
                        <div className='absolute top-4 right-4'>
                            <span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-lg text-xs font-medium hover:bg-blue-50 shadow-lg
                            bg-blue-100 text-blue-800 ">New</span>

                        </div>
                    )
                }

                <img className="object-cover object-center w-full h-56" src={courseData.image} alt="avatar" />
            </div>

            <div className="flex items-center px-3 py-3 bg-black">
                <h1 className="mx-3 text-lg font-semibold text-white">{courseData.title}</h1>
            </div>

            <div className="px-6 py-4">
                <p className="py-2 text-gray-700 ">{courseData.description}</p>
                <p className='mt-4 mb-2 text-xs text-gray-400'>About the creator</p>
                <div className="flex flex-col px-4 py-3 text-gray-700 bg-white border rounded-md ">
                    <div className='flex items-center gap-3 mb-2'>
                        <img className="object-cover object-center w-8 h-8 rounded-full" src={courseData.creatorPhoto} alt="avatar" />
                        <h1 className="mb-1 font-medium">{courseData.creator}</h1>
                        {
                            courseData.verified && (
                                <span class="ml-auto inline-flex items-center justify-center w-6 h-6 me-2 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full ">
                                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill="currentColor" d="m18.774 8.245-.892-.893a1.5 1.5 0 0 1-.437-1.052V5.036a2.484 2.484 0 0 0-2.48-2.48H13.7a1.5 1.5 0 0 1-1.052-.438l-.893-.892a2.484 2.484 0 0 0-3.51 0l-.893.892a1.5 1.5 0 0 1-1.052.437H5.036a2.484 2.484 0 0 0-2.48 2.481V6.3a1.5 1.5 0 0 1-.438 1.052l-.892.893a2.484 2.484 0 0 0 0 3.51l.892.893a1.5 1.5 0 0 1 .437 1.052v1.264a2.484 2.484 0 0 0 2.481 2.481H6.3a1.5 1.5 0 0 1 1.052.437l.893.892a2.484 2.484 0 0 0 3.51 0l.893-.892a1.5 1.5 0 0 1 1.052-.437h1.264a2.484 2.484 0 0 0 2.481-2.48V13.7a1.5 1.5 0 0 1 .437-1.052l.892-.893a2.484 2.484 0 0 0 0-3.51Z" />
                                        <path fill="#fff" d="M8 13a1 1 0 0 1-.707-.293l-2-2a1 1 0 1 1 1.414-1.414l1.42 1.42 5.318-3.545a1 1 0 0 1 1.11 1.664l-6 4A1 1 0 0 1 8 13Z" />
                                    </svg>
                                    <span class="sr-only">Icon description</span>
                                </span>
                            )
                        }
                    </div>
                    <p className='text-gray-500'>{courseData.creatorDescription}</p>
                </div>
                <Button disabled onClick={() => handleClick()} className='w-full mt-4 bg-white'>
                    Customize your course
                </Button>
            </div>


        </div>
    )
}
