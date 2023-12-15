import { useNavigate } from "react-router-dom";
import "../../styles/cardDash.css";
import { useEffect, useState } from "react";
import { API } from "../../../../constant"
import Slider from "./Slider";


export function CardDash({ user }) {
  const navigate = useNavigate();
  const pathSegments = new URL(window.location.href).pathname.split("/");
  const path = pathSegments[pathSegments.length - 1];
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    fetch(`${API}/users/${user.id}?` +
      `populate[courses][populate][cover][fields][0]=url` +
      `&populate[courses][populate][professor][populate][profile_photo][fields][0]=url` +
      `&populate[courses][populate][professor][fields][0]=username` +
      `&fields[0]=id` +
      `&populate[courses][fields][0]=title`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses.map((course) => {
          return {
            id: course.id,
            cover: course.cover.url,
            title: course.title,
            professor: course.professor,
          }
        }));
      });
  }, [path]);

  return (
    <section className="flex flex-1 items-center w-full max-w-full max-h-full 
    flex-wrap gap-y-2 gap-x-2 p-5 bg-white shadow-lg rounded-lg overflow-hidden ">
      <Slider data={courses} navigate={navigate} />
    </section>
  );
}

