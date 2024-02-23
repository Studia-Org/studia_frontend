import { useNavigate } from "react-router-dom";
import "../../styles/cardDash.css";
import { useEffect, useState } from "react";
import { API } from "../../../../constant"
import Slider from "./Slider";


export function CardDash({ user, courses }) {
  const navigate = useNavigate();

  return (
    <section className="flex flex-wrap items-center flex-1 w-full max-w-full max-h-full p-5 overflow-hidden bg-white rounded-lg shadow-lg gap-y-2 gap-x-2 ">
      <Slider data={courses} navigate={navigate} />
    </section>
  );
}

