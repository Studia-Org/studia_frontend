import React, { useState } from 'react'
import { Modal, Button } from 'rsuite';
import Swal from 'sweetalert2';
import { message } from "antd";
import { FiEdit } from "react-icons/fi";
import axios from 'axios';
import { API } from "../../../constant";
import { getToken } from "../../../helpers";
import MDEditor from '@uiw/react-md-editor';

export const ForumAddThread = ({ onClose, user, forumID }) => {
    const [title, setTitle] = useState();
    const [open, setOpen] = useState(true);
    const [content, setContent] = useState();

    const handleChangeTitle = (event) => {
        setTitle(event.target.value);
    }
    const handleClose = () => {
        setOpen(false);
        onClose();
    };

    async function handleEdit() {
        const userData = {
            title: title,
            content: content,
            autor: user.id,
            forums: forumID,
        };
        try {
            const response = await fetch(`${API}/forum-posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ data: userData })
            });
            const data = await response.json();
            message.success("Post Added Successfully");
        } catch (error) {
            console.error(error);
        }
        setOpen(false);
        onClose();

    }

    return (
        <div>
            <Modal backdrop='static' data-dismiss="modal" keyboard={false} open={open} onClose={handleClose} >
                <Modal.Body className='!overflow-y-hidden' >
                    <div className='flex flex-col '>
                        <div class="mb-6">
                            <label for="title" class="block mb-2 text-sm font-medium text-gray-900 ">Title</label>
                            <textarea onChange={handleChangeTitle} type="name" id="name" class="shadow-sm resize-none  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  " >
                            </textarea>
                        </div>
                        <div class="mb-6">
                            <label for="content" class="block mb-2 text-sm font-medium text-gray-900  ">Content</label>
                            <div className="container">
                                <MDEditor
                                    value={content}
                                    className='mx-1'
                                    onChange={setContent}
                                    data-color-mode="light"
                                />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <div className='mt-4'>
                    <Modal.Footer className=''>
                        <Button onClick={handleEdit} appearance="primary" >
                            Add new thread
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
