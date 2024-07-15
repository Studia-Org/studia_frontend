import { useEffect, React, useState } from 'react';
import { API } from "../../../constant";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { MoonLoader } from "react-spinners";
import { Select, Avatar } from 'antd';
import { useAuthContext } from "../../../context/AuthContext";
import { ProfessorQualificationsCard } from '../components/ProfessorQualificationsCard';
import { useTranslation } from 'react-i18next';
const Qualifications = () => {
    document.title = 'Qualifications - Uptitude'
    const { t } = useTranslation();
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const [qualifications, setQualifications] = useState([]);
    const [courseSelected, setCourseSelected] = useState();
    const [qualificationsProfessor, setQualificationsProfessor] = useState([]);
    const navigate = useNavigate();

    const courseOptions = qualifications.map(course => ({
        value: JSON.stringify({ id: course.id, title: course.title, cover: course.cover }),
        label: (
            <div className='flex items-center gap-3'>
                <Avatar shape="square" size="small" src={course.cover} />
                <p>{course.title}</p>
            </div>
        ),
    }));

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
            fetch(`${API}/users/${user.id}?populate=courses.sections.subsections.activity,qualifications.activity,courses.professor.profile_photo,courses.cover,qualifications.evaluator.profile_photo`)
                .then((res) => res.json())
                .then((data) => {
                    const coursesWithActivities = []

                    data.courses.forEach((course) => {
                        const filteredQualifications = data.qualifications.filter(qualification => {
                            return course.sections.some(section => {
                                return section.subsections.some(subsection => {
                                    return subsection.activity?.id === qualification.activity?.id;
                                });
                            });
                        });

                        const dateObj = new Date(course.updatedAt);
                        const courseObj = {
                            id: course.id,
                            title: course.title,
                            professor: course.professor.name,
                            professor_email: course.professor.email,
                            professor_photo: course.professor?.profile_photo?.url,
                            cover: course.cover.url,
                            last_update: format(dateObj, "yyyy-MM-dd HH:mm:ss"),
                            activities: filteredQualifications
                        };
                        coursesWithActivities.push(courseObj);

                    });
                    setQualifications(coursesWithActivities);
                    setCourseSelected({
                        value: JSON.stringify({ id: coursesWithActivities[0].id, title: coursesWithActivities[0].title, cover: coursesWithActivities[0].cover }),
                        label: coursesWithActivities[0].title,
                    });
                    setLoading(false);
                })
                .catch((error) => console.error(error))
                .finally(() => setLoading(false));
        }
    }

    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());


    function renderProfessorQualificationsCard(qualification) {
        return <ProfessorQualificationsCard qualification={qualification} />
    }

    const handleCourseChange = (value) => {
        setCourseSelected({
            value: value,
            label: JSON.parse(value).title
        });
    }

    const QualificationsTable = (qualifications) => {
        const filteredQualifications = qualifications.filter((qualification) => qualification.id === JSON.parse(courseSelected.value).id)[0]?.activities ?? [];

        return (
            <div className='relative mt-20 overflow-x-auto rounded-lg shadow-md'>
                <div class="collapse lg:visible flex items-center justify-between pb-4 bg-white p-5">
                    <Avatar onClick={() => {
                        navigate(`/app/courses/${JSON.parse(courseSelected.value).id}`)
                    }} shape="square" className='mr-3 hover:cursor-pointer' size="default" src={JSON.parse(courseSelected.value).cover} />
                    <Select
                        showSearch
                        className='w-full'
                        placeholder="Select a course"
                        optionFilterProp="children"
                        filterOption={filterOption}
                        options={courseOptions}
                        value={courseSelected}
                        onChange={handleCourseChange}
                    />
                </div>
                <table class="w-full text-sm text-left text-gray-500 ">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50  ">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                {t("COURSEINSIDE.activity")}
                            </th>
                            <th scope="col" class="px-6 py-3">
                                {t("QUALIFICATIONS.comments")}
                            </th>
                            <th scope="col" class="px-6 py-3">
                                {t("QUALIFICATIONS.qualification")}
                            </th>
                            <th scope="col" class="px-6 py-3">
                                {t("ACTIVITY.evaluator")}
                            </th>
                            <th scope="col" class="px-6 py-3">
                                {t("QUALIFICATIONS.last_modification")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {qualifications && filteredQualifications.map(qualification => (
                            <RenderQualifications key={qualification.id} qualification={qualification} />
                        ))}
                        {
                            filteredQualifications.length < 3 && (
                                <tr class="bg-white border-b">
                                    <th scope="row" className='pb-96'>
                                    </th>
                                    <td class="px-6 py-4">
                                    </td>
                                    <td class="px-6 py-4">
                                    </td>
                                    <td class="px-6 py-4">
                                    </td>
                                    <td class="px-6 py-4">
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        );
    };

    function RenderQualifications({ qualification }) {
        return (
            <tr onClick={() => {
                if (qualification.activity.type !== 'forum' && qualification.activity.type !== 'questionnaire') {
                    navigate(`/app/courses/${JSON.parse(courseSelected.value).id}/activity/${qualification.activity?.id}`)
                }
            }}
                className="bg-white border-b cursor-pointer hover:bg-gray-50 group">
                <td class="px-6 py-4">
                    <p className='font-medium text-black group-hover:underline hover:underline'>{qualification.activity?.title}</p>
                </td>
                <td class="px-6 py-4">
                    {
                        qualification.comments ?
                            <p className=''>{qualification.comments}</p>
                            :
                            <p className=''>-</p>
                    }
                </td>
                <td class="px-6 py-4">
                    <div onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (!e.currentTarget.classList.contains('blur-sm')) navigate(`/app/courses/${JSON.parse(courseSelected.value).id}/activity/${qualification.activity?.id}`)
                        e.currentTarget.classList.remove('blur-sm');


                    }} className='justify-center w-full p-2 text-center duration-100 bg-gray-200 rounded-md blur-sm hover:blur-none '>
                        {
                            qualification.qualification ?
                                <p className='font-medium text-black pointer-events-none'>{qualification.qualification}</p>
                                :
                                <p className='font-medium text-black pointer-events-none'>-</p>
                        }
                    </div>
                </td>
                <td class="px-6 py-4">
                    {
                        qualification.evaluator ?
                            <div className='flex items-center'>
                                <img alt='' src={qualification.evaluator?.profile_photo?.url} className='object-cover w-8 h-8 rounded-full' />
                                <div className='flex flex-col'>
                                    <p className='ml-2'>{qualification.evaluator?.name}</p>
                                    <p className='ml-2 text-xs text-gray-400'>{qualification.evaluator?.email}</p>
                                </div>
                            </div>
                            :
                            <p className=''>-</p>
                    }
                </td>
                <td class="px-6 py-4">
                    {format(new Date(qualification.updatedAt), "dd-MM-yyyy HH:mm:ss")}
                </td>
            </tr>
        )
    }
    return (
        <>
            {
                user !== undefined && user?.role_str !== 'student' ?
                    <div className='max-w-full w-full max-h-full rounded-tl-3xl bg-[#e7eaf886] '>
                        <h1 className='ml-12 text-xl font-bold pt-11'>{t("QUALIFICATIONS.qualifications")}</h1>
                        {!loading ?
                            <div className='px-12 text-2xl font-bold p-9'>
                                <div className='flex'>
                                    <motion.div className='flex flex-wrap w-full gap-8 ' initial="hidden" animate="visible" exit="hidden" variants={variants} transition={transition}>
                                        {qualificationsProfessor && qualificationsProfessor.map(renderProfessorQualificationsCard)}
                                    </motion.div>
                                </div>
                            </div>
                            :
                            <div className='flex items-center justify-center w-full h-full'>
                                <MoonLoader color="#363cd6" size={80} />
                            </div>

                        }
                    </div>
                    :
                    <div className='w-full relative rounded-tl-3xl bg-[#e7eaf886] p-10'>
                        {!loading ?
                            <>
                                <section className='absolute top-0 left-0 block w-full'>
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
                            <div className='flex items-center justify-center w-full h-full'>
                                <MoonLoader color="#363cd6" size={80} />
                            </div>
                        }
                    </div>
            }
        </>

    )
}

export default Qualifications;