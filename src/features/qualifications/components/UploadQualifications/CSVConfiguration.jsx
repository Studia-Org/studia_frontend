import React, { useEffect, useState } from 'react'
import { Select, Input, Button } from 'antd';
import { UploadFiles } from '../../../courses/components/CreateCourses/CourseSections/UploadFiles';
import { createCSVTemplate } from './helpers';
import { useTranslation } from 'react-i18next';
export const CSVConfiguration = ({ students, activities, formValues, setFormValues, file, setFile }) => {
    const { t } = useTranslation();
    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    useEffect(() => {
        if (file.length > 0) {
            setFormValues({
                ...formValues,
                file: file[0].originFileObj,
            })
        }
    }, [file])

    const activityOptions = activities
        .filter(activity => activity.attributes.evaluable === true)
        .map(activity => ({
            value: JSON.stringify({
                id: activity.id,
                title: activity.attributes.title,
                groupActivity: activity.attributes.groupActivity,
                isPeerReview: activity.attributes.BeingReviewedBy.data !== null
            }),
            label: activity.attributes.title,
        }));


    const handleInputChange = (e) => {
        let { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value.toUpperCase(),
        });
    };

    const handleActivityChange = (value) => {
        setFormValues({
            ...formValues,
            selectedActivity: value,
        });
    }
    return (
        <>
            <p className='mt-4 mb-3 text-sm text-gray-600'>{t("QUALIFICATIONS.first_text_upload")}:</p>
            <div className='flex gap-x-3'>
                <Select
                    showSearch
                    className='w-full'
                    placeholder={t("QUALIFICATIONS.select_activity")}
                    optionFilterProp="children"
                    filterOption={filterOption}
                    options={activityOptions}
                    value={formValues.selectedActivity}
                    onChange={handleActivityChange}
                />
                <Button onClick={() => createCSVTemplate(formValues.selectedActivity, students, activities)}>
                    {t("QUALIFICATIONS.download_template_csv")}
                </Button>
            </div>
            {
                formValues.selectedActivity !== null ?
                    <>
                        <p className='mt-4 mb-3 text-sm text-gray-600'>{t("QUALIFICATIONS.now_introduce_columns")}:</p>
                        <div className='flex space-x-3'>
                            <Input
                                placeholder={t("QUALIFICATIONS.placeholder_columns_student")}
                                name='studentInputColumn'
                                className='px-1 py-3 border border-[#d9d9d9] rounded-md text-sm pl-3'
                                value={formValues.studentInputColumn}
                                onChange={handleInputChange}
                            />
                            <Input
                                placeholder={t("QUALIFICATIONS.placeholder_columns_grade")}
                                name='qualificationInputColumn'
                                className='px-1 py-3 border border-[#d9d9d9] rounded-md text-sm pl-3'
                                value={formValues.qualificationInputColumn}
                                onChange={handleInputChange}
                            />
                            <Input
                                placeholder={t("QUALIFICATIONS.placeholder_columns_comments")}
                                name='commentsInputColumn'
                                className='px-1 py-3 border border-[#d9d9d9] rounded-md text-sm pl-3'
                                value={formValues.commentsInputColumn}
                                onChange={handleInputChange}
                            />
                            {
                                JSON.parse(formValues.selectedActivity)?.isPeerReview ?
                                    <Input
                                        placeholder={t("QUALIFICATIONS.placeholder_columns_peer")}
                                        name='gradeAverageInputColumn'
                                        className='px-1 py-3 border border-[#d9d9d9] rounded-md text-sm pl-3'
                                        value={formValues.gradeAverageInputColumn}
                                        onChange={handleInputChange}
                                    />
                                    : null
                            }

                        </div>
                        {JSON.parse(formValues.selectedActivity)?.groupActivity ?
                            JSON.parse(formValues.selectedActivity)?.isPeerReview ?
                                <>
                                    <p className='mt-4 mb-1 text-sm text-gray-600'>{t("QUALIFICATIONS.peerReviewGroup.instruction")} </p>
                                    <p className='mb-3 text-xs text-red-500'>{t("QUALIFICATIONS.peerReviewGroup.note")}</p>
                                    <img src="https://res.cloudinary.com/dnmlszkih/image/upload/v1711553756/bcmnydszoqeugcwwg1yy.png" className='w-1/2 rounded-md' style={{ border: '1px solid #d9d9d9' }} alt="" />
                                </>
                                :

                                <>
                                    <p className='mt-4 mb-3 text-sm text-gray-600'>{t("QUALIFICATIONS.group.instruction")} </p>
                                    <img src="https://res.cloudinary.com/dnmlszkih/image/upload/v1708682854/csvgroups_16a6d46027.png" className='w-1/2 rounded-md' style={{ border: '1px solid #d9d9d9' }} alt="" />
                                </>
                            :
                            JSON.parse(formValues.selectedActivity)?.isPeerReview ?
                                <>
                                    <p className='mt-4 mb-1 text-sm text-gray-600'>{t("QUALIFICATIONS.peerReview.instruction")} </p>
                                    <p className='mb-3 text-xs text-red-500'>{t("QUALIFICATIONS.peerReviewGroup.note")}</p>
                                    <img src="https://res.cloudinary.com/dnmlszkih/image/upload/v1711553570/bymzghugjetjcsksxxvm.png" className='w-1/2 rounded-md' style={{ border: '1px solid #d9d9d9' }} alt="" />
                                </>
                                :
                                <>
                                    <p className='mt-4 mb-3 text-sm text-gray-600'>{t("QUALIFICATIONS.standard.instruction")} </p>
                                    <img src="https://res.cloudinary.com/dnmlszkih/image/upload/v1704732079/k18dfux3qnblwnk98zft.png" className='w-1/2 rounded-md' style={{ border: '1px solid #d9d9d9' }} alt="" />

                                </>
                        }
                        <p className='mt-4 mb-3 text-sm text-gray-600'>{t("QUALIFICATIONS.finally_csv")}</p>
                        <UploadFiles fileList={file} setFileList={setFile} listType={'picture'} maxCount={1} />
                    </>
                    : null

            }
        </>
    );
}
