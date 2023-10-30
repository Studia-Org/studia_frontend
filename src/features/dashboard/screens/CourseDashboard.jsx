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
    <div className="rounded-tl-3xl  bg-[#e7eaf886] w-full">
      {isLoading ? (
        <div className=" flex items-center justify-center w-full h-full">
          <MoonLoader color="#363cd6" size={80} />
        </div>
      ) : (
        <main className="flex flex-wrap w-full h-full content-start xl:content-center justify-center p-5 box-border">
          <div
            className="flex flex-wrap xl:flex-nowrap h-fit xl:h-[45%] gap-y-2 
          xl:gap-x-[2%] justify-between min-w-[95%] max-w-[95%] box-border mb-4"
          >
            <SectionCoursesCards courses={user.courses} styles={"w-full"} />
          </div>
          <div className="flex flex-wrap xl:flex-nowrap min-h-[50%] xl:gap-x-[2%] justify-between min-w-[95%] max-w-[95%] box-border">
            <ActivitiesDash
              courseInformation={courseContentInformation.courseInformation}
              styles={"min-w-full xl:min-w-[49%] max-w-[50%] "}
            />
            <ForumDash
              courseInformation={courseContentInformation.courseInformation}
              styles={"min-w-full mt-4 xl:mt-0 xl:min-w-[49%] max-w-[50%] "}
            />
          </div>
        </main>
      )}
    </div>
  );
}

export default CourseDashboard;
export function DropDownMenu({ items, onClick, name }) {
  return (
    <Dropdown label={name} dismissOnClick={false}>
      {items.map((item, index) => (
        <Dropdown.Item onClick={() => { onClick(item) }} key={index}> {item.attributes.title}</Dropdown.Item>
      ))}
    </Dropdown>
  )

}
export function ActivitiesDash({ courseInformation, styles }) {
  const [selectedCourse, setSelectedCourse] = useState("Section");
  const [selectedSection, setSelectedSection] = useState("Subsection");
  const [selectedActivity, setSelectedActivity] = useState("SubActivity");
  return (
    <section className={`p-5 bg-white shadow-lg rounded-lg box-border ${styles}`}>
      <p className="text-2xl font-semibold">Activities</p>
      <div className="flex flex-wrap gap-y-2 gap-x-2">

        {courseInformation && <DropDownMenu items={courseInformation} name={selectedCourse}
          onClick={(section) => setSelectedCourse(section)} />}

        {selectedCourse !== "Section" && courseInformation?.map((course, index) => (
          <div key={course.attributes.id}>
            {selectedCourse.attributes.id === course.attributes.id && (
              <DropDownMenu items={course.attributes.subsections.data} name={selectedSection}
                onClick={(section) => setSelectedSection(section)} />
            )}
            {/* {selectedCourse === course && selectedSection && (
              <DropDownMenu name={selectedActivity} items={selectedSection.attributes.activities.data}
                onClick={(section) => setSelectedActivity(section)} />
            )} */}
          </div>
        ))}
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
