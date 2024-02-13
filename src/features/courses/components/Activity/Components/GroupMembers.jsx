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
                <p className="text-xl ">Group members</p>
                <div className="flex flex-col px-5 my-2">
                    {activityGroup.users.data.map((user, index) => {
                        return (
                            <a key={index}
                                href={`/app/profile/${user.id}`}
                                rel='noreferrer'
                                target='_blank'
                                className="flex cursor-pointer hover:scale-105 duration-150  px-3 py-1 w-[250px]
                           border-2 border-gray-700 bg-white rounded-md items-center gap-2 mt-3">
                                <Avatar size="large" src={user.attributes.profile_photo.data?.attributes?.url} />
                                <p className="text-lg text-black">{user.attributes.username}</p>
                            </a>
                        )
                    })}
                </div>
            </section>

    )
}

export default GroupMembers