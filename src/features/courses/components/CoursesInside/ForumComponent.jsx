import React, { useState } from 'react'
import { v4 as uuid } from 'uuid';
import ReactMarkdown from 'react-markdown'
import { useAuthContext } from "../../../../context/AuthContext";
import { formatDistanceToNow, set } from 'date-fns';
import { Tag } from '../../../../shared/elements/Tag';
import { AvatarGroup, Avatar } from 'rsuite';
import { message } from "antd";
import { getToken } from "../../../../helpers";
import { API } from "../../../../constant";
import { ForumAddThread } from './ForumAddThread';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from '@chakra-ui/accordion'

import { FiMessageSquare } from "react-icons/fi";

export const ForumComponent = ({ posts, forumID }) => {
  const { user } = useAuthContext();
  const [comment, setComment] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleChangeComment = (event) => {
    setComment(event.target.value);
  }

  const onClickPost = async (post) => {
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
      message.success("Post Added Successfully");
    } catch (error) {
      console.error(error);
    }
  }

  const markdownConverter = (text) => {
    return (
      <div className='prose max-w-none text-base'>
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    )
  }

  function renderResponses(response) {
    const timeAgo = formatDistanceToNow(new Date(response.attributes.createdAt), { addSuffix: true });
    return (
      <div className='text-sm'>
        <div className='flex items-center space-x-2'>
          <img className='w-8 rounded-full' src={response.attributes.autor.data.attributes.profile_photo.data.attributes.url} alt="" />
          <p className='font-medium'>{response.attributes.autor.data.attributes.name}</p>
          <p className='text-gray-400'> <span className='text-black'>·</span> {timeAgo}</p>
        </div>
        <p className='mt-1 ml-10'>{response.attributes.content}</p>
      </div>
    )
  }


  function renderPosts(post) {
    const timeAgo = formatDistanceToNow(new Date(post.attributes.createdAt), { addSuffix: true });
    const usersSet = []

    if (post.attributes.forum_answers && post.attributes.forum_answers.data) {
      post.attributes.forum_answers.data.forEach((answer) => {
        const answerAuthor = answer.attributes.autor.data.attributes;
        const answerUser = {
          avatar: answerAuthor.profile_photo.data.attributes.url,
          name: answerAuthor.name,
        };
        if (!usersSet.some(user => user.name === answerUser.name)) {
          usersSet.push(answerUser);
        }

      });
    }

    return (
      <div>
        <div className='bg-white pb-12 rounded-lg shadow-md pt-10 text-left'>
          <Accordion allowMultiple>
            <AccordionItem>
              <p className='ml-7 font-semibold text-2xl'>{post.attributes.title}</p>
              <div className='ml-12 flex mt-7 '>
                <img className='w-12 rounded-lg' src={post.attributes.autor.data.attributes.profile_photo.data.attributes.url} alt="" />
                <div className='flex flex-col ml-3 text-sm'>
                  <div className='flex'>
                    <p className='text-gray-800'>{post.attributes.autor.data.attributes.name}</p>
                    <Tag User={post.attributes.autor.data.attributes} />
                  </div>
                  <p className='text-gray-400'>{timeAgo}</p>
                </div>
              </div>
              <div className='ml-12 mt-6 prose max-w-none text-sm'>
                {markdownConverter(post.attributes.content)}
              </div>
              <div className='flex mt-10 ml-12 items-center'>
                <button className='bg-gray-100 py-2 rounded-lg inline-block border'>
                  <AccordionButton>
                    <div className='flex items-center'>
                      <FiMessageSquare className='mx-4' />
                      <p className=' text-gray-700 mr-4'>View Responses</p>
                    </div>
                  </AccordionButton>
                </button>
                <div className=' ml-auto mr-12'>
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
                        <textarea onChange={handleChangeComment} id="comment" rows="4" value={comment} className="w-full  text-sm text-gray-900 bg-white p-3 " placeholder="Write a comment..." required></textarea>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 border-t ">
                        <button type="button" onClick={() => onClickPost(post)} className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-indigo-500 rounded-lg focus:ring-4 focus:ring-blue-200  hover:bg-blue-800">
                          Post comment
                        </button>
                      </div>
                    </div>
                  </form>
                  <p className="ml-auto text-xs text-gray-500 mb-5">Remember, contributions to this topic should follow our <a href="#" className="text-blue-600 hover:underline">Community Guidelines</a>.</p>
                  <hr />
                  <div className='mt-5 ml-10 space-y-5'>
                    {post.attributes.forum_answers.data.map(renderResponses)}
                  </div>
                </div>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

    )
  }

  return (
    <div className='flex flex-col pt-5 '>
      <div className='space-y-7'>
        <div className='bg-white rounded-lg shadow-md flex justify-between items-center'>
          <p className='ml-8 text-gray-400 text-sm'>Add a new thread</p>
          <button onClick={handleOpenModal} type="button" className="text-white bg-indigo-500 hover:bg-indigo-600 transition-all duration-100 focus:ring-4 focus:ring-indigo-300 mr-5 font-medium rounded-xl text-sm px-3 py-2 m-2 mb-2 focus:outline-none">+</button>
        </div>
        <div className='space-y-7 pb-10'>
          {posts.map(renderPosts)}
        </div>

        {showModal && <ForumAddThread onClose={handleCloseModal} user={user} forumID={forumID} />}
      </div>

    </div>
  )
}
