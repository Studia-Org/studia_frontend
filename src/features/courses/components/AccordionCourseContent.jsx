import React from 'react'
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/accordion'

export const AccordionCourseContent = ({ courseContentInformation, setCourseSubsection, setCourseSection }) => {

    function handleSections(tituloSeccion, subsection) {
        setCourseSection(tituloSeccion);
        setCourseSubsection(subsection);
    }

    function selectFaseSectionContent(str) {
        if (str === "Forethought") {
            return (

                <span className="  text-xs absolute right-0 mr-20 font-medium px-2.5 py-0.5 rounded bg-green-800 text-white ">{str}</span>

            )
        } else if (str === "Performance") {
            return (

                <span className="text-xs absolute right-0 mr-20 font-medium px-2.5 py-0.5 rounded bg-yellow-600 text-white ">{str}</span>

            )
        } else if (str === "Self-reflection") {
            return (

                <span className="text-xs absolute right-0 mr-20 font-medium px-2.5 py-0.5 rounded bg-red-600 text-white ">{str}</span>

            )
        }
    }


    function RenderCourseInsideSectionContent(subsection, titulo) {
        if (new Date(subsection.attributes.start_date).toISOString() > new Date().toISOString()) {
            return (
                <div className='flex cursor-pointer my-1  items-center'>
                    <div className=' hover:translate-x-2 duration-150 py-3 flex'>
                        <p className='text-base font-normal ml-4 '>
                            <span>🔒 </span>
                        </p>
                        <span className='truncate w-3/4 ml-3'>{subsection.attributes.title}</span>
                    </div>
                    {selectFaseSectionContent(subsection.attributes.fase)}
                </div>
            )
        }
        return (
            <div className='flex cursor-pointer my-1 items-center' onClick={() => handleSections(titulo, subsection.attributes)}>
                <div className=' hover:translate-x-2 duration-150 py-3 flex '>
                    <p className='text-base font-normal ml-4   '>
                        {subsection.attributes.finished === "False" ? (
                            <span role="img" aria-label="circle">⭕ </span>
                        ) : (
                            <span role="img" aria-label="checkmark">✅ </span>
                        )}
                    </p>
                    <span className='truncate w-3/4 ml-3'>{subsection.attributes.title}</span>
                </div>
                {selectFaseSectionContent(subsection.attributes.fase)}
            </div>
        )
    }

    function RenderCourseContent(section) {
        return (
            <div>
                <Accordion allowMultiple>
                    <AccordionItem>
                        <AccordionButton>
                            <div className='container bg-gray-100 rounded py-4 mb-4 flex' >
                                <h2 className='text-lg font-medium text-left line-clamp-1  ml-4'>
                                    {section.attributes.title}
                                    <AccordionIcon className='absolute right-0 mr-20 ' />
                                </h2>
                            </div>
                        </AccordionButton>
                        <AccordionPanel>
                            {section.attributes.subsections.data.map(subseccion => RenderCourseInsideSectionContent(subseccion, section.attributes.title))}
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </div>

        )
    }

    return (
        <div className='flex-shrink-0 w-full sm:w-auto'>
            <div className='mt-8 bg-white rounded-lg  px-5 py-5  sm:mr-9 sm:right-0 sm:w-[30rem] w-full shadow-md sm:visible collapse'>
                <p className='text-xl font-semibold'>Course content</p>
                <hr className="h-px my-8 bg-gray-400 border-0"></hr>
                {courseContentInformation.map(RenderCourseContent)}
            </div>
        </div>
    )
}
