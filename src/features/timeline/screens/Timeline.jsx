import React, { useState } from 'react'
import { Sidebar } from '../../../shared/elements/Sidebar';
import TimelineComponent from '../components/TimelineComponent';
import { Navbar } from '../../../shared/elements/Navbar';
import "typeface-roboto";


const Timeline = () => {
    return (
        <div className='h-screen w-screen bg-white '>
            <Navbar />
            <div className='flex flex-wrap-reverse h-[calc(100%-8rem)] w-[calc(100%-30vmin)]  sm:flex-nowrap bg-white'>
                <Sidebar section={'timeline'} />
                <div className='rounded-tl-3xl bg-[#e7eaf886] max-w-full max-h-full'>
                    <div className='pt-9 pl-12 h-full font-bold text-2xl'>
                        <div className='bg-[#f7f7f7] p-4 pb-0 h-full rounded-tl-2xl  shadow-lg'>
                            <TimelineComponent />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Timeline