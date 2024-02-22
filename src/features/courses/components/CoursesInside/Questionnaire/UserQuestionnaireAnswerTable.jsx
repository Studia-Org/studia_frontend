import React, { useEffect, useState } from 'react'
import { Empty } from 'antd'
import { CardQuestionnaireUser } from './CardQuestionnaireUser'

export const UserQuestionnaireAnswerTable = ({ userResponses, setQuestionnaireAnswerData }) => {
    const [searchUser, setSearchUser] = useState('')
    const [filteredUsers, setFilteredUsers] = useState(userResponses)



    useEffect(() => {
        if (searchUser === '') {
            setFilteredUsers(userResponses)
        } else {
            setFilteredUsers(userResponses.filter(user => user.attributes.user.data.attributes.name.toLowerCase().includes(searchUser.toLowerCase())))
        }
    }, [searchUser, userResponses])
    return (
        <div className='space-y-3'>
            <div class="shadow-md rounded-md bg-white p-4">
                <label for="table-search" class="sr-only">Search</label>
                <div class="relative mt-1">
                    <div class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input type="text" value={searchUser} onChange={(e) => setSearchUser(e.target.value)} id="table-search" class="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search students" />
                </div>
            </div>
            {
                filteredUsers.length === 0 ?
                    (
                        <div class="shadow-md rounded-md bg-white p-4">
                            <Empty description='No students found' />
                        </div>
                    )
                    :
                    (
                        filteredUsers.map((response, index) => (
                            <CardQuestionnaireUser key={index} user={response} setQuestionnaireAnswerData={setQuestionnaireAnswerData} />
                        ))
                    )
            }
        </div>
    )
}
