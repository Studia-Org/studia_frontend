import React from 'react'
import { Popover, Whisper } from 'rsuite';
import { AccordionCourseContent } from './AccordionCourseContent';
import { ForumClickable } from './Forum/ForumClickable';
import { ProfessorData } from './ProfessorData';
function FloatingButtonNavigation({ whisper, allForums, professor, courseContentInformation, setCourseSubsection, setCourseSection, setForumFlag, setQuestionnaireFlag, setSettingsFlag, setCourseSubsectionQuestionnaire, subsectionsCompleted, setCourseContentInformation, setEditSectionFlag, setSectionToEdit, courseSubsection, courseSection, posts }) {
    return (
        <div className=' right-5 bottom-5  flexible:hidden xl:flex accordion:hidden fixed'>
            <Whisper
                ref={whisper}
                placement="autoVerticalEnd"
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
                            <ForumClickable posts={allForums[0].attributes.posts.data} setForumFlag={setForumFlag} whisper={whisper} />
                        }
                        {professor.attributes && <ProfessorData professor={professor} evaluatorFlag={false} />}
                    </Popover>}>
                <div className={`bg-indigo-700 rounded-full w-[64px] h-[64px] p-[14px] cursor-pointer`}>
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