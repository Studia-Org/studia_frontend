import React from 'react'
import { Popover } from 'antd';

export const ImportQuestionnaireInfo = () => {
    const content = (
        <div className='flex gap-5'>
            <div>
                <p className='mb-2 font-medium'>Copy the embed code on the input form below:</p>
                <a className='italic underline'  target="_blank" rel="noreferrer" href="https://support.microsoft.com/en-us/office/send-a-form-and-collect-responses-2eaf3294-0cff-492d-884d-a1dee909e845#:~:text=Embed%20in%20a%20webpage,your%20form%20within%20the%20document">How to obtain the embed code</a>
            </div>
        </div>
    );
    return (
        <div className='flex items-center gap-2'>
            <Popover content={content} trigger="hover">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
                </svg>
            </Popover>
        </div>
    )
}