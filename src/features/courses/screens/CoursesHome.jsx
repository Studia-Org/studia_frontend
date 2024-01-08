import { useEffect, useState, React } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import 'react-loading-skeleton/dist/skeleton.css'
import '../styles/utils.css'
import { getToken } from '../../../helpers';
import { useAuthContext } from "../../../context/AuthContext";
import { CoursesCardHome } from '../components/CoursesHome/CoursesCardHome';
import { Divider, Empty } from 'antd';
import Swal from 'sweetalert2'
import { MoonLoader } from "react-spinners";
import { API } from "../../../constant";
import Confetti from 'react-confetti'
import { checkAuthenticated } from "../../../helpers";
import { Whisper, Button, Popover } from 'rsuite';
import { Chip } from '@mui/material';
import { SpeedDialCreateCourse } from '../components/CoursesHome/SpeedDialCreateCourse';

const CoursesHome = () => {
  const { user } = useAuthContext();
  const [confettiActive, setConfettiActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [objectives, setObjectives] = useState([]);
  const [confettiExplode, setConfettiExplode] = useState(false);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [openObjectivesModal, setOpenObjectivesModal] = useState(false);

  document.title = 'Home - Uptitude'
  const navigate = useNavigate();

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  const transition = { duration: 0.3 };

  const handleOpen = value => {
    setOpen(true);
  };


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

  useEffect(() => {
    if (!checkAuthenticated()) {
      navigate('/');
    }
  }, []);

  const fetchCoursesCards = async () => {
    setIsLoading(true);
    try {
      let endpoint = `${API}/courses?populate=*,professor.profile_photo,course_tags,cover,students.profile_photo`;
      if (user.role_str === 'student') {
        endpoint = `${API}/users/${user?.id}?populate=courses.cover,courses.students.profile_photo,courses.professor,courses.professor.profile_photo,courses.course_tags`;
      }
      const response = await fetch(endpoint);
      const data = await response.json();
      const coursesFiltered = filterCoursesByRole(data, user);
      const finalCourses = coursesFiltered.map(mapCourseData);
      setCourses(finalCourses ?? []);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  const filterCoursesByRole = (data, user) => {
    if (user.role_str === 'professor' || user.role_str === 'admin') {
      return data.data.filter(course => course.attributes.professor.data.id === user.id);
    } else if (user.role_str === 'student') {
      return data.courses;
    }
  };
  const mapCourseData = course => ({
    id: course.id,
    title: course.title || course.attributes.title,
    cover: course.cover ? course.cover.url : course.attributes.cover.data?.attributes.url,
    professor_name: course.professor ? course.professor.name : course.attributes.professor.data.attributes.name,
    tags: course?.tags || course.attributes?.tags,
    professor_profile_photo: course.professor ? course.professor.profile_photo.url : course.attributes.professor.data.attributes.profile_photo.data.attributes.url,
    students: course.students || course.attributes.students.data
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
      const response = await fetch(`${API}/users/${user.id}?populate=courses.sections.subsections,courses.cover`);
      const data = await response.json();

      let newDailyTasks = [];

      data.courses.forEach((course) => {
        course.sections.forEach((section) => {
          section.subsections.forEach((subsection) => {
            const fechaActual = new Date();
            if (fechaActual >= new Date(subsection.start_date) && fechaActual <= new Date(subsection.end_date)) {
              if (!newDailyTasks.some((task) => task.id === subsection.id)) {
                newDailyTasks.push({ subsection, cover: course.cover.url });
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

  const speaker = (props) => {
    return (
      <Popover>
        <p>This task is about to end soon on {new Date(props).toDateString()} </p>
      </Popover>
    )
  }

  function RenderDailyTasks(subsection) {
    var colorStyle = undefined;
    const endDate = new Date(subsection.subsection.end_date);
    const today = new Date();
    const twoDaysBeforeEndDate = new Date(endDate);
    twoDaysBeforeEndDate.setDate(endDate.getDate() - 2);
    const isDateDangerous = twoDaysBeforeEndDate <= today;

    if (subsection.subsection.fase === 'Performance') {
      colorStyle = { backgroundColor: '#eab308' }
    } else if (subsection.subsection.fase === 'Self-reflection') {
      colorStyle = { backgroundColor: '#ef4444' }
    } else if (subsection.subsection.fase === 'Forethought') {
      colorStyle = { backgroundColor: '#166534' }
    }

    return (
      <div className='relative rounded-2xl border flex p-3 min-w-[350px] md:w-[22rem] lg:w-[24rem] min-h-[5rem]'>
        <div className="w-2 rounded-md mr-3" style={colorStyle}></div>
        <div className='flex-col flex justify-center w-full max-w-[calc(100%-6rem)]'>
          <div className='flex w-full'>
            <p className=' font-semibold text-base'>{subsection.subsection.title}</p>
            {
              isDateDangerous === true ?
                <div className='flex items-center mr-3'>
                  <Whisper placement="top" className='text-sm shadow-md' trigger="hover" controlId="control-id-hover" speaker={speaker(subsection.subsection.end_date)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500 ml-2">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                    </svg>
                  </Whisper>
                </div> : null
            }
          </div>

          <p className='font-normal text-sm w-3/4 line-clamp-1 text-gray-500'>{subsection.subsection.description}</p>
        </div>

        <img className='object-cover w-24 top-0 right-0 h-full absolute rounded-r-lg opacity-90' src={subsection.cover} alt="" />
      </div>
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

  const handleObjectiveCompleted = async (props) => {
    const textSwal = props.completed === true ? 'not completed' : 'completed';
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to set this objective as ${textSwal}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then(async (result) => {

      if (result.isConfirmed) {
        const updateUserObjectives = await fetch(`${API}/user-objectives/${props.id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: { completed: !props.completed, id: props.id } }),
        });
        const data = await updateUserObjectives.json();
        const updatedObjective = { ...props, completed: !props.completed };
        setObjectives((prevObjectives) => {
          return prevObjectives.map((obj) =>
            obj.id === updatedObjective.id ? updatedObjective : obj
          );
        });

        Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
            if (props.completed === false) {
              setConfettiExplode(true);
              setTimeout(() => {
                setConfettiExplode(false);
              }, 10000);
            }
          },

        }).fire({
          icon: 'success',
          title: 'Status updated successfully'
        })
      }
    })
  }

  function renderObjectives(objective) {
    return (
      <div key={objective.id} className='bg-white rounded-lg border flex  p-5 '>
        <p className='font-medium text-base'>{objective.objective}</p>
        {
          objective.completed === true ?
            <div className='ml-auto'>
              <Chip label='Completed' color='success' className='ml-auto ' onClick={() => handleObjectiveCompleted(objective)} />
            </div>
            :
            <div className='ml-auto'>
              <Chip label='Not Completed' color='info' className='ml-auto' onClick={() => handleObjectiveCompleted(objective)} />
            </div>
        }
      </div>
    )
  }


  return (
    <>
      {
        confettiExplode ?
          <div className='w-screen absolute -ml-80 -mt-32 min-h-screen'>
            {renderConfeti()}
          </div>
          :
          null
      }
      <div className=' max-h-full rounded-tl-3xl bg-[#e7eaf886] grid w-full'>
        <div className=' sm:px-12 px-6  font-bold text-2xl flex flex-wrap min-w-full relative flex-col grid-home:flex-row '>
          {
            isLoading ?
              <div className='w-full h-full flex items-center justify-center' >
                <MoonLoader color="#363cd6" size={80} />
              </div> :
              <>
                <div className={`flex flex-col ${user.role_str === 'student' && 'grid-home:max-w-[calc(100%-500px)]'} w-full`}>
                  <h1 className='py-11 pb-6 font-bold text-xl'>Recent Courses</h1>
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
                          className="relative block w-full rounded-lg border border-gray-300 p-12 text-center bg-white"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 mx-auto">
                            <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
                            <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
                            <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" />
                          </svg>

                          <span className="mt-2 block text-base font-medium text-gray-900">There are no courses available for you</span>
                          <span className="mt-2 block text-sm font-medium text-gray-600">Explore other areas of the platform or check back later for new course options.</span>
                        </div>
                      </motion.div>
                  }

                </div>

                {
                  user.role_str === 'student' &&
                  <div className='border border-gray-300 flex flex-col md:w-[480px] min-w-3/4 mt-12 grid-home:absolute right-16 bg-white p-8 rounded-lg'>
                    <section >
                      <p className='font-semibold text-lg'>Daily Tasks</p>
                      <Divider />
                      {
                        dailyTasks.length > 0 ?

                          <div className='flex flex-col space-y-5 mb-10 max-h-[20rem] overflow-y-auto'>
                            {dailyTasks.map(RenderDailyTasks)}
                          </div>
                          :
                          <div className='flex'>
                            <div className='border rounded-lg p-5 flex mb-10 items-center justify-center w-full space-x-7'>
                              <Empty description={
                                <span className='font-medium text-gray-400 text-sm '>You do not have any task for today</span>
                              } />
                            </div>
                          </div>
                      }
                    </section>
                    <section>
                      <p className='font-semibold text-lg'>Your Objectives</p>
                      <Divider />
                      <div className='space-y-5 flex flex-col mb-5'>
                        {
                          objectives !== undefined && objectives.length > 0 ?
                            objectives.map(renderObjectives)
                            :
                            <div className='flex'>
                              <div className='bg-white shadow-md rounded-2xl p-5 flex mb-10 items-center space-x-7'>
                                <p className='font-medium text-gray-400 text-base '>You did not set any objective yet!</p>
                                <img className='opacity-50 w-36' src="https://liferay-support.zendesk.com/hc/article_attachments/360032795211/empty_state.gif" alt="" />
                              </div>
                            </div>
                        }
                      </div>
                    </section>
                  </div>
                }
              </>
          }
        </div>
      </div>
      {
        user && (user.role_str === 'admin' || user.role_str === 'professor') ?
          <SpeedDialCreateCourse />
          : null
      }
    </>
  )
}


export default CoursesHome;