import { Table } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const ProfessorThinkAloud = ({ activityData }) => {
    console.log(activityData)
    const { t } = useTranslation()

    const userWithAudio = activityData.activity.data.attributes.qualifications.data.map((qualification) => {
        console.log(qualification.attributes)
        return {
            key: qualification.id,
            name: qualification.attributes.user.data.attributes.name,
            audio: qualification.attributes.file.data[0]
        }
    })

    console.log(userWithAudio)
    const columns = [
        {
            title: t("COMMON.student"),
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: '',
            dataIndex: 'audio',
            key: 'audio',
        }
    ];
    const data = [
        {
            key: '1',
            name: 'John Brown',
            audio: 32,

        }
    ];
    return (
        <div className='p-5 bg-white border rounded-md'>
            <Table columns={columns} dataSource={data} pagination={false} bordered />
        </div>
    )
}
