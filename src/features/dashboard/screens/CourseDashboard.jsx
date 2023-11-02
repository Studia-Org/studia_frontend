import { useAuthContext } from "../../../context/AuthContext";
import "../styles/cardDash.css";
import { MoonLoader } from "react-spinners";
import { SectionCoursesCards } from "../components/CardDash";
import { useEffect, useState } from "react";
import { fetchCourseInformation } from "../../../fetches/fetchCourseInformation";
import { fetchAverageQualification } from "../../../fetches/fetchAverageQualification";
import { useParams } from "react-router-dom";
import { Dropdown } from 'flowbite-react';

function CourseDashboard() {
  const { user, isLoading } = useAuthContext();
  const { courseId } = useParams();
  const [courseContentInformation, setCourseContentInformation] = useState({});

  useEffect(() => {
    async function fetchFiles() {
      const { courseInformation, students, professors } =
        await fetchCourseInformation({ courseId });
      setCourseContentInformation({ courseInformation, students, professors });
    }
    fetchFiles();
  }, [courseId]);

  return (
    <div key={courseId} className="rounded-tl-3xl  bg-[#e7eaf886] w-full">
      {
        isLoading ?
          <div className=" flex items-center justify-center w-full h-full">
            <MoonLoader color="#363cd6" size={80} />
          </div> :
          <main className="flex flex-col flex-wrap w-full h-full content-center  p-5 box-border">
            <div className="flex flex-wrap h-fit xl:h-fit gap-y-2 xl:gap-x-[2%] 
            justify-between min-w-[95%] max-w-[95%] box-border mb-4"
            >
              <SectionCoursesCards courses={user.courses} styles={"w-full h-fit"} />
            </div>
            <div className="flex flex-1 flex-wrap xl:flex-nowrap
               xl:gap-x-[2%] justify-between min-w-[95%] max-w-[95%] box-border">
              <ActivitiesDash
                key={"ActivitiesDash " + courseId}
                courseInformation={courseContentInformation.courseInformation}
                styles={"min-w-full xl:min-w-[49%]"}
              />
              <ForumDash
                key={"ForumDash " + courseId}
                courseInformation={courseContentInformation.courseInformation}
                styles={"min-w-full mt-4 xl:mt-0 xl:min-w-[49%]"}
              />
            </div>
          </main>
      }
    </div>
  );
}

export default CourseDashboard;

export function DropDownMenu({ items, onClick, name, selected }) {
  return (
    <Dropdown label={name} dismissOnClick={true} style={{
      textAlign: "left",
      backgroundColor: selected ? "#1d46ff" : "rgb(118, 144, 255)",
      width: "100%",
    }} >
      {items.map((item, index) => (
        <Dropdown.Item
          onClick={() => onClick(item)} key={index}>
          {item.attributes.title}
        </Dropdown.Item>
      ))}
    </Dropdown>

  );
}

export function CardSimple({ title, id, styles, setActivity, onClick }) {
  return (
    <div onClick={onClick} className={`px-6 py-3 text-white rounded-lg box-border cardDash ${styles}`}>
      <p className="font-normal">{title}</p>
    </div>

  )
}

export function ActivitiesDash({ courseInformation, styles }) {
  const [selectedCourse, setSelectedCourse] = useState("Section");
  const [selectedSection, setSelectedSection] = useState("Subsection");
  const [selectedActivity, setSelectedActivity] = useState("Activity");
  const [loading, setLoading] = useState(false);
  const [averageQualification, setAverageQualification] = useState(0);


  useEffect(() => {
    if (selectedActivity === "Activity") return
    async function getAverage() {
      const activityId = selectedActivity.id
      setLoading(true)
      const response = await fetchAverageQualification({ activityId })
      setLoading(false)
      setAverageQualification(response)
    }
    getAverage()

  }, [selectedActivity]);

  return (
    <section className={`flex flex-col p-5 bg-white shadow-lg rounded-lg box-border ${styles}`}>
      <p className="text-2xl font-semibold">Activities</p>
      <div className="flex flex-row flex-wrap py-2 gap-y-5 gap-x-2">

        {courseInformation &&
          <div className="flex-col xl:w-[49%]">
            <p className="text-xl font-semibold">Course</p>
            <DropDownMenu
              items={courseInformation} name={selectedCourse !== "Section" ? selectedCourse.attributes.title : selectedCourse}
              onClick={(section) => { setSelectedCourse(section); setSelectedSection("Subsection") }} selected={selectedCourse !== "Section"} />
          </div>
        }

        {selectedCourse !== "Section" &&
          <div className="flex-col xl:w-[49%] ">
            <p className="text-xl font-semibold">Section</p>
            <DropDownMenu
              items={selectedCourse.attributes.subsections.data}
              name={selectedSection !== "Subsection" ? selectedSection.attributes.title : selectedSection}
              onClick={(section) => { setSelectedSection(section); setSelectedActivity("Activity") }} selected={selectedSection !== "Subsection"} />
          </div >
        }
      </div>
      {selectedSection !== "Subsection" && (
        <div className="flex-col">
          <p className="text-xl font-semibold pt-2 pb-1">Tasks</p>
          {selectedSection.attributes.activities.data.map((activity) => {
            return (
              <CardSimple
                onClick={() => setSelectedActivity(activity)}
                title={activity.attributes.title}
                id={activity.id}
                styles={"w-fit"}
              />
            )
          })}
        </div>
      )}
      {selectedActivity !== "Activity" && (
        <main className="flex flex-1 items-center justify-center bg-red-200 mt-2">
          {!loading ?
            <div className="flex flex-col w-full h-full gap-y-2">
              <p className="text-xl font-semibold pt-2 pb-1">Activity</p>
              <p className="text-xl font-semibold pt-2 pb-1">{selectedActivity.attributes.title}</p>
              <p className="text-xl font-semibold pt-2 pb-1">Average Qualification</p>
              <p className="text-xl font-semibold pt-2 pb-1">{averageQualification}</p>
            </div>
            :
            <MoonLoader color="#363cd6" size={80} />
          }
        </main>
      )}
    </section>
  );
}
export function ForumDash({ coursetInformation, styles }) {
  return (
    <section
      className={`p-5 bg-white shadow-lg rounded-lg box-border ${styles}`}
    >
      <p className="text-2xl font-semibold">Forum contributions</p>
      <div className="flex flex-wrap gap-y-2 gap-x-2 "></div>
    </section>
  );
}
