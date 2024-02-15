import React from 'react'
import { Avatar } from 'antd';

export const CardQuestionnaireUser = ({ user, setQuestionnaireAnswerData }) => {

    console.log(user)

    const handleOnClick = () => {
        setQuestionnaireAnswerData([{
            responses: user.attributes.responses,
            timeToComplete: user.attributes.timeToComplete,
            user: user.attributes.user
        }])
    }

    const formattedDate = new Date(user.attributes.updatedAt).toLocaleDateString();
    return (
        <div onClick={() => handleOnClick()} className='p-5 bg-white rounded-md shadow-md border-l-8 border-[#35127775] hover:bg-gray-50 cursor-pointer flex items-center'>
            <div className='flex items-center gap-2'>
                <Avatar shape="square" size="large" src={user.attributes.user.data.attributes.profile_photo.data.attributes.url} />
                <p className='text-sm font-medium text-gray-600'>{user.attributes.user.data.attributes.name}</p>
            </div>
            <p className='ml-auto text-sm text-gray-600'> <strong> Time to complete:</strong> {user.attributes.timeToComplete}</p>
            <p className='ml-auto text-sm text-gray-600'><strong>Completion date:</strong>  {formattedDate}</p>
        </div>
    )
}
