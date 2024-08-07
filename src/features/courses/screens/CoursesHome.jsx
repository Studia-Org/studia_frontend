import { useEffect, useState, React } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import 'react-loading-skeleton/dist/skeleton.css'
import '../styles/utils.css'
import { useAuthContext } from "../../../context/AuthContext";
import { CoursesCardHome } from '../components/CoursesHome/CoursesCardHome';
import { Divider, Empty, Tag, Popover } from 'antd';
import { MoonLoader } from "react-spinners";
import { API } from "../../../constant";
import Confetti from 'react-confetti'
import { SpeedDialCreateCourse } from '../components/CoursesHome/SpeedDialCreateCourse';
import { ModalCreateCourseStudent } from '../components/CoursesHome/AddCourseStudent/ModalCreateCourseStudent';
import { ModalCompleteObjectives } from '../components/CoursesHome/ModalCompleteObjectives';
import { replicateCourse } from '../components/CoursesHome/helpers/replicateCourse';
import { useTranslation, Trans } from 'react-i18next';
import { useCourseContext } from '../../../context/CourseContext';

const CoursesHome = () => {
  document.title = 'Home - Uptitude'
  const { user } = useAuthContext();
  const [confettiActive, setConfettiActive] = useState(false);
  const [objectives, setObjectives] = useState([]);
  const [confettiExplode, setConfettiExplode] = useState(false);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [expandCreateCourseStudent, setExpandCreateCourseStudent] = useState(false);
  const [openModalCompleteObjectives, setOpenModalCompleteObjectives] = useState(false);
  const [openObjectivesModal, setOpenObjectivesModal] = useState(false);
  const [objectiveSelected, setObjectiveSelected] = useState();
  const { t } = useTranslation();
  const { setCourse, setSectionSelected, setSubsectionSelected, setActivitySelected, } = useCourseContext();

  useEffect(() => {
    setCourse(undefined);
    setSectionSelected(undefined);
    setSubsectionSelected(undefined);
    setActivitySelected(undefined);
  }, []);

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  const transition = { duration: 0.3 };


  useEffect(() => {
    if (!confettiExplode) return
    const confettiDuration = 10000;
    setConfettiActive(true);
    const confettiTimeout = setTimeout(() => {
      setConfettiActive(false)
    }, confettiDuration);
    return () => {
      clearTimeout(confettiTimeout);
    };
  }, [confettiExplode]);

  const fetchCoursesCards = async () => {
    setIsLoading(true);
    try {
      let endpoint = `${API}/courses?populate=*,professor.profile_photo,course_tags,cover,students.profile_photo,evaluators`;
      if (user.role_str === 'student') {
        endpoint = `${API}/users/${user?.id}?populate=courses.cover,courses.students.profile_photo,courses.professor,courses.professor.profile_photo,courses.course_tags`;
      }
      const response = await fetch(endpoint);
      const data = await response.json();
      const coursesFiltered = filterCoursesByRole(data, user);
      const finalCourses = coursesFiltered.map(mapCourseData);
      const sortedCourses = finalCourses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setCourses(sortedCourses ?? []);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };


  const filterCoursesByRole = (data, user) => {
    if (user.role_str === 'professor' || user.role_str === 'admin') {
      const coursesEvaluators = data.data.filter(course => course.attributes.evaluators.data.some(evaluator => evaluator.id === user.id));
      const coursesProfessor = data.data.filter(course => course.attributes.professor.data.id === user.id);
      return [...coursesEvaluators, ...coursesProfessor];
    } else if (user.role_str === 'student') {
      return data.courses;
    }
  };


  const mapCourseData = course => ({
    id: course.id,
    createdAt: course.createdAt || course.attributes.createdAt,
    title: course.title || course.attributes.title,
    cover: course.cover ? course.cover.url : course.attributes.cover.data?.attributes.url,
    professor_name: course.professor ? course.professor.name : course.attributes.professor.data.attributes.name,
    tags: course?.tags || course.attributes?.tags,
    professor_profile_photo: course.professor ? course.professor.profile_photo.url : course.attributes.professor.data.attributes.profile_photo.data.attributes.url,
    students: course.students || course.attributes.students.data,
    studentManaged: course?.studentManaged || course.attributes?.studentManaged,
  });


  const fetchUserObjectives = async () => {
    try {
      const response = await fetch(`${API}/users/${user.id}?populate=user_objectives`);
      const data = await response.json();
      setObjectives(data.user_objectives)

      if (user.role_str !== 'professor' && user.role_str !== 'admin') setOpenObjectivesModal(data.user_objectives.length === 0)
    } catch (error) {
      console.error(error);
    }

  }

  const fetchDailyTasks = async () => {
    try {
      const response = await fetch(`${API}/users/${user.id}?populate=courses.sections.subsections.activity,courses.cover`);
      const data = await response.json();

      let newDailyTasks = [];

      data.courses.forEach((course) => {
        course.sections.forEach((section) => {
          section.subsections.forEach((subsection) => {
            const fechaActual = new Date();
            if (fechaActual >= new Date(subsection.start_date) && fechaActual <= new Date(subsection.end_date)) {
              if (!newDailyTasks.some((task) => task.id === subsection.id)) {
                newDailyTasks.push({ subsection, cover: course.cover.url, courseId: course.id });
              }
            }
          });
        });
      });
      setDailyTasks(newDailyTasks);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user !== undefined) {
      fetchUserObjectives()
      fetchDailyTasks();
    }
  }, [user]);

  useEffect(() => {
    if (isLoading && user !== undefined) {
      fetchCoursesCards();
    }
  }, [isLoading, user]);



  function RenderDailyTasks(subsection) {
    var colorStyle = undefined;
    const endDate = new Date(subsection.subsection.end_date);
    const today = new Date();
    const twoDaysBeforeEndDate = new Date(endDate);
    twoDaysBeforeEndDate.setDate(endDate.getDate() - 2);
    const isDateDangerous = twoDaysBeforeEndDate <= today;
    const courseId = subsection.courseId;
    const activityId = subsection.subsection.activity.id;
    const isQuestionnaire = subsection.subsection.activity.type === 'questionnaire';
    const href = isQuestionnaire ? `/app/courses/${courseId}` :
      `/app/courses/${courseId}/activity/${activityId}`;

    if (subsection.subsection.fase === 'Performance') {
      colorStyle = { backgroundColor: '#eab308' }
    } else if (subsection.subsection.fase === 'Self-reflection') {
      colorStyle = { backgroundColor: '#ef4444' }
    } else if (subsection.subsection.fase === 'Forethought') {
      colorStyle = { backgroundColor: '#166534' }
    }

    return (
      <Link to={href} className='relative rounded-lg border flex p-3 group w-full min-h-[5rem] hover:bg-gray-50'>
        <div className='flex w-full items-center lg:max-w-[calc(100%-6rem)]'>
          <p className='text-base font-semibold group-hover:underline '>{subsection.subsection.title}</p>
          {
            isDateDangerous !== true ?
              <div className='flex items-center mr-3'>
                <Popover
                  content={
                    <Trans i18nKey="COURSESHOME.taskEndSoon" components={{
                      "end_date": new Date(subsection.subsection.end_date).toLocaleDateString(),
                    }} />
                  }
                  title="Warning!"
                  trigger="hover">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-2 text-red-500">
                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
                  </svg>
                </Popover>
              </div> : null
          }
        </div>
        <img className='absolute top-0 right-0 object-cover w-24 h-full rounded-r-lg opacity-90' src={subsection.cover} alt="" />
      </Link>
    )
  }
  function renderConfeti() {

    return (
      <div id="confetti" className='min-w-screen' style={{ zIndex: 1000 }} >
        {confettiActive && (
          <Confetti className='absolute' style={{ zIndex: 1000 }}
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={500}
            recycle={false}
          />
        )}
      </div>
    );
  }


  function renderObjectives(objective) {
    return (
      <div key={objective.id} className='flex items-center p-5 bg-white border rounded-lg '>
        <p className='text-base font-medium'>{objective.objective}</p>
        {
          objective.completed === true ?
            <div className='ml-auto'>
              <Tag onClick={() => {
                setObjectiveSelected(objective)
                setOpenModalCompleteObjectives(true)
              }

              } className='p-1 ml-auto cursor-pointer hover:scale-95' color="#008000">{t("COURSESHOME.objectives.completed")}</Tag>
            </div>
            :
            <div className='ml-auto'>
              <Tag onClick={() => {
                setObjectiveSelected(objective)
                setOpenModalCompleteObjectives(true)
              }} className='p-1 ml-auto cursor-pointer hover:scale-95' color="#f50 ">{t("COURSESHOME.objectives.not_completed")}</Tag>
            </div>
        }
      </div>
    )
  }


  return (
    <>
      {
        confettiExplode ?
          <div className='absolute w-screen min-h-screen -mt-32 -ml-80'>
            {renderConfeti()}
          </div>
          :
          null
      }
      <div className=' max-h-full rounded-tl-3xl bg-[#e7eaf886] grid w-full'>
        <div className='relative flex flex-col flex-wrap min-w-full px-4 text-2xl font-bold md:px-6 grid-home:flex-row'>
          {
            isLoading ?
              <div className='flex items-center justify-center w-full h-full' >
                <MoonLoader color="#363cd6" size={80} />
              </div> :
              <>
                <div className={`flex ${user.role_str === 'student' && 'grid-home:max-w-[calc(100%-500px)]'} w-full gap-x-5 flex-wrap`}>
                  <main className='flex-1'>
                    <h1 className='pb-6 text-xl font-bold py-11'>{t("COURSESHOME.recent_courses")}</h1>
                    {
                      courses.length !== 0 ?
                        <motion.div id='course-motion-div'
                          className='flex flex-wrap gap-x-[5%] gap-y-[16px]  max-w-full justify-center md:justify-start '
                          initial="hidden" animate="visible" exit="hidden" variants={variants} transition={transition}>
                          {
                            courses && courses.map((course) => (
                              <CoursesCardHome key={course.id} course={course} />
                            ))
                          }
                        </motion.div> :
                        <motion.div id='course-motion-div'
                          className='mr-10'
                          initial="hidden" animate="visible" exit="hidden" variants={variants} transition={transition}>
                          <div
                            type="button"
                            className="relative block w-full p-12 text-center bg-white border border-gray-300 rounded-lg"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 mx-auto">
                              <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
                              <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
                              <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" />
                            </svg>

                            <span className="block mt-2 text-base font-medium text-gray-900">{t("COURSESHOME.not_courses")}</span>
                            <span className="block mt-2 text-sm font-medium text-gray-600">{t("COURSESHOME.not_courses_explore")}</span>
                          </div>
                        </motion.div>
                    }
                  </main>
                  {
                    user.role_str === 'student' &&
                    <div className='border h-fit border-gray-300 flex flex-col w-1/4 min-w-[350px] xl:w-[400px] min-w-3/4 mt-12 grid-home:absolute right-16 bg-white p-8 rounded-lg'>
                      <section >
                        <p className='text-lg font-semibold'>{t("COURSESHOME.daily_tasks")}</p>
                        <Divider />
                        {
                          dailyTasks.length > 0 ?

                            <div className='flex flex-col space-y-5 mb-10 max-h-[20rem] overflow-y-auto'>
                              {dailyTasks.map(RenderDailyTasks)}
                            </div>
                            :
                            <div className='flex'>
                              <div className='flex items-center justify-center w-full p-5 mb-10 border rounded-lg space-x-7'>
                                <Empty description={
                                  <span className='text-sm font-medium text-gray-400 '>{t("COURSESHOME.not_daily_tasks")}</span>
                                } />
                              </div>
                            </div>
                        }
                      </section>
                      <section>
                        <p className='text-lg font-semibold'>{t("COURSESHOME.objectives.objectives")}</p>
                        <Divider />
                        <div className='flex flex-col mb-5 space-y-5'>
                          {
                            objectives !== undefined && objectives.length > 0 ?
                              objectives.map(renderObjectives)
                              :
                              <div className='flex'>
                                <div className='flex items-center p-5 mb-10 bg-white shadow-md rounded-2xl space-x-7'>
                                  <p className='text-base font-medium text-gray-400 '>{t("COURSESHOME.objectives.not_objectives")}</p>
                                  <img className='hidden opacity-50 xl:block w-36' src="https://liferay-support.zendesk.com/hc/article_attachments/360032795211/empty_state.gif" alt="" />
                                </div>
                              </div>
                          }
                        </div>
                      </section>
                    </div>
                  }
                </div>

              </>
          }
        </div>
        <ModalCompleteObjectives isModalOpen={openModalCompleteObjectives} setIsModalOpen={setOpenModalCompleteObjectives} setObjectives={setObjectives} propsObjectives={objectiveSelected} setConfettiExplode={setConfettiExplode} />
        <ModalCreateCourseStudent expandCreateCourseStudent={expandCreateCourseStudent} setExpandCreateCourseStudent={setExpandCreateCourseStudent} setCourses={setCourses} />
      </div>
      {
        user &&
        <SpeedDialCreateCourse setExpandCreateCourseStudent={setExpandCreateCourseStudent} />
      }
    </>
  )
}


export default CoursesHome;