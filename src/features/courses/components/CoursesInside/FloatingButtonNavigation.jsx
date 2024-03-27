import React from 'react'
import { Popover, Whisper } from 'rsuite';
import { AccordionCourseContent } from './AccordionCourseContent';
import { ForumClickable } from './Forum/ForumClickable';
import { ProfessorData } from './ProfessorData';
function FloatingButtonNavigation({ whisper, allForums, professor, courseContentInformation, setCourseSubsection, setCourseSection, setForumFlag, setQuestionnaireFlag, setSettingsFlag, setCourseSubsectionQuestionnaire, subsectionsCompleted, setCourseContentInformation, setEditSectionFlag, setSectionToEdit, courseSubsection, courseSection, posts }) {
    //TODO
    
    return (
        <div className='fixed right-[6.5rem] bottom-12 flexible:hidden xl:flex accordion:hidden'>
            <Whisper
                ref={whisper}
                placement="auto"
                trigger={"click"}
                controlId="hamburger-menu"
                speaker={
                    <Popover>
                        <AccordionCourseContent
                            {...{
                                whisper,
                                styles: "shadow-none m-0 px-1 sm:px-5 sm:w-full",
                                courseContentInformation,
                                setCourseSubsection,
                                setCourseSection,
                                setForumFlag,
                                setQuestionnaireFlag,
                                setSettingsFlag,
                                setCourseSubsectionQuestionnaire,
                                subsectionsCompleted,
                                setCourseContentInformation,
                                setEditSectionFlag,
                                setSectionToEdit,
                                courseSubsection,
                                courseSection,
                            }}
                        />
                        {allForums[0]?.attributes &&
                            <section className='ml-2'>
                                <ForumClickable posts={allForums[0].attributes.posts.data} setForumFlag={setForumFlag} whisper={whisper} />
                            </section>
                        }
                        {professor.attributes && <section className='ml-10'> <ProfessorData professor={professor} evaluatorFlag={false} /></section>}
                    </Popover>}>
                <div className={` rounded-full w-[3.2rem] h-[3.2rem] p-[14px] text-white transition bg-[#3c3c3c] cursor-pointer shadow-xl hover:bg-[#4f4f4f] duration-100`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                        stroke="white" className="w-full h-full">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                    </svg>
                </div>
            </Whisper>
        </div>
    )
}

export default FloatingButtonNavigation