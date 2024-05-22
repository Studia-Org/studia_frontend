import { useState, React, useRef } from 'react';
import { Modal, Button } from 'rsuite';
import Swal from 'sweetalert2';
import { FiEdit } from "react-icons/fi";
import axios from 'axios';
import { API } from "../../../constant";
import { getToken } from "../../../helpers";

import '../styles/userStyles.css';
import { message } from 'antd';
import { set } from 'date-fns';
import { useAuthContext } from '../../../context/AuthContext';

export const EditPanel = ({ onClose, userProfile, uid, setUserProfile }) => {

    const inputRefLandscape = useRef(null);
    const inputRefProfile = useRef(null);
    const [open, setOpen] = useState(true);
    const [description, setDescription] = useState();
    const [university, setUniversity] = useState();
    const [username, setUsername] = useState();
    const [name, setName] = useState();
    const [profilePhoto, setProfilePhoto] = useState();
    const [landscapePhoto, setLandscapePhoto] = useState();
    const [loading, setLoading] = useState(false);
    const { setUser, user } = useAuthContext();

    const handleClose = () => {
        setOpen(false);
        onClose();
    };

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })


    async function handleEdit() {
        setLoading(true);
        const formData = new FormData();
        let profilePhotoId = undefined;
        let landscapePhotoId = undefined;
        let profilePhotoNew = userProfile.profile_photo;
        let landscapePhotoNew = userProfile.landscape_photo;
        if (profilePhoto !== undefined) {
            formData.append('files', profilePhoto);
            const uploadProfileResponse = await fetch(`${API}/upload`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
                body: formData
            }).catch(error => {
                Toast.fire({
                    icon: 'error',
                    text: 'Error uploading profile photo',
                    title: ''
                })
                setLoading(false);
                return;
            });

            if (!uploadProfileResponse.ok) {
                Toast.fire({
                    icon: 'error',
                    text: 'Error uploading profile photo',
                    title: ''
                })
                setLoading(false);
                return;
            }
            const uploadProfileData = await uploadProfileResponse.json();
            profilePhotoNew = uploadProfileData[0];
            profilePhotoId = uploadProfileData[0].id;
        }
        if (landscapePhoto !== undefined) {
            formData.delete('files');
            formData.append('files', landscapePhoto);
            const uploadLandscapeResponse = await fetch(`${API}/upload`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
                body: formData
            }).catch(error => {
                Toast.fire({
                    icon: 'error',
                    text: 'Error uploading landscape photo',
                    title: ''
                })
                setLoading(false);
                return;
            });
            if (!uploadLandscapeResponse.ok) {
                Toast.fire({
                    icon: 'error',
                    text: 'Error uploading landscape photo',
                    title: ''
                })
                setLoading(false);
                return;
            }
            const uploadLandscapeData = await uploadLandscapeResponse.json();
            landscapePhotoNew = uploadLandscapeData[0]
            landscapePhotoId = uploadLandscapeData[0].id;
        }

        const userData = {
            description: description,
            university: university,
            username: username,
            name: name,
            profile_photo: profilePhotoId,
            landscape_photo: landscapePhotoId,
        };

        fetch(`${API}/users/${uid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(userData)
        })
            .then(response => {
                if (response.ok) {
                    Toast.fire({
                        icon: 'success',
                        text: 'Changes saved.',
                        title: 'Success!'
                    })
                    return response.json();
                } else {
                    response.text().then(errorMessage => {
                        Toast.fire({
                            icon: 'error',
                            text: errorMessage,
                            title: 'Error!'
                        });
                    });
                }
            }).then(data => {
                setUserProfile({ ...data, profile_photo: profilePhotoNew, landscape_photo: landscapePhotoNew });
                setUser({ ...user, ...data, profile_photo: profilePhotoNew, landscape_photo: landscapePhotoNew });
            })
            .catch(error => {
                Toast.fire({
                    icon: 'error',
                    text: 'Something went wrong.' + error,
                    title: 'Error!'
                })
            });

        resetValues();
        setOpen(false);
        onClose();
        setLoading(false);
    }

    function handleProfilePhoto() {
        inputRefProfile.current.click();
    }
    function handleLandscapePhoto() {
        inputRefLandscape.current.click();
    }

    function handleProfilePhotoChange(event) {
        console.log(event.target.files[0].size);
        if (event.target.files[0].type !== 'image/jpeg' && event.target.files[0].type !== 'image/png') {
            Toast.fire({
                icon: 'error',
                text: 'The image must be a PNG or JPEG',
                title: ''
            });
            return;
        }
        var _size = Math.floor(event.target.files[0].size / 1048576) + 'MB';
        if (_size > 10) {
            Toast.fire({
                icon: 'error',
                text: 'The image must be less than 10MB',
                title: ''
            });
            return;
        }
        setProfilePhoto(event.target.files[0]);
    }
    function handleLandscapePhotoChange(event) {
        if (event.target.files[0].type !== 'image/jpeg' && event.target.files[0].type !== 'image/png') {
            Toast.fire({
                icon: 'error',
                text: 'The image must be a PNG or JPEG',
                title: ''
            });
            return;
        }
        if (event.target.files[0].size > 1048576) {
            Toast.fire({
                icon: 'error',
                text: 'The image must be less than 10MB',
                title: ''
            });
            return;
        }
        setLandscapePhoto(event.target.files[0]);
    }


    const handleChangeDescription = (event) => {
        setDescription(event.target.value);
    };
    const handleChangeUniversity = (event) => {
        setUniversity(event.target.value);
    }
    const handleChangeUsername = (event) => {
        setUsername(event.target.value);
    }
    const handleChangeName = (event) => {
        setName(event.target.value);
    }

    const resetValues = () => {
        setDescription("");
        setUniversity("");
        setUsername("");
        setName("");
        setLandscapePhoto("");
        setProfilePhoto("");
    };

    return (
        <div>
            <Modal backdrop='static' data-dismiss="modal" keyboard={false} open={open} onClose={handleClose} >
                <Modal.Header closeButton="false" >
                    <button className='z-40 w-full' onClick={handleLandscapePhoto}>
                        <input type="file" accept=".png,.jpg" ref={inputRefLandscape} onChange={handleLandscapePhotoChange} style={{ display: 'none' }} />
                        <div className='relative flex items-center'>
                            {userProfile && (
                                landscapePhoto ? (
                                    <img
                                        src={URL.createObjectURL(landscapePhoto)}
                                        className='object-cover w-full h-56'
                                        alt=''
                                        style={{ filter: 'brightness(50%)' }}
                                    />
                                ) : (
                                    <img className='object-cover w-full h-56' style={{ filter: 'brightness(50%)' }} src={userProfile?.landscape_photo?.url} alt="" />
                                )
                            )}
                            <div className='absolute flex items-center justify-center w-full h-full ml-auto'>
                                <div className={`${userProfile.landscape_photo === null ? 'text-black' : 'text-white'}`}>
                                    <FiEdit size={20} />
                                </div>
                            </div>
                        </div>
                    </button>
                    <button className='w-full' onClick={handleProfilePhoto}>
                        <input type="file" accept=".png,.jpg" ref={inputRefProfile} onChange={handleProfilePhotoChange} style={{ display: 'none' }} />
                        <div className='justify-center ml-10 -mt-16 tems-center'>
                            {userProfile && (
                                profilePhoto ? (
                                    <img
                                        src={URL.createObjectURL(profilePhoto)}
                                        className='border-none rounded-full shadow-xl max-w-[120px] min-w-[120px] max-h-[120px] min-h-[120px] bg-center object-fill'
                                        alt=''
                                        style={{ filter: 'brightness(50%)' }}
                                    />
                                ) : (
                                    <img
                                        className='max-w-[120px] min-w-[120px] min-h-[120px] border-none rounded-full shadow-xl max-h-[120px] bg-center object-fill'
                                        src={userProfile?.profile_photo?.url}
                                        alt=''
                                        style={{ filter: 'brightness(50%)' }}
                                    />
                                )
                            )}

                        </div>
                    </button>
                </Modal.Header>
                <Modal.Body className='!overflow-y-scroll' >
                    <div className='flex flex-col '>
                        <div class="mb-6">
                            <label for="name" class="block mb-2 text-sm font-medium text-gray-900 ">Name</label>
                            <textarea onChange={handleChangeName} type="name" id="name" class="shadow-sm resize-none  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  " >
                                {userProfile.name}
                            </textarea>
                        </div>
                        <div class="mb-6">
                            <label for="username" class="block mb-2 text-sm font-medium text-gray-900 ">Username</label>
                            <textarea onChange={handleChangeUsername} type="username" id="username" class="shadow-sm  resize-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  " >
                                {userProfile.username}
                            </textarea>
                        </div>
                        <div class="mb-6">
                            <label for="university" class="block mb-2 text-sm font-medium text-gray-900 ">University</label>
                            <textarea onChange={handleChangeUniversity} id="university" class="shadow-sm resize-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  " >
                                {userProfile.university}
                            </textarea>
                        </div>
                        <div className='mb-6'>
                            <label for="message" class="block mb-2 text-sm font-medium text-gray-900 ">Description</label>
                            <textarea onChange={handleChangeDescription} id="message" rows="4" class="block p-2.5 w-full text-sm text-gray-900  rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 ">
                                {userProfile.description}
                            </textarea>
                        </div>

                    </div>
                </Modal.Body>
                <div className='mt-4'>
                    <Modal.Footer className=''>
                        <Button loading={loading} onClick={handleEdit} appearance="primary" >
                            Save Changes
                        </Button>
                        <Button onClick={handleClose} appearance="subtle">
                            Cancel
                        </Button>
                    </Modal.Footer>
                </div>

            </Modal>
        </div>
    )
}
