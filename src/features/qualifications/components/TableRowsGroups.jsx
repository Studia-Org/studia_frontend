import { useEffect, useState } from 'react'
import { Button, Input, InputNumber, message } from "antd"
import { format, set } from 'date-fns';
import { ModalFiles } from './ModalFiles';
import { API } from '../../../constant';
import { getToken } from '../../../helpers';
import { is } from 'date-fns/locale';

const { TextArea } = Input;

export async function saveChangesButtonGroups(editedGrades, groups, selectedActivity, evaluator, students, setStudents) {

    const groupsCopy = [...groups];
    for (let groupId in editedGrades) {
        const group = groupsCopy.find(group => {
            return group.id === +groupId;
        });
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


export const TableRowsGroups = ({ group, activity, isEditChecked, setThereIsChanges, editedGrades, setEditedGrades, isPeerReview, setEditActivity, activityFull }) => {
    const [files, setFiles] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const grade = group.attributes.qualifications?.data.find(qualification => qualification.attributes.activity.data.id === activity.id)
    const [qualification, setQualification] = useState(grade?.attributes?.qualification ? grade.attributes.qualification : null);
    const [comments, setComments] = useState(grade?.attributes?.comments ? grade.attributes.comments : null);
    const [ponderationProfessor, setPonderationProfessor] =
        useState(activityFull.attributes.ponderationStudent ? 100 - activityFull.attributes.ponderationStudent : 100);
    const [ponderationStudent, setPonderationStudent] =
        useState(activityFull.attributes.ponderationStudent ? activityFull.attributes.ponderationStudent : 0);

    const [professorQualification, setProfessorQualification] = useState(0);

    const BeingReviewedBy = grade?.attributes?.activity?.data?.attributes?.BeingReviewedBy?.data?.id;
    const peerReviewAnswers = group.attributes.qualifications?.data.find(qualification => qualification.attributes.activity.data.id === BeingReviewedBy)

    useEffect(() => {
        const average = calculateAverage();
        if (isNaN(average)) {
            setProfessorQualification(qualification);
            return
        }
        if (qualification) {
            const professor = (qualification - (average * ponderationStudent / 100)) / (ponderationProfessor / 100);
            setProfessorQualification(professor.toFixed(2));
        }
        else { setProfessorQualification(null); }
    }, [])

    const handleQualificationChange = (value) => {
        setQualification(value);
        setThereIsChanges(value !== grade?.attributes?.qualification || comments !== grade?.attributes?.comments ||
            ponderationStudent !== grade?.attributes?.ponderationStudent);
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
        setThereIsChanges(qualification !== grade?.attributes?.qualification || value !== grade?.attributes?.comments ||
            ponderationStudent !== grade?.attributes?.ponderationStudent);
        setEditedGrades({
            ...editedGrades,
            [group.id]: {
                qualification: qualification,
                comments: value,
            },
        });
    };

    function handlePonderation(value, type) {
        let ponderationProfessor = 0;
        let ponderationStudent = 0;
        if (type === 'professor') {
            ponderationProfessor = value;
            ponderationStudent = 100 - value;
        } else {
            ponderationStudent = value;
            ponderationProfessor = 100 - value;
        }
        setPonderationProfessor(ponderationProfessor);
        setPonderationStudent(ponderationStudent);

        const qual = (professorQualification * ponderationProfessor / 100) + (calculateAverage() * ponderationStudent / 100);
        setQualification(qual.toFixed(2));

        setThereIsChanges(qualification !== grade?.attributes?.qualification || comments !== grade?.attributes?.comments ||
            ponderationStudent !== grade?.attributes?.ponderationStudent);

        if (ponderationStudent !== grade?.attributes?.ponderationStudent) {
            setEditActivity((prev) => {
                return {
                    ...prev,
                    [activity.id]: {
                        ponderationStudent: ponderationStudent,
                        id: activity.id
                    }
                }
            });
        } else {
            setEditActivity({})
        }


    }

    const showModal = (files) => {
        setFiles(files);
        setIsModalOpen(true);
    };

    function renderQualifications() {
        if (isEditChecked && !isPeerReview) {
            return (
                <td className="px-6 py-4">
                    <InputNumber
                        min={1}
                        max={10}
                        value={qualification}
                        onChange={(value) => {

                            handleQualificationChange(value)
                        }}
                    />
                </td>
            );
        } else {
            if (grade && !isEditChecked) {
                return (
                    <td className="px-6 py-4 text-center">
                        {grade.attributes.qualification}
                    </td>
                )
            } else {
                return (
                    <td className="px-6 py-4 text-center">
                        {qualification ? qualification : "-"}
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


    function renderPonderations() {
        // if (isEditChecked) {
        //     return (
        //         <td className="px-6 py-4">
        //             <div className='flex items-center'>
        //                 <p className='min-w-[90px]'>Professor %:</p>
        //                 <InputNumber
        //                     min={1}
        //                     max={100}
        //                     value={ponderationProfessor}
        //                     onChange={(value) => { handlePonderation(value, 'professor') }}
        //                 />
        //             </div>
        //             <div className='flex items-center mt-2'>
        //                 <p className='min-w-[90px]'>Student %:</p>
        //                 <InputNumber
        //                     min={1}
        //                     max={100}
        //                     value={ponderationStudent}
        //                     onChange={(value) => { handlePonderation(value, 'student') }}
        //                 />
        //             </div>
        //         </td>
        //     );
        // } else {
        if (grade) {
            return (
                <td className="px-6 py-4">
                    <div className='flex items-center'>
                        <p className='min-w-[80px]'>Professor:</p>
                        <p>{ponderationProfessor}%</p>
                    </div>
                    <div className='flex items-center mt-2'>
                        <p className='min-w-[80px]'>Student:</p>
                        <p>{ponderationStudent}%</p>
                    </div>
                </td>
            )
        } else {
            return (
                <td className="px-6 py-4">
                </td>
            )
            // }
        }
    }

    function calculateAverage() {
        let sum = 0;
        peerReviewAnswers?.attributes?.PeerReviewAnswers?.data?.forEach(answer => {
            let internAverage = 0
            const Answer = answer?.attributes?.Answers;
            Object.keys(Answer).forEach((value) => {
                const dict = Answer[value];
                internAverage += Object.keys(dict)[0];
            })
            sum += (internAverage / Object.keys(Answer).length);
        });
        if (!grade) return "No grade yet";
        const average = sum / peerReviewAnswers?.attributes?.PeerReviewAnswers?.data?.length;
        return isNaN(average) ? "-" : average.toFixed(2);
    }


    function renderProfessorQualification() {
        if (isEditChecked) {
            return (
                <td className="px-6 py-4">
                    <InputNumber
                        min={0}
                        max={10}
                        value={professorQualification}
                        onChange={(value) => {
                            const average = calculateAverage();
                            let qual = 0
                            if (isNaN(average)) {
                                qual = value;
                            } else {
                                qual = (value * ponderationProfessor / 100) + (calculateAverage() * ponderationStudent / 100);
                            }

                            setProfessorQualification(value.toFixed(2));
                            handleQualificationChange(qual.toFixed(2))
                        }}
                    />
                </td>
            );
        }
        return (
            <td className="px-6 py-4 text-center">
                {professorQualification ? professorQualification : "-"}
            </td>
        )
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
                {
                    isPeerReview &&
                    renderProfessorQualification()
                }
                <td className="px-6 py-4 text-center">
                    {
                        isPeerReview ?
                            calculateAverage()
                            :
                            <Button onClick={() => showModal(files)} className='bg-gray-200  rounded-md p-2 h-[2rem] w-[2rem] mx-1 flex items-center justify-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
                                </svg>
                            </Button>
                    }
                </td>
                {
                    isPeerReview && renderPonderations()
                }

                {
                    grade ?
                        <td className="px-6 py-4">
                            {format(new Date(grade.attributes.updatedAt), "dd/MM/yyyy 'at' HH:mm")}
                        </td>
                        :

                        <td className="px-6 py-4">
                        </td>
                }
            </tr>
        </>
    )
}
