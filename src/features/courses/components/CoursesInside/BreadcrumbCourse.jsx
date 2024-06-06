import { Breadcrumb } from 'antd'
import React from 'react'
import { HomeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useCourseContext } from '../../../../context/CourseContext';


export const BreadcrumbCourse = ({  styles }) => {
    
    const {
        course,
        sectionSelected,
        subsectionSelected,
        activitySelected,
    } = useCourseContext();
    
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
                <Link to={`/app/courses/${course[0].id}`}>
                    {course[0].attributes.title}
                </Link>

        },
        {
            title:
                <Link to={`/app/courses/${course[0].id}`}>
                    {sectionSelected}
                </Link>
        },
        {
            title: activitySelected?.activity ?
                <Link to={`/app/courses/${course[0].id}`}>
                    {subsectionSelected.attributes.title}
                </Link>
                :
                subsectionSelected.attributes.title

        }
    ];

    if (activitySelected?.activity) {
        items.push({
            title: activitySelected?.activity
        })
    }
    return (
        <Breadcrumb
            className={`flex items-center ${styles}`}
            items={items}
        />
    )
}
