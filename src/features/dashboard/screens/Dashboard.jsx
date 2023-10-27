import { useAuthContext } from "../../../context/AuthContext";
import "../styles/cardDash.css";
import { MoonLoader } from "react-spinners";
import { SectionCoursesCards } from "../components/CardDash";
import { PerformanceGraphic } from "../components/PerformanceGraphic";
import { TimeDedicated } from "../components/TimeDedicated";

function Dashboard() {
  const { user, isLoading } = useAuthContext();
  return (
    <div className="rounded-tl-3xl  bg-[#e7eaf886] w-full">
      {isLoading ? (
        <div className=" flex items-center justify-center w-full h-full">
          <MoonLoader color="#363cd6" size={80} />
        </div>
      ) : (
        <main className="flex flex-wrap w-full h-full justify-center p-5 box-border">
          <div className="flex flex-wrap xl:flex-nowrap h-[45%] gap-y-2 xl:gap-x-[2%] justify-between min-w-[95%] max-w-[95%] box-border">
            <SectionCoursesCards
              courses={user.courses}
              styles={"min-w-full xl:min-w-[48%] max-w-[50%] "}
            />
            <PerformanceGraphic courses={user.courses} />
          </div>
          <div className="flex h-1/2 mt-3 xl:mt-0 min-w-[95%] max-w-[95%]">
            <TimeDedicated courses={user.courses} />
          </div>
        </main>
      )}
    </div>
  );
}

export default Dashboard;
