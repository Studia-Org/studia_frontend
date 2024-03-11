import { Popover, List, Typography } from 'antd'
import React, { useState, useEffect } from 'react'

export const CheckSubsectionErrors = ({ subsection }) => {
    const [color, setColor] = useState('text-yellow-400')
    const [errorsList, setErrorsList] = useState([])

    useEffect(() => {
        setColor('text-yellow-400');
        checkCompletion();
    }, [subsection]);

    const dangerSvg = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-5 h-5 text-red-500`}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
    )

    const warningSvg = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-5 h-5 text-yellow-400`}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
    )

    const checkCompletion = () => {
        let newErrorsList = [];

        switch (subsection.type) {

            case 'questionnaire':
                if (!subsection.start_date && !subsection.end_date) {
                    newErrorsList.push({ svg: dangerSvg, comment: 'Start and end date are missing' });
                    setColor('text-red-500')
                }
                if (Object.keys(subsection.activity.categories).length === 0) {
                    newErrorsList.push({ svg: dangerSvg, comment: 'No categories' });
                    setColor('text-red-500')
                }
                if (subsection.questionnaire.attributes.Options.questionnaire.questions.length === 0) {
                    newErrorsList.push({ svg: dangerSvg, comment: 'No questions' });
                    setColor('text-red-500')
                }
                if (Object.keys(subsection.questionnaire.attributes.Options.questionnaire.correctAnswers).length !==
                    subsection.questionnaire.attributes.Options.questionnaire.questions
                        .filter(question => question.options !== 'open-ended-long' && question.options !== 'open-ended-short').length) {
                    if (subsection.questionnaire.attributes.autocorrect === true) {
                        newErrorsList.push({ svg: warningSvg, comment: 'Not all questions have correct answers' });
                    }
                }
                break;

            case 'task':
                if (!subsection.start_date && !subsection.end_date) {
                    newErrorsList.push({ svg: dangerSvg, comment: 'Start and end date are missing' });
                    setColor('text-red-500')
                }
                if (Object.keys(subsection.activity.categories).length === 0) {
                    newErrorsList.push({ svg: dangerSvg, comment: 'No categories' });
                    setColor('text-red-500')
                }
                if (subsection.description === '' || subsection.description === null) {
                    newErrorsList.push({ svg: warningSvg, comment: 'No description' });
                }
                if (subsection.content === '' || subsection.content === null) {
                    newErrorsList.push({ svg: warningSvg, comment: 'No content' });
                }
                break;

            case 'peerReview':
                if (!subsection.start_date && !subsection.end_date) {
                    newErrorsList.push({ svg: dangerSvg, comment: 'Start and end date are missing' });
                    setColor('text-red-500')
                }
                if (Object.keys(subsection.activity.categories).length === 0) {
                    newErrorsList.push({ svg: dangerSvg, comment: 'No categories' });
                    setColor('text-red-500')
                }
                if (Object.keys(subsection.activity?.PeerReviewRubrica).length < 2) {
                    newErrorsList.push({ svg: dangerSvg, comment: 'Peer review rubric is empty' });
                    setColor('text-red-500')
                }
                if (subsection.activity?.task_to_review === '' || subsection.activity?.task_to_review === null) {
                    newErrorsList.push({ svg: dangerSvg, comment: 'No task to review' });
                    setColor('text-red-500')
                }
                if (subsection.description === '' || subsection.description === null) {
                    newErrorsList.push({ svg: warningSvg, comment: 'No description' });
                }
                if (subsection.content === '' || subsection.content === null) {
                    newErrorsList.push({ svg: warningSvg, comment: 'No content' });
                }
                break;

            case 'forum':
                if (!subsection.start_date && !subsection.end_date) {
                    newErrorsList.push({ svg: dangerSvg, comment: 'Start and end date are missing' });
                    setColor('text-red-500')
                }
                if (Object.keys(subsection.activity.categories).length === 0) {
                    newErrorsList.push({ svg: dangerSvg, comment: 'No categories' });
                    setColor('text-red-500')
                }
                if (subsection.description === '' || subsection.description === null) {
                    newErrorsList.push({ svg: warningSvg, comment: 'No description' });
                }
                if (subsection.content === '' || subsection.content === null) {
                    newErrorsList.push({ svg: warningSvg, comment: 'No content' });
                }
                break;
            default:
                break;
        }

        setErrorsList(newErrorsList);
    }


    const content = (
        <div>
            <p className='mb-2'>Complete it or you will not be able to create a course.</p>
            <List
                bordered
                dataSource={errorsList}
                renderItem={(item) => (
                    <List.Item>
                        <div className='flex items-center gap-2'>
                            {item.svg} {item.comment}
                        </div>
                    </List.Item>
                )}
            />
        </div>
    )


    return (
        <>
            {
                errorsList.length > 0 &&
                (
                    <Popover content={content} title="Subsection is incomplete">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className={`w-5 h-5 ${color}`}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>
                    </Popover>
                )
            }
        </>
    )
}
