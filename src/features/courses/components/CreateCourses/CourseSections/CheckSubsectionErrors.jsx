import { Popover, List, Typography } from 'antd'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export const CheckSubsectionErrors = ({ subsection, section, setSubsectionErrors, subsectionErrors }) => {
    const [color, setColor] = useState('text-yellow-400')
    const [errorsList, setErrorsList] = useState([])

    const { t } = useTranslation()

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
                    newErrorsList.push({ svg: dangerSvg, comment: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.date_missing") });
                    setColor('text-red-500')
                }
                if (Object.keys(subsection?.activity?.categories)?.length === 0) {
                    newErrorsList.push({ svg: dangerSvg, comment: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.categories_missing") });
                    setColor('text-red-500')
                }
                if (subsection.questionnaire.attributes.Options.questionnaire.questions.length === 0 && !subsection.questionnaire.attributes.Options.embedCode) {
                    newErrorsList.push({ svg: dangerSvg, comment: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.question_missing") });
                    setColor('text-red-500')
                }
                if (Object.keys(subsection.questionnaire.attributes.Options.questionnaire.correctAnswers).length !==
                    subsection.questionnaire.attributes.Options.questionnaire.questions
                        .filter(question => question.options !== 'open-ended-long' && question.options !== 'open-ended-short').length) {
                    if (subsection.questionnaire.attributes.autocorrect === true) {
                        newErrorsList.push({ svg: warningSvg, comment: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.answer_questions") });
                    }
                }
                break;

            case 'selfAssessment':
                if (!subsection.start_date && !subsection.end_date) {
                    newErrorsList.push({ svg: dangerSvg, comment: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.date_missing") });
                    setColor('text-red-500')
                }
                if (!subsection.activity?.SelfAssesmentRubrica?.length || subsection.activity?.SelfAssesmentRubrica.length < 1) {
                    newErrorsList.push({ svg: dangerSvg, comment: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.rubric_empty") });
                    setColor('text-red-500')
                }
                if (Object.keys(subsection.activity.categories).length === 0) {
                    newErrorsList.push({ svg: dangerSvg, comment: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.categories_missing") });
                    setColor('text-red-500')
                }
                if (subsection.description === '' || subsection.description === null) {
                    newErrorsList.push({ svg: warningSvg, comment: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.no_description") });
                }
                if (subsection.content === '' || subsection.content === null) {
                    newErrorsList.push({ svg: warningSvg, comment: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.no_content") });
                }
                break;
            case 'thinkAloud':
            case 'task':
            case 'reflection':
                if (!subsection.start_date && !subsection.end_date) {
                    newErrorsList.push({ svg: dangerSvg, comment: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.date_missing") });
                    setColor('text-red-500')
                }
                if (Object.keys(subsection.activity.categories).length === 0) {
                    newErrorsList.push({ svg: dangerSvg, comment: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.categories_missing") });
                    setColor('text-red-500')
                }
                if (subsection.description === '' || subsection.description === null) {
                    newErrorsList.push({ svg: warningSvg, comment: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.no_description") });
                }
                if (subsection.content === '' || subsection.content === null) {
                    newErrorsList.push({ svg: warningSvg, comment: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.no_content") });
                }
                break;

            case 'peerReview':
                if (!subsection.start_date && !subsection.end_date) {
                    newErrorsList.push({ svg: dangerSvg, comment: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.date_missing") });
                    setColor('text-red-500')
                }
                if (Object.keys(subsection.activity.categories).length === 0) {
                    newErrorsList.push({ svg: dangerSvg, comment: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.categories_missing") });
                    setColor('text-red-500')
                }
                if (Object.keys(subsection.activity?.PeerReviewRubrica).length < 2) {
                    newErrorsList.push({ svg: dangerSvg, comment: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.rubric_empty") });
                    setColor('text-red-500')
                }
                if (subsection.activity?.task_to_review === '' || subsection.activity?.task_to_review === null) {
                    newErrorsList.push({ svg: dangerSvg, comment: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.no_task") });
                    setColor('text-red-500')
                }
                if (subsection.description === '' || subsection.description === null) {
                    newErrorsList.push({ svg: warningSvg, comment: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.no_description") });
                }
                if (subsection.content === '' || subsection.content === null) {
                    newErrorsList.push({ svg: warningSvg, comment: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.no_content") });
                }
                break;

            case 'forum':
                if (!subsection.start_date && !subsection.end_date) {
                    newErrorsList.push({ svg: dangerSvg, comment: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.date_missing") });
                    setColor('text-red-500')
                }
                if (Object.keys(subsection.activity.categories).length === 0) {
                    newErrorsList.push({ svg: dangerSvg, comment: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.categories_missing") });
                    setColor('text-red-500')
                }
                if (subsection.description === '' || subsection.description === null) {
                    newErrorsList.push({ svg: warningSvg, comment: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.no_description") });
                }
                if (subsection.content === '' || subsection.content === null) {
                    newErrorsList.push({ svg: warningSvg, comment: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.no_content") });
                }
                break;
            default:
                break;
        }
        setSubsectionErrors(prevErrors => ({
            ...prevErrors,
            [subsection.id]: {
                title: subsection.title,
                section: section,
                errors: newErrorsList
                    .filter(error => error.svg === dangerSvg)
                    .map(error => error.comment)
            }
        }));
        setErrorsList(newErrorsList);
    }

    useEffect(() => {
        localStorage.setItem('subsectionErrors', JSON.stringify(subsectionErrors));
    }, [subsectionErrors]);

    const content = (
        <div>
            <p className='mb-2'>{t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.text")}</p>
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
                    <Popover content={content} title={t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.title")}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className={`min-h-[20px] min-w-[20px] max-h-[20px] max-w-[20px] ${color}`}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>
                    </Popover>
                )
            }
        </>
    )
}
