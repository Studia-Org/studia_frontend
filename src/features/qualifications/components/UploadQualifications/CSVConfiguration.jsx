import React from 'react'
import { Select, Input } from 'antd';

export const CSVConfiguration = ({ activities }) => {
    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const activityOptions = activities.map((activity) => ({
        value: activity.id,
        label: activity.attributes.title,
    }));


    return (
        <>
            <p className='text-sm mt-4 text-gray-600 mb-3'>First of all, select the activity to upload the grades:</p>
            <Select
                showSearch
                placeholder="Select an activity"
                optionFilterProp="children"
                filterOption={filterOption}
                options={activityOptions}
            />
            <p className='text-sm mt-4 text-gray-600 mb-3'>Now, introduce the relation in the columns and rows on your CSV spreadsheet:</p>
            <div className='flex space-x-3'>
                <Input placeholder='Student column and row, ex: B2-B22' className='px-1 py-3 border border-[#d9d9d9] rounded-md text-sm pl-3' />
                <Input placeholder='Qualification column and row, ex: D2-D22' className='px-1 py-3 border border-[#d9d9d9] rounded-md text-sm pl-3' />
                <Input placeholder='Comments column and row, ex: F2-F22' className='px-1 py-3 border border-[#d9d9d9] rounded-md text-sm pl-3' />
            </div>
            <p className='text-sm mt-4 text-gray-600 mb-3'>For the example below, we would select; B2-B22 (in the student case), D2-D22 (Qualification case), F2-F22 (Comment case): </p>
            <img src="https://res.cloudinary.com/dnmlszkih/image/upload/v1704732079/k18dfux3qnblwnk98zft.png" className='w-1/2' alt="" />
        </>
    );
}
