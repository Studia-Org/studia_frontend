import React, { useState } from 'react'
import { Badge, Button, message } from "antd";
import { formatDistanceToNow, set } from 'date-fns';
import { AvatarGroup, Avatar } from 'rsuite';
import { getToken } from "../../../../../helpers";
import { v4 as uuid } from 'uuid';
import { API } from "../../../../../constant";
import { useAuthContext } from "../../../../../context/AuthContext";
import { Tag } from '../../../../../shared/elements/Tag';
import { FiMessageSquare } from "react-icons/fi";
import ReactMarkdown from 'react-markdown';
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
} from '@chakra-ui/accordion'

const markdownConverter = (text) => {
    return (
        <div className='text-base prose max-w-none'>
            <ReactMarkdown>{text}</ReactMarkdown>
        </div>
    )
}

export const Post = ({ post, setAllForums, forumId }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useAuthContext();
    const [comment, setComment] = useState('');
    const timeAgo = formatDistanceToNow(new Date(post.attributes.createdAt), { addSuffix: true });
    const isPostNew = new Date(post.attributes.createdAt) > new Date(new Date().setDate(new Date().getDate() - 1));
    const usersSet = []

    function renderResponses(response) {
        const timeAgo = formatDistanceToNow(new Date(response.attributes.createdAt), { addSuffix: true });
        return (
            <div className='text-sm'>
                <div className='flex items-center space-x-2'>
                    <img className='w-8 rounded-full' src={response.attributes.autor.data.attributes?.profile_photo?.data?.attributes?.url} alt="" />
                    <p className='font-medium'>{response.attributes.autor.data.attributes.name}</p>
                    <p className='text-gray-400'> <span className='text-black'>·</span> {timeAgo}</p>
                </div>
                <p className='mt-1 ml-10'>{response.attributes.content}</p>
            </div>
        )
    }

    const handleChangeComment = (event) => {
        setComment(event.target.value);
    }

    const onClickPost = async (post) => {
        setLoading(true);
        setComment('');
        const userData = {
            content: comment,
            parent: uuid(),
            autor: user.id,
            forum_posts: post.id,
        };
        try {
            const response = await fetch(`${API}/forum-answers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ data: userData })
            });
            const data = await response.json();
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
            setAllForums((prev) => {
                const updatedForums = prev.map((forum) => {
                    if (Number(forum.id) === Number(forumId)) {
                        forum.attributes.posts.data = forum.attributes.posts.data.map((existingPost) => {
                            if (Number(existingPost.id) === Number(post.id)) {
                                if (Array.isArray(existingPost.attributes.forum_answers.data)) {
                                    existingPost.attributes.forum_answers.data = [data.data, ...existingPost.attributes.forum_answers.data];
                                } else {
                                    existingPost.attributes.forum_answers.data = [data.data];
                                }
                            }

                            return existingPost;
                        });
                    }
                    return forum;
                });
                return updatedForums;
            });

            setLoading(false);
            message.success("Post Added Successfully");
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    }

    if (post.attributes.forum_answers && post.attributes.forum_answers.data) {
        post.attributes.forum_answers.data.forEach((answer) => {
            const answerAuthor = answer.attributes.autor.data.attributes;
            const answerUser = {
                avatar: answerAuthor.profile_photo?.data?.attributes?.url,
                name: answerAuthor.name,
            };
            if (!usersSet.some(user => user.name === answerUser.name)) {
                usersSet.push(answerUser);
            }

        });
    }
    return (
        <>
            {isPostNew && <Badge.Ribbon text="New" />}
            <div className='pt-10 pb-12 text-left bg-white rounded-lg shadow-md mb-7'>
                <Accordion allowMultiple>
                    <AccordionItem>
                        <p className='text-2xl font-semibold ml-7'>{post.attributes.title}</p>
                        <div className='flex ml-12 mt-7 '>
                            <img className='w-12 rounded-lg' src={post.attributes.autor.data.attributes?.profile_photo?.data?.attributes?.url} alt="" />
                            <div className='flex flex-col ml-3 text-sm'>
                                <div className='flex gap-x-2'>
                                    <p className='text-gray-800'>{post.attributes.autor.data.attributes.name}</p>
                                    <Tag User={post.attributes.autor.data.attributes} />
                                </div>
                                <p className='text-gray-400'>{timeAgo}</p>
                            </div>
                        </div>
                        <div className='mt-6 ml-12 text-sm prose max-w-none'>
                            {markdownConverter(post.attributes.content)}
                        </div>
                        <div className='flex items-center mt-10 ml-12'>
                            <button className='inline-block py-2 bg-gray-100 border rounded-lg'>
                                <AccordionButton>
                                    <div className='flex items-center'>
                                        <FiMessageSquare className='mx-4' />
                                        <p className='mr-4 text-gray-700 '>View Responses</p>
                                    </div>
                                </AccordionButton>
                            </button>
                            <div className='ml-auto mr-12 '>
                                <AvatarGroup stack>
                                    {usersSet
                                        .filter((user, i) => i < 3)
                                        .map(user => (
                                            <Avatar circle key={user.name} src={user.avatar} alt={user.name} />
                                        ))}
                                    {usersSet.length > 3 && (
                                        <Avatar circle style={{ background: '#3730a3' }}>
                                            +{usersSet.length - 3}
                                        </Avatar>
                                    )}
                                </AvatarGroup>
                            </div>
                        </div>
                        <AccordionPanel>
                            <div className='mx-12 mt-12'>
                                <form>
                                    <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 ">
                                        <div className="px-4 py-2 bg-white rounded-t-lg ">
                                            <label for="comment" className="sr-only">Your comment</label>
                                            <textarea onChange={handleChangeComment} id="comment" rows="4" value={comment} className="w-full p-3 text-sm text-gray-900 bg-white " placeholder="Write a comment..." required></textarea>
                                        </div>
                                        <div className="flex items-center justify-between px-3 py-2 border-t ">
                                            <Button loading={loading} type="button" onClick={() => onClickPost(post)} className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-indigo-500 rounded-lg focus:ring-4 focus:ring-blue-200  hover:bg-blue-800">
                                                Post comment
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                                <p className="mb-5 ml-auto text-xs text-gray-500">Remember, contributions to this topic should follow our <a href="#" className="text-blue-600 hover:underline">Community Guidelines</a>.</p>
                                <hr />
                                <div className='mt-5 ml-10 space-y-5'>
                                    {(post.attributes?.forum_answers?.data?.sort((a, b) => new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt)))?.map(renderResponses)}
                                </div>
                            </div>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </div>
        </>
    )
}
