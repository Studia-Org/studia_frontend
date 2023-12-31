import React, { useState } from 'react';
import { TbRobot } from 'react-icons/tb'
import { MdSend } from 'react-icons/md';
import { IconContext } from "react-icons";
import { FiChevronDown } from 'react-icons/fi';


import '../../styles/chatBotStyles.css'
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

export const Chatbot = () => {
    const API_KEY = process.env.REACT_APP_API_KEY;

    const systemMessage = { 
        "role": "system", "content": "Explain things like you're talking to a software professional with 2 years of experience."
    }


    const [isExpanded, setIsExpanded] = useState(false);
    const [messages, setMessages] = useState([
        {
            message: "Hello, I'm ChatGPT! Ask me anything!",
            sentTime: "just now",
            sender: "ChatGPT"
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = async (message) => {
        const newMessage = {
            message,
            direction: 'outgoing',
            sender: "user"
        };

        const newMessages = [...messages, newMessage];

        setMessages(newMessages);
        setIsTyping(true);
        await processMessageToChatGPT(newMessages);
    };

    async function processMessageToChatGPT(chatMessages) { 

        let apiMessages = chatMessages.map((messageObject) => {
            let role = "";
            if (messageObject.sender === "ChatGPT") {
                role = "assistant";
            } else {
                role = "user";
            }
            return { role: role, content: messageObject.message }
        });

        const apiRequestBody = {
            "model": "gpt-3.5-turbo",
            "messages": [
                systemMessage,  // The system message DEFINES the logic of our chatGPT
                ...apiMessages // The messages from our chat with ChatGPT
            ]
        }

        await fetch("https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(apiRequestBody)
            }).then((data) => {
                return data.json();
            }).then((data) => {
                setMessages([...chatMessages, {
                    message: data.choices[0].message.content,
                    sender: "ChatGPT"
                }]);
                setIsTyping(false);
            });
    }

    return (
        <div data-dial-init className="fixed right-10 bottom-10 ">
            <div
                id="speed-dial-menu-dropdown"
                className={`bg-white shadow rounded-2xl transform scale-0 opacity-0 mb-5 h-3 w-[24rem]  duration-200 ${isExpanded ? 'scale-100 h-[36rem] w-[24rem] opacity-100' : ''
                    }`}
            >

                <MainContainer className='shadow-2xl rounded-2xl'>
                    <ChatContainer className=''>
                        <MessageList
                            
                            scrollBehavior="smooth"
                            typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
                        >
                            {messages.map((message, i) => {
                                return <Message className='' key={i} model={message} />
                            })}
                        </MessageList>
                        <MessageInput placeholder="Type message here" onSend={handleSend} />
                    </ChatContainer>
                </MainContainer>
            </div>
            <button
                type="button"
                data-dial-toggle="speed-dial-menu-dropdown"
                aria-controls="speed-dial-menu-dropdown"
                aria-expanded={isExpanded}
                className="flex shadow-lg items-center transition  justify-center ml-auto text-white bg-blue-600 rounded-full w-14 h-14 hover:bg-blue-600 hover-scale active-scale  "
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {!isExpanded ? <TbRobot size={26}/> : <FiChevronDown size={26} />  }
                <span className="sr-only"></span>
            </button>
        </div>
    );
};
