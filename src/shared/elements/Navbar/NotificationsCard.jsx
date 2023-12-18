import React, { useEffect } from 'react'
import { Badge } from 'antd';
import { useNavigate } from 'react-router-dom';
import { API } from '../../../constant';
import { getToken } from '../../../helpers';
import { useAuthContext } from '../../../context/AuthContext';

export const NotificationsCard = ({ notification, setNotifications }) => {
    const navigate = useNavigate();
    const { user } = useAuthContext()

    const markNotificationAsRead = (notificationId) => {
        setNotifications(prevNotifications =>
            prevNotifications.map(notification => {
                if (notification.id === notificationId) {
                    const updatedReadJSON = { ...notification.readJSON, [user.id]: true };
                    return { ...notification, readJSON: updatedReadJSON };
                }
                return notification;
            })
        );
    };


    async function handleNotificationClick() {
        markNotificationAsRead(notification.id);
        routeNotification(notification.type);
        await fetch(`${API}/notifications/${notification.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,

            },
            body: JSON.stringify({
                data: {
                    readJSON: { ...notification.readJSON, [user.id]: true }
                }
            })
        });
    }

    function routeNotification() {
        document.getElementById("notification-button").click();
        navigate(notification.link)
    }

    if (notification.readJSON?.[user.id] === false) {
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
            <div onClick={() => routeNotification()} className='hover:bg-gray-50 rounded-md p-3 border w-full cursor-pointer'>
                <p>{notification.content}</p>
            </div>
        )
    }

}