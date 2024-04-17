import React, { useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { Link } from "react-router-dom";
import { fetchUserHasNotReadNotificationDashboard } from "../../fetches/fetchUserHasNotReadNotification";

import {
  FiGrid,
  FiCalendar,
  FiCheckCircle,
  FiSettings,
  FiBarChart,
} from "react-icons/fi";

import { MdTimeline } from "react-icons/md";
import { useAuthContext } from "../../context/AuthContext";
import { set } from "date-fns";
import { Button } from "antd";

export const Sidebar = (props) => {
  const [dashboardNotification, setDashboardNotification] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const { user } = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      setDashboardNotification(await fetchUserHasNotReadNotificationDashboard(user.id));
    };
    fetchData();
    const resizeListener = window.addEventListener("resize", function (event) {
      const sidebar = document.getElementById("default-sidebar");
      if (sidebar === null || sidebar === undefined) return;
      if (window.innerWidth > 1550) {
        sidebar.classList.add("-translate-x-full");
      }
    });
    const scrollListener = window.addEventListener("scroll", function (event) {

      const sidebar = document.getElementById("default-sidebar");
      if (sidebar === null || sidebar === undefined) return;
      if (window.innerWidth < 1550) {
        sidebar.classList.add("-translate-x-full");
        setExpanded(false);
        mostrarScrollbar();
      }
    });
    const clickListener = window.addEventListener("click", function (event) {
      if (
        event.target.matches("#button-sidebar") ||
        event.target.matches("#svg-sidebar") ||
        event.target.matches("#path-sidebar")
      )
        return;
      if (!event.target.matches(".inline-flex")) {
        const sidebar = document.getElementById("default-sidebar");
        if (sidebar === null || sidebar === undefined) return;
        sidebar.classList.add("-translate-x-full");
        setExpanded(false);
        mostrarScrollbar();
      }
    });
    return () => {
      window.removeEventListener("resize", resizeListener);
      window.removeEventListener("scroll", scrollListener);
      window.removeEventListener("click", clickListener);
    };
  }, []);

  const iconProps = {
    courses: {},
    events: {},
    dashboard: {},
    qualifications: {},
    settings: {},
    timeline: {},
  };

  if (props.section === "courses") {
    iconProps.courses = { color: "white", size: "25px" };
  } else if (props.section === "calendar") {
    iconProps.events = { color: "white", size: "25px" };
  } else if (props.section === "dashboard") {
    iconProps.dashboard = { color: "white", size: "25px" };
  } else if (props.section === "qualifications") {
    iconProps.qualifications = { color: "white", size: "25px" };
  } else if (props.section === "settings") {
    iconProps.settings = { color: "white", size: "25px" };
  } else if (props.section === "timeline") {
    iconProps.timeline = { color: "white", size: "25px" };
  } else {
    iconProps.courses = { color: "white", size: "25px" };
  }

  useEffect(() => {
    setShowSidebar(document.location.pathname !== '/app/courses/create');
    const pathSegments = new URL(window.location.href).pathname.split('/');
    const lastElement = pathSegments.pop();
    const inCourseInside = pathSegments.join('/') === '/app/courses' && lastElement !== 'create' && lastElement !== 'courses';
    setCourseInsideStyle(inCourseInside);

  }, [document.location.pathname]);


  const [showSidebar, setShowSidebar] = useState(document.location.pathname !== '/app/courses/create');
  const [courseInsideStyle, setCourseInsideStyle] = useState('xl');
  function oscurecerScrollbar() {
    const style = document.createElement('style');
    style.innerHTML = `
      /* Estilos para la barra de desplazamiento */
      ::-webkit-scrollbar {
        width: 0px; /* Ancho de la barra de desplazamiento */
      }
    `;
    document.head.appendChild(style);
  }

  function mostrarScrollbar() {
    const style = document.createElement('style');
    style.innerHTML = `
    ::-webkit-scrollbar-thumb:hover {
      background-color: #a8bbbf;
  }
  
  ::-webkit-scrollbar-thumb {
      background-color: #d6dee1;
      border-radius: 20px;
      border: 6px solid transparent;
      background-clip: content-box;
  }
  
  ::-webkit-scrollbar-track {
      background-color: transparent;
  }
  
  ::-webkit-scrollbar {
      width: 20px;
  }
    `;
    document.head.appendChild(style);
  }

  function handleClick() {
    const sidebar = document.getElementById("default-sidebar");
    if (sidebar === null || sidebar === undefined) return;
    sidebar.classList.toggle("-translate-x-full");
    setExpanded(!expanded);
    oscurecerScrollbar();
  }

  return (
    <>
      <button
        data-drawer-target="default-sidebar"
        id="button-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        onClick={handleClick}
        className={`absolute z-10 items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg top-8 ${courseInsideStyle ? `flexible:${!showSidebar ? "block" : "hidden"}` : `xl:${!showSidebar ? "block" : "hidden"}`} hover:bg-gray-100 
        focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600`}
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6 "
          id="svg-sidebar"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            id="path-sidebar"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="default-sidebar"
        className={`absolute flex min-h-screen  ${courseInsideStyle ? "flexible:min-h-[calc(100vh-8rem)]" : "xl:min-h-[calc(100vh-8rem)]"} bg-white z-[1000] pl-8 
         ${courseInsideStyle ? "flexible:pl-16" : "xl:pl-16"} top-0 left-0 w-80 ${courseInsideStyle ? "flexible:top-32" : "xl:top-32"} transition-transform -translate-x-full ${showSidebar ? `${courseInsideStyle ? "flexible:translate-x-0" : "xl:translate-x-0"}` : "-translate-x-full"} `}
        aria-label="Sidebar"
      >
        <div className="min-h-[100%]">
          <Button
            data-drawer-target="default-sidebar"
            id="button-sidebar"
            data-drawer-toggle="default-sidebar"
            aria-controls="default-sidebar"

            onClick={handleClick}
            className={` z-10 items-center flex   mt-4 mb-16 py-5 px-3 text-sm text-gray-500 rounded-lg top-8 ${courseInsideStyle ? `flexible:${!showSidebar ? "block" : "hidden"}` : `xl:${!showSidebar ? "block" : "hidden"}`} hover:bg-gray-100 
        focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600`}
          >
            <span className="sr-only">Open sidebar</span>
            <svg
              className="w-6 h-6 "
              id="svg-sidebar"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                id="path-sidebar"
                fillRule="evenodd"
                d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
              ></path>
            </svg>
          </Button>
          {
            expanded && (
              <hr className="w-64 " />
            )
          }
          <ul className={`w-48 ml-3 font-medium space-y-96 ${courseInsideStyle ? "flexible:ml-0" : "xl:ml-0"} `}>
            <Link to={"/app/courses"} style={{ textDecoration: "none" }}>
              <li
                className={`py-3 mt-7 pl-5 hover:text-indigo-600 hover:translate-x-[5px] transition-all  rounded-lg ${Object.keys(iconProps.courses).length > 0
                  ? "bg-gradient-to-r from-[#657DE9] to-[#6E66D6] rounded-lg py-3"
                  : ""
                  }`}
              >
                <span className="flex items-center font-semibold">

                  <IconContext.Provider value={iconProps.courses}>
                    <FiGrid size={25} />
                  </IconContext.Provider>
                  <h2
                    className={`${Object.keys(iconProps.courses).length > 0
                      ? "pl-2 text-white"
                      : "px-4"
                      }`}
                  >
                    Home
                  </h2>
                </span>
              </li>
            </Link>

            <Link to={"/app/calendar"} style={{ textDecoration: "none" }}>
              <li
                className={`py-3 mt-7 pl-5 hover:text-indigo-600 hover:translate-x-[5px] transition-all  rounded-lg ${Object.keys(iconProps.events).length > 0
                  ? "bg-gradient-to-r from-[#657DE9] to-[#6E66D6] rounded-lg py-3"
                  : ""
                  }`}
              >
                <span className="flex items-center font-semibold">

                  <IconContext.Provider value={iconProps.events}>
                    <FiCalendar size={25} />
                  </IconContext.Provider>
                  <h2
                    className={`${Object.keys(iconProps.events).length > 0
                      ? "pl-2 text-white"
                      : "px-4"
                      }`}
                  >
                    Calendar
                  </h2>
                </span>
              </li>
            </Link>
            <Link to={"/app/timeline"} style={{ textDecoration: "none" }}>
              <li
                className={`py-3 mt-7 pl-5 hover:text-indigo-600 hover:translate-x-[5px] transition-all  rounded-lg ${Object.keys(iconProps.timeline).length > 0
                  ? "bg-gradient-to-r from-[#657DE9] to-[#6E66D6] rounded-lg py-3"
                  : ""
                  }`}
              >
                <span className="flex items-center font-semibold">

                  <IconContext.Provider value={iconProps.timeline}>
                    <MdTimeline size={25} />
                  </IconContext.Provider>
                  <h2
                    className={`${Object.keys(iconProps.timeline).length > 0
                      ? "pl-2 text-white"
                      : "px-4"
                      }`}
                  >
                    Timeline
                  </h2>
                </span>
              </li>
            </Link>
            <Link to={"/app/dashboard"} style={{ textDecoration: "none" }}>
              <li
                onClick={() => setDashboardNotification(false)}
                className={`py-3 mt-7 pl-5 hover:text-indigo-600 hover:translate-x-[5px] transition-all rounded-lg ${Object.keys(iconProps.dashboard).length > 0
                  ? "bg-gradient-to-r from-[#657DE9] to-[#6E66D6] rounded-lg py-3"
                  : ""
                  }`}
              >
                <span className="relative flex items-center font-semibold">
                  <IconContext.Provider value={iconProps.dashboard}>
                    <FiBarChart size={25} />
                  </IconContext.Provider>
                  <h2
                    className={`${Object.keys(iconProps.dashboard).length > 0 ? "pl-2 text-white" : "px-4"
                      }`}
                  >
                    Dashboard
                  </h2>
                  {
                    Object.keys(iconProps.dashboard).length <= 0 && dashboardNotification && (
                      <span name="ping" className="flex items-center">
                        <span className="absolute  w-2.5 h-2.5 bg-red-400 rounded-full opacity-75 animate-ping"></span>
                        <span className="absolute  w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                      </span>
                    )
                  }
                </span>
              </li>


            </Link>
            <Link to={"/app/qualifications"} style={{ textDecoration: "none" }}>
              <li
                className={`py-3 mt-7 pl-5 hover:text-indigo-600 hover:translate-x-[5px] transition-all  rounded-lg ${Object.keys(iconProps.qualifications).length > 0
                  ? "bg-gradient-to-r from-[#657DE9] to-[#6E66D6] rounded-lg py-3"
                  : ""
                  }`}
              >
                <span className="flex font-semibold align-middle">
                  <IconContext.Provider value={iconProps.qualifications}>
                    <FiCheckCircle size={25} />
                  </IconContext.Provider>
                  <h2
                    className={`${Object.keys(iconProps.qualifications).length > 0
                      ? "pl-2 text-white"
                      : "px-4"
                      }`}
                  >
                    Qualifications
                  </h2>
                </span>
              </li>
            </Link>
            <Link to={"/app/settings"} style={{ textDecoration: "none" }}>
              <li
                className={`py-3 mt-7 pl-5 hover:text-indigo-600 hover:translate-x-[5px] transition-all  rounded-lg ${Object.keys(iconProps.settings).length > 0
                  ? "bg-gradient-to-r from-[#657DE9] to-[#6E66D6] rounded-lg py-3"
                  : ""
                  }`}
              >
                <span className="flex items-center font-semibold">

                  <IconContext.Provider value={iconProps.settings}>
                    <FiSettings size={25} />
                  </IconContext.Provider>
                  <h2
                    className={`${Object.keys(iconProps.settings).length > 0
                      ? "pl-2 text-white"
                      : "px-4"
                      }`}
                  >
                    Settings
                  </h2>
                </span>
              </li>
            </Link>
          </ul>
        </div>
      </aside>
      <main className={`absolute right-0 top-0 h-screen  ${courseInsideStyle ? "flexible:w-1/3" : "xl:w-1/3"}  ${courseInsideStyle ? "flexible:relative" : "xl:relative"} ${expanded ? 'w-full h-screen bg-black bg-opacity-30 z-40' : 'hidden'}`}></main>
    </>
  );
};
