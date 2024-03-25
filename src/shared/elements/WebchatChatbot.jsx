import React, { useEffect } from 'react'
import { useAuthContext } from '../../context/AuthContext';

export const WebchatChatbot = () => {
    const { user } = useAuthContext();
    useEffect(() => {
        if (user?.id) {
            const script = document.createElement('script')
            script.src = 'https://cdn.botpress.cloud/webchat/v1/inject.js'
            script.async = true
            document.body.appendChild(script)

            script.onload = () => {
                window.botpressWebChat.init({
                    "composerPlaceholder": "Chat with uptibot",
                    "botConversationDescription": "Start a conversation with the bot designed for uptitude.",
                    "botId": "8bde2552-ddb0-4513-bdd7-8f55765530fe",
                    "hostUrl": "https://cdn.botpress.cloud/webchat/v1",
                    "messagingUrl": "https://messaging.botpress.cloud",
                    "clientId": "8bde2552-ddb0-4513-bdd7-8f55765530fe",
                    "webhookId": "8a2495e6-ad0d-46ac-a82c-56b8c0275fdd",
                    "lazySocket": true,
                    "themeName": "prism",
                    "frontendVersion": "v1",
                    "showPoweredBy": true,
                    "theme": "prism",
                    "themeColor": "#2563eb",
                    "userData": {
                        "user_id": user?.id,
                        "company": "Botpress"
                    }
                });
            }
        }
    }, [user])

    return <div id="webchat" />
}



