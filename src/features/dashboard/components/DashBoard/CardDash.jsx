import { useNavigate } from "react-router-dom";
import "../../styles/cardDash.css";

export function CardDash({ courseName, courseId }) {
  const navigate = useNavigate();
  const pathSegments = new URL(window.location.href).pathname.split("/");
  const path = pathSegments[pathSegments.length - 1];
  return (
    <div
      key={courseId}
      onClick={() => {
        navigate(`/app/dashboard/${courseId}`);
      }}
      className={`px-7 shadow-md w-full ${parseInt(path) === courseId ? "active" : "cardDash"
        }
      md2:min-w-[49%] md2:max-w-[49%] 2xl:min-w-[30%] 2xl:max-w-[30%] flex  items-center 
         rounded-lg py-3 relative
       transition-all `}
    >
      <p className="py-0.5 max-w-[80%] text-white font-medium text-base">
        {courseName}
      </p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="white"
        className="w-6 h-6 absolute right-4 "
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
        />
      </svg>
    </div>
  );
}

export function SectionCoursesCards({ courses, styles }) {
  return (
    <section
      className={`p-5 bg-white shadow-lg rounded-lg box-border ${styles}`}
    >
      <div className="flex flex-wrap gap-y-2 gap-x-2 ">
        {courses.map((course) => {
          if (course.title === undefined) {
            return <CardDash key={course.id} courseName={course.attributes.title} courseId={course.id} />;
          }
          return <CardDash key={course.id} courseName={course.title} courseId={course.id} />;
        })}
      </div>
    </section>
  );
}
