import React, { useState } from 'react'
import { Sidebar } from '../../../shared/elements/Sidebar';
import { Navbar } from '../../../shared/elements/Navbar';
import draw2 from '../../../assets/draw2.png'
import { CreateCourseBreadcrumb } from '../components/CreateCourseBreadcrumb';
import { CreateConfirmation, CreateCourseInfo, CreateCourseSections } from '../components/CreateCourseComponents';



const CreateCourse = () => {
    const [createCourseOption, setCreateCourseOption] = useState(0);

    function RenderCreateCourse() {
        switch (createCourseOption) {
            case 0:
                return <CreateCourseInfo createCourseOption={createCourseOption} setCreateCourseOption={setCreateCourseOption} />
            case 1:
                return <CreateCourseSections createCourseOption={createCourseOption} setCreateCourseOption={setCreateCourseOption} />
            case 2:
                return <CreateConfirmation createCourseOption={createCourseOption} setCreateCourseOption={setCreateCourseOption} />
            default:
                return <CreateCourseInfo createCourseOption={createCourseOption} setCreateCourseOption={setCreateCourseOption} />
        }
    }

    return (

        <div className='rounded-tl-3xl bg-[#e7eaf886] w-full max-h-full'>
            <div className='pt-9 pl-12 h-full font-bold text-2xl w-full'>
                <h1>Create new Course</h1>
                <CreateCourseBreadcrumb createCourseOption={createCourseOption} />
                <div className='flex justify-between mr-16 mt-5'>
                    {RenderCreateCourse()}
                    <img src={draw2} alt="" />
                </div>
            </div>
        </div>

    )
}

export default CreateCourse