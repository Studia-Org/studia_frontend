import { useEffect, React, useState } from 'react';
import { Sidebar } from '../../../shared/elements/Sidebar';
import { Navbar } from '../../../shared/elements/Navbar';
import { API } from "../../../constant";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { MoonLoader } from "react-spinners";
import { Whisper, Button, Popover } from 'rsuite';
import { useAuthContext } from "../../../context/AuthContext";

const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};
const transition = { duration: 0.3 };

const Qualifications = () => {
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const [qualifications, setQualifications] = useState([]);


    useEffect(() => {
        if (loading) {
            callQualificationsData();
        }
    }, [loading, user]);

    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };
    const transition = { duration: 0.3 };


    function callQualificationsData() {
        if (user) {
            setLoading(true);
            fetch(`${API}/users/${user.id}?populate=courses.sections.subsections.activities,qualifications.activity,courses.professor.profile_photo`)
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
            <div>
                <Whisper placement="top" className='text-sm shadow-md' trigger="hover" controlId="control-id-hover" speaker={speaker(grades)}>
                    <Link className='no-underline' to={`/app/courses/${courseID}/activity/${grades.activity.id}`}>
                        <Button style={style} className='text-sm shadow-md '> {grades.qualification}</Button>
                    </Link>
                </Whisper>
            </div>
        );
    }

    const QualificationsTable = ({ qualifications }) => {
        return (
            <div>
                <div className='flex space-x-6'>
                    <div className='font-normal text-base text-gray-600 rounded-lg py-2  grid grid-cols-5 w-full  items-center'>
                        <div className='flex items-center'>
                            <h1 className=' ml-5'>Course</h1>
                        </div>
                        <div className='flex items-center space-x-2'>
                            <h1>Professor</h1>
                        </div>
                        <div className='col-span-2 flex space-x-3'>
                            <h1>Qualifications</h1>
                        </div>
                        <div className='text-right mr-5'>
                            <h1>Last Updated</h1>
                        </div>
                    </div>
                </div>
                {qualifications && qualifications.map(RenderQualifications)}
            </div>
        );
    };

    function RenderQualifications(curso_grade) {
        return (
            <div className='flex'>
                <div className='bg-white rounded-lg font-medium text-lg py-5 my-2 grid grid-cols-5 w-full  items-center shadow'>
                    <div className='flex items-center'>
                        <h1 className='text-base ml-5 ' >{curso_grade.title}</h1>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <img className='w-8 h-8 rounded-full' src={curso_grade.professor_photo} alt="" />
                        <p className='text-sm font-normal'>{curso_grade.professor}</p>
                    </div>
                    <div className='col-span-2 flex space-x-3'>
                        {curso_grade.activities.map((activity) => RenderGradesFromData(activity, curso_grade.id))}
                    </div>
                    <div className='text-right mr-5'>
                        <p className='text-base text-gray-600'>{curso_grade.last_update}</p>
                    </div>
                </div>
            </div>
        )
    }
    return (

        <div className='max-w-full w-full max-h-full rounded-tl-3xl bg-[#e7eaf886] '>
            {!loading ?
                <div className='p-9 px-12 font-bold text-2xl'>
                    <motion.div initial="hidden" animate="visible" exit="hidden" variants={variants} transition={transition}>
                        {qualifications && <QualificationsTable qualifications={qualifications} />}
                    </motion.div>
                </div>

                :
                <div className='w-full h-full flex items-center justify-center'>
                    <MoonLoader color="#363cd6" size={80} />
                </div>

            }
        </div>

    )
}

export default Qualifications;