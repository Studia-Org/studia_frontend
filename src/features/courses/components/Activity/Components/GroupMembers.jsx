import React from 'react'
import { Avatar } from 'rsuite';
import { MoonLoader } from 'react-spinners';

function GroupMembers({ activityGroup, loadingGroup }) {

    return (
        loadingGroup ?
            <div className="flex items-center justify-center w-full h-full">
                <MoonLoader color="#1E40AF" size={80} />
            </div>
            :
            activityGroup !== null &&
            <section className="flex flex-col flex-1 w-full ">
                <p className="text-base font-medium text-gray-800 ">Group members</p>
                <div className="flex flex-col px-5 my-2">
                    {activityGroup.users.data.map((user, index) => {
                        return (
                            <a key={index}
                                href={`/app/profile/${user.id}`}
                                rel='noreferrer'
                                target='_blank'
                                className="flex items-center w-full gap-2 py-3 pl-3 mt-3 duration-150 bg-white rounded-md shadow-md cursor-pointer hover:bg-gray-50">
                                <Avatar size="large" src={user.attributes.profile_photo.data?.attributes?.url} />
                                <p className="text-sm text-gray-800">{user.attributes.name} · <span className='font-medium text-black'>{user.attributes.username}</span> </p>
                            </a>
                        )
                    })}
                </div>
            </section>

    )
}

export default GroupMembers