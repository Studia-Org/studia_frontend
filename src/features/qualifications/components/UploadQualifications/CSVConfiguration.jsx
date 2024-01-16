import React, { useEffect, useState } from 'react'
import { Select, Input } from 'antd';
import { UploadFiles } from '../../../courses/components/CreateCourses/CourseSections/UploadFiles';

export const CSVConfiguration = ({ activities, formValues, setFormValues, file, setFile }) => {
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

    const activityOptions = activities.map((activity) => ({
        value: JSON.stringify({ id: activity.id, title: activity.attributes.title }),
        label: activity.attributes.title,
    }));

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
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
            <p className='text-sm mt-4 text-gray-600 mb-3'>First of all, select the activity to upload the grades:</p>
            <Select
                showSearch
                placeholder="Select an activity"
                optionFilterProp="children"
                filterOption={filterOption}
                options={activityOptions}
                value={formValues.selectedActivity}
                onChange={handleActivityChange}
            />
            <p className='text-sm mt-4 text-gray-600 mb-3'>Now, introduce the relation in the columns and rows on your CSV spreadsheet:</p>
            <div className='flex space-x-3'>
                <Input
                    placeholder='Student column and row, ex: B2-B22'
                    name='studentInputColumn'
                    className='px-1 py-3 border border-[#d9d9d9] rounded-md text-sm pl-3'
                    value={formValues.studentInputColumn}
                    onChange={handleInputChange}
                />
                <Input
                    placeholder='Qualification column and row, ex: D2-D22'
                    name='qualificationInputColumn'
                    className='px-1 py-3 border border-[#d9d9d9] rounded-md text-sm pl-3'
                    value={formValues.qualificationInputColumn}
                    onChange={handleInputChange}
                />
                <Input
                    placeholder='Comments column and row, ex: F2-F22'
                    name='commentsInputColumn'
                    className='px-1 py-3 border border-[#d9d9d9] rounded-md text-sm pl-3'
                    value={formValues.commentsInputColumn}
                    onChange={handleInputChange}
                />
            </div>
            <p className='text-sm mt-4 text-gray-600 mb-3'>For the example below, we would select; B2-B22 (in the student case), D2-D22 (Qualification case), F2-F22 (Comment case): </p>
            <img src="https://res.cloudinary.com/dnmlszkih/image/upload/v1704732079/k18dfux3qnblwnk98zft.png" className='w-1/2 rounded-md' style={{ border: '1px solid #d9d9d9' }} alt="" />
            <p className='text-sm mt-4 text-gray-600 mb-3'>Finally, upload the CSV spreadsheet file (comma or semi-colon separated).</p>
            <UploadFiles fileList={file} setFileList={setFile} listType={'picture'} maxCount={1} />
        </>
    );
}
