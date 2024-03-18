import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button, DatePicker, Input, message } from 'antd'
import { UploadFiles } from '../../CreateCourses/CourseSections/UploadFiles';
import { createCourse } from './createCourse';
import { set } from 'date-fns';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

export const CustomizeCourse = ({ setCustomizeCourse, seletedCourse, fileList, setFileList, setExpandCreateCourseStudent }) => {
    const [loading, setLoading] = useState(false)
    const [seletedCourseTemp, setSeletedCourseTemp] = useState(seletedCourse)

    const handleDateChange = (date) => {
        setSeletedCourseTemp({ ...seletedCourseTemp, startDate: date[0], endDate: date[1] })
    }

    useEffect(() => {
        setSeletedCourseTemp({ ...seletedCourseTemp, cover: fileList[0] })
    }, [fileList])

    async function handleCreateCourse() {
        setLoading(true)
        if (!checkErrors()) {
            await createCourse(seletedCourseTemp)
            setLoading(false)
            setCustomizeCourse(false)
            setExpandCreateCourseStudent(false)
        }
    }

    function checkErrors() {
        try {
            if (!seletedCourseTemp.title) {
                throw new Error('Title is required');
            }
            if (!seletedCourseTemp.startDate) {
                throw new Error('Start date is required');
            }
            if (!seletedCourseTemp.endDate) {
                throw new Error('End date is required');
            }

            const startDate = new Date(seletedCourseTemp.startDate);
            const endDate = new Date(seletedCourseTemp.endDate);
            const diffDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

            if (diffDays < 30) {
                throw new Error('Course duration must be at least 30 days');
            }
        } catch (error) {
            message.error(error.message);
            setLoading(false);
            return true;
        }
    }


    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.2 }}
            className=''
        >
            <Button onClick={() => setCustomizeCourse(false)} className='flex items-center gap-2'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M14 8a.75.75 0 0 1-.75.75H4.56l1.22 1.22a.75.75 0 1 1-1.06 1.06l-2.5-2.5a.75.75 0 0 1 0-1.06l2.5-2.5a.75.75 0 0 1 1.06 1.06L4.56 7.25h8.69A.75.75 0 0 1 14 8Z" clipRule="evenodd" />
                </svg>
                Go back
            </Button>
            <p className='mt-5'>Enter some basic information about the course you are going to do.</p>

            <section className='ml-5'>
                <p className='mt-3 mb-2 text-gray-500'>Title *</p>
                <TextArea
                    showCount
                    rows={1}
                    maxLength={100}
                    onChange={(e) => setSeletedCourseTemp({ ...seletedCourseTemp, title: e.target.value })}
                    value={seletedCourseTemp.title}
                    style={{ resize: 'none' }}
                />
                <p className='mt-3 mb-2 text-gray-500'>Select when do you plan to start and end the course *</p>
                <RangePicker className='w-full' onChange={(e) => handleDateChange(e)} />

                <p className='mt-3 mb-2 text-gray-500'>If you need it, add a custom cover (optional)</p>
                <UploadFiles fileList={fileList} setFileList={setFileList} listType={'picture'} maxCount={1} />

                <Button onClick={() => handleCreateCourse()} className='flex mt-5 ml-auto'>
                    Create course
                </Button>
            </section>
        </motion.div>
    )
}
