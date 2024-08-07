import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from 'antd';
import { FiChevronRight, FiPlus } from 'react-icons/fi';
import { useAuthContext } from '../../../../context/AuthContext';
import { useTranslation } from 'react-i18next';

export const SpeedDialCreateCourse = ({ setExpandCreateCourseStudent }) => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { user } = useAuthContext()
    const [isExpanded, setIsExpanded] = useState(false)

    function handleClick() {
        if (user && user.role_str === 'student') {
            setExpandCreateCourseStudent(true)
        } else {
            setIsExpanded(!isExpanded)
        }
    }

    return (
        <div className='fixed  right-[6.5rem] bottom-12'>
            <div
                id="speed-dial-menu-dropdown"
                className={`bg-white shadow rounded-t-2xl rounded-bl-2xl transform scale-0 w-1 -translate-x-6 opacity-0 mb-5 h-3 duration-200 ${isExpanded ? 'scale-100 h-[10rem] w-[24rem] opacity-100' : ''}`}
            >
                <div className='flex flex-col p-4 space-y-4 text-base font-medium '>
                    <div className='flex items-center'>
                        <button disabled className='flex items-center text-left text-gray-400'
                            onClick={() => navigate('create')}>
                            <div className='flex items-center duration-150'>
                                <p className='ml-2'>{t("COURSESHOME.create_course_speed_dial.create_course_from_template")}</p>
                                <FiChevronRight className='ml-1' />
                            </div>
                        </button>
                    </div>
                    <div className='flex items-center'>
                        <button className='flex items-center text-left' onClick={() => navigate('create')}>
                            <div className='flex items-center duration-150 hover:translate-x-2'>
                                <p className='ml-2'>{t("COURSESHOME.create_course_speed_dial.create_course")}</p>
                                <FiChevronRight className='ml-1' />
                                <Badge className='ml-2' count={t("COMMON.recommended")} color='#3b82f6' />
                            </div>
                        </button>
                    </div>
                    <div className='absolute bottom-0 w-full pb-2 pl-0'>
                        <hr className='ml-0 mr-8' />
                        <button className='mt-2 text-sm font-light'>{t("COMMON.need_help")}</button>
                    </div>
                </div>
            </div>
            <button
                type="button"
                data-dial-toggle="speed-dial-menu-dropdown"
                aria-controls="speed-dial-menu-dropdown"
                className="flex items-center justify-center ml-auto w-[3.2rem] h-[3.2rem]  text-white transition !bg-[#3c3c3c] rounded-full shadow-xl hover:!bg-[#4f4f4f] duration-100 hover-scale active-scale "
                onClick={() => handleClick()}
            >
                <FiPlus size={26} />
                <span className="sr-only"></span>
            </button>
        </div>
    )
}
