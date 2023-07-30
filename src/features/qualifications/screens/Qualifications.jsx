import { useEffect, React, useState } from 'react';
import { Sidebar } from '../../../shared/elements/Sidebar';
import { Navbar } from '../../../shared/elements/Navbar';
import { API } from "../../../constant";
import { format } from 'date-fns';
import { useAuthContext } from "../../../context/AuthContext";

const Qualifications = () => {
    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };
    const transition = { duration: 0.3 };

    const { user } = useAuthContext();
    const [qualifications, setQualifications] = useState([]);

    useEffect(() => {
        callQualificationsData();
    }, [user]);

    function callQualificationsData() {
        if (user) {
            fetch(`${API}/users/${user.id}?populate=courses.sections.subsections.activities,courses.professor.profile_photo&fields[0]=activities`)
                .then((res) => res.json())
                .then((data) => {
                    const coursesWithActivities = []
                    data.courses.forEach((course) => {
                        const dateObj = new Date(course.updatedAt);
                        const courseObj = {
                            id: course.id,
                            title: course.title,
                            professor: course.professor.name,
                            professor_photo: course.professor.profile_photo.url,
                            last_update: format(dateObj, "yyyy-MM-dd HH:mm:ss"),
                            activities: []
                        };
                        course.sections.forEach((section) => {
                            section.subsections.forEach((subsection) => {
                                courseObj.activities.push(...subsection.activities);
                            });
                        });
                        coursesWithActivities.push(courseObj);
                    });
                    console.log(coursesWithActivities);
                    setQualifications(coursesWithActivities);
                })
                .catch((error) => console.error(error));
        }
    }

    function RenderGradesFromData(grades) {
        const style = {
            backgroundColor: `rgba(59, 130, 246, ${Math.max(grades.qualification / 10, 0.35)})`,
            borderRadius: '0.5rem',
            width: '2rem',
            height: '2rem',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        };
        return (
            <div style={style} className='text-sm'>
                {grades.qualification}
            </div>
        );
    }

    function RenderQualifications(curso_grade) {
        const maxCalificacion = 10
        let blueValue = 240 - (curso_grade.nota_media_provisional / maxCalificacion) * 190
        if (blueValue >= 164) {
            blueValue = 155;
        }

        const color = `rgba(${blueValue}, ${blueValue}, 255, 1)`;

        const style = {
            color: color,
        };

        return (
            <div className='flex space-x-6'>
                <div className='bg-white rounded-lg font-medium text-lg py-5 my-2 grid grid-cols-5 w-full  items-center'>
                    <div className='flex items-center'>
                        <h1 className='font-sans ml-5'>{curso_grade.title}</h1>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <img className='w-8 h-8 rounded-full' src={curso_grade.professor_photo} alt="" />
                        <p className='text-base font-normal'>{curso_grade.professor}</p>
                    </div>
                    <div className='col-span-2 flex space-x-3'>
                        {curso_grade.activities.map(RenderGradesFromData)}
                    </div>
                    <div className='text-right mr-5'>
                        <p className='text-base font-normal'>{curso_grade.last_update}</p>
                    </div>

                </div>
            </div>

        )
    }
    return (
        <div className='h-screen w-full bg-white'>
            <Navbar user={user} />
            <div className='flex flex-wrap-reverse sm:flex-nowrap bg-white'>
                <Sidebar section={'qualifications'} />
                <div className='container-fluid h-screen w-full rounded-tl-3xl bg-[#e7eaf886] '>
                    <div className='p-9 px-12 font-bold text-2xl'>
                        <h2>Qualifications</h2>
                        <div className='mt-12'>
                            <div className='grid grid-cols-6 font-normal text-sm pl-6 mb-2'>
                                <p className=''>Course</p>
                                <p className=''>Professor</p>
                                <p className='col-span-2 ml-6'>Grades</p>
                                <p className=' text-right'>Last updated</p>
                            </div>
                            {qualifications && qualifications.map(RenderQualifications)}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Qualifications;