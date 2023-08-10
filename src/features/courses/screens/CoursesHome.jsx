import { useEffect, useState, React } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import 'react-loading-skeleton/dist/skeleton.css'
import '../styles/utils.css'
import { useAuthContext } from "../../../context/AuthContext";
import { Sidebar } from '../../../shared/elements/Sidebar';
import { CoursesCardHome } from '../components/CoursesCardHome';
import { Navbar } from '../../../shared/elements/Navbar';
import { MoonLoader } from "react-spinners";
import { API } from "../../../constant";
import { checkAuthenticated } from "../../../helpers";

const CoursesHome = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
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
      const response = await fetch(`${API}/users/${user.id}?populate=courses.cover,courses.students,courses.professor,courses.professor.profile_photo&fields[]=courses`);
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
    <div className='h-screen w-screen bg-white '>
      <Navbar />
      <div className='flex flex-wrap-reverse sm:h-[calc(100%-8rem)]   sm:flex-nowrap bg-white'>
        <Sidebar section={'courses'} />
        <div className='max-w-full w-full max-h-full rounded-tl-3xl bg-[#e7eaf886] '>
          <div className=' sm:px-12  font-bold text-2xl'>
            {!isLoading ? <motion.div className='flex flex-wrap py-11 sm:space-y-0 space-y-10  sm:space-x-12 space-x-0' initial="hidden" animate="visible" exit="hidden" variants={variants} transition={transition}>
              {courses.courses && courses.courses.map(RenderCourse)}
            </motion.div> : <div className='w-full h-full flex items-center justify-center' >
              <MoonLoader color="#363cd6" size={80} /></div>}
          </div>
        </div>
      </div>
    </div>
  )

}


export default CoursesHome;