import React, { useEffect, useState } from 'react'
import { API } from '../../../../../../constant'
import { getToken } from '../../../../../../helpers'
import { useParams } from 'react-router-dom'
import { Empty, Button, Avatar } from 'antd'
import { CardSelfAssesmentStudent } from './CardSelfAssesmentStudent'
import { FinalResultsAutoAssesment } from './FinalResultsAutoAssesment'
import { useTranslation } from "react-i18next";

export const ProfessorAutoAssesment = () => {
    const [allData, setAllData] = useState()
    const [userSelected, setUserSelected] = useState()
    const [searchUser, setSearchUser] = useState('')
    const { t } = useTranslation()
    let { activityId } = useParams()

    const fetchSelfAssesmentData = async () => {
        try {
            const response = await fetch(`${API}/self-assesment-answers?populate=user.profile_photo,user.qualifications,Activity&filters[activity][id][$eq]=${activityId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
            })
            const data = await response.json()
            setAllData(data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchSelfAssesmentData()
    }, [])


    return (
        <>
            {
                userSelected ? (
                    <>
                        <div className='flex items-center justify-between gap-3'>
                            <div className='flex items-center gap-3 p-3 bg-white border rounded-md hover:bg-gray-50'>
                                <Avatar shape="square" size="default" src={userSelected[0].attributes.user.data.attributes.profile_photo.data.attributes.url} />
                                <p className='text-sm'>{userSelected[0].attributes.user.data.attributes.name}</p>
                            </div>
                            <Button className='flex items-center gap-2 bg-white' onClick={() => setUserSelected(null)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z" clipRule="evenodd" />
                                </svg>
                                {t("SELFASSESTMENT.select_another_student")}
                            </Button>
                        </div>

                        <FinalResultsAutoAssesment selfAssesmentData={userSelected} />
                    </>
                ) :
                    <>
                        <div className="bg-white rounded-md shadow-md border-t-[14px] border-[#6366f1] mb-5">
                            <div className="flex flex-col w-full my-7 mx-7">
                                <div className='flex items-center w-full '>
                                    <div className='flex items-center w-full gap-3'>
                                        <p className="text-3xl font-semibold text-black">{t("SELFASSESTMENT.self_assessment")}</p>
                                    </div>
                                </div>
                                <div className='flex justify-between my-7'>
                                    <p>{t("SELFASSESTMENT.self_assessment_text_prof")}</p>
                                </div>
                            </div>
                        </div>
                        <div className='p-5 bg-white rounded-md shadow-md'>
                            <div className='space-y-3'>
                                <div class="border rounded-md bg-white p-4">
                                    <label for="table-search" class="sr-only">Search</label>
                                    <div class="relative mt-1">
                                        <div class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                            <svg class="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                            </svg>
                                        </div>
                                        <input type="text" value={searchUser}
                                            onChange={(e) => setSearchUser(e.target.value)} id="table-search"
                                            className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder={t("COMMON.search_students")} />
                                    </div>
                                </div>
                                {
                                    allData?.length === 0 ?
                                        (
                                            <div class="shadow-md rounded-md bg-white p-4">
                                                <Empty description='No students found' />
                                            </div>
                                        )
                                        :
                                        (
                                            allData?.length > 0 && allData
                                                .filter(response => {
                                                    if (searchUser.trim() === '') return true;
                                                    return response.attributes.user.data.attributes.name.toLowerCase().includes(searchUser.toLowerCase());
                                                })
                                                .map((response, index) => (
                                                    <CardSelfAssesmentStudent key={index} user={response} setUserSelected={setUserSelected} />
                                                ))
                                        )
                                }
                            </div>
                        </div>
                    </>
            }

        </>
    )
}
