import { Breadcrumb } from 'antd'
import React from 'react'
import { HomeOutlined } from '@ant-design/icons';


export const BreadcrumbCourse = ({ coursePositionInfo, styles, courseId }) => {
    const items = [
        {
            href: '/app/courses/',
            title: (
                <div className='flex items-center justify-center'>
                    <HomeOutlined className='mt-1' />
                </div>
            ),
        },
        {
            href: coursePositionInfo?.activity ? `/app/courses/${courseId}` : undefined,
            title: coursePositionInfo?.course
        },
        {
            href: coursePositionInfo?.activity ? `/app/courses/${courseId}` : undefined,
            title: coursePositionInfo?.courseSection
        },
        {
            href: coursePositionInfo?.activity ? `/app/courses/${courseId}` : undefined,
            title: coursePositionInfo?.courseSubsection
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
