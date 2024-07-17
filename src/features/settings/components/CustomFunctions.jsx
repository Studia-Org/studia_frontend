import React, { useState } from 'react'
import { Button, InputNumber, Popconfirm } from 'antd'
import { replicateCourse } from '../../courses/components/CoursesHome/helpers/replicateCourse'
import { useTranslation } from 'react-i18next'

export const CustomFunctions = () => {
    const [courseId, setCourseId] = useState('')
    const { t } = useTranslation()
    return (
        <div className='mt-10'>
            <div className='p-5 space-y-3 bg-white border rounded-md'>
                <h2>{t("SETTINGS.CUSTOM_FUNCTIONS.DUPLICATE_COURSE.title")}</h2>
                <p className='text-sm font-normal'>{t("SETTINGS.CUSTOM_FUNCTIONS.DUPLICATE_COURSE.duplicate_course_text")}</p>
                <InputNumber
                    className='w-full'
                    placeholder={t("SETTINGS.CUSTOM_FUNCTIONS.DUPLICATE_COURSE.placeholder")}
                    value={courseId}
                    onChange={value => setCourseId(value)}
                />

                <Popconfirm
                    title={t("SETTINGS.CUSTOM_FUNCTIONS.DUPLICATE_COURSE.pop_confirm.title")}
                    description={t("SETTINGS.CUSTOM_FUNCTIONS.DUPLICATE_COURSE.pop_confirm.description")}
                    placement='topLeft'
                    onConfirm={() => replicateCourse(courseId)}
                    okText={t("SETTINGS.CUSTOM_FUNCTIONS.DUPLICATE_COURSE.pop_confirm.confirm")}
                    cancelText={t("SETTINGS.CUSTOM_FUNCTIONS.DUPLICATE_COURSE.pop_confirm.cancel")}
                >
                    <Button className='flex ml-auto' >
                        {t("SETTINGS.CUSTOM_FUNCTIONS.DUPLICATE_COURSE.duplicate")}
                    </Button>
                </Popconfirm>
            </div>
        </div >
    )
}
