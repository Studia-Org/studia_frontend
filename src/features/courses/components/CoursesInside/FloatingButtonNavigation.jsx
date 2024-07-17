import React, { useState } from 'react'
import { AccordionCourseContent } from './AccordionCourseContent';
import { ForumClickable } from './Forum/ForumClickable';
import { Button, Drawer } from "antd";
import { CourseParticipantsClickable } from './TabComponents';
import { ButtonSettings } from './EditSection/buttonEditCourse';
import { useTranslation } from 'react-i18next';

export const SideBar = ({
    allPosts, students, enableEdit,
    setForumFlag, setQuestionnaireFlag, setSettingsFlag, setCourseSubsectionQuestionnaire,
    subsectionsCompleted, setEditSectionFlag,
    setSectionToEdit, user, courseBasicInformation, setParticipantsFlag }) => {
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation();
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
                title={t("COURSEINSIDE.ACCORDION.course_info")}
                size='large'
                className='px-1 xl:hidden'
                placement="right"
                open={visible}
                onClose={() => setVisible(false)}
            >
                <aside className='flex flex-col mt-5 gap-y-3'>
                    {(user?.role_str === 'professor' || user?.role_str === 'admin' || courseBasicInformation?.studentManaged === true) ?
                        <ButtonSettings setSettingsFlag={setSettingsFlag} setVisible={setVisible} setForumFlag={setForumFlag} setParticipantsFlag={setParticipantsFlag} /> : null
                    }
                    {allPosts &&
                        <ForumClickable posts={allPosts} setForumFlag={setForumFlag} setSettingsFlag={setSettingsFlag} setParticipantsFlag={setParticipantsFlag} setVisible={setVisible} />
                    }
                    <AccordionCourseContent
                        {...{
                            styles: "shadow-none px-1",
                            setForumFlag,
                            setQuestionnaireFlag,
                            setSettingsFlag,
                            setCourseSubsectionQuestionnaire,
                            subsectionsCompleted,
                            setEditSectionFlag,
                            setSectionToEdit,
                            setParticipantsFlag,
                            setVisible
                        }}
                    />
                    <CourseParticipantsClickable
                        students={students}
                        enableEdit={enableEdit}
                        setSettingsFlag={setSettingsFlag}
                        setForumFlag={setForumFlag}
                        setParticipantsFlag={setParticipantsFlag}
                        setVisible={setVisible}
                    />

                </aside>

            </Drawer>
        </nav>
    );
};


export default SideBar