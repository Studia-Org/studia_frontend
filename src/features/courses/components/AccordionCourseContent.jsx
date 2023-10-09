import React from 'react'
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/accordion'

export const AccordionCourseContent = ({ courseContentInformation, setCourseSubsection, setCourseSection, setForumFlag }) => {

    function handleSections(tituloSeccion, subsection) {
        setForumFlag(false);
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
        return (
            <li class="mb-10 ml-8 mt-8">
                <span class="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white ">
                    <svg class="w-2.5 h-2.5 text-blue-800 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                    </svg>
                </span>
                <h3 class="flex items-center mb-1 font-medium text-gray-900"> {subsection.attributes.title}</h3>
            </li>

        )
    }

    function RenderCourseContent(section) {
        return (
            <Accordion allowMultiple className=''>
                <AccordionItem className='border rounded-3xl my-4'>                   
                        <AccordionButton className=' rounded-3xl border-b py-5 flex items-center'>
                            <div>
                            </div>
                            <h2 className='w-3/4 text-lg font-medium text-left line-clamp-2  ml-4'>
                                {section.attributes.title}
                            </h2>
                            <AccordionIcon fontSize={'24px'} className='ml-auto mr-5' />
                        </AccordionButton>
                        <AccordionPanel className='  mb-3 '>
                            <ol class="relative border-l border-dashed border-gray-300 ml-10">
                                {section.attributes.subsections.data.map(subseccion => RenderCourseInsideSectionContent(subseccion, section.attributes.title))}
                            </ol>
                        </AccordionPanel>
                </AccordionItem>
            </Accordion>
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
