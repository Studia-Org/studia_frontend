import React, { useState } from 'react'
import { PageContent, SequenceDevelop, SequenceDevelopNoMSLQForum } from './ConstantsSubsectionItems';
import { motion } from 'framer-motion';
import { ForethoughtPage, PerformancePage, SelfReflectionPage } from './ConstantsSubsectionItems'


export const SubsectionItems = ({ setCreateCourseSectionsList, sectionToEdit}) => {
    const [currentPage, setCurrentPage] = useState('first');
    const [addItemsOrPreMade, setAddItemsOrPreMade] = useState('addItems');

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

    function renderPage() {
        switch (currentPage) {
            case 'first':
                return <ForethoughtPage  setCreateCourseSectionsList={setCreateCourseSectionsList} sectionToEdit={sectionToEdit} />
            case 'second':
                return <PerformancePage  setCreateCourseSectionsList={setCreateCourseSectionsList} sectionToEdit={sectionToEdit}/>
            case 'third':
                return <SelfReflectionPage  setCreateCourseSectionsList={setCreateCourseSectionsList} sectionToEdit={sectionToEdit}/>
            default:
                return <ForethoughtPage setCreateCourseSectionsList={setCreateCourseSectionsList} sectionToEdit={sectionToEdit}/>
        }
    }

    const handleContinue = () => {
        if (currentIndex < pages.length - 1) {
            handlePageChange(pages[currentIndex + 1]);
        }
    };

    return (
        <>
            <div className="relative bg-white rounded-md shadow-md p-5 font-medium text-base  mt-5 mr-16 mb-10">
                <div className="absolute top-0 h-[5rem] border-b-[4px] border-[#45406f]  bg-[#7468c3] w-full left-0 rounded-t-md flex items-center">
                    <button onClick={() => setAddItemsOrPreMade('addItems')} className={`${addItemsOrPreMade === 'addItems' ? ' bg-[#45406f]' : ''} font-medium inline-block px-4 ml-4 hover:bg-[#45406f] duration-100  mt-[2.5rem] rounded-t-lg text-white p-2`}>Add items to the sequence</button>
                    <button onClick={() => setAddItemsOrPreMade('preMade')} className={`${addItemsOrPreMade === 'preMade' ? ' bg-[#45406f]' : ''} font-medium inline-block ml-2 px-4 hover:bg-[#45406f] duration-100  mt-[2.5rem] rounded-t-lg text-white p-2`}>Pre-Made sequences</button>
                </div>
                {
                    addItemsOrPreMade === 'addItems' ?
                        <>
                            <motion.div id='course-motion-div'
                                className=' '
                                initial="hidden" animate="visible" exit="hidden" variants={variants} transition={transition}>
                                {renderPage()}
                            </motion.div>
                            <div className="flex justify-between mt-10 text-sm">
                                <button
                                    onClick={handleBack}
                                    className={`${currentIndex > 0 ? 'bg-[#45406f] p-2 rounded-md hover:-translate-x-2 duration-150  flex items-center gap-1 px-3 text-white' : ''} `}
                                    disabled={currentIndex === 0}>
                                    {
                                        !(currentIndex === 0) &&
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                                        </svg>
                                    }
                                    Back
                                </button>
                                <button
                                    onClick={handleContinue}
                                    className={`${currentIndex < pages.length - 1 ? 'bg-[#45406f] flex items-center gap-1 text-white px-3 hover:translate-x-2 duration-150' : ''
                                        } p-2 rounded-md`}
                                    disabled={currentIndex === pages.length - 1}>
                                    Continue
                                    {
                                        !(currentIndex === pages.length - 1) &&
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                                        </svg>
                                    }
                                </button>
                            </div>
                        </>
                        :
                        <>
                            <p className='mt-20 mb-5'>Sequences</p>
                            <motion.div id='course-motion-div'
                                className='space-y-5'
                                initial="hidden" animate="visible" exit="hidden" variants={variants} transition={transition}>
                                <SequenceDevelop />
                                <SequenceDevelopNoMSLQForum />
                            </motion.div>
                            <p className='text-xs font-normal  text-gray-400 mt-5 ml-1'>You can edit all the sequences for customization when they are added on a section.</p>
                        </>
                }
            </div >
        </>
    );
}
