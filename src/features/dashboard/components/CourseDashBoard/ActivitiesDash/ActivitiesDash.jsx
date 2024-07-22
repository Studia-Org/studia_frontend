import { useState, useEffect } from "react";
import { MoonLoader } from "react-spinners";
import { useAuthContext } from "../../../../../context/AuthContext";
import { PieChart } from '@mui/x-charts/PieChart';
import ReactApexChart from 'react-apexcharts'
import { useNavigate } from "react-router-dom";
import { fetchAverageCourse } from "../../../../../fetches/fetchAverageCourse";
import { fetchAllActivitiesObjectives } from "../../../../../fetches/fetchAllActivitiesObjectives";
import { fetchNumbersOfPosts } from "../../../../../fetches/fetchNumbersOfPosts";
import { ActivityDetailChart } from "./components/ActivityDetailChart";
import { StudentGradesProfessor } from "./components/StudentGradesProfessor";
import { fetchQuestionnaireTimeByCourse } from "../../../../../fetches/fetchQuestionnaireTimeByCourse";
import { ProgressChart } from "./components/ProgressChart";
import { Empty } from "antd";
import { fetchStudentsAverageWithLabel } from "../../../../../fetches/fetchStudentsAverageWithLabel";
import { useTranslation } from "react-i18next";

