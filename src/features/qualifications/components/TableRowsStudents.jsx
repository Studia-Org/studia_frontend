import React, { useState } from 'react'
import { Whisper, Popover } from 'rsuite';
import { useAuthContext } from '../../../context/AuthContext';
import { message, Popconfirm, Button } from "antd"
import { getToken } from '../../../helpers';
import { API } from '../../../constant';
import { ModalFiles } from './ModalFiles';
import { ModalEditQualification } from './ModalEditQualification';


export const TableRowsStudents = ({ student, activities, isEditChecked, setStudents }) => {
    const [files, setFiles] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenEditQualification, setIsModalOpenEditQualification] = useState(false);
    const [qualification, setQualification] = useState('');
    const [placeholderComment, setPlaceholderComment] = useState('');
    const [placeholderQualification, setPlaceholderQualification] = useState('');
    const [qualificationID, setQualificationId] = useState(null);
    const [activitieId, setActivitieId] = useState('');
    const [comments, setComments] = useState('');
    const { user } = useAuthContext();
    const [openPop, setOpenPop] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const showPopconfirm = () => {
        setOpenPop(true);
    };

    const handleOpen = (student, activitie) => {
        const grade = student.attributes.qualifications.data.find(
            qualification => qualification.attributes.activity.data?.id === activitie.id
        );
        const gradeId = grade ? grade.id : null;
        setQualificationId(gradeId)
        setActivitieId(activitie.id)
        setPlaceholderQualification(grade?.attributes?.qualification)
        setPlaceholderComment(grade?.attributes?.comments)
        setIsModalOpenEditQualification(true);
    };

    const handleClose = () => {
        setQualification('')
        setComments('')
        setIsModalOpenEditQualification(false)
    }

    const speaker = (props) => {
        return (
            <Popover >
                <p>{props}</p>
            </Popover>
        )
    }

    const saveChangesButton = async (studentId) => {
        setConfirmLoading(true);
        let successFlag = false;
        if (qualification !== '' || comments !== '') {
            if (qualificationID === null || qualificationID === undefined) {
                const data = {
                    activity: activitieId,
                    user: studentId,
                    comments: comments,
                    evaluator: user.id,
                    qualification: qualification,
                    file: null,
                    delivered: true
                }
                console.log(data)
                const response = await fetch(`${API}/qualifications`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify({ data: data }),
                });
                if (response.status === 200) {
                    successFlag = true;
                    handleClose()
                }
            } else {
                const data = {
                    ...(qualification !== '' && { qualification }),
                    ...(comments !== '' && { comments }),
                };
                const response = await fetch(`${API}/qualifications/${qualificationID}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify({ data: data }),
                });
                if (response.status === 200) {
                    successFlag = true;
                    handleClose()
                }
            }
        }

        if (successFlag) {
            await fetch(`${API}/notifications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                    data: {
                        link: `app/qualifications`,
                        content: `The professor ${user.name} has updated your qualification in the activity ${activities.find(activitie => activitie.id === activitieId).attributes.title}`,
                        type: 'qualification',
                        readJSON: { [studentId]: false },
                        users: [studentId],
                    },
                }),
            });
            setConfirmLoading(false);
            setStudents(prevState => {
                const newStudents = prevState.map(student => {
                    if (student.id === studentId) {
                        const newQualifications = student.attributes.qualifications.data.map(qualificationTemp => {
                            if (qualificationTemp.id === qualificationID) {
                                return {
                                    ...qualificationTemp,
                                    attributes: {
                                        ...qualificationTemp.attributes,
                                        comments: comments,
                                        qualification: qualification
                                    }
                                }
                            } else {
                                return qualificationTemp
                            }
                        })
                        return {
                            ...student,
                            attributes: {
                                ...student.attributes,
                                qualifications: {
                                    ...student.attributes.qualifications,
                                    data: newQualifications
                                }
                            }
                        }
                    } else {
                        return student
                    }
                })
                return newStudents
            })
            message.success('Changes saved successfully!');
        } else {
            setConfirmLoading(false);
            message.error('There was an error while saving the changes. Please, check if grades have correct values.');
        }

    }

    const showModal = (files) => {
        setFiles(files);
        setIsModalOpen(true);
    };



    function renderFileButton(files) {
        return (
            <>
                <Button onClick={() => showModal(files)} className='bg-gray-200  rounded-md p-2 h-[2rem] w-[2rem] mx-1 flex items-center justify-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
                    </svg>
                </Button>
            </>

        )
    }

    const deleteQualification = async (grade) => {
        setConfirmLoading(true);
        const bodyData = {
            comments: null,
            qualification: null,
            evaluator: null,
        }
        const response = await fetch(`${API}/qualifications/${grade.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ data: bodyData }),
        })
        if (response.status === 200) {
            setStudents(prevState => {
                const newStudents = prevState.map(student => {
                    const newQualifications = student.attributes.qualifications.data.filter(qualification => qualification.id !== grade.id)
                    return {
                        ...student,
                        attributes: {
                            ...student.attributes,
                            qualifications: {
                                ...student.attributes.qualifications,
                                data: newQualifications
                            }
                        }
                    }

                })
                return newStudents
            })
            message.success('Qualification deleted successfully!');
            setConfirmLoading(false);
            setOpenPop(false);
        } else {
            message.error('There was an error while deleting the qualification. Please, try again.');
            setConfirmLoading(false);
            setOpenPop(false);
        }
    }




    function renderCell(activitie) {
        const grade = student.attributes.qualifications.data.find(
            qualification => qualification.attributes.activity.data?.id === activitie?.id
        );
        const file = grade?.attributes?.file.data

        if (isEditChecked) {
            return (
                <td key={activitie.id} className="px-6 py-4">
                    <ModalFiles grade={grade} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} student={student} />
                    <div className='flex'>
                        <button onClick={() => handleOpen(student, activitie)} className='border rounded-md px-14 h-[3rem] w-1 flex items-center justify-center'>
                            <p>{grade ? grade.attributes.qualification : ''}</p>
                        </button>
                        {
                            grade?.attributes?.qualification !== '' && grade?.attributes?.qualification !== undefined && grade?.attributes?.qualification !== null ?
                                <Popconfirm
                                    id={activitie.id}
                                    title="Delete the task"
                                    description="Are you sure to delete this qualification?"
                                    okText="Yes"
                                    okType="danger"
                                    cancelText="No"
                                    okButtonProps={{
                                        loading: confirmLoading,
                                    }}
                                    onConfirm={() => deleteQualification(grade)}
                                    onCancel={() => setOpenPop(false)}
                                >
                                    <button onClick={showPopconfirm} className='flex items-center mx-2'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </Popconfirm>
                                : null
                        }

                        {
                            file !== null && file !== undefined ?
                                <div className='flex items-center mx-2 '>
                                    {renderFileButton(file)}
                                </div> :
                                null
                        }

                        <ModalEditQualification student={student} saveChangesButton={saveChangesButton} setIsModalOpen={setIsModalOpenEditQualification}
                            isModalOpen={isModalOpenEditQualification} placeholderComment={placeholderComment} placeholderQualification={placeholderQualification}
                            qualification={qualification} comments={comments} setComments={setComments} setQualifications={setQualification} />
                    </div>
                </td>
            );
        } else {
            return (
                <td key={activitie.id} className="px-6 py-4">
                    <ModalFiles grade={grade} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} student={student} />
                    <div className='flex'>
                        {grade?.attributes?.comments ?
                            (
                                <Whisper placement="top" className='text-sm shadow-md' trigger="hover" controlId="control-id-hover" speaker={speaker(grade.attributes.comments)}>
                                    <div className="rounded-md w-[10rem] h-[3rem] p-3 text-center">
                                        <p>{grade.attributes.qualification}</p>
                                    </div>
                                </Whisper>
                            ) : (
                                <div className="rounded-md w-[10rem] h-[3rem] p-3 text-center">{grade?.attributes?.qualification}</div>
                            )}
                        {
                            file !== null && file !== undefined ?
                                <div className='flex items-center px-2'>
                                    {renderFileButton(file)}
                                </div> :
                                null
                        }
                    </div>

                </td>
            );
        }
    }


    return (
        <tr class="bg-white border-b  hover:bg-gray-50 ">
            <th scope="row" class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap ">
                <img alt='' class="w-10 h-10 rounded-full" src={student.attributes.profile_photo.data.attributes.url} />
                <div class="pl-3">
                    <div class="text-base font-semibold">{student.attributes.name}</div>
                    <div class="font-normal text-gray-500">{student.attributes.email}</div>
                </div>
            </th>
            {activities.map(renderCell)}
        </tr>
    )
}
