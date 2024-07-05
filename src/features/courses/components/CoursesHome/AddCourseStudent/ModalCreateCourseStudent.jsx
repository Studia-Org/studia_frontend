import React, { useState } from 'react'
import { Modal } from 'antd'
import { CardCreateCourse } from './CardCreateCourse'
import useCoursesData from './coursesData'
import { CustomizeCourse } from './CustomizeCourse'
import LoadingBar from 'react-top-loading-bar'
import { useTranslation } from 'react-i18next'

export const ModalCreateCourseStudent = ({ expandCreateCourseStudent, setExpandCreateCourseStudent, setCourses }) => {
    const [customizeCourse, setCustomizeCourse] = useState(false)
    const [seletedCourse, setSeletedCourse] = useState({})
    const [progress, setProgress] = useState(0)
    const [fileList, setFileList] = useState([])
    const coursesData = useCoursesData()
    const { t } = useTranslation()

    function handleCancel() {
        setExpandCreateCourseStudent(false)
        setCustomizeCourse(false)
    }

    return (
        <Modal footer={null} title={t("COURSESHOME.student_creation_courses.add_course")} open={expandCreateCourseStudent} width={1200} onCancel={() => handleCancel()}>
            {
                customizeCourse ?
                    <CustomizeCourse setCustomizeCourse={setCustomizeCourse} seletedCourse={seletedCourse} fileList={fileList}
                        setFileList={setFileList} setExpandCreateCourseStudent={setExpandCreateCourseStudent} setCourses={setCourses} setProgress={setProgress} />
                    :
                    <>
                        <p className='text-gray-600 mb-7'>{t("COURSESHOME.student_creation_courses.add_course_text")}</p>
                        <div className='flex flex-wrap mb-10 ml-5 space-y-5'>
                            {
                                coursesData.map((courseData, index) =>
                                    <CardCreateCourse key={index} courseData={courseData} setCustomizeCourse={setCustomizeCourse} setSeletedCourse={setSeletedCourse} />
                                )
                            }
                        </div>
                    </>
            }
            <LoadingBar color='#6366f1' height={4} progress={progress} onLoaderFinished={() => setProgress(0)} shadow={true} />
        </Modal>
    )
}
