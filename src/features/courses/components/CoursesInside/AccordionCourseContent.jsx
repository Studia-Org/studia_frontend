import React, { useState } from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Collapse } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import '../../styles/utils.css'
import { useAuthContext } from '../../../../context/AuthContext';

export const AccordionCourseContent = ({ courseContentInformation, setCourseSubsection, setCourseSection, setForumFlag, setQuestionnaireFlag, setCourseSubsectionQuestionnaire, subsectionsCompleted }) => {
  const [sectionNumber, setSectionNumber] = useState(1);
  const { Panel } = Collapse;
  const user = useAuthContext();

  function handleSections(tituloSeccion, subsection) {
    if (
      subsection.attributes.activities?.data[0]?.attributes.type ===
      "questionnaire"
    ) {
      setQuestionnaireFlag(true);
      setCourseSubsectionQuestionnaire(
        subsection.attributes.questionnaire.data
      );
    } else {
      setQuestionnaireFlag(false);
    }
    setCourseSubsection(subsection);
    setCourseSection(tituloSeccion);
    setForumFlag(false);
  }

  function selectFaseSectionContent(str) {
    if (str === "Forethought") {
      return (
        <span className="  text-xs  font-medium w-3 h-3 rounded bg-green-400 text-white   ml-auto mr-5 "></span>
      );
    } else if (str === "Performance") {
      return (
        <span className="text-xs font-medium w-3 h-3 rounded bg-yellow-400 text-white  ml-auto mr-5  "></span>
      );
    } else if (str === "Self-reflection") {
      return (
        <span className="text-xs   font-medium w-3 h-3 rounded bg-red-400 text-white ml-auto mr-5 "></span>
      );
    }
  }

  function RenderCourseInsideSectionContent(
    subsection,
    titulo,
    prevSubsectionFinished,
    isFirstSubsection,
    index
  ) {
    const dateToday = new Date();
    const dateTemp = new Date(subsection.attributes.start_date);
    const isDoing =
      dateTemp <= dateToday &&
      dateToday <= new Date(subsection.attributes.end_date);
    const isSubsectionCompleted = subsectionsCompleted.some(
      (subsectionTemp) => subsectionTemp.id === subsection.id
    );

    if (user.user?.role.type === 'professor' || user.user?.role.type === 'admin') {
      return (
        <li className="mb-10 ml-8 mt-8 flex items-center" key={index}>
          <span className="absolute flex items-center justify-center w-8 h-8 bg-indigo-500 rounded-full -left-4  ring-white ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </span>
          <button
            onClick={() => handleSections(titulo, subsection)}
            className="flex items-center mb-1 font-medium text-gray-900 line-clamp-2 w-3/4 hover:translate-x-2 duration-200 text-left"
          >
            {" "}
            {subsection.attributes.title}
          </button>
        </li>
      )
    } else {
      return (
        <li className="mb-10 ml-8 mt-8 flex items-center" key={index}>
          {isSubsectionCompleted === true ? (
            <span className="absolute flex items-center justify-center w-8 h-8 bg-indigo-500 rounded-full -left-4  ring-white ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </span>
          ) : isFirstSubsection ? (
            <span className="absolute flex items-center justify-center w-8 h-8 bg-indigo-200 rounded-full -left-4 ring-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-indigo-500"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          ) : prevSubsectionFinished === false ? (
            <span className="absolute flex items-center justify-center w-8 h-8 bg-white rounded-full border border-gray-300 -left-4  ring-black ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </span>
          ) : dateTemp < dateToday ? (
            <span className="absolute flex items-center justify-center w-8 h-8 bg-indigo-200 rounded-full -left-4  ring-white ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-indigo-500"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          ) : (
            <span className="absolute flex items-center justify-center w-8 h-8 bg-white rounded-full border border-gray-300 -left-4  ring-black ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </span>
          )}
          {isFirstSubsection === true ? (
            <button
              onClick={() => handleSections(titulo, subsection)}
              className="flex items-center mb-1 font-medium text-gray-900 line-clamp-2 w-3/4 hover:translate-x-2 duration-200 text-left"
            >
              {" "}
              {subsection.attributes.title}
            </button>
          ) : isDoing === true ? (
            <button
              onClick={() => handleSections(titulo, subsection)}
              className="flex items-center mb-1 font-medium text-gray-900 line-clamp-2 w-3/4 hover:translate-x-2 duration-200 text-left"
            >
              {" "}
              {subsection.attributes.title}
            </button>
          ) : isSubsectionCompleted === true ? (
            <button
              onClick={() => handleSections(titulo, subsection)}
              className="flex items-center mb-1 font-medium text-gray-900 line-clamp-2 w-3/4 hover:translate-x-2 duration-200 text-left"
            >
              {" "}
              {subsection.attributes.title}
            </button>
          ) : (
            <button className="flex items-center mb-1 font-medium text-gray-500 line-clamp-2 w-3/4  text-left cursor-not-allowed">
              {" "}
              {subsection.attributes.title}
            </button>
          )}
          {selectFaseSectionContent(subsection.attributes.fase)}
        </li>
      );
    }
  }

  function RenderCourseContent({ section, sectionNumber, index }) {
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

    if (!isFinite(percentageFinished)) {
      percentageFinished = 0;
    }

    return (
      <Collapse
        expandIcon={({ isActive }) => <CaretRightOutlined className='absolute top-0 bottom-0 right-5 ' rotate={isActive ? 90 : 0} />}
        className='mt-5 bg-gray-50'
        expandIconPosition="right"
      >
        <Panel
          header={
            <div className='flex items-center py-4 '>
              <div className='ml-2 items-center flex'>
                <div className='w-20 h-20 items-center flex text-sm'>
                  <CircularProgressbar className='font-medium text-sm' value={percentageFinished} text={`${percentageFinished}%`} styles={buildStyles({
                    textSize: '22px',
                    pathColor: '#6366f1',
                    textColor: 'black',
                  })} />
                </div>
              </div>
              <div className='flex flex-col ml-9 w-full text-left'>
                <p className='text-sm mb-1'>Section {sectionNumber}</p>
                <h2 className='w-3/4 text-lg font-medium text-left line-clamp-2'>
                  {section.attributes.title}
                </h2>
              </div>
            </div>
          }
          key={sectionNumber}
        >
          <ol className="relative border-l border-dashed border-gray-300 ml-10 text-base">
            {section.attributes.subsections.data.map((subsection, index) => {
              const isFirstSubsection = index === 0;
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
    <div className="flex-shrink-0 w-full sm:w-auto z-20 ">
      <div className="mt-8 bg-white rounded-lg  p-5  sm:mr-9 sm:right-0 sm:w-[30rem] w-full shadow-md sm:visible collapse">
        <p className="text-xl font-semibold">Course content</p>
        <hr className="h-px my-8 bg-gray-400 border-0"></hr>
        {courseContentInformation.map((section, index) => (
          <RenderCourseContent
            key={index}
            section={section}
            sectionNumber={sectionNumber + index}
          />
        ))}
      </div>
    </div>
  );
};
