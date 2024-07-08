import { useEffect, useState, React, useRef } from "react";
import { useParams } from "react-router-dom";
import { API, BEARER } from "../../../constant";
import { getToken } from "../../../helpers";
import { Tabs, Popconfirm, Badge, DatePicker, Input } from "antd";
import { SwitchEdit } from "../components/CoursesInside/SwitchEdit";
import { CourseSettings } from "../components/CoursesInside/Settings/CourseSettings";
import { AccordionCourseContent } from "../components/CoursesInside/AccordionCourseContent";
import { ForumClickable } from "../components/CoursesInside/Forum/ForumClickable";
import { ForumComponent } from '../components/CoursesInside/Forum/ForumComponent'
import { QuestionnaireComponent } from '../components/CoursesInside/QuestionnaireComponent';
import { CourseParticipantsClickable, CourseContent, CourseFiles } from "../components/CoursesInside/TabComponents";
import { useAuthContext } from "../../../context/AuthContext";
import { EditSection } from "../components/CoursesInside/EditSection";
import { SideBar } from "../components/CoursesInside/FloatingButtonNavigation";
import { MoonLoader } from "react-spinners";
import { CourseHasNotStarted } from "../components/CoursesInside/CourseHasNotStarted";
import { ButtonSettings } from "../components/CoursesInside/EditSection/buttonEditCourse";
import { Participants } from "../components/CoursesInside/Participants";
import dayjs from "dayjs";
import { BreadcrumbCourse } from "../components/CoursesInside/BreadcrumbCourse";
import { useCourseContext } from "../../../context/CourseContext";
import { useTranslation } from "react-i18next";
import { ca, es, enUS } from 'date-fns/locale';
import { format } from 'date-fns';
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const CourseInside = () => {
  const { t, i18n } = useTranslation();
  const locales = { ca, es } || enUS;
  const local = locales[i18n.language] || enUS;
  const inputRefLandscape = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
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
  const [participantsFlag, setParticipantsFlag] = useState(false);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState([]);
  const [subsectionsCompleted, setSubsectionsCompleted] = useState([]);
  const [subsectionsLandscapePhoto, setSubsectionsLandscapePhoto] = useState(null);
  const [dateSubsection, setDateSubsection] = useState();
  const [courseSubsectionQuestionnaire, setCourseSubsectionQuestionnaire] = useState([]);
  const [students, setStudents] = useState([]);
  const [professor, setProfessor] = useState([]);

  const {
    course,
    sectionSelected,
    subsectionSelected,
    activitySelected,
    setCourse,
    setSectionSelected,
    setSubsectionSelected,
    setActivitySelected,
  } = useCourseContext();


  let { courseId } = useParams();
  let { activityId } = useParams();
  const { user } = useAuthContext()

  const allPosts = allForums.map((forum) => forum.attributes.posts.data).reduce((accumulator, currentForum) => {
    return accumulator.concat(currentForum.map(forum => forum));
  }, [])


  function handleLandscapePhotoChange(event) {
    setBackgroundPhotoSubsection(event.target.files[0]);
  }

  const hasCourseStarted = (start_date) => {
    const currentDate = new Date();
    const startDate = new Date(start_date);
    return currentDate >= startDate;
  }

  const fetchPostData = async () => {
    try {
      const response = await fetch(
        `${API}/courses/${courseId}?populate=forums.posts.autor.profile_photo,forums.posts.forum_answers.autor.profile_photo`
      );
      const data = await response.json();
      const list = data.data.attributes.forums.data;
      list.sort((a, b) => (a.attributes.title === 'News') ? -1 : (b.attributes.title === 'News') ? 1 : 0);
      setAllForums(list);
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

    for (const curso of course.sections.data) {
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
        `${API}/courses/${courseId}?populate=sections.subsections.activity.qualifications,cover,sections.subsections.paragraphs,sections.subsections.files,students.profile_photo,professor.profile_photo,evaluators.profile_photo,sections.subsections.landscape_photo,sections.subsections.questionnaire`
      );
      const data = await response.json();
      document.title = `${data?.data?.attributes.title} - Uptitude`
      setCourseBasicInformation(data?.data?.attributes ?? []);
      setCourse(data?.data?.attributes ?? []);
      setStudents(data?.data?.attributes?.students ?? []);
      setProfessor(data?.data?.attributes?.professor?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (subsectionSelected && Object.keys(subsectionSelected)?.length !== 0) {
      return;
    }
    if (
      course?.sections?.data?.length > 0 &&
      subsectionsCompleted.length > 0
    ) {
      const firstSubsection = obtenerPrimeraSubseccion(
        course,
        subsectionsCompleted
      );

      if (firstSubsection) {
        if (firstSubsection?.subseccion?.attributes?.activity?.data?.attributes?.type === 'questionnaire') {
          setSectionSelected(firstSubsection?.cursoTitle);
          setSubsectionSelected(firstSubsection.subseccion);
          setQuestionnaireFlag(true);
          setCourseSubsectionQuestionnaire(
            firstSubsection.subseccion.attributes.questionnaire.data
          );
        } else {
          setSectionSelected(firstSubsection.cursoTitle);
          setSubsectionSelected(firstSubsection.subseccion);
        }
        loadQuestionnaire();
      }
    } else if (
      course?.sections.data?.length > 0 &&
      subsectionsCompleted.length === 0
    ) {
      const {
        attributes: {
          title,
          subsections: { data: subsecciones },
        },
      } = course.sections.data[0];
      if (
        subsecciones[0]?.attributes?.activity?.data?.attributes?.type ===
        "questionnaire"
      ) {
        setSectionSelected(title);
        setSubsectionSelected(subsecciones[0]);
        setQuestionnaireFlag(true);
        setCourseSubsectionQuestionnaire(
          subsecciones[0].attributes.questionnaire.data
        );
      } else {
        setSectionSelected(title);
        setSubsectionSelected(subsecciones[0]);
      }
      loadQuestionnaire();
    }

  }, [course, subsectionsCompleted]);

  function deleteFile() {
    setBackgroundPhotoSubsection(undefined)
  }

  useEffect(() => {
    if (subsectionSelected?.length && subsectionSelected?.length !== 0) {
      setSubsectionsLandscapePhoto(
        subsectionSelected.attributes.landscape_photo?.data?.attributes?.url ??
        null
      );
    }
    setActivitySelected(undefined);
    setTitleSubsection(subsectionSelected?.attributes?.title);
    setDateSubsection([subsectionSelected?.attributes?.start_date, subsectionSelected?.attributes?.end_date]);
    setBackgroundPhotoSubsection(subsectionSelected?.attributes?.landscape_photo?.data?.attributes?.url)
  }, [subsectionSelected]);

  useEffect(() => {
    Promise.all([
      fetchUserResponsesData(),
      fetchCourseInformation(),
      fetchPostData(),
    ]).catch((error) => console.error(error)).finally(() => setIsLoading(false));
  }, []);



  const loadQuestionnaire = () => {
    if (activityId && course.sections.data.length > 0 && user.role_str !== 'student') {
      const data = locateFromActivityId(Number(activityId));
      if (data) {
        setSubsectionSelected(data.subsection);
        setSectionSelected(data.section.attributes.title);
        setCourseSubsectionQuestionnaire(data.subsection.attributes.questionnaire.data);
        setQuestionnaireFlag(true);
      }
    }
  }

  const locateFromActivityId = (activityId) => {
    for (const section of course.sections.data) {
      for (const subsection of section.attributes.subsections.data) {
        if (subsection.attributes.activity.data.id === activityId) {
          return { section, subsection };
        }
      }
    }
  }


  const items = [
    {
      key: '1',
      label: t('COURSEINSIDE.course'),
      children:
        <CourseContent setForumFlag={setForumFlag} course={course} courseSection={sectionSelected}
          courseSubsection={subsectionSelected} courseId={courseId} enableEdit={enableEdit} setEnableEdit={setEnableEdit}
          setCourse={setCourse} titleSubsection={titleSubsection} dateSubsection={dateSubsection}
          backgroundPhotoSubsection={backgroundPhotoSubsection}
        />,
    },
    {
      key: '2',
      label: t('COURSEINSIDE.files'),
      children: <CourseFiles course={course} courseSection={sectionSelected} courseSubsection={subsectionSelected} enableEdit={enableEdit} setCourse={setCourse} />,
    }
  ].filter(item => {
    if (item.label === 'Participants') {
      return courseBasicInformation && courseBasicInformation.studentManaged !== true;
    }
    return true;
  });

  return (
    <>
      {isLoading ? (
        <div className='flex items-center justify-center w-full h-full rounded-tl-3xl bg-[#e7eaf886]'>
          <div className='flex items-center justify-center w-full h-full '>
            <MoonLoader color='#363cd6' size={80} />
          </div>
        </div>

      ) :
        <div className="container-fluid min-h-screen w-screen max-w-full rounded-tl-3xl bg-[#e7eaf886] flex flex-wrap flex-col-reverse md:flex-row  ">
          <SideBar
            {...{
              course,
              setForumFlag,
              setQuestionnaireFlag,
              setSettingsFlag,
              setCourseSubsectionQuestionnaire,
              subsectionsCompleted,
              setCourse,
              setEditSectionFlag,
              setSectionToEdit,
              professor,
              allPosts,
              students,
              enableEdit,
              user,
              courseBasicInformation,
              setParticipantsFlag
            }}

          />
          <div id="flex_wrap" className="flex-1 max-w-full min-w-0 sm:w-auto mt-3 md:ml-8 md:mr-8 p-5 md:p-0 md:basis-[600px]">
            {editSectionFlag && sectionToEdit !== null ? (
              <EditSection setEditSectionFlag={setEditSectionFlag} sectionToEdit={sectionToEdit} setCourse={setCourse}
                setSectionToEdit={setSectionToEdit} course={course} />
            ) : (!forumFlag && !participantsFlag && !settingsFlag) ? (
              <div>
                {
                  backgroundPhotoSubsection && (
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
                          className="absolute z-20 text-white transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-9 h-9"
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
                      subsectionSelected?.attributes?.landscape_photo?.data ?
                        <>
                          <img
                            src={subsectionSelected?.attributes?.landscape_photo?.data?.attributes?.url}
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
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="absolute transform -translate-x-1/2 -translate-y-1/2 w-9 h-9 top-1/2 left-1/2 ">
                        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                        <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                      </svg>
                    </div>
                  )
                }
                {
                  (!hasCourseStarted(courseBasicInformation.start_date) && settingsFlag === false) && (
                    <CourseHasNotStarted startDate={courseBasicInformation.start_date} />
                  )
                }

                {
                  questionnaireFlag && questionnaireAnswers !== undefined ? (
                    (hasCourseStarted(courseBasicInformation.start_date) || user.role_str !== 'student') ? (
                      <QuestionnaireComponent
                        questionnaire={courseSubsectionQuestionnaire}
                        answers={questionnaireAnswers}
                        subsectionID={subsectionSelected.id}
                        enableEdit={enableEdit}
                        setEnableEdit={setEnableEdit}
                        courseSubsection={subsectionSelected}
                        setCourseSubsectionQuestionnaire={setCourseSubsectionQuestionnaire}
                        professorID={professor.id}
                        coursePositionInfo={
                          {
                            course: courseBasicInformation.title,
                            courseSection: sectionSelected,
                            courseSubsection: subsectionSelected.attributes.title,
                            activity: null
                          }
                        }

                      />
                    ) :
                      <CourseHasNotStarted startDate={courseBasicInformation.start_date} />

                  ) : sectionSelected && course.sections.data.length > 0 && (
                    <>

                      <BreadcrumbCourse
                        styles={
                          'mt-3'
                        }
                      />
                      <div className="flex items-center w-full max-w-full md:my-5">
                        {
                          enableEdit ?

                            <TextArea
                              value={titleSubsection}
                              className="w-1/2"
                              onChange={(e) => setTitleSubsection(e.target.value)}
                              style={{ resize: 'none' }}
                              rows={1}
                            />
                            :
                            <div className="flex items-center w-full max-w-full gap-x-5">
                              <p className="text-2xl font-semibold max-w-[calc(100%-140px)]"> {subsectionSelected?.attributes?.title}</p>
                              <Badge color="#6366f1" count={format(new Date(subsectionSelected?.attributes?.end_date), "EEE MMM dd yyyy", { locale: local })} />
                            </div>
                        }
                        {
                          enableEdit && (
                            <RangePicker
                              value={[dayjs(dateSubsection[0]), dayjs(dateSubsection[1])]}
                              showTime
                              className="w-1/2 mx-5"
                              clearIcon={null}
                              onChange={(value, dateString) => {
                                setDateSubsection(dateString)
                              }}
                            />
                          )
                        }
                        {
                          user?.role_str === 'professor' || user?.role_str === 'admin' ?
                            <div className='flex items-center ml-auto'>
                              <SwitchEdit enableEdit={enableEdit} setEnableEdit={setEnableEdit} />
                            </div> : null
                        }
                      </div>
                      {
                        (hasCourseStarted(courseBasicInformation.start_date) || user.role_str !== 'student') ?
                          <Tabs className='font-normal' tabBarStyle={{ borderBottom: '1px solid black' }} defaultActiveKey="1" items={items} />
                          :
                          <CourseHasNotStarted startDate={courseBasicInformation.start_date} />
                      }
                    </>
                  )}
              </div>
            ) :
              participantsFlag ?
                <Participants students={students} />
                :
                settingsFlag && (user.role_str === 'professor' || user.role_str === 'admin' || courseBasicInformation?.studentManaged === true) ?
                  <CourseSettings setSettingsFlag={setSettingsFlag} courseData={courseBasicInformation} setCourseData={setCourseBasicInformation} />
                  :
                  <ForumComponent allForums={allForums} setAllForums={setAllForums}
                    courseData={
                      {
                        name: courseBasicInformation.title,
                        students: courseBasicInformation.students.data.map((student) => student.id)
                      }
                    } />
            }
          </div>
          {
            editSectionFlag && sectionToEdit !== null && (user?.role_str !== 'professor' || user?.role_str !== 'admin') ? null :
              (
                <aside className="flex-col hidden mb-5 mr-6 mt-7 gap-y-5 xl:flex">
                  {(user?.role_str === 'professor' || user?.role_str === 'admin' || courseBasicInformation?.studentManaged === true) ?
                    <ButtonSettings setSettingsFlag={setSettingsFlag} setForumFlag={setForumFlag} setParticipantsFlag={setParticipantsFlag} /> : null
                  }
                  {
                    !courseBasicInformation?.studentManaged === true && (
                      <section >
                        {allPosts &&
                          <ForumClickable posts={allPosts} setForumFlag={setForumFlag} setParticipantsFlag={setParticipantsFlag} setSettingsFlag={setSettingsFlag} />
                        }
                      </section>
                    )
                  }
                  <section >
                    <AccordionCourseContent
                      {...{
                        course,
                        setForumFlag,
                        setQuestionnaireFlag,
                        setSettingsFlag,
                        setCourseSubsectionQuestionnaire,
                        subsectionsCompleted,
                        setCourse,
                        setEditSectionFlag,
                        setSectionToEdit,
                        setParticipantsFlag
                      }}
                    />
                  </section>
                  <section className="xl:w-30">
                    <CourseParticipantsClickable students={students} enableEdit={enableEdit} setSettingsFlag={setSettingsFlag} setParticipantsFlag={setParticipantsFlag} setForumFlag={setForumFlag} />
                  </section>
                </aside>
              )
          }
        </div>
      }
    </>
  );

};

export default CourseInside;
