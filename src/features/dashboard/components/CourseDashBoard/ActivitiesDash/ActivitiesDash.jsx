import { useState, useEffect } from "react";
import { CardSimple } from "../../../utils/CardSimple";
import { GenerateChartQualifitation } from "../../../utils/BarChartQualification";
import { DropDownCourse, DropDownSection } from "./components/DropDownActivities";
import { fetchAverageQualification } from "../../../../../fetches/fetchAverageQualification";
import { MoonLoader } from "react-spinners";
import { fetchSingleQualification } from "../../../../../fetches/fetchSingleQualification";
import { useAuthContext } from "../../../../../context/AuthContext";

export function ActivitiesDash({ courseInformation, styles }) {
    const [selectedCourse, setSelectedCourse] = useState("Section");
    const [selectedSection, setSelectedSection] = useState("Subsection");
    const [selectedActivity, setSelectedActivity] = useState("Activity");
    const [loading, setLoading] = useState(false);
    const [averageQualification, setAverageQualification] = useState(0);
    const [qualification, setQualification] = useState(0);
    const { user } = useAuthContext();

    useEffect(() => {
        if (selectedActivity === "Activity") return
        async function getAverageAndQualification() {
            const activityId = selectedActivity.id
            const userId = user.id
            setLoading(true)
            const average = await fetchAverageQualification({ activityId })
            const qualification = await fetchSingleQualification({ activityId, userId })
            setLoading(false)
            setAverageQualification(average)
            setQualification(qualification)
        }
        getAverageAndQualification()

    }, [selectedActivity]);

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
            <main className="flex flex-col w-full h-full justify-center mt-4">
                {
                    !loading ?
                        <div className="flex flex-col justify-evenly items-center 
                        xl:w-1/2 h-full xl:border-r-[1px] border-black gap-y-1 ">
                            <div className="flex justify-evenly w-full">
                                <p className="text-lg font-medium pt-2 pb-1">
                                    Average: {averageQualification.toFixed(2)}</p>
                                <p className="text-lg font-medium pt-2 pb-1">
                                    Your score: {qualification.toFixed(2)}</p>
                            </div>
                            <GenerateChartQualifitation
                                averageQualification={averageQualification}
                                qualification={qualification} />
                        </div>
                        :
                        <MoonLoader className="self-center" color="#363cd6" size={80} />
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