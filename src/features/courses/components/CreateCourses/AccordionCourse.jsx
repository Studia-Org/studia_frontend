import React, { useState } from 'react'
import { Collapse, Progress } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';

export const AccordionCourse = ({ createCourseSectionsList, setSectionContentSelector, setSectionId }) => {
    const { Panel } = Collapse;
    const [sectionNumber, setSectionNumber] = useState(1);

    function RenderCourseSubsections({ subsection, sectionId }) {
        let ringColor = '#15803d'
        if (subsection.fase === 'forethought') {
            ringColor = '#15803d'
        } else if (subsection.fase === 'performance') {
            ringColor = '#f59e0b'
        } else if (subsection.fase === 'self-reflection') {
            ringColor = '#dc2626'
        }

        return (
            <li className="mb-10 ml-8 mt-8 flex items-center">
                <span className={`absolute flex items-center justify-center w-8 h-8 bg-[${ringColor}] rounded-full -left-4  ring-white `}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.59L7.3 9.24a.75.75 0 00-1.1 1.02l3.25 3.5a.75.75 0 001.1 0l3.25-3.5a.75.75 0 10-1.1-1.02l-1.95 2.1V6.75z" clipRule="evenodd" />
                    </svg>
                </span>
                <button onClick={() => {
                    setSectionContentSelector(subsection.id)
                    setSectionId(sectionId)
                }} className="flex items-center mb-1 font-medium text-gray-900 line-clamp-2 w-3/4 hover:translate-x-2 duration-200 text-left"> {subsection.title}</button>
            </li>
        )
    }

    function RenderCourseSections({ section, sectionNumber }) {
        return (
            <Collapse
                expandIcon={({ isActive }) => <CaretRightOutlined className='absolute top-0 bottom-0 right-5 ' rotate={isActive ? 90 : 0} />}
                className='mt-5 bg-gray-50'
                expandIconPosition="right">
                <Panel
                    header={
                        <div className='flex items-center py-4 '>
                            <div className='flex flex-col ml-9 w-full text-left'>
                                <p className='text-sm mb-1'>Section {sectionNumber}</p>
                                <h2 className='w-3/4 text-lg font-medium text-left line-clamp-2'>
                                    {section.name}
                                </h2>
                            </div>
                        </div>
                    }
                    key={sectionNumber}
                >
                    <ol className="relative border-l border-dashed border-gray-300 ml-10 text-base">
                        {section.subsections.map((subsection, index) => (
                            <RenderCourseSubsections key={index} subsection={subsection} sectionId={section.id} />
                        ))}
                    </ol>
                </Panel>
            </Collapse>
        )
    }

    return (
        <div className='bg-white rounded-lg p-5 shadow-md'>
            <p className='text-xl font-semibold'>Course content</p>
            <hr className="h-px my-8 bg-gray-400 border-0"></hr>
            {
                createCourseSectionsList.map((section, index) => (
                    <RenderCourseSections key={index} section={section} sectionNumber={sectionNumber + index} />
                ))
            }
        </div>

    )
}
