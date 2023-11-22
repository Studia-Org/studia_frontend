import { useEffect, useState, React } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API, BEARER } from "../../../constant";
import { getToken } from "../../../helpers";
import ReactMarkdown from "react-markdown";
import { Tabs, Empty, Button } from "antd";
import { TaskComponentCard } from "../components/CreateCourses/CourseConfirmation/TaskComponentCard";
import { ProfessorData } from "../components/CoursesInside/ProfessorData";
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
  const [questionnaireFlag, setQuestionnaireFlag] = useState(false);
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
  const navigate = useNavigate();


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
        `${API}/courses/${courseId}?populate=sections.subsections.activities,sections.subsections.paragraphs,sections.subsections.files,students.profile_photo,professor.profile_photo,sections.subsections.landscape_photo,sections.subsections.questionnaire`
      );
      const data = await response.json();
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
        <div className="flex-1 min-w-0  sm:w-auto mt-3 ml-8 mr-8">
          {forumFlag === false ? (
            <div>
              {subsectionsLandscapePhoto !== null ? (
                <img
                  src={subsectionsLandscapePhoto}
                  alt=""
                  className="h-[30rem] w-full object-cover rounded-md shadow-md mt-5"
                />
              ) : null}
              {questionnaireFlag === true && questionnaireAnswers !== undefined ? (
                <QuestionnaireComponent
                  questionnaire={courseSubsectionQuestionnaire}
                  answers={questionnaireAnswers}
                  subsectionID={courseSubsection.id}
                />
              ) : (
                courseSection && courseContentInformation.length > 0 &&
                <>
                  {courseSubsection.attributes && (
                    <p className="text-xl mt-5 font-semibold">
                      {courseSubsection.attributes.title}
                    </p>
                  )}
                  <Tabs className='font-normal' tabBarStyle={{ borderBottom: '1px solid black' }} defaultActiveKey="1" items={items} />
                </>
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
              setCourseSubsectionQuestionnaire,
              subsectionsCompleted,
            }}
          />
          <ForumClickable posts={posts} setForumFlag={setForumFlag} />
          {professor.attributes && (
            <ProfessorData professor={professor} evaluatorFlag={false} />
          )}
        </div>
      </div>
      <Chatbot />
    </>
  );
};

export default CourseInside;
