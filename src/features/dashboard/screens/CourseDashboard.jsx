import { useAuthContext } from "../../../context/AuthContext";
import { MoonLoader } from "react-spinners";
import { SectionCoursesCards } from "../components/DashBoard/CardDash";
import { ActivitiesDash } from "../components/CourseDashBoard/ActivitiesDash/ActivitiesDash";
import { ForumDash } from "../components/CourseDashBoard/ForumDash";
import { useEffect, useState } from "react";
import { fetchCourseInformation } from "../../../fetches/fetchCourseInformation";
import { useParams } from "react-router-dom";
import "../styles/cardDash.css";

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


