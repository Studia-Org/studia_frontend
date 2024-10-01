import { Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom';


export const ProfessorThinkAloud = ({ activityData }) => {
    const { t } = useTranslation()
    const [searchTerm, setSearchTerm] = useState("")
    const [userWithAudio, setUserWithAudio] = useState(
        activityData.activity.data.attributes.qualifications.data
            .map((qualification) => ({
                key: qualification.id,
                user: qualification.attributes.user.data,
                audio: qualification.attributes.file.data[0]
            }))
    );



    useEffect(() => {
        const filteredUsers = activityData.activity.data.attributes.qualifications.data.filter((qualification) => {
            return qualification.attributes.user.data.attributes.name.toLowerCase().includes(searchTerm.toLowerCase())
        })
        setUserWithAudio(
            filteredUsers.map((qualification) => ({
                key: qualification.id,
                user: qualification.attributes.user.data,
                audio: qualification.attributes.file.data[0]
            }))
        )
    }, [searchTerm])

    const columns = [
        {
            title: t("COMMON.student"),
            dataIndex: 'user',
            key: 'user',
            render: (user) => <div className='flex items-center gap-2'>
                <img src={user.attributes?.profile_photo?.data?.attributes?.url} className='object-cover w-8 h-8 rounded-full ' alt="" />
                <Link to={`/app/profile/${user.id}`}>
                    <p className='text-sm text-gray-700'>{user.attributes.name}</p>
                    <p className='text-sm text-gray-500'>{user.attributes.email}</p>

                </Link>
            </div>,
        },
        {
            title: '',
            dataIndex: 'audio',
            key: 'audio',
            render: (audio) => <audio className='flex w-full px-8' controls src={audio.attributes.url} />
        }
    ];

    return (
        <div className='p-5 bg-white border rounded-md'>
            <div class="relative pb-8">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none bottom-8">
                    <svg class="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </div>
                <input
                    type="text"
                    id="table-search-users"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    class="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                    placeholder={t("QUALIFICATIONS.search_users")}
                />
            </div>
            <Table columns={columns} dataSource={userWithAudio} pagination={true} bordered />
        </div>
    )
}
