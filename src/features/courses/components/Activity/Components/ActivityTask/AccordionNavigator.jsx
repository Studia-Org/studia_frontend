import React, { useState } from 'react'
import { Badge, Collapse } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { useCourseContext } from '../../../../../../context/CourseContext';
import { getIcon } from '../../../CoursesInside/helpers';
import { useAuthContext } from '../../../../../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

export const AccordionNavigator = ({ subsectionsCompleted }) => {
    const navigate = useNavigate();
    const { Panel } = Collapse;
    const { user } = useAuthContext();
    const [sectionNumber, setSectionNumber] = useState(1);
    const { course, subsectionSelected, sectionSelected, setSectionSelected, setSubsectionSelected, setActivitySelected } = useCourseContext();
    let { courseId } = useParams();


    function selectFaseSectionContent(str) {
        if (str === "forethought") {
            return (
                <>
                    <Badge color='#15803d' count='Forethought' />

                </>
            );
        } else if (str === "performance") {
            return (
                <>
                    <Badge color='#faad14' count='Performance' />

                </>
            );
        } else if (str === "self-reflection") {
            return (
                <>
                    <Badge color='#dc2626' count='Self-reflection' />

                </>
            );
        }
    }

    function switchSVG(str) {
        switch (str) {
            case 'peerReview':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                        <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                    </svg>

                )
            case 'task':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                        <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
                        <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                    </svg>
                )
            case 'forum':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                        <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
                        <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                    </svg>
                )
            case 'questionnaire':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                        <path d="M5.625 3.75a2.625 2.625 0 100 5.25h12.75a2.625 2.625 0 000-5.25H5.625zM3.75 11.25a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75zM3 15.75a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zM3.75 18.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75z" />
                    </svg>
                )
            default:
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                        <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
                        <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                    </svg>
                )
        }
    }

    function handleClickSubsection(subsection, section) {
        setSubsectionSelected(subsection);
        setSectionSelected(section);
        setActivitySelected({})
        navigate(`/app/courses/${courseId}`);
    }

    function RenderCourseInsideSectionContent(
        subsection,
        titulo,
        prevSubsectionFinished,
        isFirstSubsection,
        index
    ) {
        const selectedSubsection = subsection.id === subsectionSelected?.id;
        const dateToday = new Date();
        const startDate = new Date(subsection.attributes.start_date);
        const isBeforeStartDate = dateToday < startDate;
        const disableButton = isBeforeStartDate || (!isFirstSubsection && !prevSubsectionFinished);

        const buttonClassName = `flex items-center mb-1 font-medium ${!disableButton ? 'text-gray-900 hover:translate-x-2' : 'text-gray-500'
            } line-clamp-2 w-3/4 duration-200 text-left`;

        if (user?.role_str === 'professor' || user?.role_str === 'admin') {
            return (
                <li className="flex items-center mt-8 mb-10 ml-8" key={index}>
                    <span className={` absolute flex items-center justify-center w-8 h-8 bg-indigo-500 rounded-full -left-4  ring-white `}>
                        {switchSVG(subsection.attributes.activity?.data?.attributes.type)}
                    </span>
                    <button
                        onClick={() => { handleClickSubsection(subsection, titulo) }}
                        className="flex items-center w-3/4 mb-1 font-medium text-left text-gray-900 duration-200 line-clamp-2 hover:translate-x-2"
                    >
                        {" "}
                        {
                            subsection.attributes.activity?.data?.attributes.type === 'questionnaire' ? subsection.attributes.questionnaire.data.attributes.Title : subsection.attributes.title
                        }
                        {
                            selectedSubsection && (
                                <span class="relative flex h-3 w-3 ml-3">
                                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span class="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                                </span>
                            )
                        }
                    </button>
                </li>
            )
        } else {
            return (
                <li className="flex items-center mt-8 mb-10 ml-8" key={index}>
                    {getIcon(subsection, subsectionsCompleted, isFirstSubsection, prevSubsectionFinished)}
                    <button
                        onClick={() => handleClickSubsection(subsection, titulo)}
                        className={buttonClassName}
                        disabled={disableButton}
                    >
                        {subsection.attributes.activity?.data?.attributes.type === 'questionnaire' ? subsection.attributes.questionnaire.data.attributes.Title : subsection.attributes.title}
                    </button>
                    {selectFaseSectionContent(subsection.attributes.fase)}
                </li>
            );
        }
    }

    function RenderCourseSections({ section, sectionNumber }) {
        let prevSubsectionFinished = false;
        const subsectionIdsCompleted = subsectionsCompleted.map(
            (subsection) => subsection.id
        );
        const filteredSubsections = section.attributes.subsections.data.filter(
            (subsection) => subsectionIdsCompleted.includes(subsection.id)
        );
        let percentageFinished = (
            (filteredSubsections.length /
                section.attributes.subsections.data.length) *
            100
        ).toFixed(0);
        return (
            <Collapse
                expandIcon={({ isActive }) => <CaretRightOutlined className='absolute top-0 bottom-0 right-5 ' rotate={isActive ? 90 : 0} />}
                className='mt-5 bg-gray-50'
                expandIconPosition="right"
                defaultActiveKey={(sectionSelected === section.attributes.title) && sectionNumber.toString()}
            >
                <Panel
                    header={
                        <div className='flex items-center py-4 '>
                            <div className='flex items-center ml-2'>
                                {
                                    user?.role_str === 'student' &&
                                    <div className='flex items-center w-16 h-16 text-sm xl:w-20 xl:h-20'>
                                        <CircularProgressbar className='text-sm font-medium ' value={percentageFinished} text={`${percentageFinished}%`} styles={buildStyles({
                                            textSize: '22px',
                                            pathColor: '#6366f1',
                                            textColor: 'black',
                                        })} />
                                    </div>
                                }
                            </div>
                            <div className='flex flex-col w-full text-left ml-9'>
                                <p className='mb-1 text-sm'>Section {sectionNumber}</p>
                                <h2 className='w-3/4 text-lg font-medium text-left line-clamp-2'>
                                    {section?.attributes ? section.attributes.title : section.name}
                                </h2>
                            </div>
                        </div>
                    }
                    key={sectionNumber}
                >
                    <ol className="relative ml-10 text-base border-l border-gray-300 border-dashed">
                        {section.attributes.subsections.data.map((subsection, index) => {
                            let isFirstSubsection = false;
                            if (sectionNumber === 1 && index === 0) {
                                isFirstSubsection = true;
                            }
                            const content = RenderCourseInsideSectionContent(subsection, section.attributes.title, prevSubsectionFinished, isFirstSubsection);
                            prevSubsectionFinished = subsectionsCompleted.some(subsectionTemp => subsectionTemp.id === subsection.id);
                            return content;
                        })}
                    </ol>
                </Panel>
            </Collapse>
        )
    }

    return (
        <div className='w-full p-5 bg-white border rounded-lg'>
            <p className='text-xl font-semibold'>Course content</p>
            <hr className="h-px my-8 bg-gray-400 border-0"></hr>
            {
                course && course?.sections.data.map((section, index) => (
                    <RenderCourseSections key={index} section={section} sectionNumber={sectionNumber + index} />
                ))
            }
        </div>

    )
}
