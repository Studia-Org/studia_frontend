import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import draw2 from '../../../assets/draw2.png'
import { CreateCourseBreadcrumb } from '../components/CreateCourses/CreateCourseBreadcrumb';
import { EditCreateCourseSection } from '../components/CreateCourses/CourseSections/EditCreateCourseSection';
import { CreateConfirmation, CreateCourseInfo, CreateCourseSections } from '../components/CreateCourses/CreateCourseComponents';
import { useTranslation } from 'react-i18next';



const CreateCourse = () => {
    const { t } = useTranslation();
    document.title = 'Create Course - Uptitude'
    const [createCourseOption, setCreateCourseOption] = useState(0);
    const [editCourseSectionFlag, setEditCourseSectionFlag] = useState(false)
    const [subsectionErrors, setSubsectionErrors] = useState(() => {
        const savedErrors = localStorage.getItem('subsectionErrors');
        return savedErrors ? JSON.parse(savedErrors) : null;
    }
    )

    const [sectionToEdit, setSectionToEdit] = useState({})

    const [createCourseSectionsListCopy, setCreateCourseSectionsListCopy] = useState(() => {
        const savedSections = localStorage.getItem('createCourseSectionsList');
        return savedSections ? JSON.parse(savedSections) : [];
    });

    const [createCourseSectionsList, setCreateCourseSectionsList] = useState(() => {
        const savedSections = localStorage.getItem('createCourseSectionsList');
        return savedSections ? JSON.parse(savedSections) : [];
    });

    const [courseBasicInfo, setCourseBasicInfo] = useState(() => {
        const savedInfo = localStorage.getItem('courseBasicInfo');
        return savedInfo ? JSON.parse(savedInfo) : { tags: [] };
    });

    const [categories, setCategories] = useState(() => {
        const savedCategories = localStorage.getItem('categories');
        return savedCategories ? JSON.parse(savedCategories) : {};
    });

    const [task, setTask] = useState(() => {
        const savedTask = localStorage.getItem('task');
        return savedTask ? JSON.parse(savedTask) : {};
    });


    // eliminar los errores de las subsections que no existen en el createCourseSectionsListCopy
    useEffect(() => {
        const validSubsectionIds = new Set();
        createCourseSectionsListCopy.forEach(section => {
            section.subsections.forEach(subsection => {
                validSubsectionIds.add(subsection.id);
            });
        });

        setSubsectionErrors(prevErrors => {
            const filteredErrors = {};
            Object.keys(prevErrors).forEach(id => {
                if (validSubsectionIds.has(id)) {
                    filteredErrors[id] = prevErrors[id];
                }
            });
            return filteredErrors;
        });

    }, [createCourseSectionsListCopy])

    function RenderCreateCourse() {
        switch (createCourseOption) {
            case 0:
                return <CreateCourseInfo createCourseOption={createCourseOption} setCreateCourseOption={setCreateCourseOption} setCourseBasicInfo={setCourseBasicInfo} courseBasicInfo={courseBasicInfo} />
            case 1:
                return <CreateCourseSections createCourseOption={createCourseOption} setCreateCourseOption={setCreateCourseOption}
                    setCreateCourseSectionsList={setCreateCourseSectionsList} createCourseSectionsList={createCourseSectionsList} setEditCourseSectionFlag={setEditCourseSectionFlag}
                    setSectionToEdit={setSectionToEdit} setCreateCourseSectionsListCopy={setCreateCourseSectionsListCopy}
                    createCourseSectionsListCopy={createCourseSectionsListCopy} />
            case 2:
                return <CreateConfirmation subsectionErrors={subsectionErrors} task={task} createCourseOption={createCourseOption} setCreateCourseOption={setCreateCourseOption} createCourseSectionsList={createCourseSectionsList} evaluator={courseBasicInfo.evaluator} courseBasicInfo={courseBasicInfo} />
            default:
                return <CreateCourseInfo createCourseOption={createCourseOption} setCreateCourseOption={setCreateCourseOption} />
        }
    }

    return (
        <div className=' bg-[#e7eaf886] w-full max-h-full'>
            <div className='w-full h-full pl-12 text-2xl font-bold pt-9'>
                {
                    editCourseSectionFlag ?
                        <>
                            <EditCreateCourseSection key={sectionToEdit.id} setEditCourseSectionFlag={setEditCourseSectionFlag}
                                sectionToEdit={sectionToEdit} createCourseSectionsList={createCourseSectionsList} task={task} setTask={setTask}
                                createCourseSectionsListCopy={createCourseSectionsListCopy} setCreateCourseSectionsListCopy={setCreateCourseSectionsListCopy}
                                setCreateCourseSectionsList={setCreateCourseSectionsList} categories={categories} setCategories={setCategories} setSubsectionErrors={setSubsectionErrors}
                                subsectionErrors={subsectionErrors} />
                        </>
                        :
                        <>
                            <h1>{t("CREATE_COURSES.principal_text")}</h1>
                            <CreateCourseBreadcrumb createCourseOption={createCourseOption} setCreateCourseOption={setCreateCourseOption} courseBasicInfo={courseBasicInfo} />
                            <div className='flex justify-between mt-5 mr-16'>
                                {RenderCreateCourse()}
                                {
                                    createCourseOption !== 2 ?
                                        <div className='w-[30rem] h-[30rem]'>
                                            <img src={draw2} className='w-[30rem] h-[30rem]' alt="" />
                                        </div>
                                        :
                                        null
                                }
                            </div>
                        </>
                }
            </div>
        </div>
    )
}

export default CreateCourse