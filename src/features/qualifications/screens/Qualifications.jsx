import { useEffect, React, useState } from 'react';
import { API } from "../../../constant";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { MoonLoader } from "react-spinners";
import { Whisper, Button, Popover } from 'rsuite';
import { useAuthContext } from "../../../context/AuthContext";
import { ProfessorQualificationsCard } from '../components/ProfessorQualificationsCard';

const Qualifications = () => {
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const [qualifications, setQualifications] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [qualificationsProfessor, setQualificationsProfessor] = useState([]);


    useEffect(() => {
        if (loading) {
            callQualificationsData();
            fetchProfessorQualificationsData();
        }
    }, [loading, user]);

    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };
    const transition = { duration: 0.3 };

    const fetchProfessorQualificationsData = async () => {
        try {
            const response = await fetch(`${API}/courses?populate=cover,professor.profile_photo`);
            const data = await response.json();
            const professorCourses = []
            data.data.forEach((course) => {
                if (course.attributes.professor.data.id === user.id) {
                    professorCourses.push(course)
                }
            })
            setQualificationsProfessor(professorCourses);
        } catch (error) {

        }
    }


    function callQualificationsData() {
        if (user) {
            setLoading(true);
            fetch(`${API}/users/${user.id}?populate=courses.sections.subsections.activities,qualifications.activity,courses.professor.profile_photo,courses.cover`)
                .then((res) => res.json())
                .then((data) => {
                    const coursesWithActivities = []

                    data.courses.forEach((course) => {
                        const filteredQualifications = data.qualifications.filter(qualification => {
                            return course.sections.some(section => {
                                return section.subsections.some(subsection => {
                                    return subsection.activities.some(activity => {
                                        return activity.id === qualification.activity.id;
                                    });
                                });
                            });
                        });

                        const dateObj = new Date(course.updatedAt);
                        const courseObj = {
                            id: course.id,
                            title: course.title,
                            professor: course.professor.name,
                            professor_photo: course.professor.profile_photo.url,
                            cover: course.cover.url,
                            last_update: format(dateObj, "yyyy-MM-dd HH:mm:ss"),
                            activities: filteredQualifications
                        };
                        coursesWithActivities.push(courseObj);

                    });
                    setQualifications(coursesWithActivities);
                    setLoading(false);
                })
                .catch((error) => console.error(error));
        }
    }

    const speaker = (props) => {
        return (
            <Popover title={props.activity.title}>
                <p className='italic text-gray-400'>Comments </p>
                {props.comments ? <p>{props.comments}</p> : <p>No comments.</p>}
            </Popover>
        )
    }

    function RenderGradesFromData(grades, courseID) {
        const style = {
            borderRadius: '0.5rem',
            width: '2rem',
            height: '2rem',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        };
        return (
            <div>
                <Whisper placement="top" className='text-sm shadow-md' trigger="hover" controlId="control-id-hover" speaker={speaker(grades)}>
                    <Link className='no-underline' to={`/app/courses/${courseID}/activity/${grades.activity.id}`}>
                        <Button style={style} className='text-sm shadow-md bg-gradient-to-r from-[#657DE9] to-[#6E66D6] '> {grades.qualification}</Button>
                    </Link>
                </Whisper>
            </div>
        );
    }

    function renderProfessorQualificationsCard(qualification) {
        return (
            <>
                <ProfessorQualificationsCard qualification={qualification} />
            </>
        )
    }

    const QualificationsTable = (qualifications) => {
        const filteredQualifications = qualifications.filter((qualification) =>
            qualification.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div className='relative overflow-x-auto shadow-md rounded-lg mt-20'>
                <div class="collapse lg:visible flex items-center justify-between pb-4 bg-white p-5">
                    <label for="table-search" class="sr-only">Search</label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            id="table-search-users"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            class="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                            placeholder="Search for courses" />
                    </div>
                </div>
                <table class="w-full text-sm text-left text-gray-500 ">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50  ">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Course
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Professor
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Qualifications
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Last Updated
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {qualifications && filteredQualifications.map(RenderQualifications)}
                    </tbody>
                </table>
            </div>
        );
    };

    function RenderQualifications(curso_grade) {
        const filteredActivities = curso_grade.activities.filter((activity) => activity.qualification !== null);

        return (
            <tr class="bg-white border-b hover:bg-gray-50">
                <th scope="row" class="px-6 py-4 text-gray-900 whitespace-nowrap">
                    <p className='lg:text-base text-sm'>{curso_grade.title}</p>
                </th>
                <td class="px-6 py-4 flex items-center text-gray-900">
                    <img alt='' class="w-10 h-10 rounded-full" src={curso_grade.professor_photo} />
                    <div class="pl-3">
                        <div class="text-sm font-semibold">{curso_grade.professor}</div>
                        <div class="font-normal text-xs text-gray-500">dawdawd@gmail.com</div>
                    </div>
                </td>
                <td class="px-6 py-4 lg:w-2/5">
                    <div className='flex space-x-3'>
                        {filteredActivities.map((activity) => RenderGradesFromData(activity, curso_grade.id))}
                    </div>
                </td>
                <td class="px-6 py-4">
                    {curso_grade.last_update}
                </td>
            </tr>

        )
    }
    return (
        <>
            {
                user !== undefined && user?.role_str === 'professor' ?
                    <div className='max-w-full w-full max-h-full rounded-tl-3xl bg-[#e7eaf886] '>
                        <h1 className='pt-11 font-bold text-xl ml-12'>Qualifications</h1>
                        {!loading ?
                            <div className='p-9 px-12 font-bold text-2xl'>
                                <div className='flex'>
                                    <motion.div className='flex flex-wrap w-full gap-8 ' initial="hidden" animate="visible" exit="hidden" variants={variants} transition={transition}>
                                        {qualificationsProfessor && qualificationsProfessor.map(renderProfessorQualificationsCard)}
                                    </motion.div>
                                </div>
                            </div>
                            :
                            <div className='w-full h-full flex items-center justify-center'>
                                <MoonLoader color="#363cd6" size={80} />
                            </div>

                        }
                    </div>
                    :
                    <div className='w-full relative rounded-tl-3xl bg-[#e7eaf886] p-10'>
                        {!loading ?
                            <>
                                <section className='absolute block top-0 left-0 w-full'>
                                    {
                                        <img alt='' src={`https://wallpaperaccess.com/full/1779010.jpg`}
                                            className="absolute top-0 left-0 w-full h-[20rem] object-cover lg:rounded-tl-3xl" />
                                    }
                                    <span
                                        id="blackOverlay"
                                        className="absolute block top-0 left-0 h-[20rem] w-full opacity-40 bg-black lg:rounded-tl-3xl"
                                    />
                                </section>
                                <motion.div initial="hidden" animate="visible" exit="hidden" variants={variants} transition={transition}>
                                    {qualifications && QualificationsTable(qualifications)}
                                </motion.div>
                            </>
                            :
                            <div className='w-full h-full flex items-center justify-center'>
                                <MoonLoader color="#363cd6" size={80} />
                            </div>
                        }
                    </div>
            }
        </>

    )
}

export default Qualifications;