import React from 'react'
import { Avatar } from 'rsuite';
import { MoonLoader } from 'react-spinners';
import { Link } from 'react-router-dom';

function GroupMembers({ activityGroup, loadingGroup, small = false }) {
  const sizeAvatar = small ? 'md' : 'large'
  return (
    loadingGroup ?
      <div className="flex items-center justify-center w-full h-full">
        <MoonLoader color="#1E40AF" size={80} />
      </div>
      :
      activityGroup !== null &&
      <section className="flex flex-col flex-wrap flex-1 w-full ">
        <p className="text-base font-medium text-gray-800 ">Group members</p>
        <div className={`flex ${small ? "flex gap-x-2" : "flex-col px-5"}  my-2 flex-wrap`}>
          {activityGroup.users.data.map((user, index) => {
            return (
              <Link
                key={index}
                to={`/app/profile/${user.id}`}
                aria-label={`Go to ${user.attributes.username} profile`}
                title={`Go to ${user.attributes.username} profile`}
                className="flex items-center gap-2 px-3 py-3 mt-3 duration-150 bg-white rounded-md shadow-md cursor-pointer hover:bg-gray-50"
              >
                <Avatar size={sizeAvatar} src={user.attributes?.profile_photo?.data?.attributes?.url} />
                {!small ? (
                  <p className="text-sm text-gray-800">
                    {user.attributes.name} · <span className="font-medium text-black">{user.attributes.username}</span>{' '}
                  </p>
                ) : null}
              </Link>
            )
          })}
        </div>
      </section>

  )
}

export default GroupMembers