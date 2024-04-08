import React from 'react'
import { Table, Avatar } from 'antd';
import { is } from 'date-fns/locale';
const { Column, ColumnGroup } = Table;

export const Visualization = ({ formValues, data }) => {
    if (JSON.parse(formValues.selectedActivity).groupActivity) {
        return (
            <>
                <p className='mt-2 text-sm text-gray-500'>Visualize the qualifications before uploading to your course. </p>
                <Table dataSource={data} className='mt-5'>
                    <ColumnGroup title={JSON.parse(formValues.selectedActivity).title} >
                        <Column
                            title="Group"
                            dataIndex="Group"
                            key="Group"
                            render={(text, record) => {
                                return (
                                    <section className='flex flex-col gap-y-2 '>
                                        {record.group.students.map(({ student }) => {
                                            return (
                                                <div className="flex " key={student.id}>
                                                    <img alt='' className="w-10 h-10 rounded-full" src={student?.attributes.profile_photo?.data?.attributes?.url} />
                                                    <div className="pl-3">
                                                        <div className="text-base font-semibold">{student.attributes.name}</div>
                                                        <div className="font-normal text-gray-500">{student.attributes.email}</div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </section>
                                )
                            }}
                        />
                        <Column
                            title={JSON.parse(formValues.selectedActivity).isPeerReview ? 'Professor Qualification' : 'Qualification'}
                            dataIndex="Qualification"
                            key="Qualification"
                            render={(text, record) => (record.group.Qualification)}
                        />
                        <Column
                            title="Comments"
                            dataIndex="Comments"
                            key="Comments"
                            render={(text, record) => (record.group.Comments)}
                        />
                        {
                            JSON.parse(formValues.selectedActivity).isPeerReview &&
                            <Column
                                title="Peer Review Grade"
                                dataIndex="averageGradePeerReview"
                                key="averageGradePeerReview"
                                render={(text, record) => (record.group.averageGradePeerReview)}
                            />
                        }

                    </ColumnGroup>
                </Table>
                <p className='mt-2 text-xs text-gray-500'>Students who aren't enrolled in the course won't show up here.</p>
            </>
        )
    }

    return (
        <>
            <p className='mt-2 text-sm text-gray-500'>Visualize the qualifications before uploading to your course. </p>
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
                    <Column
                        title={JSON.parse(formValues.selectedActivity).isPeerReview ? 'Professor Qualification' : 'Qualification'}
                        dataIndex="Qualification"
                        key="Qualification"
                        render={(text, record) => (record.Qualification)}
                    />
                    <Column title="Comments" dataIndex="Comments" key="Comments" />
                    {
                        JSON.parse(formValues.selectedActivity).isPeerReview &&
                        <Column
                            title="Peer Review Grade"
                            dataIndex="averageGradePeerReview"
                            key="averageGradePeerReview"
                            render={(text, record) => (record.averageGradePeerReview)}
                        />
                    }
                </ColumnGroup>
            </Table>
            <p className='mt-2 text-xs text-gray-500'>Students who aren't enrolled in the course won't show up here.</p>
        </>
    )
}
