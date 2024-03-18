import React, { useState } from 'react'
import { Modal } from 'antd'
import { CardCreateCourse } from './CardCreateCourse'
import { coursesData } from './coursesData'
import { CustomizeCourse } from './CustomizeCourse'

export const ModalCreateCourseStudent = ({ expandCreateCourseStudent, setExpandCreateCourseStudent }) => {
    const [customizeCourse, setCustomizeCourse] = useState(false)
    const [seletedCourse, setSeletedCourse] = useState({})
    const [fileList, setFileList] = useState([])

    function handleCancel() {
        setExpandCreateCourseStudent(false)
        setCustomizeCourse(false)

    }

    return (
        <Modal footer={null} title="Add a course" open={expandCreateCourseStudent} width={1200} onCancel={() => handleCancel()}>
            {
                customizeCourse ?
                    <CustomizeCourse setCustomizeCourse={setCustomizeCourse} seletedCourse={seletedCourse} fileList={fileList}
                        setFileList={setFileList} setExpandCreateCourseStudent={setExpandCreateCourseStudent} />
                    :
                    <>
                        <p className='text-gray-600 mb-7'>Add a course based on your preferences and customize it. </p>
                        <div className='flex flex-wrap mb-10 ml-5 space-y-5'>
                            {
                                coursesData.map((courseData, index) =>
                                    <CardCreateCourse key={index} courseData={courseData} setCustomizeCourse={setCustomizeCourse} setSeletedCourse={setSeletedCourse} />
                                )
                            }
                        </div>
                    </>
            }
        </Modal>
    )
}
