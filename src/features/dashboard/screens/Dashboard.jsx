import { useAuthContext } from "../../../context/AuthContext";
import whiteArrow from "../../../assets/white-arrow.png";
import "../styles/cardDash.css";
import { MoonLoader } from "react-spinners";

function Dashboard() {
  const { user, isLoading } = useAuthContext();
  return (
    <div className="rounded-tl-3xl  bg-[#e7eaf886] w-full">
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <MoonLoader color="#363cd6" size={80} />
        </div>
      ) : (
        <main className="flex flex-wrap w-full h-full justify-center p-5">
          <div className="flex h-[45%]  gap-x-3 max-w-[95%]">
            <SectionCoursesCards courses={user.courses} />
            <PerformanceGraphic courses={user.courses} />
          </div>
          <div className="flex h-1/2 min-w-[95%] max-w-[95%]">
            <TimeDedicated courses={user.courses} />
          </div>
        </main>
      )}
    </div>
  );
}

export default Dashboard;

export function CardDash({ courseName }) {
  return (
    <div
      className="px-7 shadow-md w-full xl:min-w-[49%] xl:max-w-[49%] 2xl:min-w-[30%] 2xl:max-w-[30%] flex  items-center 
       rounded-lg py-3 relative
      hover:scale-105 transition-all hover:cursor-pointer cardDash"
    >
      <p className="py-0.5 max-w-[80%] text-white font-medium text-base">
        {courseName}
      </p>
      <img
        className="absolute right-4 w-8"
        alt={`White arrow from ${courseName} `}
        src={whiteArrow}
      ></img>
    </div>
  );
}

export function SectionCoursesCards({ courses }) {
  return (
    <section className="p-5  bg-white shadow-lg rounded-lg ">
      <div className="flex flex-wrap gap-y-2 gap-x-2 ">
        {courses.map((course) => {
          return <CardDash courseName={course.title} />;
        })}
      </div>
    </section>
  );
}

export function PerformanceGraphic({ courses }) {
  return (
    <section className=" p-5 bg-white shadow-lg rounded-lg ">
      <div className="flex flex-wrap h-fit max-w-1/2 gap-y-2 gap-x-2 ">
        {courses.map((course) => {
          return <CardDash courseName={course.title} />;
        })}
      </div>
    </section>
  );
}
export function TimeDedicated({ courses }) {
  return (
    <section className="p-5 w-full bg-white shadow-lg rounded-lg ">
      <div className="flex flex-wrap h-fit max-w-1/2 gap-y-2 gap-x-2 ">
        {courses.map((course) => {
          return <CardDash courseName={course.title} />;
        })}
      </div>
    </section>
  );
}
