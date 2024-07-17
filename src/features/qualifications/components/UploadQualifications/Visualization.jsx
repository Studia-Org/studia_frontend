import React from 'react'
import { Table, Avatar } from 'antd';
import { is } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
const { Column, ColumnGroup } = Table;
export const Visualization = ({ formValues, data }) => {
    const { t } = useTranslation();
    if (JSON.parse(formValues.selectedActivity).groupActivity) {
        return (
            <>
                <p className='mt-2 text-sm text-gray-500'>{t("QUALIFICATIONS.visualization_text")} </p>
                <Table dataSource={data} className='mt-5'>
                    <ColumnGroup title={JSON.parse(formValues.selectedActivity).title} >
                        <Column
                            title={t("QUALIFICATIONS.groups")}
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
                            title={JSON.parse(formValues.selectedActivity).isPeerReview ? t("QUALIFICATIONS.professor_qualification") : t("QUALIFICATIONS.qualification")}
                            dataIndex="Qualification"
                            key="Qualification"
                            render={(text, record) => (record.group.Qualification)}
                        />
                        <Column
                            title={t("ACTIVITY.comments")}
                            dataIndex="Comments"
                            key="Comments"
                            render={(text, record) => (record.group.Comments)}
                        />
                        {
                            JSON.parse(formValues.selectedActivity).isPeerReview &&
                            <Column
                                title={t("QUALIFICATIONS.average_grade")}
                                dataIndex="averageGradePeerReview"
                                key="averageGradePeerReview"
                                render={(text, record) => (record.group.averageGradePeerReview)}
                            />
                        }

                    </ColumnGroup>
                </Table>
                <p className='mt-2 text-xs text-gray-500'>{t("QUALIFICATIONS.students_no_enrolled")}</p>
            </>
        )
    }

    return (
        <>
            <p className='mt-2 text-sm text-gray-500'>{t("QUALIFICATIONS.visualization_text")} </p>
            <Table dataSource={data} className='mt-5'>
                <ColumnGroup title={JSON.parse(formValues.selectedActivity).title} >
                    <Column
                        title={t("QUALIFICATIONS.name")}
                        dataIndex="Name"
                        key="Name"
                        render={(text, record) => (
                            <div className='flex items-center gap-2'>
                                <Avatar src={record.Name.student.attributes.profile_photo?.data?.attributes?.url} />
                                <div className='flex flex-col'>
                                    <p className='font-medium'>{record.Name.student.attributes.name}</p>
                                    <p className='text-gray-500'>{record.Name.student.attributes.email}</p>
                                </div>
                            </div>
                        )}
                    />
                    <Column
                        title={JSON.parse(formValues.selectedActivity).isPeerReview ? t("QUALIFICATIONS.professor_qualification") : t("QUALIFICATIONS.qualification")}
                        dataIndex="Qualification"
                        key="Qualification"
                        render={(text, record) => (record.Qualification)}
                    />
                    <Column title={t("ACTIVITY.comments")} dataIndex="Comments" key="Comments" />
                    {
                        JSON.parse(formValues.selectedActivity).isPeerReview &&
                        <Column
                            title={t("QUALIFICATIONS.average_grade")}
                            dataIndex="averageGradePeerReview"
                            key="averageGradePeerReview"
                            render={(text, record) => (record.averageGradePeerReview)}
                        />
                    }
                </ColumnGroup>
            </Table>
            <p className='mt-2 text-xs text-gray-500'>{t("QUALIFICATIONS.students_no_enrolled")}</p>
        </>
    )
}
