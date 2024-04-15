import React from 'react'
import { Badge } from 'antd'


export const Header = ({ questionnaire }) => {

    return (
        <div className="bg-white rounded-md shadow-md border-t-[14px] border-[#6366f1] mb-5">
            <div className="flex flex-col w-full my-7 mx-7">
                <div className='flex items-center w-full '>
                    <div className='flex items-center w-full gap-3'>
                        <p className="text-3xl font-semibold text-black">{questionnaire.attributes.Title}</p>
                        <Badge color="#6366f1" className='ml-auto mr-10' count={new Date().toDateString()} />
                    </div>
                </div>
                <div className='flex justify-between mt-7'>
                    <p>{questionnaire.attributes.description}</p>
                </div>
            </div>
        </div>
    )
}
