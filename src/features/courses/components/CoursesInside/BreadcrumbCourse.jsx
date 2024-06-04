import { Breadcrumb } from 'antd'
import React from 'react'
import { HomeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';


export const BreadcrumbCourse = ({ coursePositionInfo, styles, courseId }) => {
    const items = [
        {
            title:
                <Link to={'/app/courses/'}>
                    <HomeOutlined className='flex items-center mt-1' />
                </Link>
            ,
        },
        {
            title:
                <Link to={`/app/courses/${courseId}`}>
                    {coursePositionInfo?.course} noe
                </Link>

        },
        {
            title:
                <Link to={`/app/courses/${courseId}`}>
                    {coursePositionInfo?.courseSection}
                </Link>
        },
        {
            title: coursePositionInfo?.activity ?
                <Link to={`/app/courses/${courseId}`}>
                    {coursePositionInfo?.courseSubsection}
                </Link>
                :
                coursePositionInfo?.courseSubsection

        }
    ];

    if (coursePositionInfo.activity) {
        items.push({
            title: coursePositionInfo.activity
        })
    }
    return (
        <Breadcrumb
            className={`flex items-center ${styles}`}
            items={items}
        />
    )
}
