import { useAuthContext } from "../../../context/AuthContext";
import { MoonLoader } from "react-spinners";
import { SectionCoursesCards } from "../components/DashBoard/CardDash";
import { PerformanceGraphic } from "../components/DashBoard/PerformanceGraphic";
import { TimeDedicated } from "../components/DashBoard/TimeDedicated";
import "../styles/cardDash.css";


function Dashboard() {
  const { user, isLoading } = useAuthContext();
  return (
    <div className="rounded-tl-3xl  bg-[#e7eaf886] w-full">
      {isLoading ? (
        <div className=" flex items-center justify-center w-full h-full">
          <MoonLoader color="#363cd6" size={80} />
        </div>
      ) : (
        <main className="flex flex-wrap w-full h-full justify-center items-center p-3">
          <div className="flex flex-wrap xl:flex-nowrap h-[45%] gap-y-2 xl:gap-x-[2%] justify-between min-w-[95%] max-w-[95%] ">
            <SectionCoursesCards
              courses={user.courses}
              styles={"min-w-full xl:min-w-[48%] max-w-[50%] "}
            />
            <PerformanceGraphic courses={user.courses} />
          </div>
          <div className="flex h-[48%] mt-3 xl:mt-0 min-w-[95%] max-w-[95%]">
            <TimeDedicated courses={user.courses} />
          </div>
        </main>
      )}
    </div>
  );
}

export default Dashboard;
