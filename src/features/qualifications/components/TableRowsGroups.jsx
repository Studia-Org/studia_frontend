import { useState } from 'react'
import { Button, Input, InputNumber, message } from "antd"
import { format, set } from 'date-fns';
import { ModalFiles } from './ModalFiles';
import { API } from '../../../constant';
import { getToken } from '../../../helpers';

const { TextArea } = Input;

export async function saveChangesButtonGroups(editedGrades, groups, selectedActivity, evaluator, students, setStudents) {

    const groupsCopy = [...groups];
    for (let groupId in editedGrades) {
        const group = groupsCopy.find(group => {
            return group.id === +groupId;
        });
        console.log(group);
        const comments = editedGrades[groupId].comments;
        const qualification = editedGrades[groupId].qualification;

        let qual = group.attributes.qualifications?.data?.find((qual) => {
            return qual.attributes.activity.data.id === JSON.parse(selectedActivity).id
        })
        if (!qual) {
            const response = await fetch(`${API}/qualifications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                    data: {
                        activity: JSON.parse(selectedActivity).id,
                        group: group.id,
                        comments: comments,
                        evaluator: evaluator.id,
                        qualification: qualification,
                        delivered: true
                    }
                }),
            })
            if (response.ok) {
                const data = await response.json();
                // group.attributes.qualifications.data = data.data;
                qual = data.data;

            }
        }
        else {
            const response = await fetch(`${API}/qualifications/${qual.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                    data: {
                        comments: comments,
                        qualification: qualification,
                        evaluator: evaluator.id,
                        delivered: true
                    }
                }),
            })
            if (response.ok) {
                const data = await response.json();
                qual = data.data
                //group.attributes.qualifications.data = data.data;

            }
        }
        const studentsCopy = [...students];
        const studentsWithThisGroup = studentsCopy.filter(student => student?.attributes?.groups?.data?.find(group => group.id === +groupId));
        studentsWithThisGroup.forEach(student => {
            student.attributes.groups.data.forEach(groupItr => {
                groupItr.attributes.qualifications?.data?.forEach((quali) => {
                    if (quali.attributes.activity.data.id === JSON.parse(selectedActivity).id) {
                        quali.attributes.comments = comments;
                        quali.attributes.qualification = qualification;
                    }
                })
            });


        });

        setStudents(studentsCopy);

    }

    message.success('Changes saved successfully!');


}


export const TableRowsGroups = ({ group, activity, isEditChecked, setThereIsChanges, editedGrades, setEditedGrades }) => {
    const [files, setFiles] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const grade = group.attributes.qualifications?.data.find(qualification => qualification.attributes.activity.data.id === activity.id)
    const [qualification, setQualification] = useState(grade?.attributes?.qualification ? grade.attributes.qualification : null);
    const [comments, setComments] = useState(grade?.attributes?.comments ? grade.attributes.comments : null);

    const handleQualificationChange = (value) => {
        setQualification(value);
        setThereIsChanges(value !== grade?.attributes?.qualification || comments !== grade?.attributes?.comments);
        setEditedGrades({
            ...editedGrades,
            [group.id]: {
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
            [group.id]: {
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
                    <td className="px-6 py-4">
                        {grade.attributes.qualification}
                    </td>
                )
            } else {
                return (
                    <td className="px-6 py-4">
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
                    <td className="px-6 py-4">
                        {grade.attributes.comments}
                    </td>
                )
            } else {
                return (
                    <td className="px-6 py-4">
                    </td>
                )
            }
        }
    }

    return (
        <>
            <ModalFiles grade={grade} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} student={group} group={true} />
            <tr className="bg-white border-b hover:bg-gray-50 ">
                <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap">
                    {
                        <section className='flex flex-col gap-y-2 '>
                            {group.attributes.users.data.map((student) => {
                                return (
                                    <div className="flex " key={student.id}>
                                        <img alt='' className="w-10 h-10 rounded-full" src={student?.attributes.profile_photo.data?.attributes?.url} />
                                        <div className="pl-3">
                                            <div className="text-base font-semibold">{student.attributes.name}</div>
                                            <div className="font-normal text-gray-500">{student.attributes.email}</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </section>

                    }
                </th>
                {renderQualifications()}
                {renderComments()}
                <td className="px-6 py-4">
                    <div>
                        <Button onClick={() => showModal(files)} className='bg-gray-200  rounded-md p-2 h-[2rem] w-[2rem] mx-1 flex items-center justify-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
                            </svg>
                        </Button>
                    </div>
                </td>
                {
                    grade ?
                        (
                            <td className="px-6 py-4">
                                {format(new Date(grade.attributes.updatedAt), "dd/MM/yyyy 'at' HH:mm")}
                            </td>
                        ) :
                        (
                            <td className="px-6 py-4">
                            </td>
                        )
                }
            </tr>
        </>
    )
}
