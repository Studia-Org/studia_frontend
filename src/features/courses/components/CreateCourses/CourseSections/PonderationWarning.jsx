import React, { useEffect, useState } from 'react'
import { Popover } from 'antd'

export const PonderationWarning = ({ createCourseSectionsList, sectionID }) => {
    const [ponderationCorrect, setPonderationCorrect] = useState(false);
    const [ponderation, setPonderation] = useState(0);
    const contentWrong = (
        <div className='w-56'>
            <p>You will not be able to create a course, the ponderation of all subsections do not sum 100%, they do sum {ponderation}% instead  </p>
        </div>
    );

    const contentCorrect = (
        <div className='w-56'>
            <p>Everything is correct</p>
        </div>
    );

    useEffect(() => {
        let ponderation = 0;
        createCourseSectionsList.forEach(section => {
            if (section.id === sectionID) {
                section.subsections.forEach(subsection => {
                    if (subsection.activity && subsection.activity.evaluable) {
                        ponderation += subsection.activity.ponderation
                    }
                })
                setPonderation(ponderation)
                if (ponderation !== 100) {
                    setPonderationCorrect(false)
                } else {
                    setPonderationCorrect(true)
                }
            }
        })

    }, [createCourseSectionsList])

    if (ponderationCorrect === false) {
        return (
            <Popover content={contentWrong} title="Ponderation do not sum 100" className=''>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
            </Popover>
        )
    } else {
        return (
            <Popover content={contentCorrect} title="Ponderation sum 100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </Popover>
        )
    }


}
