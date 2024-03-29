import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import draw2 from '../../../assets/draw2.png'
import { CreateCourseBreadcrumb } from '../components/CreateCourses/CreateCourseBreadcrumb';
import { EditCreateCourseSection } from '../components/CreateCourses/CourseSections/EditCreateCourseSection';
import { CreateConfirmation, CreateCourseInfo, CreateCourseSections } from '../components/CreateCourses/CreateCourseComponents';



const CreateCourse = () => {
    const navigate = useNavigate();
    document.title = 'Create Course - Uptitude'
    const [createCourseOption, setCreateCourseOption] = useState(0);
    const [createCourseSectionsList, setCreateCourseSectionsList] = useState([])
    const [createCourseSectionsListCopy, setCreateCourseSectionsListCopy] = useState([])
    const [courseBasicInfo, setCourseBasicInfo] = useState({ tags: [] })
    const [editCourseSectionFlag, setEditCourseSectionFlag] = useState(false)
    const [sectionToEdit, setSectionToEdit] = useState({})
    const [categories, setCategories] = useState({})
    const [task, setTask] = useState({})


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
                return <CreateConfirmation task={task} createCourseOption={createCourseOption} setCreateCourseOption={setCreateCourseOption} createCourseSectionsList={createCourseSectionsList} evaluator={courseBasicInfo.evaluator} courseBasicInfo={courseBasicInfo} />
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
                                setCreateCourseSectionsList={setCreateCourseSectionsList} categories={categories} setCategories={setCategories} />
                        </>
                        :
                        <>
                            <h1>Create new Course</h1>
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