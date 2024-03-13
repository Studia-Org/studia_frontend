import React from 'react'
import { Avatar } from 'rsuite';
import { MoonLoader } from 'react-spinners';

function GroupMembers({ activityGroup, loadingGroup, small = false }) {
    const sizeAvatar = small ? 'md' : 'large'
    return (
        loadingGroup ?
            <div className="flex items-center justify-center w-full h-full">
                <MoonLoader color="#1E40AF" size={80} />
            </div>
            :
            activityGroup !== null &&
            <section className="flex flex-col flex-1 w-full ">
                <p className="text-base font-medium text-gray-800 ">Group members</p>
                <div className={`flex ${small ? "flex gap-x-2" : "flex-col px-5"}  my-2`}>
                    {activityGroup.users.data.map((user, index) => {
                        return (
                            <a key={index}
                                href={`/app/profile/${user.id}`}
                                rel='noreferrer'
                                aria-label={`Go to ${user.attributes.username} profile`}
                                title={`Go to ${user.attributes.username} profile`}
                                target='_blank'
                                className="flex items-center gap-2 px-3 py-3 mt-3 duration-150 bg-white rounded-md shadow-md cursor-pointer hover:bg-gray-50">
                                <Avatar size={sizeAvatar} src={user.attributes.profile_photo.data?.attributes?.url} />
                                {
                                    !small ?
                                        <p className="text-sm text-gray-800">{user.attributes.name} · <span className='font-medium text-black'>{user.attributes.username}</span> </p>
                                        :
                                        null
                                }
                            </a>
                        )
                    })}
                </div>
            </section>

    )
}

export default GroupMembers