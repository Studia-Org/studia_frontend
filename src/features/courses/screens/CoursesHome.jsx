import { useEffect, useState, React } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import 'react-loading-skeleton/dist/skeleton.css'
import '../styles/utils.css'
import { useAuthContext } from "../../../context/AuthContext";
import { Sidebar } from '../../../shared/elements/Sidebar';
import { CoursesCardHome } from '../components/CoursesCardHome';
import { FiPlus } from 'react-icons/fi';
import { Navbar } from '../../../shared/elements/Navbar';
import { MoonLoader } from "react-spinners";
import { API } from "../../../constant";
import { FiChevronRight } from 'react-icons/fi';
import { checkAuthenticated } from "../../../helpers";

const CoursesHome = () => {
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleOpen = value => {
    setOpen(true);
  };
  const transition = { duration: 0.3 };
  const { user } = useAuthContext();


  useEffect(() => {
    if (!checkAuthenticated()) {
      navigate('/');
    }
  }, []);

  const fetchCoursesCards = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API}/users/${user.id}?populate=courses.cover,courses.students,courses.professor,courses.professor.profile_photo`);
      const data = await response.json();
      setCourses(data ?? []);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isLoading) {
      fetchCoursesCards();
    }
  }, [isLoading, user]);

  function RenderCourse(course) {
    return (
      <CoursesCardHome course={course} />
    )
  }

  return (
    <div className='min-h-screen  bg-white '>
      <Navbar />
      <Sidebar section={'courses'} />
      <div className='flex min-h-[calc(100vh-8rem)] md:ml-80 md:min-w-[calc(100vw-20rem)] md:flex-nowrap bg-white'>
        <div className=' max-h-full rounded-tl-3xl bg-[#e7eaf886] grid w-full'>
          <div className=' sm:px-12  font-bold text-2xl'>
            {!isLoading ?
              <motion.div id='course-motion-div' className='flex flex-wrap py-11 gap-9 justify-center md:justify-start ' initial="hidden" animate="visible" exit="hidden" variants={variants} transition={transition}>
                {courses.courses && courses.courses.map(RenderCourse)}
              </motion.div> :
              <div className='w-full h-full flex items-center justify-center' >
                <MoonLoader color="#363cd6" size={80} />
              </div>
            }
          </div>
        </div>
        {
          user && user.role_str === 'admin' ?
            <div className='fixed right-10 bottom-10'>
              <div
                id="speed-dial-menu-dropdown"
                className={`bg-white shadow rounded-2xl transform scale-0 opacity-0 mb-5 h-3 w-[24rem]  duration-200 ${isExpanded ? 'scale-100 h-[12rem] w-[20rem] opacity-100' : ''}`}
              >
                <div className='p-4 flex flex-col text-base font-medium space-y-4 '>
                  <button className='flex items-center text-left  hover:border-l-4 border-black transition-all duration-100 ' onClick={() => navigate('create')}>
                    <p className='ml-2'>Create new course from a template</p>
                    <FiChevronRight className='ml-auto' />
                  </button>
                  <button className='flex items-center text-left hover:border-l-4 border-black transition-all duration-100' onClick={() => navigate('create')}>
                    <p className='ml-2'>Create new course</p>
                    <FiChevronRight className='ml-auto' />
                  </button>
                  <div className=''>
                    <hr />
                    <button className='font-light text-sm mt-2'>Do you need help?</button>
                  </div>
                </div>
              </div>
              <button
                type="button"
                data-dial-toggle="speed-dial-menu-dropdown"
                aria-controls="speed-dial-menu-dropdown"
                className="flex shadow-lg items-center transition  justify-center ml-auto text-white bg-blue-600 rounded-full w-14 h-14 hover:bg-blue-600 hover-scale active-scale  "
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <FiPlus size={26} />
                <span className="sr-only"></span>
              </button>
            </div>
            :
            <div>
            </div>
        }
      </div>
    </div>
  )

}


export default CoursesHome;