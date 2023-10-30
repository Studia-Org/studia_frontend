import { useEffect, useState, React } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API, BEARER } from "../../../constant";
import { getToken } from "../../../helpers";
import {
  ActivitiesText,
  ActivitiesLecture,
  ActivitiesDelivery,
  ActivitiesPeerReview,
  ActivitiesQuestionnaire,
} from "../components/Activities";
import { ProfessorData } from "../components/ProfessorData";
import { Nothing404 } from "../components/Nothing404";
import { Sidebar } from "../../../shared/elements/Sidebar";
import { Navbar } from "../../../shared/elements/Navbar";
import { AccordionCourseContent } from "../components/AccordionCourseContent";
import { ForumClickable } from "../components/ForumClickable";

import { Chatbot } from "../components/ChatBot";
import { ForumComponent } from "../components/ForumComponent";
import { QuestionnaireComponent } from "../components/QuestionnaireComponent";
import { set, sub } from "date-fns";

const CourseInside = () => {
  const [courseInsideSectionType, setcourseInsideSectionType] =
    useState("course");
  const [files, setFiles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [forumID, setForumID] = useState([]);
  const [forumFlag, setForumFlag] = useState(false);
  const [questionnaireFlag, setQuestionnaireFlag] = useState(false);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState([]);

  const [subsectionsCompleted, setSubsectionsCompleted] = useState([]);
  const [subsectionsLandscapePhoto, setSubsectionsLandscapePhoto] =
    useState(null);
  const [courseSubsection, setCourseSubsection] = useState([]);
  const [courseSection, setCourseSection] = useState([]);
  const [courseSubsectionQuestionnaire, setCourseSubsectionQuestionnaire] =
    useState([]);
  let { courseId } = useParams();
  const navigate = useNavigate();

  const [courseContentInformation, setCourseContentInformation] = useState([]);
  const [students, setStudents] = useState([]);
  const [professor, setProfessor] = useState([]);

  const componentMap = {
    paragraph: ActivitiesText,
    Delivery: ActivitiesDelivery,
    lecture: ActivitiesLecture,
    peer_review: ActivitiesPeerReview,
    cuestionario: ActivitiesQuestionnaire,
  };

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
        `${API}/courses/${courseId}?populate=sections.subsections.activities,sections.subsections.paragraphs,students.profile_photo,professor.profile_photo,sections.subsections.landscape_photo,sections.subsections.questionnaire`
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
        if (
          firstSubsection.subseccion.attributes.activities.data[0].attributes
            .type === "questionnaire"
        ) {
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
        subsecciones[0].attributes.activities.data[0].attributes.type ===
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
    fetchCourseInformation();
  }, []);

  useEffect(() => {
    fetchUserResponsesData();
  }, []);

  useEffect(() => {
    fetchPostData();
  }, []);

  function renderAllActivities(activities) {
    let Component = null;
    console.log(activities.data);
    if (activities.type === "paragraph") {
      Component = componentMap[activities.type];
    } else {
      Component = componentMap[activities.data.attributes.type];
    }
    if (Component) {
      return (
        <Component
          activitie={activities.data.attributes}
          activitieID={activities.data.id}
          courseID={courseId}
        />
      );
    }
    return null;
  }

  function RenderTextActivitiesInsideCourse() {
    const section_ = courseContentInformation.find(
      (seccion) => seccion.attributes.title === courseSection
    );
    const subsection_ = section_.attributes.subsections.data.find(
      (subseccion) =>
        subseccion.attributes.title === courseSubsection.attributes.title
    );
    var contenido = subsection_.attributes;

    const activities = contenido.activities.data.map((activity) => {
      return {
        type: "activity",
        order: activity.attributes.order,
        data: activity,
      };
    });

    const paragraphs = contenido.paragraphs.data.map((paragraph) => {
      return {
        type: "paragraph",
        order: paragraph.attributes.order,
        data: paragraph,
      };
    });

    const combinedList = [...activities, ...paragraphs];
    combinedList.sort((a, b) => a.order - b.order);

    return <div className="mb-12">{combinedList.map(renderAllActivities)}</div>;
  }

  function RenderFilesInsideCourse() {
    if (files.length === 0) {
      return <Nothing404 />;
    }
  }

  function RenderParticipantsInsideCourseHandler(students) {
    return (
      <button
        className="bg-white rounded flex p-3 items-center space-x-3 shadow w-[14rem]"
        onClick={() => navigate(`/app/profile/${students.id}/`)}
      >
        <img
          src={students.attributes.profile_photo.data.attributes.url}
          alt=""
          className="rounded w-14 h-14"
        />
        <p className="font-medium">{students.attributes.name}</p>
      </button>
    );
  }

  function RenderParticipantsInsideCourse() {
    if (students.data.length === 0) {
      return <Nothing404 />;
    } else {
      return (
        <div className="flex space-x-8">
          {students.data.map(RenderParticipantsInsideCourseHandler)}
        </div>
      );
    }
  }

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
                  className="rounded shadow mt-8"
                />
              ) : null}
              {questionnaireFlag === true ? (
                <div>
                  <QuestionnaireComponent
                    questionnaire={courseSubsectionQuestionnaire}
                    answers={questionnaireAnswers}
                    subsectionID={courseSubsection.id}
                  />
                </div>
              ) : (
                <div>
                  {courseSubsection.attributes && (
                    <p className="text-xl mt-5 font-semibold">
                      {courseSubsection.attributes.title}
                    </p>
                  )}
                  <div className="flex flex-row mt-8  items-center space-x-8 ml-5">
                    <button
                      className={`font-medium hover:text-black pb-3 ${
                        courseInsideSectionType === "course"
                          ? "text-black border-b-2 border-black"
                          : "text-gray-500"
                      }`}
                      onClick={() => setcourseInsideSectionType("course")}
                    >
                      Course
                    </button>
                    <button
                      className={`font-medium hover:text-black pb-3 ${
                        courseInsideSectionType === "files"
                          ? "text-black border-b-2 border-black"
                          : "text-gray-500"
                      }`}
                      onClick={() => setcourseInsideSectionType("files")}
                    >
                      Files
                    </button>
                    <button
                      className={`font-medium hover:text-black pb-3 ${
                        courseInsideSectionType === "participants"
                          ? "text-black border-b-2 border-black"
                          : "text-gray-500"
                      }`}
                      onClick={() => setcourseInsideSectionType("participants")}
                    >
                      Participants
                    </button>
                  </div>
                  <hr className="h-px  bg-gray-600 border-0 mb-6"></hr>
                  {courseInsideSectionType === "course" &&
                    courseContentInformation.length > 0 &&
                    courseSection.length > 0 &&
                    RenderTextActivitiesInsideCourse()}
                  {courseInsideSectionType === "files" &&
                    RenderFilesInsideCourse()}
                  {courseInsideSectionType === "participants" &&
                    RenderParticipantsInsideCourse()}
                </div>
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
