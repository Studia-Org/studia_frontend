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
        if (user && user.role_str === 'professor') {
            navigate('create')
        }
    }

    return (
        <div className='fixed right-[6.5rem] bottom-12'>
            <button
                type="button"
                data-dial-toggle="speed-dial-menu-dropdown"
                aria-controls="speed-dial-menu-dropdown"
                className="flex items-center justify-center ml-auto w-[3.2rem] h-[3.2rem]  text-white transition !bg-[#3c3c3c] rounded-full shadow-xl hover:!bg-[#4f4f4f] duration-100 hover-scale active-scale "
                onClick={handleClick}
            >
                <FiPlus size={26} />
                <span className="sr-only"></span>
            </button>
        </div>
    )
}
