import React from 'react'

export const NavigationButtons = ({ setCurrentPage, currentPage, totalPages }) => {
    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
        window.scrollTo(0, 0);
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
        window.scrollTo(0, 0);
    };
    return (
        <>
            <button className='flex items-center mx-4 duration-200 hover:-translate-x-2 disabled:text-gray-300 disabled:translate-x-0'
                onClick={handlePrevPage} disabled={currentPage === 1}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                </svg>
                Previous
            </button>
            <button className='flex items-center mx-4 duration-200 hover:translate-x-2 disabled:text-gray-300 disabled:translate-x-0'
                onClick={handleNextPage} disabled={currentPage === totalPages}>
                Next
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                </svg>
            </button>
        </>
    )
}
