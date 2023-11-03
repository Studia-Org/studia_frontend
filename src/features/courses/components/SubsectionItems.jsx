import React, { useState } from 'react'

const PageContent = {
    first: () => (
        <>
            <p className='mt-8 mb-5'>Forethought</p>
            <div className='flex items-center p-5 border rounded-xl bg-gray-50'>
                <div className='px-3 py-3 bg-[#15803d] rounded-md flex items-center justify-center '>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                        <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                        <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className='ml-5'>
                    <p className='text-base font-normal'>Plannification questionnaire</p>
                    <p className='text-sm text-gray-500 font-normal'>A planning questionnaire is a valuable tool for gathering essential information to create effective plans. This questionnaire helps individuals or teams define goals, identify resources, and establish a roadmap for successful execution. </p>
                </div>
                <div className='mx-3 ml-auto'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6  text-[#45406f]">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
            <div className='flex items-center p-5 border rounded-xl bg-gray-50 mt-5'>
                <div className='px-3 py-3 bg-[#15803d] rounded-md flex items-center justify-center '>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                        <path d="M5.625 3.75a2.625 2.625 0 100 5.25h12.75a2.625 2.625 0 000-5.25H5.625zM3.75 11.25a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75zM3 15.75a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zM3.75 18.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75z" />
                    </svg>
                </div>
                <div className='ml-5'>
                    <p className='text-base font-normal'>MSLQ Questionnaire</p>
                    <p className='text-sm text-gray-500 font-normal'>The Motivated Strategies for Learning Questionnaire (MSLQ) is a widely-used tool in education for assessing students' motivation and learning strategies. This questionnaire aims to understand the factors that influence students' engagement and achievement.</p>
                </div>
                <div className='mx-3 ml-auto'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#45406f]">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
            <div className='flex items-center p-5 border rounded-xl bg-gray-50 mt-5'>
                <div className='px-3 py-3 bg-[#15803d] rounded-md flex items-center justify-center '>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                        <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
                        <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                    </svg>
                </div>
                <div className='ml-5'>
                    <p className='text-base font-normal'>Task statement</p>
                    <p className='text-sm text-gray-500 font-normal'>Define the essential details of the task, including its objectives, scope, and expected outcomes. Task statements are designed to provide clear guidance to individuals or teams, ensuring that they understand their responsibilities and can execute the task effectively. </p>
                </div>
                <div className='mx-3 ml-auto'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#45406f]">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
        </>
    ),
    second: () => (
        <>
            <p className='mt-8 mb-5'>Performance</p>
            <div className='flex items-center p-5 border rounded-xl bg-gray-50 mt-5'>
                <div className='px-3 py-3 bg-[#f59e0b] rounded-md flex items-center justify-center '>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 text-white">
                        <path fillRule="evenodd" d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13zm10.857 5.691a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>

                </div>
                <div className='ml-5'>
                    <p className='text-base font-normal'>Task implementation</p>
                    <p className='text-sm text-gray-500 font-normal'>Implementation of the task, during this phase, the planned tasks and activities are put into action. It involves carrying out the necessary actions to achieve the project or task objectives defined in the planning phase.</p>
                </div>
                <div className='mx-3 ml-auto'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#45406f]">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
        </>
    ),
    third: () => (
        <>
            <p className='mt-8 mb-5'>Self-Reflection</p>
            <div className='flex items-center p-5 border rounded-xl bg-gray-50 mt-5'>
                <div className='px-3 py-3 bg-[#dc2626] rounded-md flex items-center justify-center '>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 text-white">
                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
                    </svg>
                </div>
                <div className='ml-5'>
                    <p className='text-base font-normal'>Peer review</p>
                    <p className='text-sm text-gray-500 font-normal'>This review method aims to provide constructive feedback, validate the quality and accuracy of the work, and ensure it meets established standards or criteria.</p>
                </div>
                <div className='mx-3 ml-auto'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#45406f]">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>

            <div className='flex items-center p-5 border rounded-xl bg-gray-50 mt-5'>
                <div className='px-3 py-3 bg-[#dc2626] rounded-md flex items-center justify-center '>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 text-white">
                        <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm4.75 11.25a.75.75 0 001.5 0v-2.546l.943 1.048a.75.75 0 101.114-1.004l-2.25-2.5a.75.75 0 00-1.114 0l-2.25 2.5a.75.75 0 101.114 1.004l.943-1.048v2.546z" clipRule="evenodd" />
                    </svg>

                </div>
                <div className='ml-5'>
                    <p className='text-base font-normal'>Final delivery</p>
                    <p className='text-sm text-gray-500 font-normal'>Final delivery of the task.</p>
                </div>
                <div className='mx-3 ml-auto'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#45406f] ">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
        </>
    ),
};



export const SubsectionItems = () => {
    const [currentPage, setCurrentPage] = useState('first');
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

    const handleContinue = () => {
        if (currentIndex < pages.length - 1) {
            handlePageChange(pages[currentIndex + 1]);
        }
    };

    return (
        <>
            <p className="font-medium">Add items to the sequence</p>
            <div className="relative bg-white rounded-md shadow-md p-5 font-medium text-base  mt-5 mr-16 ">
                <div className="absolute top-0 h-[2rem] bg-[#45406f] w-full left-0 rounded-t-md"></div>
                {PageContent[currentPage]()}
                <div className="flex justify-between mt-10">
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
            </div>
        </>
    );
}
