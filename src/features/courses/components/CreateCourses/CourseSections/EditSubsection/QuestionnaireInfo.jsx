import React from 'react'
import { Popover } from 'antd';

export const QuestionnaireInfo = () => {
    const content = (
        <div className='flex gap-5'>
            <div>
                <p className='mb-2 font-medium'>Standard</p>
                <img src="https://res.cloudinary.com/dnmlszkih/image/upload/v1717000390/pifgkuzlqitptygtho9y.png" className='w-[26rem] h-auto ' alt="" />
            </div>

            <div>
                <p className='mb-2 font-medium'>Scaling</p>
                <img src="https://res.cloudinary.com/dnmlszkih/image/upload/v1717000390/vcnrk5cxzkgcjfcfzj0a.png" className='w-[26rem] h-auto ' alt="" />
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