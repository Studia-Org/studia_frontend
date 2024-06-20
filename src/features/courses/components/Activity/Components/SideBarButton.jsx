import { Button, Drawer } from 'antd';
import React, { useState } from 'react'
import { AccordionNavigator } from './ActivityTask/AccordionNavigator';

export const SideBarButton = ({ subsectionsCompleted }) => {
    const [visible, setVisible] = useState(false);
    return (
        <nav className="absolute top-[calc(8rem+7px)] right-0 ">
            <Button
                className="absoulte flex items-center h-14  z-10 rounded-[200px] group
                rounded-r-none p-5 transition-all bg-[#0072CE]  hover:px-6 duration-200"
                onClick={() => setVisible(true)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="absolute w-5 h-5 left-2 group-hover:scale-110">
                    <path fillRule="evenodd"
                        d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 
                            0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
                        clipRule="evenodd" />
                </svg>
            </Button>
            <Drawer
                title="Course Menu"
                size='large'
                className='px-1 '
                placement="right"
                open={visible}
                onClose={() => setVisible(false)}
            >
                <aside className='flex flex-col mt-5 gap-y-3'>
                    <AccordionNavigator subsectionsCompleted={subsectionsCompleted} />
                </aside>
            </Drawer>
        </nav>
    );
}
