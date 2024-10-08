import React from 'react'
import { message } from 'antd';
import { useTranslation } from 'react-i18next';

export const CreateCourseBreadcrumb = ({ createCourseOption, setCreateCourseOption, courseBasicInfo }) => {
    const { t } = useTranslation();

    function handleContinue(n) {
        if (courseBasicInfo.courseName === '' || courseBasicInfo.description === '' || courseBasicInfo.tags.length === 0 || !courseBasicInfo.cover || courseBasicInfo.cover.length === 0) {
            message.error(t("COMMON.please_complete"))
        } else {
            setCreateCourseOption(n)
        }
    }

    switch (createCourseOption) {
        case 0:
            return (
                <ol class="flex items-center  text-sm font-medium text-center text-gray-500 w-2/4 mt-5 sm:text-base">
                    <li class="flex md:w-full items-center text-blue-600 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 ">
                        <button onClick={() => setCreateCourseOption(0)} class="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 ">
                            <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                            </svg>
                            <p className='w-full max-w-none'>{t("CREATE_COURSES.NAVIGATION.course_info")}</p>

                        </button>
                    </li>
                    <li class="flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 ">
                        <button onClick={() => handleContinue(1)} class="hover:text-blue-400 duration-150 flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 ">
                            <span class="mr-2">2</span>
                            <p className='w-full max-w-none'> {t("CREATE_COURSES.NAVIGATION.course_sections")}</p>

                        </button>
                    </li>
                    <li class="flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 ">
                        <button onClick={() => handleContinue(2)} class="hover:text-blue-400 duration-150 flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 ">
                            <span class="mr-2">3</span>
                            <p className='w-full max-w-none'> {t("CREATE_COURSES.NAVIGATION.course_visualization")}</p>

                        </button>
                    </li>
                </ol>
            )
        case 1:
            return (
                <ol class="flex items-center  text-sm font-medium text-center text-gray-500 w-2/4 mt-5 sm:text-base">
                    <li class="flex md:w-full items-center  sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 ">
                        <button onClick={() => setCreateCourseOption(0)} class="hover:text-blue-400 duration-150 flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 ">
                            <span class="mr-2">1</span>
                            <p className='w-full max-w-none'> {t("CREATE_COURSES.NAVIGATION.course_info")}</p>
                        </button>
                    </li>
                    <li class="flex md:w-full items-center text-blue-600 after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 ">
                        <button onClick={() => setCreateCourseOption(1)} class="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 ">
                            <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                            </svg>
                            <p className='w-full max-w-none'> {t("CREATE_COURSES.NAVIGATION.course_sections")}</p>
                        </button>
                    </li>
                    <li class="flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 ">
                        <button onClick={() => setCreateCourseOption(2)} class="hover:text-blue-400 duration-150 flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 ">
                            <span class="mr-2">3</span>
                            <p className='w-full max-w-none'> {t("CREATE_COURSES.NAVIGATION.course_visualization")}</p>
                        </button>
                    </li>
                </ol>
            )
        case 2:
            return (
                <ol class="flex items-center  text-sm font-medium text-center text-gray-500 w-2/4 mt-5 sm:text-base">
                    <li class="flex md:w-full items-center sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 ">
                        <button onClick={() => setCreateCourseOption(0)} class="hover:text-blue-400 duration-150 flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 ">
                            <span class="mr-2">1</span>
                            <p className='w-full max-w-none'> {t("CREATE_COURSES.NAVIGATION.course_info")}</p>

                        </button>
                    </li>
                    <li class="flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 ">
                        <button onClick={() => setCreateCourseOption(1)} class="hover:text-blue-400 duration-150 flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 ">
                            <span class="mr-2">2</span>
                            <p className='w-full max-w-none'> {t("CREATE_COURSES.NAVIGATION.course_sections")}</p>
                        </button>
                    </li>
                    <li class="flex items-center text-blue-600 w-full">
                        <button onClick={() => setCreateCourseOption(2)} class="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 ">
                            <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                            </svg>
                            <p className='w-full max-w-none'> {t("CREATE_COURSES.NAVIGATION.course_visualization")}</p>
                        </button>
                    </li>
                </ol>
            )
        default:
            return (
                <ol class="flex items-center  text-sm font-medium text-center text-gray-500 w-2/4 mt-5 sm:text-base">
                    <li class="flex md:w-full items-center text-blue-600 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 ">
                        <span class="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 ">
                            <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                            </svg>
                            {t("CREATE_COURSES.NAVIGATION.course_info")}
                        </span>
                    </li>
                    <li class="flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 ">
                        <span class="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 ">
                            <span class="mr-2">2</span>
                            {t("CREATE_COURSES.NAVIGATION.course_sections")}
                        </span>
                    </li>
                    <li class="flex items-center w-full">
                        <span class="mr-2">3</span>
                        {t("CREATE_COURSES.NAVIGATION.course_visualization")}
                    </li>
                </ol>
            )
    }
}
