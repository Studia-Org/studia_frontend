import React from 'react'
import { Table, Avatar } from 'antd';
const { Column, ColumnGroup } = Table;



export const Visualization = ({ formValues, data }) => {
    return (
        <>
            <p className='text-sm text-gray-500 mt-2'>Visualize the qualifications before uploading to your course. </p>
            <Table dataSource={data} className='mt-5'>
                <ColumnGroup title={JSON.parse(formValues.selectedActivity).title} >
                    <Column
                        title="Name"
                        dataIndex="Name"
                        key="Name"
                        render={(text, record) => (
                            <div className='flex items-center gap-2'>
                                <Avatar src={record.Name.student.attributes.profile_photo.data.attributes.url} />
                                <div className='flex flex-col'>
                                    <p className='font-medium'>{record.Name.student.attributes.name}</p>
                                    <p className='text-gray-500'>{record.Name.student.attributes.email}</p>
                                </div>
                            </div>
                        )}
                    />
                    <Column title="Qualification" dataIndex="Qualification" key="Qualification" />
                    <Column title="Comments" dataIndex="Comments" key="Comments" />
                </ColumnGroup>
            </Table>
            <p className='text-xs text-gray-500 mt-2'>Students who aren't enrolled in the course won't show up here.</p>
        </>
    )
}
