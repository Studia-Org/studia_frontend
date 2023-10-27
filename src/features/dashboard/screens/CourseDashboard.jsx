import { useAuthContext } from "../../../context/AuthContext";
import "../styles/cardDash.css";
import { MoonLoader } from "react-spinners";
import { SectionCoursesCards } from "../components/CardDash";

function CourseDashboard() {
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
            <SectionCoursesCards courses={user.courses} styles={"w-full"} />
          </div>
          <div
            className="flex flex-wrap xl:flex-nowrap h-1/2
           xl:gap-x-[2%] justify-between min-w-[95%] max-w-[95%] box-border"
          >
            <ActivitiesDash
              courses={user.courses}
              styles={"min-w-full xl:min-w-[49%] max-w-[50%] "}
            />
            <ForumDash
              courses={user.courses}
              styles={"min-w-full xl:min-w-[49%] max-w-[50%] "}
            />
          </div>
        </main>
      )}
    </div>
  );
}

export default CourseDashboard;

export function ActivitiesDash({ courses, styles }) {
  return (
    <section
      className={`p-5 bg-white shadow-lg rounded-lg box-border ${styles}`}
    >
      <p className="text-2xl font-semibold">Activities</p>
      <div className="flex flex-wrap gap-y-2 gap-x-2 "></div>
    </section>
  );
}
export function ForumDash({ courses, styles }) {
  return (
    <section
      className={`p-5 bg-white shadow-lg rounded-lg box-border ${styles}`}
    >
      <p className="text-2xl font-semibold">Forum contributions</p>
      <div className="flex flex-wrap gap-y-2 gap-x-2 "></div>
    </section>
  );
}
