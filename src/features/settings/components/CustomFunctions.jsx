import React, { useState } from 'react'
import { Button, InputNumber, Popconfirm } from 'antd'
import { replicateCourse } from '../../courses/components/CoursesHome/helpers/replicateCourse'

export const CustomFunctions = () => {
    const [courseId, setCourseId] = useState('')
    return (
        <div className='mt-10'>
            <div className='p-5 space-y-3 bg-white border rounded-md'>
                <h2>Duplicate Course</h2>
                <p className='text-sm font-normal'>Enter the course ID of the course you want to duplicate</p>
                <InputNumber
                    className='w-full'
                    placeholder='Course ID'
                    value={courseId}
                    onChange={value => setCourseId(value)}
                />

                <Popconfirm
                    title="Delete the task"
                    description="Are you sure to delete this task?"
                    onConfirm={() => replicateCourse(courseId)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button className='flex ml-auto' >
                        Submit
                    </Button>
                </Popconfirm>
            </div>
        </div >
    )
}
