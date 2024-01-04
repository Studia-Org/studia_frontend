import React, { useState } from 'react'
import { Modal } from 'rsuite';
import { message, Button } from "antd";
import { API } from "../../../../../constant";
import { getToken } from "../../../../../helpers";
import MDEditor from '@uiw/react-md-editor';
import { useParams } from 'react-router-dom';

export const ForumAddThread = ({ onClose, user, forumID, setAllForums, courseData }) => {
    const [title, setTitle] = useState();
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState();
    const [titleError, setTitleError] = useState(false);
    const [contentError, setContentError] = useState(false);
    const { courseId } = useParams();

    const handleChangeTitle = (e) => {
        setTitle(e.target.value);
        setTitleError(false);
    };

    const handleChangeContent = (e) => {
        setContent(e);
        setContentError(false);
    }
    const handleClose = () => {
        setOpen(false);
        onClose();
    };


    async function handleEdit() {
        try {
            setLoading(true);
            if (!title || !title.trim()) {
                setTitleError(true);
                throw new Error("Title is required");
            }

            if (!content || !content.trim()) {
                setContentError(true);
                throw new Error("Content is required");
            }
            const userData = {
                title: title,
                content: content,
                autor: user.id,
                forums: forumID,
            };

            const response = await fetch(`${API}/forum-posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ data: userData })
            });
            const data = await response.json();
            data.data.attributes.forum_answers = [];
            data.data.attributes.autor = {
                data: {
                    id: user.id,
                    attributes: {
                        username: user.username,
                        email: user.email,
                        name: user.name,
                        role_str: user.role_str,
                        profile_photo: {
                            data: {
                                id: 80,
                                attributes: user.profile_photo
                            }
                        }
                    }
                }
            }

            setAllForums((prevForums) => {
                const newPost = data.data
                const updatedForums = prevForums.map((forum) => {
                    if (Number(forum.id) === Number(forumID)) {
                        forum.attributes.posts.data = [newPost, ...forum.attributes.posts.data];
                        forum.attributes.posts.data.sort((a, b) => new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt));
                    }
                    return forum;
                });
                return updatedForums;
            })

            const readJSON = {}
            courseData.students.forEach(function (student) {
                readJSON[student] = false;
            });


            await fetch(`${API}/notifications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                    data: {
                        content: `New post in forum from course ${courseData.name}`,
                        link: `app/courses/${courseId}`,
                        readJSON: readJSON,
                        type: 'forum',
                        users: courseData.students.filter(studentID => studentID !== user.id)
                    }
                })
            });


            message.success("Post Added Successfully");
            setLoading(false);
            setOpen(false);
            onClose();

        } catch (error) {
            setLoading(false);
            console.error(error.message);
            return;
        }

    }

    return (
        <div>
            <Modal backdrop='static' data-dismiss="modal" keyboard={false} open={open} onClose={handleClose} >
                <Modal.Body className='!overflow-y-hidden' >
                    <div className='flex flex-col '>
                        <div class="mb-6">
                            <label for="title" class="block mb-2 text-sm font-medium text-gray-900 ">Title</label>
                            <textarea
                                onChange={handleChangeTitle}
                                value={title}
                                className={`shadow-sm resize-none border ${titleError ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                            />
                        </div>
                        <div class="mb-6">
                            <label for="content" class="block mb-2 text-sm font-medium text-gray-900  ">Content</label>
                            <div className="container ">
                                <MDEditor
                                    value={content}
                                    className={`mx-1 ${contentError ? 'border border-red-500' : ''}`}
                                    onChange={handleChangeContent}
                                    data-color-mode="light"
                                />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <div className='mt-4'>
                    <Modal.Footer className='space-x-3'>
                        <Button loading={loading} onClick={handleEdit} className='bg-blue-500' type="primary" >
                            Submit
                        </Button>
                        <Button onClick={handleClose} >
                            Cancel
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>
        </div>
    )
}
