import React, { useState } from 'react'
import { SequenceDevelop, SequenceDevelopNoMSLQForum, SequenceDevelopEducation1, SequenceDevelopEducation2 } from './ConstantsSubsectionItems';
import { motion } from 'framer-motion';
import { Badge, Tabs } from 'antd';
import { ForethoughtPage, PerformancePage, SelfReflectionPage } from './ConstantsSubsectionItems'


export const SubsectionItems = ({ setCreateCourseSectionsList, sectionToEdit, context, ref3 }) => {
    const [currentPage, setCurrentPage] = useState('first');
    const [currentPageSequence, setCurrentPageSequence] = useState(0);
    const [addItemsOrPreMade, setAddItemsOrPreMade] = useState('preMade');

    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };
    const transition = { duration: 0.3 };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const pages = ['first', 'second', 'third'];
    const currentIndex = pages.indexOf(currentPage);

    const handleBack = () => {
        if (currentIndex > 0) {
            handlePageChange(pages[currentIndex - 1]);
        }
    };

    function renderSequencesPage() {
        switch (currentPageSequence) {
            case 0:
                return (
                    <>
                        <SequenceDevelop setCreateCourseSectionsList={setCreateCourseSectionsList} sectionToEdit={sectionToEdit} />
                        <SequenceDevelopNoMSLQForum setCreateCourseSectionsList={setCreateCourseSectionsList} sectionToEdit={sectionToEdit} />
                    </>
                )
            case 1:
                return (
                    <SequenceDevelopEducation1 setCreateCourseSectionsList={setCreateCourseSectionsList} sectionToEdit={sectionToEdit} />
                )
            case 2:
                return (
                    <SequenceDevelopEducation2 setCreateCourseSectionsList={setCreateCourseSectionsList} sectionToEdit={sectionToEdit} />
                )
            default:
                return (
                    <>
                        <SequenceDevelop setCreateCourseSectionsList={setCreateCourseSectionsList} sectionToEdit={sectionToEdit} />
                        <SequenceDevelopNoMSLQForum setCreateCourseSectionsList={setCreateCourseSectionsList} sectionToEdit={sectionToEdit} />
                    </>
                )
        }
    }


    const handleContinueSequence = () => {
        if (currentPageSequence !== 2) {
            setCurrentPageSequence(currentPageSequence + 1)
        }
    }

    const handleBackSequence = () => {
        if (currentPageSequence !== 0) {
            setCurrentPageSequence(currentPageSequence - 1)
        }
    }

    const handleContinue = () => {
        if (currentIndex < pages.length - 1) {
            handlePageChange(pages[currentIndex + 1]);
        }
    };

    const items = [
        {
            key: '1',
            label: 'Forethought',
            children: <ForethoughtPage setCreateCourseSectionsList={setCreateCourseSectionsList} sectionToEdit={sectionToEdit} handleBack={handleBack} handleContinue={handleContinue} context={context} />
        },
        {
            key: '2',
            label: 'Performance',
            children: <PerformancePage setCreateCourseSectionsList={setCreateCourseSectionsList} sectionToEdit={sectionToEdit} handleBack={handleBack} handleContinue={handleContinue} context={context} />,
        },
        {
            key: '3',
            label: 'Self-Reflection',
            children: <SelfReflectionPage setCreateCourseSectionsList={setCreateCourseSectionsList} sectionToEdit={sectionToEdit} handleBack={handleBack} handleContinue={handleContinue} context={context} />,
        },
    ];

    return (
        <>
            <div ref={ref3} className="relative bg-white rounded-md shadow-md p-5 font-medium text-base  mt-5 mr-16 mb-10">
                <div className="absolute top-0 h-[5rem] border-b-[4px] border-[#45406f]  bg-[#7468c3] w-full left-0 rounded-t-md flex items-center">
                    <button onClick={() => setAddItemsOrPreMade('preMade')} className={`${addItemsOrPreMade === 'preMade' ? ' bg-[#45406f]' : ''} font-medium inline-block ml-4 px-4 hover:bg-[#45406f] duration-100  mt-[2.5rem] rounded-t-lg text-white p-2`}>Pre-Made sequences</button>
                    <button onClick={() => setAddItemsOrPreMade('addItems')} className={`${addItemsOrPreMade === 'addItems' ? ' bg-[#45406f]' : ''} font-medium inline-block px-4 ml-2 hover:bg-[#45406f] duration-100  mt-[2.5rem] rounded-t-lg text-white p-2`}>Add items to the sequence</button>
                </div>
                {
                    addItemsOrPreMade === 'addItems' ?
                        <>
                            <motion.div id='course-motion-div'
                                className='mt-16 '
                                initial="hidden" animate="visible" exit="hidden" variants={variants} transition={transition}>
                                <Tabs defaultActiveKey='1' items={items} />
                            </motion.div>
                        </>
                        :
                        <>
                            <div className='flex mt-20 '>
                                <p className='mb-5'>Sequences</p>
                                <div className='ml-auto space-x-3 flex items-center'>
                                    <Badge count={(currentPageSequence + 1) + '/3'} color='#45406f' />
                                    <button onClick={() => handleBackSequence()} className='bg-[#45406f] p-1 text-white rounded-md hover:bg-indigo-900 duration-150'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                                        </svg>

                                    </button>
                                    <button onClick={() => handleContinueSequence()} className='bg-[#45406f] p-1 text-white rounded-md hover:bg-indigo-900 duration-150'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <motion.div id='course-motion-div'
                                className='space-y-5'
                                initial="hidden" animate="visible" exit="hidden" variants={variants} transition={transition}>
                                {renderSequencesPage()}
                            </motion.div>
                            <p className='text-xs font-normal  text-gray-400 mt-5 ml-1'>You can edit all the sequences for customization when they are added on a section.</p>
                        </>
                }
            </div >
        </>
    );
}