export function ActivitiesDash({ courseInformation, styles, courseId }) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [studentsAverage, setStudentsAverage] = useState()
    const [activitiesAverage, setActivitiesAverage] = useState();
    const [objectives, setObjectives] = useState()
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

            const { averageMainActivity, averageMainActivityUser, totalQualifications } = await fetchAverageCourse({ courseId, user })
            const objectives = await fetchAllActivitiesObjectives({ courseId })
            setAverageQualification(averageMainActivity)
            setObjectives(objectives)
            setQualification(averageMainActivityUser)
            if (user.role_str !== "student") {
                let data = await fetchStudentsAverageWithLabel(courseId)
                setStudentsAverage(data.students)
                setActivitiesAverage(data.activities)
            }
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

    function CourseProgress() {
        return (
            !loading ?
                <>
                    <p className="mb-1 text-lg font-medium">{t("DASHBOARD.objective_progress")}</p>
                    <p className="pb-5 text-sm font-normal text-gray-600">{t("DASHBOARD.check_progress")}</p>
                    <div className="">
                        {
                            objectives.length !== 0 ?
                                <ProgressChart objectivesList={objectives} />
                                :
                                <Empty description='Course is empty' />
                        }
                    </div>

                </>
                :
                <MoonLoader className="self-center" color="#363cd6" size={80} />
        )
    }

    function checkIfNoQualifications(totalQualifications) {
        return totalQualifications.every(item => item.value === 'NaN');
    }

    function generatePieChart() {
        const colors = [
            '#1f77b4',
            '#ff7f0e',
            '#2ca02c',
            '#d62728',
            '#9467bd',
            '#8c564b',
            '#e377c2',
            '#7f7f7f',
            '#bcbd22',
            '#17becf',
            '#ffcc00'
        ]

        // Añadir color a cada entrada de datos
        const coloredData = totalQualifications.map((item, index) => ({
            ...item,
            color: colors[index % colors.length]
        }));

        return (
            <>
                <p className="mb-1 text-lg font-medium">{t("DASHBOARD.qualifications_distribution")}</p>
                <p className="pb-5 text-sm font-normal text-gray-600">{t("DASHBOARD.distribution_based_on_activities")}</p>
                {
                    checkIfNoQualifications(totalQualifications) ?
                        <div className="flex items-center justify-center h-full pb-32">
                            <Empty description='No data to show' />
                        </div>
                        :
                        <PieChart
                            series={[{
                                data: coloredData,
                                highlightScope: { faded: 'global', highlighted: 'item' },
                                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                            }]}
                            height={200}
                        />
                }

            </>
        )
    }
    function QuestionnarieTime() {
        return (
            <>
                <p className="mb-1 text-lg font-medium">{t("DASHBOARD.questionnaire_time_min")}</p>
                <p className="pb-5 text-sm font-normal text-gray-600">{t("DASHBOARD.compare_time")}</p>
                {
                    questionnaireTime[0] === '0.00' && questionnaireTime[1] === '0.00' ?
                        <div className="flex items-center justify-center h-full pb-32">
                            <Empty description='No data to show' />
                        </div>

                        :
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
                                    categories: [t("DASHBOARD.average_time_spent"), t("DASHBOARD.your_time_spent")],
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
                }

            </>
        )
    }
    function PostChart() {
        return (
            <>
                <p className="mb-1 text-lg font-medium">{t("DASHBOARD.participation_forums")}</p>
                <p className="pb-5 text-sm font-normal text-gray-600">{t("DASHBOARD.measure_engagement")}</p>
                {
                    posts.totalPosts === 0 && posts.totalRespuestas === 0 ?
                        <div className="flex items-center justify-center h-full pb-32">
                            <Empty description={t("DASHBOARD.no_data")} />
                        </div>
                        :
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
                                    categories: [t("DASHBOARD.posts_forum"), t("DASHBOARD.replies_forum")]
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
                                    name: t("DASHBOARD.total_posts"),
                                    data: [posts.totalPosts, 0]
                                },
                                {
                                    name: t("DASHBOARD.total_answers"),
                                    data: [0, posts.totalRespuestas]
                                },
                                {
                                    name: t("DASHBOARD.your_posts"),
                                    data: [posts.postsUsuario, 0]
                                },
                                {
                                    name: t("DASHBOARD.your_answers"),
                                    data: [0, posts.respuestasUsuario]
                                }
                            ]}
                        />
                }
            </>
        )
    }
    return (
        <section className={`flex flex-col p-2 lg:p-5 rounded-lg  ${styles}`}>
            {
                loading ?
                    <div className="flex items-center justify-center w-full h-full ">
                        <MoonLoader color="#363cd6" size={80} />
                    </div>
                    :
                    <main className="h-full mb-10">
                        <button className='flex pb-2 mb-4 text-sm duration-150 md:-mt-4 w-fit hover:-translate-x-2 '
                            onClick={() => navigate(`/app/dashboard`)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                            </svg>
                            <p className='ml-1 '>{t("DASHBOARD.go_back_dashboard")}</p>
                        </button>
                        <h2 className="mb-1 text-xl font-semibold">{t("DASHBOARD.course_dashboard")}</h2>
                        <p className="mb-5 text-sm text-gray-500">{t("DASHBOARD.explore_performance_metrics")}</p>

                        <div className="grid gap-6 pb-16  grid-cols-1 lg:grid-cols-[repeat(auto-fit,minmax(30vw,1fr))] ">
                            {
                                user.role_str === "student" ?
                                    <>
                                        <section className="rounded-lg bg-white p-5 overflow-x-auto overflow-y-clip max-w-[calc(100vw-2rem)]  
                                    shadow-lg">
                                            <CourseProgress />
                                        </section>
                                        <section className="rounded-lg bg-white p-5 overflow-x-auto overflow-y-clip max-w-[calc(100vw-2rem)] 
                                      shadow-lg">
                                            {totalQualifications && generatePieChart()}
                                        </section>
                                    </>
                                    :
                                    <>
                                        <section className="rounded-lg col-span-full bg-white p-5 overflow-x-auto overflow-y-clip max-w-[calc(100vw-2rem)]  
                                    shadow-lg">
                                            {studentsAverage && <StudentGradesProfessor data={studentsAverage} />}
                                        </section>
                                    </>
                            }
                            {
                                user.role_str === "student" ?
                                    <section className="rounded-lg bg-white p-5 overflow-x-auto overflow-y-clip max-w-[calc(100vw-2rem)] 
                                shadow-lg">
                                        {questionnaireTime && QuestionnarieTime()}
                                    </section>
                                    :
                                    <section className="rounded-lg bg-white p-5 overflow-x-auto overflow-y-clip max-w-[calc(100vw-2rem)] shadow-lg">
                                        {activitiesAverage && <ActivityDetailChart data={activitiesAverage} />}
                                    </section>
                            }
                            <section className="rounded-lg bg-white overflow-x-auto p-5 overflow-y-clip max-w-[calc(100vw-2rem)] 
                             shadow-lg">
                                {posts && <PostChart />}
                            </section>
                        </div>
                    </main>
            }

        </section>
    );
}