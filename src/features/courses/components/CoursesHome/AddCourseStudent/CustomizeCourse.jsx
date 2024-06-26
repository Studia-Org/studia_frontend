import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button, DatePicker, Input, message } from 'antd'
import { UploadFiles } from '../../CreateCourses/CourseSections/UploadFiles';
import { createCourse } from './createCourse';
import { TFGExtendedCourseData } from './coursesData';
import { useAuthContext } from '../../../../../context/AuthContext';
import dayjs from 'dayjs';
import { API } from '../../../../../constant';


const { RangePicker } = DatePicker;
const { TextArea } = Input;



export const CustomizeCourse = ({ setCustomizeCourse, seletedCourse, fileList, setFileList, setExpandCreateCourseStudent, setCourses, setProgress }) => {
    const [loading, setLoading] = useState(false)
    const [seletedCourseTemp, setSeletedCourseTemp] = useState(seletedCourse)
    const { user } = useAuthContext()

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < dayjs().endOf('day');
    };

    const handleDateChange = (date) => {
        setSeletedCourseTemp({ ...seletedCourseTemp, startDate: date[0], endDate: date[1] })
    }

    useEffect(() => {
        setSeletedCourseTemp({ ...seletedCourseTemp, cover: fileList[0] })
    }, [fileList])

    const filterCoursesByRole = (data, user) => {
        if (user.role_str === 'professor' || user.role_str === 'admin') {
            return data.data.filter(course => course.attributes.professor.data.id === user.id);
        } else if (user.role_str === 'student') {
            return data.courses;
        }
    };

    const mapCourseData = course => ({
        id: course.id,
        createdAt: course.createdAt || course.attributes.createdAt,
        title: course.title || course.attributes.title,
        cover: course.cover ? course.cover.url : course.attributes.cover.data?.attributes.url,
        professor_name: course.professor ? course.professor.name : course.attributes.professor.data.attributes.name,
        tags: course?.tags || course.attributes?.tags,
        professor_profile_photo: course.professor ? course.professor?.profile_photo?.url : course.attributes.professor?.data?.attributes?.profile_photo?.data?.attributes?.url,
        students: course.students || course.attributes.students.data,
        studentManaged: course?.studentManaged || course.attributes?.studentManaged,
    });

    async function handleCreateCourse() {
        setLoading(true)
        if (!checkErrors()) {
            switch (seletedCourseTemp.type) {
                case 'TFG':
                    await createCourse(seletedCourseTemp, user.id, TFGExtendedCourseData, setProgress)
                    break;
                default:
                    break;
            }
            //cargar cursos de nuevo
            const response = await fetch(`${API}/users/${user?.id}?populate=courses.cover,courses.students.profile_photo,courses.professor,courses.professor.profile_photo,courses.course_tags`)
            const data = await response.json();
            const coursesFiltered = filterCoursesByRole(data, user);
            const finalCourses = coursesFiltered.map(mapCourseData);
            const sortedCourses = finalCourses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setCourses(sortedCourses ?? []);

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
                <RangePicker disabledDate={disabledDate} className='w-full' onChange={(e) => handleDateChange(e)} />

                <p className='mt-3 mb-2 text-gray-500'>If you need it, add a custom cover (optional)</p>
                <UploadFiles fileList={fileList} setFileList={setFileList} listType={'picture'} maxCount={1} />

                <Button loading={loading} onClick={() => handleCreateCourse()} className='flex mt-5 ml-auto'>
                    Create course
                </Button>
            </section>
        </motion.div>
    )
}
