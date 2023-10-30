import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import { Whisper, Popover, Modal, Input, Button, Form } from 'rsuite';
import { set } from 'date-fns/esm';
import Swal from 'sweetalert2'
import { useAuthContext } from '../../../context/AuthContext';
import { message } from "antd"
import { getToken } from '../../../helpers';
import { API } from '../../../constant';

export const TableRowsStudents = ({ student, activities, isEditChecked }) => {
    const [open, setOpen] = useState(false);
    const [qualification, setQualification] = useState('');
    const [placeholderComment, setPlaceholderComment] = useState('');
    const [placeholderQualification, setPlaceholderQualification] = useState('');
    const [qualificationID, setQualificationId] = useState('');
    const [activitieId, setActivitieId] = useState('');
    const [comments, setComments] = useState('');
    const { user } = useAuthContext();


    const handleQualificationChange = (value) => {
        setQualification(value);
    };

    const handleCommentsChange = (value) => {
        setComments(value);
    };

    const handleOpen = (student, activitie) => {
        const grade = student.attributes.qualifications.data.find(
            qualification => qualification.attributes.activity.data.id === activitie.id
        );
        const gradeId = grade ? grade.id : null;
        setQualificationId(gradeId)
        setActivitieId(activitie.id)
        setPlaceholderQualification(grade?.attributes?.qualification)
        setPlaceholderComment(grade?.attributes?.comments)
        setOpen(true);
    };

    const handleClose = () => {
        setQualification('')
        setComments('')
        setOpen(false)
    }

    const speaker = (props) => {
        return (
            <Popover >
                <p>{props}</p>
            </Popover>
        )
    }


    const saveChangesButton = async (studentId) => {
        let successFlag = false;
        if (qualification !== '' || comments !== '') {
            if (qualificationID === null) {
                //En caso que no exista el modelo qualification   
                const data = {
                    activity: activitieId,
                    user: studentId,
                    comments: comments,
                    evaluator: user.id,
                    qualification: qualification,
                    file: null,
                    delivered: true
                }
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
            message.success('Changes saved successfully!');
        } else {
            message.error('There was an error while saving the changes. Please, check if grades have correct values.');
        }

    }

    const downloadFile = async (file) => {
        try {
            const response = await fetch(file.url);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                console.error('Error al descargar el archivo');
            }
        } catch (error) {
            console.error('Error en la descarga: ', error);
        }
    };

    function renderFileButtons(file) {
        return (
            <button onClick={() => downloadFile(file.attributes)} className='bg-gray-200  rounded-md p-2 h-[2rem] w-[2rem] mx-1 flex items-center justify-center'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
                </svg>
            </button>
        )
    }

    function renderModal(student) {
        return (
            <Modal size='sm' open={open} onClose={handleClose}>
                <Modal.Header>
                    <Modal.Title className=''>Edit qualification</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group >
                        <Form.ControlLabel>Qualification</Form.ControlLabel>
                        <Input className='my-4' value={qualification} placeholder={placeholderQualification} onChange={handleQualificationChange} />
                    </Form.Group >
                    <Form.Group >
                        <Form.ControlLabel>Comments</Form.ControlLabel>
                        <Input className='mt-4' value={comments} placeholder={placeholderComment} onChange={handleCommentsChange} />
                    </Form.Group >
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose} appearance="subtle">
                        Cancel
                    </Button>
                    <Button onClick={() => saveChangesButton(student.id)} appearance="primary">
                        Save changes
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    const deleteQualification = async (grade) => {
        const bodyData = {
            comments: null,
            qualification: null,
            evaluator: null,
        }
        Swal.fire({
            title: 'Are you sure?',
            text: "You are going to delete the qualification",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await fetch(`${API}/qualifications/${grade.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify({ data: bodyData }),
                })
                if (response.status === 200) {
                    message.success('Qualification deleted successfully!');
                } else {
                    message.error('There was an error while deleting the qualification. Please, try again.');
                }
            }
        })

    }



    function renderCell(activitie) {
        const grade = student.attributes.qualifications.data.find(
            qualification => qualification.attributes.activity.data.id === activitie.id
        );
        const file = grade?.attributes?.file.data

        if (isEditChecked) {
            return (
                <td key={activitie.id} className="px-6 py-4">
                    <div className='flex'>
                        <button onClick={() => handleOpen(student, activitie)} className='border rounded-md px-14 h-[3rem] w-1 flex items-center justify-center'>
                            <p>{grade ? grade.attributes.qualification : ''}</p>
                        </button>
                        {
                            grade?.attributes?.qualification !== '' && grade?.attributes?.qualification !== undefined && grade?.attributes?.qualification !== null?
                                <button onClick={() => deleteQualification(grade)} className='flex items-center mx-2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                                    </svg>
                                </button> : null
                        }

                        {
                            file !== null && file !== undefined ?
                                <div className='flex items-center mx-2 '>
                                    {file.map(renderFileButtons)}
                                </div> :
                                null
                        }

                        {renderModal(student)}
                    </div>
                </td>
            );
        } else {
            return (
                <td key={activitie.id} className="px-6 py-4">
                    <div className='flex'>
                        {grade?.attributes?.comments ? 
                        (
                            <Whisper placement="top" className='text-sm shadow-md' trigger="hover" controlId="control-id-hover" speaker={speaker(grade.attributes.comments)}>
                                <div className="rounded-md w-[10rem] h-[3rem] p-3 text-center">
                                    <p>{grade.attributes.qualification}</p>
                                </div>
                            </Whisper>
                        ) : (
                            <div className="rounded-md w-[10rem] h-[3rem] p-3 text-center"></div>
                        )}
                        {
                            file !== null && file !== undefined ?
                                <div className='flex items-center px-2'>
                                    {file.map(renderFileButtons)}
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
