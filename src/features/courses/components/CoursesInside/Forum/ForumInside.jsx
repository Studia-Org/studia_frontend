import React from 'react'
import { Post } from './Post';



export const ForumInside = ({ posts, setAllForums, forumId }) => {
    return (
        <>
            <div className='pb-10'>
                {
                    posts.map((post) => (
                        <Post post={post} setAllForums={setAllForums} forumId={forumId} />
                    ))
                }
            </div>
        </>
    )
}
