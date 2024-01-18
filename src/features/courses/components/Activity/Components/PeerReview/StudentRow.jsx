import React, { useState } from 'react'
import { Button } from "antd"
import { ModalRubrica } from './ModalRubrica'
import { ModalFilesPR } from './ModalFilesPR'

export const StudentRow = ({ student, activityToReviewID, activityTitle, peerReviewAnswers }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRubricModalOpen, setIsRubricModalOpen] = useState(false);
    const [rubricData, setRubricData] = useState({})
    const studentQualifications = student.attributes.qualifications.data.filter((qualification) => qualification.attributes.activity.data.id === activityToReviewID)
    const studentQualificationsGiven = peerReviewAnswers.filter((answer) => answer.attributes.user?.data.id === student.id)
    const studentQualificationsReceived = peerReviewAnswers.filter((answer) => answer.attributes.qualification?.data.attributes.user.data.id === student.id)
    const studentFiles = studentQualifications[0]?.attributes.file.data

    console.log(activityToReviewID)

    function handleRubricModalOpen(qualification) {
        setRubricData(qualification)
        setIsRubricModalOpen(true)
    }

    function renderAllGivenQualifications(givenQualification) {
        return (
            <>
                <Button onClick={() => handleRubricModalOpen(givenQualification)} className='h-full flex items-center' >
                    <img alt='' className="w-6 h-6 rounded-full" src={givenQualification.attributes.qualification?.data?.attributes?.user?.data?.attributes.profile_photo.data.attributes.url} />
                    <div className="pl-3 text-left">
                        <p className="text-sm font-semibold">{givenQualification.attributes.qualification?.data?.attributes?.user?.data?.attributes.name}</p>
                        <p className="font-normal text-gray-500 text-xs">{givenQualification.attributes.qualification?.data?.attributes?.user?.data?.attributes.email}</p>
                    </div>
                </Button>
            </>
        )
    }

    function renderAllRecievedQualifications(recievedQualification) {
        return (
            <>
                <Button onClick={() => handleRubricModalOpen(recievedQualification)} className='h-full flex items-center' >
                    <img alt='' className="w-6 h-6 rounded-full" src={recievedQualification.attributes.user?.data?.attributes.profile_photo.data.attributes.url} />
                    <div className="pl-3 text-left">
                        <p className="text-sm font-semibold">{recievedQualification.attributes.user?.data?.attributes.name}</p>
                        <p className="font-normal text-gray-500 text-xs">{recievedQualification.attributes.user?.data?.attributes.email}</p>
                    </div>
                </Button>
            </>
        )
    }

    return (
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <ModalFilesPR files={studentFiles} activityTitle={activityTitle} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} studentName={student.attributes.name} />
            <ModalRubrica isModalOpen={isRubricModalOpen} setIsModalOpen={setIsRubricModalOpen} rubricData={rubricData} />
            <th scope="row" class="px-6 py-4 text-gray-900 whitespace-nowrap">
                <div className='flex items-center '>
                    <img alt='' class="w-10 h-10 rounded-full" src={student.attributes.profile_photo.data.attributes.url} />
                    <div class="pl-3">
                        <div class="text-base font-semibold">{student.attributes.name}</div>
                        <div class="font-normal text-gray-500">{student.attributes.email}</div>
                    </div>
                </div>

            </th>
            <td class="px-6 py-4">
                <Button onClick={() => setIsModalOpen(true)} className='bg-gray-200  rounded-md p-2 h-[2rem] w-[2rem] mx-1 flex items-center '>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
                    </svg>
                </Button>
            </td>
            <td class="px-6 py-4">
                <div class="flex flex-col space-y-3">
                    {studentQualificationsReceived.length > 0 && studentQualificationsReceived.map(renderAllRecievedQualifications)}
                </div>
            </td>
            <td class="px-6 py-4">
                <div class="flex flex-col space-y-3">
                    {studentQualificationsGiven.length > 0 && studentQualificationsGiven.map(renderAllGivenQualifications)}
                </div>
            </td>
        </tr>
    )
}
