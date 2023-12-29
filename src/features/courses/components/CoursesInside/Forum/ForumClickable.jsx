import React from "react";
import { FiChevronRight, FiCornerDownLeft } from "react-icons/fi";

export const ForumClickable = ({ posts, setForumFlag }) => {
  console.log(posts);
  function renderPostsLogic(posts) {
    if (posts.length === 1) {
      return renderPostsInside(posts[0]);
    } else if (posts.length > 1) {
      const firstTwoPosts = posts.slice(0, 2);
      return firstTwoPosts.map((post) => renderPostsInside(post));
    } else {
      return (
        <p className="text-gray-700 text-sm ">
          There are no posts yet,{" "}
          <strong className="font-semibold">write your first post now!</strong>{" "}
        </p>
      );
    }
  }

  function renderPostsInside(post) {
    return (
      <div key={post.id} className="text-sm w-full">
        <p className="font-semibold">{post.attributes.title}</p>
        <p className="text-gray-700 mt-2 line-clamp-3">
          {post.attributes.content}
        </p>
        <div className="flex items-center  mt-3 w-full ">
          <img
            src={
              post.attributes.autor.data.attributes.profile_photo.data
                .attributes.url
            }
            className="w-8 rounded-full"
            alt=""
          />
          <p className="font-medium ml-1">
            {post.attributes.autor.data.attributes.name}
          </p>
          <span className="flex items-center space-x-1 text-black ml-auto font-medium">
            <FiCornerDownLeft />{" "}
            <p className="ml-auto">
              {" "}
              {post.attributes.forum_answers.data?.length} Replies
            </p>
          </span>
        </div>
        <hr className="mt-4" />
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 w-full sm:w-auto">
      <div className="mt-4 bg-white rounded-lg  px-5 py-5  sm:mr-9 sm:right-0 sm:w-[30rem] w-full shadow-md ml-8 hidden sm:block">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
            <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
          </svg>
          <p className="text-lg font-medium">Forum</p>
          <button
            onClick={setForumFlag}
            className="text-base ml-auto font-medium text-indigo-700"
          >
            View all posts
          </button>
          <FiChevronRight className="text-indigo-700" />
        </div>
        <div className="mt-3 space-y-4">{renderPostsLogic(posts)}</div>
      </div>
    </div>
  );
};
