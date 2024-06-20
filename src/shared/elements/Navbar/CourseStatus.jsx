import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { API } from '../../../constant'
import { getToken } from '../../../helpers'
import { Avatar } from 'antd'

export const CourseStatus = () => {
    const courseId = (useLocation().pathname.match(/\/(\d+)$/) || [])[1]
    const [courseInfo, setCourseInfo] = useState({})
    useEffect(() => {
        // fetch course status
        const courseInfo = async () => {
            try {
                const response = await fetch(`${API}/courses/${courseId}?populate=cover`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': getToken()
                    }
                })
                const data = await response.json()
                setCourseInfo(data)
                console.log(data)
            } catch (error) {
                console.log(error)
            }

        }
        courseInfo()
    }, [courseId])

    if (courseId && courseInfo?.data) {
        return (
            <div className='flex items-center gap-2  rounded-xl bg-[#e7eaf886] absolute left-[19.6rem] border'>
                <img className='object-cover w-20 h-14 rounded-l-xl' src={courseInfo.data?.attributes?.cover.data?.attributes?.url} alt="" />
                <h2 className='pr-5 font-semibold'>{courseInfo.data?.attributes?.title}</h2>
            </div>

        )
    }

}
