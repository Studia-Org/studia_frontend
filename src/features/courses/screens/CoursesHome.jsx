import { useEffect, useState, React } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTimeout, useWindowSize } from 'react-use';
import 'react-loading-skeleton/dist/skeleton.css'
import '../styles/utils.css'
import { getToken } from '../../../helpers';
import { useAuthContext } from "../../../context/AuthContext";
import { CoursesCardHome } from '../components/CoursesHome/CoursesCardHome';

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [dailyTasks, setDailyTasks] = useState([]);


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
    if (user.role_str === 'professor') {
      try {
        const response = await fetch(`${API}/courses?populate=*,professor.profile_photo,course_tags,cover,students.profile_photo`);
        const data = await response.json();
        const coursesFiltered = data.data.filter((course) => course.attributes.professor.data.id === user.id)
        setCourses(coursesFiltered ?? []);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    } else if (user.role_str === 'student') {
      try {
        const response = await fetch(`${API}/users/${user?.id}?populate=courses.cover,courses.students.profile_photo,courses.professor,courses.professor.profile_photo,courses.course_tags`);
        const data = await response.json();
        setCourses(data.courses ?? []);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    } else if (user.role_str === 'admin') {
      try {
        const response = await fetch(`${API}/courses?populate=*,professor.profile_photo,course_tags,cover,students.profile_photo`);
        const data = await response.json();
        setCourses(data.data ?? []);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    }

  };
  const fetchUserObjectives = async () => {
    try {
      const response = await fetch(`${API}/users/${user.id}?populate=user_objectives`);
      const data = await response.json();
      setObjectives(data.user_objectives)
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

  function RenderCourse(course) {
    return (
      <CoursesCardHome course={course} />
    )
  }

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
      <div className='relative bg-white rounded-2xl shadow-md flex p-3 min-w-[450px] md:w-[28rem] lg:w-[30rem] min-h-[5rem]'>
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
      <div id="confetti" className='min-w-screen move-confetti'>
        {confettiActive && (
          <Confetti />
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
          body: JSON.stringify({ data: { completed: !props.completed } }),
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
      <div>
        <div className='bg-white rounded-2xl shadow-md flex  min-w-[450px] p-5 md:w-[28rem] lg:w-[30rem]'>
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
                <div className={`flex flex-col ${user.role.type === 'student' && 'grid-home:max-w-[calc(100%-500px)]'} w-full`}>
                  <p className='py-11 pb-6 font-bold text-xl'>Recent Courses</p>
                  <motion.div id='course-motion-div'
                    className='flex flex-wrap gap-x-[5%] gap-y-[16px]  max-w-full justify-center md:justify-start '
                    initial="hidden" animate="visible" exit="hidden" variants={variants} transition={transition}>
                    {courses && courses.map(RenderCourse)}
                  </motion.div>
                </div>

                <div className='flex flex-col md:w-[480px] min-w-3/4 mt-12 grid-home:absolute right-16 '>
                  <div className=''>
                    {
                      user.role_str !== 'professor' && user.role_str !== 'admin' ?
                        <>
                          <p className=' pb-6 font-bold text-xl'>Daily Tasks</p>
                          {
                            dailyTasks.length > 0 ?

                              <div className='flex flex-col space-y-5 mb-10'>
                                {dailyTasks.map(RenderDailyTasks)}
                              </div>
                              :
                              <div className='flex'>
                                <div className='bg-white shadow-md rounded-2xl p-5 flex mb-10 items-center space-x-7'>
                                  <p className='font-medium text-gray-400 text-base '>There are no tasks for today</p>
                                  <img className='opacity-50 w-36' src="https://liferay-support.zendesk.com/hc/article_attachments/360032795211/empty_state.gif" alt="" />
                                </div>
                              </div>
                          }
                        </> : null
                    }
                  </div>
                  <div className=''>
                    {
                      user.role_str !== 'professor' && user.role_str !== 'admin' ?
                        <>
                          <p className=' pb-6 font-bold text-xl'>Your Objectives</p>
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
                        </>
                        :
                        null
                    }
                  </div>
                </div>
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