import React from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';

export const NavigationButtons = ({ setCurrentPage, currentPage, totalPages, groupValues, questionsPerPage, questionnaireAnswered }) => {
    const handleNextPage = () => {
        if (!checkIfAllQuestionsAnswered() && !questionnaireAnswered) {
            message.error('Please answer all questions before proceeding to the next page');
            return;
        }
        setCurrentPage(prevPage => prevPage + 1);
        window.scrollTo(0, 0);
    };

    const handlePrevPage = () => {
        setCurrentPage(prevPage => prevPage - 1);
        window.scrollTo(0, 0);
    };

    const checkIfAllQuestionsAnswered = () => {

        const startIdx = (currentPage - 1) * questionsPerPage;
        for (let key = 0; key < questionsPerPage; key++) {
            const indexElement = startIdx + key;
            if (!groupValues.hasOwnProperty(indexElement) || groupValues[indexElement] === undefined) {
                return false;
            }
        }
        return true;

    };

    return (
        <>
            <button
                className='flex items-center mx-4 duration-200 hover:-translate-x-2 disabled:text-gray-300 disabled:translate-x-0'
                onClick={handlePrevPage}
                disabled={currentPage === 1}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                </svg>
                Previous
            </button>
            <button
                className='flex items-center mx-4 duration-200 hover:translate-x-2 disabled:text-gray-300 disabled:translate-x-0'
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
            >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                </svg>
            </button>
        </>
    );
};

NavigationButtons.propTypes = {
    setCurrentPage: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    groupValues: PropTypes.object.isRequired,
    questionsPerPage: PropTypes.number.isRequired,
    questionnaireAnswered: PropTypes.bool.isRequired,
};

