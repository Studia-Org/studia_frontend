import React, { useState } from 'react';
import { IconContext } from "react-icons";
import { Link } from 'react-router-dom';

import {
    FiGrid,
    FiCalendar,
    FiCheckCircle,
    FiSettings,
    FiBarChart
} from "react-icons/fi";

import { MdTimeline } from "react-icons/md";


export const Sidebar = (props) => {

    const iconProps = {
        courses: {},
        events: {},
        dashboard: {},
        qualifications: {},
        settings: {},
        timeline: {},
    };

    if (props.section === 'courses') {
        iconProps.courses = { color: 'white', size: '25px' };
    } else if (props.section === 'events') {
        iconProps.events = { color: 'white', size: '25px' };
    } else if (props.section === 'dashboard') {
        iconProps.dashboard = { color: 'white', size: '25px' };
    } else if (props.section === 'qualifications') {
        iconProps.qualifications = { color: 'white', size: '25px' };
    } else if (props.section === 'settings') {
        iconProps.settings = { color: 'white', size: '25px' };
    } else if (props.section === 'timeline') {
        iconProps.timeline = { color: 'white', size: '25px' };
    }
    function handleClick() {
        const sidebar = document.getElementById('default-sidebar');
        sidebar.style.minHeight = '100vh'
        sidebar.style.backgroundColor = 'white'
        sidebar.classList.toggle('-translate-x-full');
    }
    window.addEventListener('click', function (event) {
        if (event.target.matches('#button-sidebar') ||
            event.target.matches('#svg-sidebar') ||
            event.target.matches('#path-sidebar')
        ) return;
        if (!event.target.matches('.inline-flex')) {
            const sidebar = document.getElementById('default-sidebar');
            sidebar.style.height = 'fit-content'
            sidebar.style.backgroundColor = 'transparent'
            sidebar.classList.add('-translate-x-full');
        }
    })
    return (
        <>
            <button data-drawer-target="default-sidebar" id='button-sidebar' data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" onClick={handleClick}
                class="inline-flex z-10 items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 
                focus:outline-none focus:ring-2 focus:ring-gray-200 ">
                <span class="sr-only">Open sidebar</span>
                <svg class="w-6 h-6 " id='svg-sidebar' aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clip-rule="evenodd" id='path-sidebar' fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button>

            <aside id="default-sidebar" class="absolute top-0 left-0  z-40 w-64 md:mt-10 transition-transform -translate-x-full md:translate-x-0" aria-label="Sidebar">
                <div class="h-full px-3 py-4 overflow-y-auto ">

                    <ul className="space-y-96 font-medium py-12 ">
                        <Link to={'/app/courses'} style={{ textDecoration: "none" }}>
                            <li className={`py-3 mt-7 pl-5 hover:text-indigo-600 hover:translate-x-[5px] transition-all  rounded-lg ${Object.keys(iconProps.courses).length > 0 ? 'bg-gradient-to-r from-[#657DE9] to-[#6E66D6] rounded-lg py-3' : ''}`}>
                                <span className='flex font-semibold'>
                                    <IconContext.Provider value={iconProps.courses}>
                                        <FiGrid size={25} />
                                    </IconContext.Provider>
                                    <h2 className={`${Object.keys(iconProps.courses).length > 0 ? 'pl-2 text-white' : 'px-4'}`}>My Courses</h2>
                                </span>
                            </li>
                        </Link>

                        <Link to={'/app/calendar'} style={{ textDecoration: "none" }}>
                            <li className={`py-3 mt-7 pl-5 hover:text-indigo-600 hover:translate-x-[5px] transition-all  rounded-lg ${Object.keys(iconProps.events).length > 0 ? 'bg-gradient-to-r from-[#657DE9] to-[#6E66D6] rounded-lg py-3' : ''}`}>
                                <span className='flex font-semibold'>
                                    <IconContext.Provider value={iconProps.events}>
                                        <FiCalendar size={25} />
                                    </IconContext.Provider>
                                    <h2 className={`${Object.keys(iconProps.events).length > 0 ? 'pl-2 text-white' : 'px-4'}`}>Calendar</h2>
                                </span>
                            </li>
                        </Link>
                        <Link to={'/app/timeline'} style={{ textDecoration: "none" }}>

                            <li className={`py-3 mt-7 pl-5 hover:text-indigo-600 hover:translate-x-[5px] transition-all  rounded-lg ${Object.keys(iconProps.timeline).length > 0 ? 'bg-gradient-to-r from-[#657DE9] to-[#6E66D6] rounded-lg py-3' : ''}`}>
                                <span className='flex font-semibold'>
                                    <IconContext.Provider value={iconProps.timeline}>
                                        <MdTimeline size={25} />
                                    </IconContext.Provider>
                                    <h2 className={`${Object.keys(iconProps.timeline).length > 0 ? 'pl-2 text-white' : 'px-4'}`}>Timeline</h2>
                                </span>
                            </li>
                        </Link>
                        <Link to={'/app/dashboard'} style={{ textDecoration: "none" }}>
                            <li className={`py-3 mt-7 pl-5 hover:text-indigo-600 hover:translate-x-[5px] transition-all  rounded-lg ${Object.keys(iconProps.dashboard).length > 0 ? 'bg-gradient-to-r from-[#657DE9] to-[#6E66D6] rounded-lg py-3' : ''}`}>
                                <span className='flex font-semibold'>
                                    <IconContext.Provider value={iconProps.dashboard}>
                                        <FiBarChart size={25} />
                                    </IconContext.Provider>
                                    <h2 className={`${Object.keys(iconProps.dashboard).length > 0 ? 'pl-2 text-white' : 'px-4'}`}>Dashboard</h2>
                                </span>
                            </li>
                        </Link>
                        <Link to={'/app/qualifications'} style={{ textDecoration: "none" }}>
                            <li className={`py-3 mt-7 pl-5 hover:text-indigo-600 hover:translate-x-[5px] transition-all  rounded-lg ${Object.keys(iconProps.qualifications).length > 0 ? 'bg-gradient-to-r from-[#657DE9] to-[#6E66D6] rounded-lg py-3' : ''}`}>
                                <span className='flex align-middle font-semibold'>
                                    <IconContext.Provider value={iconProps.qualifications}>
                                        <FiCheckCircle size={25} />
                                    </IconContext.Provider>
                                    <h2 className={`${Object.keys(iconProps.qualifications).length > 0 ? 'pl-2 text-white' : 'px-4'}`}>Qualifications</h2>
                                </span>
                            </li>
                        </Link>
                        <Link to={'/app/settings'} style={{ textDecoration: "none" }}>
                            <li className={`py-3 mt-7 pl-5 hover:text-indigo-600 hover:translate-x-[5px] transition-all  rounded-lg ${Object.keys(iconProps.settings).length > 0 ? 'bg-gradient-to-r from-[#657DE9] to-[#6E66D6] rounded-lg py-3' : ''}`}>
                                <span className='flex font-semibold'>
                                    <IconContext.Provider value={iconProps.settings}>
                                        <FiSettings size={25} />
                                    </IconContext.Provider>
                                    <h2 className={`${Object.keys(iconProps.settings).length > 0 ? 'pl-2 text-white' : 'px-4'}`}>Settings</h2>
                                </span>
                            </li>
                        </Link>
                    </ul>
                </div>

            </aside>
        </>

    )
}
