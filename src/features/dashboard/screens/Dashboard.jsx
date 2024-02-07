import { useAuthContext } from "../../../context/AuthContext";
import { MoonLoader } from "react-spinners";
import { CardDash } from "../components/DashBoard/CardDash";
import { fetchCoursesInfoDashboard } from "../../../fetches/fetchCoursesInfoDashboard";
import { TimeDedicated } from "../components/DashBoard/TimeDedicated";
import "../styles/cardDash.css";
import { useEffect, useState } from "react";


function Dashboard() {
  const [courses, setCourses] = useState([]);
  const { user, isLoading } = useAuthContext();
  const [coursesLoading, setCoursesLoading] = useState(false);
  document.title = 'Dashboard - Uptitude'

  useEffect(() => {
    const fetchData = async () => {
      setCoursesLoading(true);
      if (user) {
        const coursesData = await fetchCoursesInfoDashboard(user);
        setCourses(coursesData);
      }
      setCoursesLoading(false);
    };

    fetchData();
  }, [user]);


  return (
    <div className="rounded-tl-3xl  bg-[#e7eaf886] w-full">
      {isLoading || coursesLoading ? (
        <div className="flex items-center justify-center w-full h-full ">
          <MoonLoader color="#363cd6" size={80} />
        </div>
      ) : (
        <main className="flex flex-wrap items-center justify-center w-full h-full pt-7 ">
          <div className="flex h-[15rem] p-3 min-w-[95%] max-w-[95%] ">
            <CardDash user={user} courses={courses} />
          </div>
          <div className="flex  min-h-[400px] h-[calc(100vh-15rem-10rem)] p-3 min-w-[95%] max-w-[95%]">
            <TimeDedicated courses={courses} />
          </div>
        </main>
      )}
    </div>
  );
}

export default Dashboard;
