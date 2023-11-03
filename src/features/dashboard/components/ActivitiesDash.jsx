import { useState, useEffect } from "react";
import { DropDownMenu } from "../utils/DropDownMenu";
import { CardSimple } from "../utils/CardSimple";
import { fetchAverageQualification } from "../../../fetches/fetchAverageQualification";
import { MoonLoader } from "react-spinners";

export function ActivitiesDash({ courseInformation, styles }) {
    const [selectedCourse, setSelectedCourse] = useState("Section");
    const [selectedSection, setSelectedSection] = useState("Subsection");
    const [selectedActivity, setSelectedActivity] = useState("Activity");
    const [loading, setLoading] = useState(false);
    const [averageQualification, setAverageQualification] = useState(0);

    useEffect(() => {
        if (selectedActivity === "Activity") return
        async function getAverage() {
            const activityId = selectedActivity.id
            setLoading(true)
            const response = await fetchAverageQualification({ activityId })
            setLoading(false)
            setAverageQualification(response)
        }
        getAverage()

    }, [selectedActivity]);

    function GenerateBars({ index, color }) {
        return (
            <div
                key={index}
                className={`tremor-Tracker-trackingBlock h-[13px] w-[54px] relative rounded-tremor-small bg-${color}-500`}
                onMouseEnter={() => {
                    const tooltip = document.getElementById("tremor-" + index);
                    if (tooltip) {
                        tooltip.style.display = "block";
                    }
                }}
                onMouseLeave={() => {
                    const tooltip = document.getElementById("tremor-" + index);
                    if (tooltip) {
                        tooltip.style.display = "none";
                    }
                }}
            >
                <div id={"tremor-" + index}
                    className="max-w-xs text-sm z-20 rounded-tremor-default  text-white bg-dark-tremor-background-subtle px-2.5 py-1"
                    style={{ position: "absolute", top: "-9px", left: "60px", display: "none" }}>{10 - index}
                </div>
            </div>
        )

    }
    function DropDownCourse({ courseInformation, selectedCourse, setSelectedCourse, setSelectedSection }) {
        return (
            <div className="flex-col xl:w-[49%]">
                <p className="text-xl font-semibold">Course</p>
                <DropDownMenu
                    items={courseInformation} name={selectedCourse !== "Section" ? selectedCourse.attributes.title : selectedCourse}
                    onClick={(section) => { setSelectedCourse(section); setSelectedSection("Subsection") }} selected={selectedCourse !== "Section"} />
            </div>
        )
    }
    function DropDownSection({ selectedCourse, selectedSection, setSelectedSection, setSelectedActivity }) {
        return (
            <div className="flex-col xl:w-[49%] ">
                <p className="text-xl font-semibold">Section</p>
                <DropDownMenu
                    items={selectedCourse.attributes.subsections.data}
                    name={selectedSection !== "Subsection" ? selectedSection.attributes.title : selectedSection}
                    onClick={(section) => { setSelectedSection(section); setSelectedActivity("Activity") }}
                    selected={selectedSection !== "Subsection"} />
            </div >
        )
    }
    function ActivitySection({ selectedSection, setSelectedActivity }) {
        return (
            <div className="flex-col">
                <p className="text-xl font-semibold pt-2 pb-1">Tasks</p>
                {selectedSection.attributes.activities.data.map((activity) => {
                    return (
                        <CardSimple
                            onClick={() => setSelectedActivity(activity)}
                            title={activity.attributes.title}
                            id={activity.id}
                            styles={"w-fit"}
                        />
                    )
                })}
            </div>
        )
    }
    function ActivityInformation({ averageQualification }) {
        return (
            <main className="flex flex-1 items-center justify-center bg-red-200 mt-2">
                {!loading ?
                    <div className="flex flex-col w-full h-full gap-y-1">
                        {Array.from({ length: 11 }, (_, index) => {
                            let color = index < 4 ? "emerald" : index < 6 ? "yellow" : "rose"
                            return (
                                <div>
                                    <GenerateBars index={index} color={color} />
                                </div>
                            )
                        })}
                        <p className="text-xl font-semibold pt-2 pb-1">{averageQualification}</p>
                    </div>
                    :
                    <MoonLoader color="#363cd6" size={80} />
                }
            </main>
        )
    }

    return (
        <section className={`flex flex-col p-5 bg-white shadow-lg rounded-lg box-border ${styles}`}>
            <p className="text-2xl font-semibold">Activities</p>
            <div className="flex flex-row flex-wrap py-2 gap-y-5 gap-x-2">
                {courseInformation &&
                    <DropDownCourse courseInformation={courseInformation}
                        selectedCourse={selectedCourse}
                        setSelectedCourse={setSelectedCourse}
                        setSelectedSection={setSelectedSection} />
                }
                {selectedCourse !== "Section" &&
                    <DropDownSection
                        selectedCourse={selectedCourse}
                        selectedSection={selectedSection}
                        setSelectedSection={setSelectedSection}
                        setSelectedActivity={setSelectedActivity} />
                }
            </div>

            {selectedSection !== "Subsection" && (
                <ActivitySection
                    selectedSection={selectedSection}
                    setSelectedActivity={setSelectedActivity}
                />
            )}
            {selectedActivity !== "Activity" && (
                <ActivityInformation averageQualification={averageQualification} />
            )}
        </section>
    );
}