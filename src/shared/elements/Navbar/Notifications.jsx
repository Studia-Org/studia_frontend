import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Popover, Empty, message } from 'antd';
import { API } from '../../../constant';
import { getToken } from '../../../helpers';
import { NotificationsCard } from './NotificationsCard';
import { useAuthContext } from '../../../context/AuthContext';
import { useTranslation } from 'react-i18next';
export const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuthContext();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const content = (
        <div className='w-[25rem] h-[25rem] max-w-[90vw] overflow-y-auto overflow-x-hidden px-3'>
            <hr className='mb-3' />
            {
                notifications?.length > 0 ?
                    (
                        <div className='space-y-3 '>
                            {notifications && notifications.map(notification => (
                                <NotificationsCard key={notification.id} notification={notification} setNotifications={setNotifications} />
                            ))}
                        </div>
                    )
                    :
                    (
                        <div className='flex items-center justify-center w-full h-full'>
                            <Empty description={'There are no notifications'} />
                        </div>
                    )
            }
        </div>
    );

    async function readAllNotifications() {
        setLoading(true);
        try {
            notifications.forEach(async (notification) => {
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
            })
        } catch (e) {
            setLoading(false);
            message.error('Something went wrong');
        }
        setLoading(false);
    }

    async function fetchNotifications() {
        const response = await fetch(`${API}/users/me?populate=notifications`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
        });
        const data = await response.json();
        const filteredNotifications = data.notifications
            .sort((a, b) => {
                const aReadStatus = a.readJSON[user.id] || false;
                const bReadStatus = b.readJSON[user.id] || false;
                if (aReadStatus !== bReadStatus) {
                    return aReadStatus ? 1 : -1;
                } else {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                }
            })
            .slice(0, 10);
        setNotifications(filteredNotifications);
    }


    useEffect(() => {
        fetchNotifications()
    }, [])

    const contentTitle = (
        <>
            <div className='flex items-center justify-between max-w-[90vw]'>
                <h1 className='text-base font-medium'>{t("NAVBAR.NOTIFICATIONS.notifications")}</h1>
                <Button className='flex items-center justify-center' shape="circle" onClick={() => { document.getElementById("notification-button").click(); navigate('/app/settings') }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </Button>
            </div>
        </>
    )



    return (
        <Popover content={content} className='max-w-[100vw]' title={contentTitle} trigger="click">
            <Button id='notification-button' shape="circle" onClick={readAllNotifications}>
                {user && <Badge count={notifications?.filter((noti) => noti.readJSON[user.id] === false)?.length} className=''>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                </Badge>}
            </Button>
        </Popover>
    )
}
