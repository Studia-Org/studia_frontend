import React from 'react'
import { FiChevronRight, FiCornerDownLeft } from "react-icons/fi";

export const ForumClickable = ({ posts }) => {

    function renderPostsLogic(posts) {
        if(posts.length === 1){
            return renderPostsInside(posts[0])
        }
        else if(posts.length > 1){
            const firstTwoPosts = posts.slice(0, 2);
            return firstTwoPosts.map((post) => renderPostsInside(post))
        }
        else{
            return <p className='text-gray-700 text-sm '>There are no posts yet, <strong className='font-semibold'>write your first post now!</strong> </p>
        }
    }

    function renderPostsInside(post) {
        return (
            <div className='text-sm w-full'>
                <p className='font-semibold'>{post.title}</p>
                <p className='text-gray-700 mt-2'>{post.content}</p>
                <div className='flex items-center  mt-3 w-full '>
                    <img src={post.autor.profile_photo} className='w-8 rounded-full' alt="" />
                    <p className='font-medium ml-1'>{post.autor.name}</p>
                    <span className='flex items-center space-x-1 text-black ml-auto font-medium'><FiCornerDownLeft /> <p className='ml-auto'> {post.forum_answers.length} Replies</p></span>
                </div>
                <hr className='mt-4' />
            </div>
        )
    }


    return (
        <div className='flex-shrink-0 w-full sm:w-auto'>
            <div className='mt-4 bg-white rounded-lg  px-5 py-5  sm:mr-9 sm:right-0 sm:w-[30rem] w-full shadow-md sm:visible collapse'>
                <div className='flex items-center'>
                    <p className='text-lg font-medium'>Hot posts</p>
                    <button className='text-base ml-auto font-medium text-indigo-700'>View all posts</button>
                    <FiChevronRight className='text-indigo-700' />
                </div>
                <div className='mt-3 space-y-4'>         
                    {renderPostsLogic(posts)}           
                </div>
            </div>
        </div>
    )
}
