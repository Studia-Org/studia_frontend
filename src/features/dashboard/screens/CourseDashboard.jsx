import { useAuthContext } from "../../../context/AuthContext";
import { MoonLoader } from "react-spinners";
import { ActivitiesDash } from "../components/CourseDashBoard/ActivitiesDash/ActivitiesDash";
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
          <main className="flex flex-col w-full h-full overflow-y-hidden content-center box-border">
            <div className="flex flex-1 w-full box-border p-2 md:p-5 lg:10">
              <ActivitiesDash
                key={"ActivitiesDash " + courseId}
                courseInformation={courseContentInformation.courseInformation}
                courseId={courseId}
                styles={"min-w-full xl:min-w-[100%]"}
              />
            </div>
          </main>
      }
    </div>
  );
}

export default CourseDashboard;


