import React, { useState } from 'react'
import { Collapse } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { useCourseContext } from '../../../../../../context/CourseContext';

export const AccordionNavigator = () => {
    const { Panel } = Collapse;
    const [sectionNumber, setSectionNumber] = useState(1);

    const { course, subsectionSelected, sectionSelected } = useCourseContext();


    function RenderCourseSubsections({ subsection }) {
        const selectedSubsectionTemp = subsection.id === subsectionSelected.id

        let ringColor = '#15803d'
        if (subsection.fase === 'forethought') {
            ringColor = '#15803d'
        } else if (subsection.fase === 'performance') {
            ringColor = '#f59e0b'
        } else if (subsection.fase === 'self-reflection') {
            ringColor = '#dc2626'
        }

        return (
            <li className="flex items-center mt-8 mb-10 ml-8">
                <span className={`absolute flex items-center justify-center w-8 h-8 bg-[${ringColor}] rounded-full -left-4  ring-white `}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.59L7.3 9.24a.75.75 0 00-1.1 1.02l3.25 3.5a.75.75 0 001.1 0l3.25-3.5a.75.75 0 10-1.1-1.02l-1.95 2.1V6.75z" clipRule="evenodd" />
                    </svg>
                </span>
                <button onClick={() => {

                }} className="flex items-center w-3/4 mb-1 font-medium text-left text-gray-900 duration-200 line-clamp-2 hover:translate-x-2"> {subsection.title}</button>
                {
                    selectedSubsectionTemp && (
                        <span class="relative flex h-3 w-3 ml-3">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                        </span>
                    )
                }
            </li>
        )
    }

    function RenderCourseSections({ section, sectionNumber }) {
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
                            <div className='flex flex-col w-full text-left ml-9'>
                                <p className='mb-1 text-sm'>Section {sectionNumber}</p>
                                <h2 className='w-3/4 text-lg font-medium text-left line-clamp-2'>
                                    {section.name}

                                </h2>

                            </div>
                        </div>
                    }
                    key={sectionNumber}
                >
                    <ol className="relative ml-10 text-base border-l border-gray-300 border-dashed">
                        {section.subsections?.map((subsection, index) => (
                            <RenderCourseSubsections key={index} subsection={subsection} sectionId={section.id} />
                        ))}
                    </ol>
                </Panel>
            </Collapse>
        )
    }

    return (
        <div className='p-5 bg-white rounded-lg shadow-md'>
            <p className='text-xl font-semibold'>Course content</p>
            <hr className="h-px my-8 bg-gray-400 border-0"></hr>
            {
                course?.map((section, index) => (
                    <RenderCourseSections key={index} section={section} sectionNumber={sectionNumber + index} />
                ))
            }
        </div>

    )
}
