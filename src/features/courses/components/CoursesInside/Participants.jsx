import React, { useState } from 'react'
import { List, Avatar, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../../context/AuthContext';
import { useTranslation } from 'react-i18next';

export const Participants = ({ students }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { user } = useAuthContext()
    const [searchTerm, setSearchTerm] = useState('')
    const studentsFiltered = students.data.filter((student) => {
        return student.attributes.name.toLowerCase().includes(searchTerm.toLowerCase())
    })


    return (
        <div className=''>
            <h2 className='mt-5 text-xl font-bold'>{t("COURSEINSIDE.PARTICIPANTS.participants")}</h2>
            <p className='mt-2 text-sm text-gray-600 '>{t("COURSEINSIDE.PARTICIPANTS.participants_tile")}</p>
            {
                user.role_str !== 'student' && (
                    <p className='text-sm text-gray-600 '>{t("COURSEINSIDE.PARTICIPANTS.to_add_student")}</p>
                )
            }
            <div className='p-5 mt-5 mb-10 bg-white border rounded-lg'>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        id="table-search-users"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        class="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                        placeholder={t("COURSEINSIDE.PARTICIPANTS.placeholder_search")} />
                </div>
                <List
                    className='mt-5'
                    itemLayout="horizontal"
                    dataSource={studentsFiltered}
                    renderItem={(item, index) => (
                        <List.Item className='cursor-pointer hover:bg-gray-50' onClick={() => navigate(`/app/profile/${item.id}/`)}>
                            <List.Item.Meta
                                avatar={<Avatar src={item.attributes.profile_photo.data?.attributes?.url} alt='profile_photo' size={'large'} />}
                                title={item.attributes.name}
                                className='pl-5'
                                description={item.attributes.email}
                            />
                        </List.Item>
                    )}
                />
            </div>
        </div>
    )
}
