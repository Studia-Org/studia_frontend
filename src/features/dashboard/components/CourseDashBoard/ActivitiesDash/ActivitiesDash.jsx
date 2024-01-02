import { useState, useEffect } from "react";
import { GenerateChartQualifitation } from "../../../utils/BarChartQualification";
import { MoonLoader } from "react-spinners";
import { useAuthContext } from "../../../../../context/AuthContext";
import { PieChart } from '@mui/x-charts/PieChart';
import ReactApexChart from 'react-apexcharts'
import { useNavigate } from "react-router-dom";
import { fetchAverageCourse } from "../../../../../fetches/fetchAverageCourse";
import { fetchNumbersOfPosts } from "../../../../../fetches/fetchNumbersOfPosts";
import { fetchQuestionnaireTimeByCourse } from "../../../../../fetches/fetchQuestionnaireTimeByCourse";

export function ActivitiesDash({ courseInformation, styles, courseId }) {

    const [loading, setLoading] = useState(true);
    const [averageQualification, setAverageQualification] = useState(0);
    const [qualification, setQualification] = useState(0);
    const [totalQualifications, setTotalQualifications] = useState();
    const [questionnaireTime, setQuestionnaireTime] = useState([{}]);
    const [posts, setPosts] = useState({});
    const { user } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        async function getAverageAndQualification() {
            const userId = user.id
            setLoading(true)

            const { averageMainActivity, averageMainActivityUser, totalQualifications } = await fetchAverageCourse({ courseId, userId })

            setAverageQualification(averageMainActivity)
            setQualification(averageMainActivityUser)

            let { tiempoPromedio, tiempoPromedioFormateado, tiempoUsuario, tiempoUsuarioFormateado, totalQuestionnaire } =
                await fetchQuestionnaireTimeByCourse({ courseId, userId })
            if (isNaN(tiempoPromedio)) tiempoPromedio = 0
            if (isNaN(tiempoUsuario)) tiempoUsuario = 0

            setQuestionnaireTime([(tiempoPromedio / 60).toFixed(2), (tiempoUsuario / 60).toFixed(2)])

            const sumValues = Object.values(totalQualifications).reduce((a, b) => a + b, 0);
            let dict = [];
            for (let i = 0; i <= 10; i++) {
                const key = i.toString();
                const value = totalQualifications[key] || 0;

                dict.push({ id: key, value: (value / sumValues * 100).toFixed().toString(), label: key });
            }

            setTotalQualifications(dict)

            const { totalPosts, postsUsuario, totalRespuestas, respuestasUsuario } = await fetchNumbersOfPosts({ courseId, userId })
            setPosts({ totalPosts, postsUsuario, totalRespuestas, respuestasUsuario })
            setLoading(false)

        }
        getAverageAndQualification()

    }, [courseId])

    function ActivityInformation() {
        return (
            !loading ?
                <>
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
                </>
                :
                <MoonLoader className="self-center" color="#363cd6" size={80} />
        )
    }
    function generatePieChart() {
        return (
            <>
                <p className="text-2xl font-semibold pb-4" >Qualifications distribution</p>
                <PieChart
                    series={[{
                        data: totalQualifications,
                        highlightScope: { faded: 'global', highlighted: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    }]}
                    height={200}
                />
            </>
        )
    }
    function QuestionnarieTime() {
        return (
            <>
                <p className="text-2xl font-semibold pb-2">Questionnarie time (min)</p>
                <ReactApexChart
                    options={{

                        colors: ['#6E66D6'],
                        plotOptions: {
                            bar: {
                                borderRadius: 5,
                                dataLabels: {
                                    position: 'top',
                                },
                                columnWidth: 100 + (60 / (1 + 30 * Math.exp(2 / 3)))
                            }
                        },
                        dataLabels: {
                            enabled: true,
                            formatter: function (val) {
                                return val;
                            },
                            offsetY: -20,
                            style: {
                                fontSize: '12px',
                                colors: ["#304758"]
                            }
                        },

                        stroke: {
                            show: true,
                            width: 1,
                            colors: ['transparent']
                        },
                        xaxis: {
                            categories: ["Average time spent", "Your time spent"],
                        },
                        fill: {
                            opacity: 1,

                        },
                        tooltip: {
                            y: {
                                formatter: function (val) {
                                    return val + " min"
                                }
                            }
                        },
                        yaxis: {
                            max: Math.max(...questionnaireTime) + Math.max(...questionnaireTime) * 0.1,
                        }
                    }}
                    series={[
                        {
                            name: 'Time',
                            data: questionnaireTime
                        }


                    ]}
                    type="bar"
                    height={'90%'} />
            </>
        )
    }
    function PostChart() {
        return (
            <>
                <p className="text-2xl font-semibold pb-2">Participation in forums</p>
                <ReactApexChart
                    options={{
                        chart: {
                            type: 'bar',
                            stacked: true,
                        },
                        stroke: {
                            width: 1,
                            colors: ['#fff']
                        },
                        plotOptions: {
                            bar: {
                                horizontal: true,
                                dataLabels: {
                                    total: {
                                        enabled: true,
                                        offsetX: 0,
                                        style: {
                                            fontSize: '13px',
                                            fontWeight: 900
                                        }
                                    }
                                }
                            },
                        },
                        responsive: [{
                            breakpoint: 480,
                            options: {
                                legend: {
                                    position: 'bottom',
                                    offsetX: -10,
                                    offsetY: 0
                                }
                            }
                        }],
                        xaxis: {
                            categories: ['Posts forum', 'Replies forum']
                        },
                        fill: {
                            opacity: 1
                        },
                        colors: ['#008ffbd9', '#60009B', '#00e396d9', '#B800D8'],
                        yaxis: {
                            title: {
                                text: undefined
                            },
                        },
                        legend: {
                            position: 'top',
                            horizontalAlign: 'left',
                            offsetX: 40
                        }

                    }}
                    type="bar"
                    height={'90%'}
                    series={[
                        {
                            name: 'Total posts',
                            data: [posts.totalPosts, 0]
                        },
                        {
                            name: 'Total answers',
                            data: [0, posts.totalRespuestas]
                        },
                        {
                            name: 'Your posts',
                            data: [posts.postsUsuario, 0]
                        },
                        {
                            name: 'Your answers',
                            data: [0, posts.respuestasUsuario]
                        }
                    ]}
                />
            </>
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
                    <main className="h-full mb-10">
                        <button className='text-sm flex md:-mt-4 pb-2  w-fit hover:-translate-x-2 duration-150 '
                            onClick={() => navigate(`/app/dashboard`)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                            </svg>
                            <p className='ml-1'>Go back to dashboard</p>
                        </button>
                        <div className="grid gap-6 h-full grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(30vw,1fr))] ">
                            <section className="rounded-lg bg-white p-5 overflow-x-auto overflow-y-clip max-w-[calc(100vw-2rem)]  
                            shadow-lg">
                                <ActivityInformation />
                            </section>
                            <section className="rounded-lg bg-white p-5 overflow-x-auto overflow-y-clip max-w-[calc(100vw-2rem)] 
                              shadow-lg">
                                {totalQualifications && generatePieChart()}
                            </section>
                            <section className="rounded-lg max-h-[40dvh] bg-white p-5 overflow-x-auto overflow-y-clip max-w-[calc(100vw-2rem)] 
                            shadow-lg">
                                {questionnaireTime && QuestionnarieTime()}
                            </section>
                            <section className="rounded-lg max-h-[40dvh] bg-white overflow-x-auto p-5 overflow-y-clip max-w-[calc(100vw-2rem)] 
                             shadow-lg">
                                {posts && <PostChart />}
                            </section>
                        </div>
                    </main>
            }

        </section>
    );
}