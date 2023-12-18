import { useState, useEffect } from "react";
import { GenerateChartQualifitation } from "../../../utils/BarChartQualification";
import { MoonLoader } from "react-spinners";
import { useAuthContext } from "../../../../../context/AuthContext";
import { fetchAverageCourse } from "../../../../../fetches/fetchAverageCourse";
import { fetchAverageSubSectionMark } from "../../../../../fetches/fetchAvegareSubsectionsMark";
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { useNavigate } from "react-router-dom";
import { fetchQuestionnaireTimeByCourse } from "../../../../../fetches/fetchQuestionnaireTimeByCourse";

export function ActivitiesDash({ courseInformation, styles, courseId }) {
    const [selectedCourse, setSelectedCourse] = useState("Section");
    const [loading, setLoading] = useState(true);
    const [averageQualification, setAverageQualification] = useState(0);
    const [qualification, setQualification] = useState(0);
    const [totalQualifications, setTotalQualifications] = useState();
    const [questionnaireTime, setQuestionnaireTime] = useState([{}]);
    const { user } = useAuthContext();
    const navigate = useNavigate();
    useEffect(() => {
        async function getAverageAndQualification() {
            const userId = user.id
            setLoading(true)
            const { averageMainActivity, averageMainActivityUser, totalQualifications } =
                await fetchAverageCourse({ courseId, userId })
            setAverageQualification(averageMainActivity)
            setQualification(averageMainActivityUser)


            const { tiempoPromedio, tiempoPromedioFormateado, tiempoUsuario, tiempoUsuarioFormateado, totalQuestionnaire } =
                await fetchQuestionnaireTimeByCourse({ courseId, userId })

            setQuestionnaireTime([{
                data: [(tiempoPromedio / 60).toFixed(2), (tiempoUsuario / 60).toFixed(2)]

            }])

            const sumValues = Object.values(totalQualifications).reduce((a, b) => a + b, 0);
            let dict = [];
            for (let i = 0; i <= 10; i++) {
                const key = i.toString();
                const value = totalQualifications[key] || 0;

                dict.push({ id: key, value: (value / sumValues * 100).toFixed().toString(), label: key });
            }

            setTotalQualifications(dict)
            setLoading(false)

        }
        getAverageAndQualification()

    }, [courseId])


    useEffect(() => {
        if (selectedCourse === "Subsection") return
        const sectionId = selectedCourse.id
        const userId = user.id
        fetchAverageSubSectionMark({ courseId, userId, sectionId })

    }, [selectedCourse])

    function ActivityInformation() {
        return (
            !loading ?
                <div>
                    <p className="text-2xl font-semibold">Course information</p>
                    <div className="flex flex-row justify-around h-full pb-2">
                        <div className="flex flex-col justify-evenly w-fit">
                            <p className="text-lg font-medium pt-2 pb-1">
                                Average: {averageQualification.toFixed(2)}</p>
                            <p className="text-lg font-medium pt-2 pb-1">
                                Your grade: {qualification?.toFixed(2)}</p>
                        </div>
                        <GenerateChartQualifitation
                            averageQualification={averageQualification}
                            qualification={qualification} />
                    </div>
                </div>
                :
                <MoonLoader className="self-center" color="#363cd6" size={80} />
        )
    }

    function generatePieChart() {
        return (
            <div>
                <p className="text-2xl font-semibold pb-4" >Qualifications distribution</p>
                <PieChart
                    series={[{
                        data: totalQualifications,
                        highlightScope: { faded: 'global', highlighted: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    }]}
                    height={200}
                />
            </div>
        )
    }
    function generateBarChart() {
        return (
            <div>
                <p className="text-2xl font-semibold pb-2">Questionnarie time (min)</p>
                <BarChart
                    xAxis={[{ scaleType: 'band', data: ["Average", "Your's"] }]}
                    series={questionnaireTime}
                    width={500}
                    height={300}
                />
            </div>
        )
    }

    return (
        <section className={`flex flex-col p-2 lg:p-5 rounded-lg  ${styles}`}>
            {
                loading ?
                    <div className=" flex items-center justify-center w-full h-full">
                        <MoonLoader color="#363cd6" size={80} />
                    </div>
                    :
                    <>
                        <button className='text-sm flex -mt-4 pb-2  w-fit hover:-translate-x-2 duration-150 '
                            onClick={() => navigate(`/app/dashboard`)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                            </svg>
                            <p className='ml-1'>Go back to dashboard</p>
                        </button>
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(500px,1fr))] gap-6">
                            <div className="rounded-lg bg-white p-5  min-h-[50%] shadow-lg">

                                <ActivityInformation />
                            </div>
                            <div className="rounded-lg bg-white p-5  min-h-[50%] shadow-lg">
                                {totalQualifications && generatePieChart()}
                            </div>
                            <div className="rounded-lg bg-white p-5  min-h-[50%] shadow-lg">
                                {questionnaireTime && generateBarChart()}
                            </div>
                        </div>
                    </>
            }

        </section>
    );
}