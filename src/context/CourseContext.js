import { createContext, useContext, useEffect, useState } from "react";

export const CourseContext = createContext({
    course: [],
    sectionSelected: undefined,
    subsectionSelected: [],
    activitySelected: undefined,
    setCourse: () => { },
    setSectionSelected: () => { },
    setSubsectionSelected: () => { },
    setActivitySelected: () => { },
});

export const useCourseContext = () => useContext(CourseContext);

export const CourseProvider = ({ children }) => {
    const [course, setCourse] = useState(undefined);
    const [sectionSelected, setSectionSelected] = useState(undefined);
    const [idSectionSelected, setIdSectionSelected] = useState(undefined);
    const [subsectionSelected, setSubsectionSelected] = useState(undefined);
    const [activitySelected, setActivitySelected] = useState(undefined);

    return (
        <CourseContext.Provider
            value={{
                course,
                sectionSelected,
                idSectionSelected,
                subsectionSelected,
                activitySelected,
                setIdSectionSelected,
                setCourse,
                setSectionSelected,
                setSubsectionSelected,
                setActivitySelected,
            }}
        >
            {children}
        </CourseContext.Provider>
    );
};
