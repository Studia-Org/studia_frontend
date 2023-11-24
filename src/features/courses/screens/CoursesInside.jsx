import { useEffect, useState, React } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API, BEARER } from "../../../constant";
import { getToken } from "../../../helpers";
import { Tabs } from "antd";
import { FiChevronRight } from "react-icons/fi";
import { ProfessorData } from "../components/CoursesInside/ProfessorData";
import { CourseSettings } from "../components/CoursesInside/CourseSettings";
import { AccordionCourseContent } from "../components/CoursesInside/AccordionCourseContent";
import { ForumClickable } from "../components/CoursesInside/ForumClickable";
import { Chatbot } from '../components/CoursesInside/ChatBot';
import { ForumComponent } from '../components/CoursesInside/ForumComponent'
import { QuestionnaireComponent } from '../components/CoursesInside/QuestionnaireComponent';
import { CourseParticipants, CourseContent, CourseFiles } from "../components/CoursesInside/TabComponents";

const CourseInside = () => {
  const [posts, setPosts] = useState([]);
  const [forumID, setForumID] = useState([]);
  const [forumFlag, setForumFlag] = useState(false);
  const [courseBasicInformation, setCourseBasicInformation] = useState([]);
  const [questionnaireFlag, setQuestionnaireFlag] = useState(false);
  const [settingsFlag, setSettingsFlag] = useState(false);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState([]);
  const [subsectionsCompleted, setSubsectionsCompleted] = useState([]);
  const [subsectionsLandscapePhoto, setSubsectionsLandscapePhoto] = useState(null);
  const [courseSubsection, setCourseSubsection] = useState([]);
  const [courseSection, setCourseSection] = useState();
  const [courseSubsectionQuestionnaire, setCourseSubsectionQuestionnaire] = useState([]);
  const [courseContentInformation, setCourseContentInformation] = useState([]);
  const [students, setStudents] = useState([]);
  const [professor, setProfessor] = useState([]);
  let { courseId } = useParams();


  const fetchPostData = async () => {
    try {
      const response = await fetch(
        `${API}/courses/${courseId}?populate=forum.posts.autor.profile_photo,forum.posts.forum_answers.autor.profile_photo`
      );
      const data = await response.json();
      setForumID(data.data.attributes.forum.data.id);
      setPosts(data.data.attributes.forum.data.attributes.posts.data.reverse());
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserResponsesData = async () => {
    const token = getToken();
    try {
      const response = await fetch(
        `${API}/users/me?populate=user_response_questionnaires.questionnaire,subsections_completed`,
        {
          headers: { Authorization: `${BEARER} ${token}` },
        }
      );
      const data = await response.json();
      setSubsectionsCompleted(data.subsections_completed);
      setQuestionnaireAnswers(data.user_response_questionnaires);
    } catch (error) {
      console.error(error);
    }
  };

  function obtenerPrimeraSubseccion() {
    const currentDate = new Date();
    let lastCompletedSubseccion = null;
    let cursoTitle = null;

    for (const curso of courseContentInformation) {
      const {
        id,
        attributes: {
          title,
          subsections: { data: subsecciones },
        },
      } = curso;

      for (const subseccion of subsecciones) {
        const subseccionId = subseccion.id;
        const subseccionCompletada = subsectionsCompleted.find(
          (sub) => sub.id === subseccionId
        );

        const subseccionStartDate = new Date(subseccion.attributes.start_date);
        const subseccionEndDate = new Date(subseccion.attributes.end_date);

        if (
          !subseccionCompletada &&
          currentDate >= subseccionStartDate &&
          currentDate <= subseccionEndDate
        ) {
          return { subseccion, cursoTitle: title };
        }

        if (subseccionCompletada) {
          lastCompletedSubseccion = subseccion;
          cursoTitle = title;
        }
      }
    }

    if (lastCompletedSubseccion) {
      return { subseccion: lastCompletedSubseccion, cursoTitle };
    }

    return null;
  }

  const fetchCourseInformation = async () => {
    try {
      const response = await fetch(
        `${API}/courses/${courseId}?populate=sections.subsections.activities,cover,sections.subsections.paragraphs,sections.subsections.files,students.profile_photo,professor.profile_photo,sections.subsections.landscape_photo,sections.subsections.questionnaire`
      );
      const data = await response.json();
      setCourseBasicInformation(data?.data?.attributes ?? []);
      setCourseContentInformation(data?.data?.attributes?.sections?.data ?? []);
      setStudents(data?.data?.attributes?.students ?? []);
      setProfessor(data?.data?.attributes?.professor?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (
      courseContentInformation.length > 0 &&
      subsectionsCompleted.length > 0
    ) {
      const firstSubsection = obtenerPrimeraSubseccion(
        courseContentInformation,
        subsectionsCompleted
      );
      if (firstSubsection) {
        if (firstSubsection?.subseccion?.attributes?.activities?.data[0]?.attributes?.type === 'questionnaire') {
          setCourseSubsection(firstSubsection.subseccion);
          setQuestionnaireFlag(true);
          setCourseSubsectionQuestionnaire(
            firstSubsection.subseccion.attributes.questionnaire.data
          );
        } else {
          setCourseSection(firstSubsection.cursoTitle);
          setCourseSubsection(firstSubsection.subseccion);
        }
      }
    } else if (
      courseContentInformation.length > 0 &&
      subsectionsCompleted.length === 0
    ) {
      const {
        attributes: {
          title,
          subsections: { data: subsecciones },
        },
      } = courseContentInformation[0];
      if (
        subsecciones[0]?.attributes?.activities?.data[0]?.attributes?.type ===
        "questionnaire"
      ) {
        setCourseSubsection(subsecciones[0]);
        setQuestionnaireFlag(true);
        setCourseSubsectionQuestionnaire(
          subsecciones[0].attributes.questionnaire.data
        );
      } else {
        setCourseSection(title);
        setCourseSubsection(subsecciones[0]);
      }
    }
  }, [courseContentInformation, subsectionsCompleted]);

  useEffect(() => {
    if (courseSubsection.length !== 0) {
      setSubsectionsLandscapePhoto(
        courseSubsection.attributes.landscape_photo?.data?.attributes?.url ??
        null
      );
    }
  }, [courseSubsection]);

  useEffect(() => {
    fetchUserResponsesData();
    fetchCourseInformation();
    fetchPostData();
  }, []);

  const items = [
    {
      key: '1',
      label: 'Course',
      children: <CourseContent courseContentInformation={courseContentInformation} courseSection={courseSection} courseSubsection={courseSubsection} courseId={courseId} />,
    },
    {
      key: '2',
      label: 'Files',
      children: <CourseFiles courseContentInformation={courseContentInformation} courseSection={courseSection} courseSubsection={courseSubsection} />,
    },
    {
      key: '3',
      label: 'Participants',
      children: <CourseParticipants students={students} />,
    }
  ];

  return (
    <>
      <div className="container-fluid min-h-screen w-screen rounded-tl-3xl bg-[#e7eaf886] flex flex-wrap">
        <div className="flex-1 min-w-0 sm:w-auto mt-3 ml-8 mr-8">
          {forumFlag === false ? (
            <div>
              {(subsectionsLandscapePhoto && !settingsFlag) && (
                <img
                  src={subsectionsLandscapePhoto}
                  alt=""
                  className="h-[30rem] w-full object-cover rounded-md shadow-md mt-5"
                />
              )}
              {
                settingsFlag ? (
                  <>
                    <CourseSettings setSettingsFlag={setSettingsFlag} courseData={courseBasicInformation} setCourseData={setCourseBasicInformation} />
                  </>
                ) :
                  questionnaireFlag && questionnaireAnswers !== undefined ? (
                    <QuestionnaireComponent
                      questionnaire={courseSubsectionQuestionnaire}
                      answers={questionnaireAnswers}
                      subsectionID={courseSubsection.id}
                    />
                  ) :
                    (
                      courseSection && courseContentInformation.length > 0 && (
                        <>
                          <p className="text-xl mt-5 font-semibold">{courseSubsection.attributes.title}</p>
                          <Tabs className='font-normal' tabBarStyle={{ borderBottom: '1px solid black' }} defaultActiveKey="1" items={items} />
                        </>
                      )
                    )}
            </div>
          ) : (
            <ForumComponent posts={posts} forumID={forumID} />
          )}
        </div>
        <div>
          <AccordionCourseContent
            {...{
              courseContentInformation,
              setCourseSubsection,
              setCourseSection,
              setForumFlag,
              setQuestionnaireFlag,
              setSettingsFlag,
              setCourseSubsectionQuestionnaire,
              subsectionsCompleted,
            }}
          />
          <ForumClickable posts={posts} setForumFlag={setForumFlag} />
          {professor.attributes && <ProfessorData professor={professor} evaluatorFlag={false} />}
          <button onClick={() => setSettingsFlag(true)} className="bg-white p-3 rounded-md shadow-md flex items-center mt-4 w-[30rem]">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-2">
                <path fillRule="evenodd" d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 01-.517.608 7.45 7.45 0 00-.478.198.798.798 0 01-.796-.064l-.453-.324a1.875 1.875 0 00-2.416.2l-.243.243a1.875 1.875 0 00-.2 2.416l.324.453a.798.798 0 01.064.796 7.448 7.448 0 00-.198.478.798.798 0 01-.608.517l-.55.092a1.875 1.875 0 00-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 01-.064.796l-.324.453a1.875 1.875 0 00.2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 01.796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 01.517-.608 7.52 7.52 0 00.478-.198.798.798 0 01.796.064l.453.324a1.875 1.875 0 002.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 01-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 001.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 01-.608-.517 7.507 7.507 0 00-.198-.478.798.798 0 01.064-.796l.324-.453a1.875 1.875 0 00-.2-2.416l-.243-.243a1.875 1.875 0 00-2.416-.2l-.453.324a.798.798 0 01-.796.064 7.462 7.462 0 00-.478-.198.798.798 0 01-.517-.608l-.091-.55a1.875 1.875 0 00-1.85-1.566h-.344zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
              </svg>
              <p className="font-medium"> Course Settings</p>
            </div>
            <div className="mr-2 flex items-center ml-auto">
              <p className='text-base font-medium text-indigo-700'>Edit course info</p>
              <FiChevronRight className='text-indigo-700' />
            </div>

          </button>
        </div>
      </div>
      <Chatbot />
    </>
  );

};

export default CourseInside;
