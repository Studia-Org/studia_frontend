import React, { useState } from 'react'
import { Sidebar } from '../../../shared/elements/Sidebar';
import TimelineComponent from '../components/TimelineComponent';
import { Navbar } from '../../../shared/elements/Navbar';
import "typeface-roboto";


const Timeline = () => {
    return (
        <div className='rounded-tl-3xl bg-[#e7eaf886] w-full '>
            <div className='pt-9 pl-12 font-bold text-2xl  h-[95%] w-full '>
                <div className='bg-[#f7f7f7] p-4 pb-0  rounded-tl-2xl  h-full shadow-lg w-full '>
                    <TimelineComponent />
                </div>
            </div>
        </div>

    )

}

export default Timeline