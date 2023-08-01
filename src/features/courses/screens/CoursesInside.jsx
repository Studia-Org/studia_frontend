import { useEffect, useState, React } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from "../../../constant";
import { ActivitiesText, ActivitiesLecture, ActivitiesDelivery, ActivitiesPeerReview, ActivitiesQuestionnaire } from '../components/Activities';
import { ProfessorData } from '../components/ProfessorData';
import { Nothing404 } from '../components/Nothing404';
import { Sidebar } from '../../../shared/elements/Sidebar';
import { Navbar } from '../../../shared/elements/Navbar';
import { AccordionCourseContent } from '../components/AccordionCourseContent';
import { Chatbot } from '../components/ChatBot';



const CourseInside = () => {
  const [courseInsideSectionType, setcourseInsideSectionType] = useState('course');
  const [files, setFiles] = useState([]);
  const [courseSubsection, setCourseSubsection] = useState([]);
  const[students, setStudents] = useState([])
  const [courseContentInformation, setCourseContentInformation] = useState([]);
  const [courseSection, setCourseSection] = useState([]);
  const [courses, setCourses] = useState([]);
  let { courseId } = useParams();
  const navigate = useNavigate();

  const componentMap = {
    texto: ActivitiesText,
    entrega: ActivitiesDelivery,
    lecture: ActivitiesLecture,
    peer_review: ActivitiesPeerReview,
    cuestionario: ActivitiesQuestionnaire,
  };

  const fetchCourseInformation = async () => {
    try {
      const response = await fetch(`${API}/courses/${courseId}?populate=sections.subsections.activities,students.profile_photo`);
      const data = await response.json();
      console.log(data.data.attributes.students.data)
      setCourseContentInformation(data?.data?.attributes?.sections?.data ?? []);
      setStudents(data?.data?.attributes?.students ?? []);
      setCourses(data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  useEffect(() => {
    fetchCourseInformation();
  }, []);

  function renderAllActivities(activities) {
    const Component = componentMap[activities.tipo];
    if (Component) {
      return <Component activitie={activities} />;
    }
    return null;
  }

  function RenderTextActivitiesInsideCourse() {
    //const section_ = courseContentInformation.find(seccion => seccion.titulo === courseSection);
    //const subsection_ = section_.subsecciones.find(subseccion => subseccion.titulo === courseSubsection);
    //var contenido = subsection_.contenido;
    return (
      <div className='mb-12'>
        {/*contenido.map(renderAllActivities)*/}
      </div>
    )
  }

  function RenderFilesInsideCourse() {
    if (files.length === 0) {
      return (
        <Nothing404 />
      )
    }
  }

  function RenderParticipantsInsideCourseHandler(students) {
    return (
      <button className='bg-white rounded flex p-3 items-center space-x-3 shadow w-[14rem]' onClick={() => navigate(`/app/profile/${students.id}/`)}>
        <img src={students.attributes.profile_photo.data.attributes.url} alt="" className='rounded w-14 h-14'/>
        <p className='font-medium'>{students.attributes.name}</p>
      </button>
    )
  }

  function RenderParticipantsInsideCourse() {
    if (students.data.length === 0) {
      return (
        <Nothing404 />
      )
    } else {
      return (
        <div className='flex space-x-8'>
          {students.data.map(RenderParticipantsInsideCourseHandler)}
        </div>
      )
    }
  }


  return (
    <div className='h-screen w-full bg-white'>
      <Navbar />
      <div className='flex flex-wrap-reverse sm:flex-nowrap bg-white'>
        <Sidebar section={'courses'} />
        <div className='container-fluid min-h-screen w-screen rounded-tl-3xl bg-[#e7eaf886] flex flex-wrap'>
          <div className='flex-1 min-w-0  sm:w-auto mt-8 ml-8 mr-8'>
            <img src="https://kinsta.com/wp-content/uploads/2022/03/what-is-postgresql.png" alt="" className='rounded shadow' />
            <p className='text-xl mt-5 font-semibold'>{courseSubsection}</p>
            <div className='flex flex-row mt-8  items-center space-x-8 ml-5'>
              <button
                className={`font-medium hover:text-black pb-3 ${courseInsideSectionType === 'course' ? 'text-black border-b-2 border-black' : 'text-gray-500'
                  }`}
                onClick={() => setcourseInsideSectionType('course')}
              >
                Course
              </button>
              <button
                className={`font-medium hover:text-black pb-3 ${courseInsideSectionType === 'files' ? 'text-black border-b-2 border-black' : 'text-gray-500'
                  }`}
                onClick={() => setcourseInsideSectionType('files')}
              >
                Files
              </button>

              <button
                className={`font-medium hover:text-black pb-3 ${courseInsideSectionType === 'participants' ? 'text-black border-b-2 border-black' : 'text-gray-500'
                  }`}
                onClick={() => setcourseInsideSectionType('participants')}
              >
                Participants
              </button>
            </div>
            <hr className="h-px  bg-gray-600 border-0 mb-6"></hr>
            {/*courseInsideSectionType === 'course' && courseContentInformation.length > 0 && RenderTextActivitiesInsideCourse()*/}
            {courseInsideSectionType === 'files' && RenderFilesInsideCourse()}
            {courseInsideSectionType === 'participants' && RenderParticipantsInsideCourse()}
          </div>
          <div>
            
            <AccordionCourseContent {...{ courseContentInformation, setCourseSubsection, setCourseSection }} />
            
            {/*courseInformation && courseInformation.professor && (
              <ProfessorData professor={courseInformation.professor} />
            )*/}
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  )
}

export default CourseInside;