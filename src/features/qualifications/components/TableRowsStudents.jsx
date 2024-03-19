import React, { useState, useEffect } from 'react'
import { Button, Input, InputNumber, Badge } from "antd"
import { useNavigate, useParams } from "react-router-dom"
import { format } from 'date-fns';
import { ModalFiles } from './ModalFiles';


const { TextArea } = Input;



export const TableRowsStudents = ({ student, activity, isEditChecked, setThereIsChanges, editedGrades, setEditedGrades, activities }) => {
    const navigate = useNavigate();
    const grade = student.attributes.qualifications.data.find(qualification => qualification.attributes.activity.data?.id === JSON.parse(activity).id)
    const [files, setFiles] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [qualification, setQualification] = useState(grade?.attributes?.qualification ? grade.attributes.qualification : null);
    const [comments, setComments] = useState(grade?.attributes?.comments ? grade.attributes.comments : null);
    const filteredActivity = activities?.filter(activityTemp => activityTemp.id === JSON.parse(activity).id)

    const { courseID } = useParams();


    useEffect(() => {
        setQualification(grade?.attributes?.qualification)
        setComments(grade?.attributes?.comments)
    }, [activity])

    const handleQualificationChange = (value) => {
        setQualification(value);
        setThereIsChanges(value !== grade?.attributes?.qualification || comments !== grade?.attributes?.comments);
        setEditedGrades({
            ...editedGrades,
            [student.id]: {
                qualification: value,
                comments: comments,
            },
        });
    };

    const handleCommentsChange = (value) => {
        setComments(value);
        setThereIsChanges(qualification !== grade?.attributes?.qualification || value !== grade?.attributes?.comments);
        setEditedGrades({
            ...editedGrades,
            [student.id]: {
                qualification: qualification,
                comments: value,
            },
        });
    };

    const showModal = (files) => {
        setFiles(files);
        setIsModalOpen(true);
    };

    function renderQualifications() {
        if (isEditChecked) {
            return (
                <td className="px-6 py-4">
                    <InputNumber
                        min={1}
                        max={10}
                        value={qualification}
                        onChange={(value) => { handleQualificationChange(value) }}
                    />
                </td>
            );
        } else {
            if (grade) {
                return (
                    <td class="px-6 py-4">
                        {grade.attributes.qualification}
                    </td>
                )
            } else {
                return (
                    <td class="px-6 py-4">
                    </td>
                )
            }
        }
    }

    function renderComments() {
        if (isEditChecked) {
            return (
                <td className="px-6 py-4">
                    <TextArea
                        rows={3}
                        className="mt-4"
                        placeholder="Write a comment"
                        value={comments}
                        onChange={(e) => { handleCommentsChange(e.target.value) }}
                    />
                </td>
            );
        } else {
            if (grade) {
                return (
                    <td class="px-6 py-4">
                        {grade.attributes.comments}
                    </td>
                )
            } else {
                return (
                    <td class="px-6 py-4">
                    </td>
                )
            }
        }
    }

    const checkIfQuestionnaireHasBeenAnswered = () => {


        const hasCompleted = student.attributes.user_response_questionnaires.data.some(
            userResponse => {
                if (filteredActivity) {
                    return userResponse.attributes.questionnaire.data.attributes.subsection.data.attributes.activity.data.id === filteredActivity[0]?.id;
                } return false;
            }
        );

        if (hasCompleted === true) {
            return (
                <Badge count={'Completed'} style={{ backgroundColor: '#52c41a' }} />
            )
        } else {
            return (
                <Badge count={'Not completed'} />
            )
        }

    }

    return (
        <>
            <ModalFiles grade={grade} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} student={student} />
            <tr onClick={() => {
                if (filteredActivity && filteredActivity[0]?.attributes?.type === 'questionnaire' && !isEditChecked) {
                    navigate(`/app/courses/${courseID}/${filteredActivity[0]?.id}/`)
                }
            }} className={`bg-white border-b  hover:bg-gray-50 ${filteredActivity && filteredActivity.length > 0 && filteredActivity[0]?.attributes?.type === 'questionnaire' ? 'cursor-pointer' : ''}`}>
                <th scope="row" class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap">
                    <img alt='' class="w-10 h-10 rounded-full" src={student?.attributes.profile_photo.data?.attributes?.url} />
                    <div class="pl-3">
                        <div class="text-base font-semibold">{student.attributes.name}</div>
                        <div class="font-normal text-gray-500">{student.attributes.email}</div>
                    </div>
                </th>
                {renderQualifications()}
                {renderComments()}
                {
                    filteredActivity && filteredActivity.length > 0 && filteredActivity[0]?.attributes?.type !== 'questionnaire' ?
                        (
                            <td class="px-6 py-4">
                                <div>
                                    <Button onClick={() => showModal(files)} className='bg-gray-200  rounded-md p-2 h-[2rem] w-[2rem] mx-1 flex items-center justify-center'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                            <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
                                        </svg>
                                    </Button>
                                </div>
                            </td>
                        ) :
                        (
                            <td class="px-6 py-4">
                                {checkIfQuestionnaireHasBeenAnswered()}
                            </td>
                        )
                }
                {
                    grade ?
                        (
                            <td class="px-6 py-4">
                                {format(new Date(grade.attributes.updatedAt), "dd/MM/yyyy 'at' HH:mm")}
                            </td>
                        ) :
                        (
                            <td class="px-6 py-4">
                            </td>
                        )
                }
            </tr>
        </>
    )
}
