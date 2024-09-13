import React, { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { Webchat, WebchatProvider, useClient } from '@botpress/webchat';
import { buildTheme } from '@botpress/webchat-generator';
import { Drawer } from 'antd';
import '../styles/webchatCustomCss.css';

const themeConfig = buildTheme({
    themeName: 'eggplant',
    themeColor: '#6366f1',
});

export const WebchatChatbot = () => {
    const [open, setOpen] = useState(false);
    const { user } = useAuthContext();
    const client = useClient({ clientId: '8a2495e6-ad0d-46ac-a82c-56b8c0275fdd' });
    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };


    const configuration = {
        botName: 'Uptitude Bot',
        botAvatar: '../logo.png',
        botDescription: 'Hi! 👋  Welcome to uptitude webchat, your personalized assistant powered by your data for all things learning.',
        email: {
            title: 'uptitudeapp@gmail.com',
            link: 'mailto:uptitudeapp@gmail.com',
        }
    };

    return (
        <>
            <button
                type="button"
                data-dial-toggle="speed-dial-menu-dropdown"
                aria-controls="speed-dial-menu-dropdown"
                className="fixed right-4 bottom-4 items-center justify-center ml-auto w-[3.2rem] h-[3.2rem] text-white transition !bg-[#3c3c3c] rounded-full shadow-xl hover:!bg-[#4f4f4f] duration-100 hover-scale active-scale"
                onClick={showDrawer}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mx-auto">
                    <path fillRule="evenodd" d="M12 2.25c-2.429 0-4.817.178-7.152.521C2.87 3.061 1.5 4.795 1.5 6.741v6.018c0 1.946 1.37 3.68 3.348 3.97.877.129 1.761.234 2.652.316V21a.75.75 0 0 0 1.28.53l4.184-4.183a.39.39 0 0 1 .266-.112c2.006-.05 3.982-.22 5.922-.506 1.978-.29 3.348-2.023 3.348-3.97V6.741c0-1.947-1.37-3.68-3.348-3.97A49.145 49.145 0 0 0 12 2.25ZM8.25 8.625a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Zm2.625 1.125a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" clipRule="evenodd" />
                </svg>
            </button>
            <Drawer onClose={onClose} className='' open={open} width={'650px'} headerStyle={{ display: 'none' }}>
                <WebchatProvider
                    configuration={configuration}
                    theme={themeConfig.theme}
                    client={client}
                    userData={{
                        "user_id": (user?.id).toString(),
                        "company": "Uptitude"
                    }}>
                    <style>{themeConfig.style}</style>
                    <Webchat />
                </WebchatProvider>
            </Drawer>
        </>
    );
};
