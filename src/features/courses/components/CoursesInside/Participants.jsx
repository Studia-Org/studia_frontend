import React from 'react'
import { List, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';

export const Participants = ({ students }) => {

    const navigate = useNavigate()

    return (
        <div className=''>
            <h2 className='mt-5 text-xl font-bold'>Participants</h2>
            <List
                className='p-5 mt-5 mb-10 bg-white border rounded-lg'
                itemLayout="horizontal"
                dataSource={students.data}
                renderItem={(item, index) => (
                    <List.Item className='cursor-pointer hover:bg-gray-50' onClick={() => navigate(`/app/profile/${item.id}/`)}>
                        <List.Item.Meta
                            avatar={<Avatar src={item.attributes.profile_photo.data?.attributes?.url} alt='profile_photo' size={'large'} />}
                            title={item.attributes.name}
                            className='pl-5'
                            description={item.attributes.email}
                        />
                    </List.Item>
                )}
            />
        </div>
    )
}
