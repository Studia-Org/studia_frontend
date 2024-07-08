import React from "react";
import { FiChevronRight, FiCornerDownLeft } from "react-icons/fi";
import { useTranslation } from "react-i18next";
export const ForumClickable = ({ posts, setForumFlag, setVisible, setParticipantsFlag, setSettingsFlag }) => {
  const { t } = useTranslation();
  function renderPostsLogic(posts) {
    if (posts.length === 1) {
      return renderPostsInside(posts[0]);
    } else if (posts.length > 1) {
      const firstTwoPosts = posts.slice(0, 1);
      return firstTwoPosts.map((post) => renderPostsInside(post));
    } else {
      return (
        <p className="text-sm text-gray-700 ">
          There are no posts yet,{" "}
          <strong className="font-semibold">write your first post now!</strong>{" "}
        </p>
      );
    }
  }

  function renderPostsInside(post) {
    return (
      <div key={post.id} className="w-full text-sm">
        <p className="font-semibold">{post.attributes.title}</p>
        <p className="mt-2 text-gray-700 line-clamp-1">
          {post.attributes.content}
        </p>
        <div className="flex items-center w-full mt-3 ">
          <img
            src={
              post.attributes.autor.data.attributes.profile_photo?.data
                ?.attributes?.url
            }
            className="w-5 h-5 rounded-full"
            alt="profile_photo"
          />
          <p className="ml-1 font-medium">
            {post.attributes.autor.data.attributes.name}
          </p>
          <span className="flex items-center ml-auto space-x-1 font-medium text-black">
            <FiCornerDownLeft />{" "}
            <p className="ml-auto">
              {" "}
              {post.attributes.forum_answers.data?.length} {t("COURSEINSIDE.FORUM.answers")}
            </p>
          </span>
        </div>
        <hr className="mt-4" />
      </div>
    );
  }
  return (
    <section className={`px-5 py-5 bg-white rounded-lg shadow-none xl:shadow-md xl:border-none ${setVisible ? "border border-[#DADADA]" : "sm:w-[30rem]"} `}>
      <div className="flex items-center">
        <p className="text-lg font-medium">{t("COURSEINSIDE.FORUM.forum")}</p>
        <div className="flex items-center ml-auto duration-150 hover:translate-x-1">
          <button
            onClick={() => { setForumFlag(true); setParticipantsFlag(false); setSettingsFlag(false); if (setVisible) setVisible(false) }}
            className="ml-auto text-base font-medium text-indigo-700 "
          >
            {t("COURSEINSIDE.FORUM.view_all_posts")}
          </button>
          <FiChevronRight className="text-indigo-700" />
        </div>
      </div>
      <div className="mt-3 space-y-4">{renderPostsLogic(posts)}</div>
    </section>
  );
};
