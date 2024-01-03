import { useEffect, useState, React, useRef } from "react";
import { useParams } from "react-router-dom";
import { API, BEARER } from "../../../constant";
import { getToken } from "../../../helpers";
import { Tabs, Popconfirm, Badge, FloatButton } from "antd";
import { SwitchEdit } from "../components/CoursesInside/SwitchEdit";
import { FiChevronRight } from "react-icons/fi";
import { ProfessorData } from "../components/CoursesInside/ProfessorData";
import { CourseSettings } from "../components/CoursesInside/CourseSettings";
import { AccordionCourseContent } from "../components/CoursesInside/AccordionCourseContent";
import { ForumClickable } from "../components/CoursesInside/Forum/ForumClickable";
import { ForumComponent } from '../components/CoursesInside/Forum/ForumComponent'
import { QuestionnaireComponent } from '../components/CoursesInside/QuestionnaireComponent';
import { CourseParticipants, CourseContent, CourseFiles } from "../components/CoursesInside/TabComponents";
import { useAuthContext } from "../../../context/AuthContext";
import { EditSection } from "../components/CoursesInside/EditSection";
import FloatingButtonNavigation from "../components/CoursesInside/FloatingButtonNavigation";

const CourseInside = () => {
  const inputRefLandscape = useRef(null);
  const [titleSubsection, setTitleSubsection] = useState("");
  const [backgroundPhotoSubsection, setBackgroundPhotoSubsection] = useState()
  const [allForums, setAllForums] = useState([]);
  const [enableEdit, setEnableEdit] = useState(false)
  const [forumFlag, setForumFlag] = useState(false);
  const [editSectionFlag, setEditSectionFlag] = useState(false);
  const [sectionToEdit, setSectionToEdit] = useState(null);
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
  const { user } = useAuthContext()
  const whisper = useRef(null);

  function handleLandscapePhotoChange(event) {
    setBackgroundPhotoSubsection(event.target.files[0]);
  }

  const fetchPostData = async () => {
    try {
      const response = await fetch(
        `${API}/courses/${courseId}?populate=forums.posts.autor.profile_photo,forums.posts.forum_answers.autor.profile_photo`
      );
      const data = await response.json();
      setAllForums(data.data.attributes.forums.data);
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
        `${API}/courses/${courseId}?populate=sections.subsections.activity,cover,sections.subsections.paragraphs,sections.subsections.files,students.profile_photo,professor.profile_photo,sections.subsections.landscape_photo,sections.subsections.questionnaire`
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
        console.log(firstSubsection?.subseccion?.attributes?.activity?.data?.attributes?.type)
        if (firstSubsection?.subseccion?.attributes?.activity?.data?.attributes?.type === 'questionnaire') {
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
        subsecciones[0]?.attributes?.activity?.data?.attributes?.type ===
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

  function deleteFile() {
    setBackgroundPhotoSubsection(undefined)
  }

  useEffect(() => {
    if (courseSubsection.length !== 0) {
      setSubsectionsLandscapePhoto(
        courseSubsection.attributes.landscape_photo?.data?.attributes?.url ??
        null
      );
    }
    setTitleSubsection(courseSubsection?.attributes?.title);
    setBackgroundPhotoSubsection(courseSubsection?.attributes?.landscape_photo?.data?.attributes?.url)
  }, [courseSubsection]);

  useEffect(() => {
    fetchUserResponsesData();
    fetchCourseInformation();
    fetchPostData();


  }, []);

  useEffect(() => {
    const handleResize = (e) => {
      whisper.current?.close();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const items = [
    {
      key: '1',
      label: 'Course',
      children: <CourseContent setForumFlag={setForumFlag} courseContentInformation={courseContentInformation} courseSection={courseSection} courseSubsection={courseSubsection} courseId={courseId} enableEdit={enableEdit} setEnableEdit={setEnableEdit} setCourseContentInformation={setCourseContentInformation} titleSubsection={titleSubsection} backgroundPhotoSubsection={backgroundPhotoSubsection} />,
    },
    {
      key: '2',
      label: 'Files',
      children: <CourseFiles courseContentInformation={courseContentInformation} courseSection={courseSection} courseSubsection={courseSubsection} enableEdit={enableEdit} setCourseContentInformation={setCourseContentInformation} />,
    },
    {
      key: '3',
      label: 'Participants',
      children: <CourseParticipants students={students} enableEdit={enableEdit} setSettingsFlag={setSettingsFlag} />,
    }
  ];

  return (
    <>
      <div className="container-fluid min-h-screen w-screen max-w-full rounded-tl-3xl bg-[#e7eaf886] flex flex-wrap flex-col-reverse md:flex-row  ">
        <div id="flex_wrap" className="flex-1 max-w-full min-w-0 sm:w-auto mt-3 md:ml-8 md:mr-8 p-5 md:p-0 md:basis-[600px]">
          {editSectionFlag && sectionToEdit !== null ? (
            <EditSection setEditSectionFlag={setEditSectionFlag} sectionToEdit={sectionToEdit} setCourseContentInformation={setCourseContentInformation} setSectionToEdit={setSectionToEdit} />
          ) : !forumFlag ? (
            <div>
              {
                backgroundPhotoSubsection && !settingsFlag && (
                  enableEdit ?
                    <div className="relative w-full mt-5 h-[30rem]">
                      <input type="file" ref={inputRefLandscape} accept="image/*" className="absolute  h-[30rem] w-full top-0 left-0 z-40 opacity-0 cursor-pointer" onChange={handleLandscapePhotoChange} />
                      <div className="absolute top-0 left-0 w-full h-[30rem] bg-black opacity-40 rounded-md shadow-md z-10"></div>
                      <img
                        src={typeof backgroundPhotoSubsection === 'string' ? backgroundPhotoSubsection : URL.createObjectURL(backgroundPhotoSubsection)}
                        alt="Background"
                        className="absolute top-0 left-0 w-full h-[30rem] object-cover rounded-md shadow-md"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-9 h-9 text-white z-20"
                      >
                        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                        <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                      </svg>
                      <Popconfirm
                        title="Delete the background"
                        description="Are you sure to delete the background photo?"
                        okText="Yes"
                        okType="danger"
                        onConfirm={(e) => {
                          e.stopPropagation();
                          deleteFile();
                        }}
                        onCancel={(e) => {
                          e.stopPropagation();
                        }}
                        cancelText="No"
                      >
                        <button onClick={(e) => {
                          e.stopPropagation();
                        }} className="absolute top-0 right-0 z-50 px-4 py-4">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white ">
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </Popconfirm>
                    </div>
                    :
                    courseSubsection?.attributes?.landscape_photo?.data ?
                      <>
                        <img
                          src={courseSubsection?.attributes?.landscape_photo?.data?.attributes?.url}
                          alt=""
                          className="h-auto md:h-[30rem] w-[calc(100%-1.25rem)] md:w-full object-cover rounded-md shadow-md mt-5"
                        />
                      </>
                      : null
                )
              }
              {
                (enableEdit && !backgroundPhotoSubsection && !settingsFlag && !questionnaireFlag) && (
                  <div className="relative w-full h-[15rem] rounded-md bg-gray-50 flex items-center justify-center shadow-md">
                    <input ref={inputRefLandscape} type="file" className="absolute opacity-0 h-[15rem] w-full cursor-pointer z-20" onChange={handleLandscapePhotoChange} />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
                      <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                      <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                    </svg>
                  </div>
                )
              }

              {settingsFlag && (user.role_str === 'professor' || user.role_str === 'admin') ? (
                <CourseSettings setSettingsFlag={setSettingsFlag} courseData={courseBasicInformation} setCourseData={setCourseBasicInformation} />
              ) : questionnaireFlag && questionnaireAnswers !== undefined ? (
                <QuestionnaireComponent
                  questionnaire={courseSubsectionQuestionnaire}
                  answers={questionnaireAnswers}
                  subsectionID={courseSubsection.id}
                  enableEdit={enableEdit}
                  setEnableEdit={setEnableEdit}
                  courseSubsection={courseSubsection}
                  setCourseSubsectionQuestionnaire={setCourseSubsectionQuestionnaire}
                />
              ) : courseSection && courseContentInformation.length > 0 && (
                <>
                  <div className="flex items-center max-w-full w-full  md:my-5">
                    {
                      enableEdit ?
                        <input
                          type="text"
                          name="first-name"
                          value={titleSubsection}
                          onChange={(e) => setTitleSubsection(e.target.value)}
                          id="first-name"
                          autoComplete="given-name"
                          className="mt-1 rounded-md border-blue-gray-300 text-blue-gray-900 shadow-sm
                           focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        :
                        <div className="flex items-center w-full gap-x-5 max-w-full">
                          <p className="text-2xl font-semibold max-w-[calc(100%-140px)]"> {courseSubsection?.attributes?.title}</p>
                          <Badge color="#6366f1" count={new Date(courseSubsection?.attributes?.end_date).toDateString()} />
                        </div>
                    }
                    {
                      user?.role_str === 'professor' || user?.role_str === 'admin' ?
                        <div className='flex ml-auto items-center'>
                          <SwitchEdit enableEdit={enableEdit} setEnableEdit={setEnableEdit} />
                        </div> : null
                    }
                  </div>
                  <Tabs className='font-normal' tabBarStyle={{ borderBottom: '1px solid black' }} defaultActiveKey="1" items={items} />
                </>
              )}
            </div>
          ) : (
            <ForumComponent allForums={allForums} setAllForums={setAllForums}
              courseData={
                {
                  name: courseBasicInformation.title,
                  students: courseBasicInformation.students.data.map((student) => student.id)
                }
              } />
          )}
        </div>
        {
          editSectionFlag && sectionToEdit !== null && (user?.role_str !== 'professor' || user?.role_str !== 'admin') ? null :
            (
              <div>
                {(user?.role_str === 'professor' || user?.role_str === 'admin') ?
                  <button onClick={() => setSettingsFlag(true)} className="bg-white ml-8 p-3 rounded-md shadow-md flex items-center mt-8 w-[30rem]">
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
                  </button> : null
                }

                <FloatingButtonNavigation
                  {...{
                    whisper,
                    courseContentInformation,
                    setCourseSubsection,
                    setCourseSection,
                    setForumFlag,
                    setQuestionnaireFlag,
                    setSettingsFlag,
                    setCourseSubsectionQuestionnaire,
                    subsectionsCompleted,
                    setCourseContentInformation,
                    setEditSectionFlag,
                    setSectionToEdit,
                    courseSubsection,
                    courseSection,
                  }}
                />
                
                <div className="flexible:flex xl:hidden 2lg:flex hidden ">
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
                      setCourseContentInformation,
                      setEditSectionFlag,
                      setSectionToEdit,
                      courseSubsection,
                      courseSection,
                    }}
                  />
                </div>
                <div className="flexible:block xl:hidden 2lg:block hidden ">
                  {allForums[0]?.attributes &&
                    <ForumClickable posts={allForums[0].attributes.posts.data} setForumFlag={setForumFlag} />
                  }
                  {professor.attributes && <ProfessorData professor={professor} evaluatorFlag={false} />}
                </div>
              </div>
            )
        }
      </div>
    </>
  );

};

export default CourseInside;
