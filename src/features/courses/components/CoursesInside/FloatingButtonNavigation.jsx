import React, { useState } from 'react'
import { Popover, Whisper } from 'rsuite';
import { AccordionCourseContent } from './AccordionCourseContent';
import { ForumClickable } from './Forum/ForumClickable';
import { ProfessorData } from './ProfessorData';
import { Button, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { CourseParticipants } from './TabComponents';
import { ButtonSettings } from './EditSection/buttonEditCourse';

function FloatingButtonNavigation({ whisper, allForums, professor, courseContentInformation, setCourseSubsection, setCourseSection, setForumFlag, setQuestionnaireFlag, setSettingsFlag, setCourseSubsectionQuestionnaire, subsectionsCompleted, setCourseContentInformation, setEditSectionFlag, setSectionToEdit, courseSubsection, courseSection, posts }) {
    //TODO

    return (
        <div className='fixed flex xl:hidden right-[6.5rem] bottom-12'>
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

export const SideBar = ({
    allPosts, students, enableEdit, courseContentInformation,
    setCourseSubsection, setCourseSection, setForumFlag,
    setQuestionnaireFlag, setSettingsFlag, setCourseSubsectionQuestionnaire,
    subsectionsCompleted, setCourseContentInformation, setEditSectionFlag,
    setSectionToEdit, courseSubsection, courseSection,
    user, courseBasicInformation }) => {
    const [visible, setVisible] = useState(false);
    return (
        <nav className="absolute top-[calc(8rem+7px)] right-0 xl:hidden">
            <Button
                className="absoulte flex items-center h-14  z-10 rounded-[200px] group
                rounded-r-none p-5 transition-all bg-[#0072CE]  hover:px-6 duration-200"
                onClick={() => setVisible(true)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="absolute w-5 h-5 left-2 group-hover:scale-110">
                    <path fillRule="evenodd"
                        d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 
                            0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
                        clipRule="evenodd" />
                </svg>
            </Button>
            <Drawer
                title="Course Menu"
                size='large'
                className='px-1 xl:hidden'
                placement="right"
                open={visible}
                onClose={() => setVisible(false)}
            >
                <aside className='flex flex-col mt-5 gap-y-3'>
                    {(user?.role_str === 'professor' || user?.role_str === 'admin' || courseBasicInformation?.studentManaged === true) ?
                        <ButtonSettings setSettingsFlag={setSettingsFlag} setVisible={setVisible} setForumFlag={setForumFlag} /> : null
                    }
                    {allPosts &&
                        <ForumClickable posts={allPosts} setForumFlag={setForumFlag} setVisible={setVisible} />
                    }
                    <AccordionCourseContent
                        {...{
                            styles: "shadow-none px-1",
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
                            setVisible
                        }}
                    />
                    <CourseParticipants students={students} enableEdit={enableEdit} setSettingsFlag={setSettingsFlag} />

                </aside>

            </Drawer>
        </nav>
    );
};


export default FloatingButtonNavigation