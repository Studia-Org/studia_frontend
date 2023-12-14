import React from 'react'
import { Badge } from 'antd';
import { useNavigate } from 'react-router-dom';
import { API } from '../../../constant';
import { getToken } from '../../../helpers';

export const NotificationsCard = ({ notification, setNotifications }) => {
    const navigate = useNavigate();

    const markNotificationAsRead = (notificationId) => {
        setNotifications(prevNotifications =>
            prevNotifications.map(notification =>
                notification.id === notificationId ? { ...notification, read: true } : notification
            )
        );
    };

    async function handleNotificationClick() {
        markNotificationAsRead(notification.id);
        switch (notification.type) {
            case 'qualifications':
                navigate('/app/qualifications')
                break;
            case 'forum':
                navigate('/app/courses')
                break;
            default:
                break;
        }
        await fetch(`${API}/notifications/${notification.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,

            },
            body: JSON.stringify({
                data: {
                    read: true
                }
            })
        });
    }

    if (notification.read === false) {
        return (
            <>
                <Badge dot className='w-full'>
                    <div onClick={() => handleNotificationClick()} className='hover:bg-gray-50 rounded-md p-3 border w-full cursor-pointer'>
                        <p>{notification.content}</p>
                    </div>
                </Badge>
            </>
        )
    } else {
        return (
            <div className='hover:bg-gray-50 rounded-md p-3 border w-full'>
                <p>{notification.content}</p>
            </div>
        )
    }

}