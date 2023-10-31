import { useAuthContext } from "../../../context/AuthContext";
import "../styles/cardDash.css";
import { MoonLoader } from "react-spinners";
import { SectionCoursesCards } from "../components/CardDash";
import { useEffect, useState } from "react";
import { fetchCourseInformation } from "../../../fetches/fetchCourseInformation";
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
            <div className="flex flex-1 flex-wrap xl:flex-nowrap xl:gap-x-[2%] justify-between min-w-[95%] max-w-[95%] box-border">
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
      width: "48%", textAlign: "left",
      backgroundColor: selected ? "#1d46ff" : "rgb(118, 144, 255)"
    }} >
      {items.map((item, index) => (
        <Dropdown.Item onClick={() => onClick(item)} key={index}>{item.attributes.title}</Dropdown.Item>
      ))}
    </Dropdown>

  );


}
export function ActivitiesDash({ courseInformation, styles }) {
  const [selectedCourse, setSelectedCourse] = useState("Section");
  const [selectedSection, setSelectedSection] = useState("Subsection");
  const [selectedActivity, setSelectedActivity] = useState("Activity");
  return (
    <section className={`p-5 bg-white shadow-lg rounded-lg box-border ${styles}`}>
      <p className="text-2xl font-semibold">Activities</p>
      <div className="flex flex-wrap py-2 gap-y-2 gap-x-2">

        {courseInformation &&
          <DropDownMenu
            items={courseInformation} name={selectedCourse !== "Section" ? selectedCourse.attributes.title : selectedCourse}
            onClick={(section) => { setSelectedCourse(section); setSelectedSection("Subsection") }} selected={selectedCourse !== "Section"} />}

        {selectedCourse !== "Section" &&
          <DropDownMenu
            items={selectedCourse.attributes.subsections.data}
            name={selectedSection !== "Subsection" ? selectedSection.attributes.title : selectedSection}
            onClick={(section) => { setSelectedSection(section); setSelectedActivity("Activity") }} selected={selectedSection !== "Subsection"} />}

        {selectedSection !== "Subsection" && (
          <DropDownMenu
            items={selectedSection.attributes.activities.data}
            name={selectedActivity !== "Activity" ? selectedActivity.attributes.title : selectedActivity}
            onClick={(section) => setSelectedActivity(section)} selected={selectedActivity !== "Activity"} />
        )}

      </div>
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
