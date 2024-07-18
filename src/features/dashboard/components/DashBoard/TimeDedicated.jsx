import { Title } from "@tremor/react";
import { useEffect, useState } from "react";
import { fetchAverageCourse } from "../../../../fetches/fetchAverageCourse";
import { useAuthContext } from "../../../../context/AuthContext";
import ReactApexChart from 'react-apexcharts'
import { MoonLoader } from "react-spinners";
import { useTranslation } from "react-i18next";
const chartdata2 = [
  {
    name: "Topic 1",
    "Group A": 890,
    "Group B": 338,
    "Group C": 538,
    "Group D": 396,
    "Group E": 138,
    "Group F": 436,
  },
  {
    name: "Topic 2",
    "Group A": 289,
    "Group B": 233,
    "Group C": 253,
    "Group D": 333,
    "Group E": 133,
    "Group F": 533,
  },
  {
    name: "Topic 3",
    "Group A": 380,
    "Group B": 535,
    "Group C": 352,
    "Group D": 718,
    "Group E": 539,
    "Group F": 234,
  },
  {
    name: "Topic 4",
    "Group A": 90,
    "Group B": 98,
    "Group C": 28,
    "Group D": 33,
    "Group E": 61,
    "Group F": 53,
  },
];
export function TimeDedicated({ courses }) {
  const { t } = useTranslation();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [charData, setCharData] = useState([]);
  const text = t("DASHBOARD.average_course");
  const text2 = t("DASHBOARD.your_mark");

  useEffect(() => {
    async function getAverageAndQualification() {
      setLoading(true);
      const userId = user.id;
      const dict = {};

      // Utilizar Promise.all para esperar a que todas las promesas se resuelvan
      await Promise.all(courses.map(async (course) => {
        dict[course.title] = await fetchAverageCourse({ courseId: course.id, user: user });
      }));
      const data = Object.keys(dict).map((key) => {
        return {
          name: key,
          [text]: dict[key].averageMainActivity,
          [text2]: dict[key].averageMainActivityUser,
        };
      });
      setCharData(data)

      //const qualification = await fetchSingleQualification({ activityId, userId })
      setLoading(false);
    }

    getAverageAndQualification();

  }, [courses]);


  return (
    <section className="box-border w-full p-5 bg-white rounded-lg shadow-lg ">
      <Title>{t("DASHBOARD.average_course_marks")}</Title>
      {
        loading ? (
          <div className="flex items-center justify-center w-full h-full">
            <MoonLoader color="#363cd6" size={80} />
          </div>
        ) : (
          <ReactApexChart
            options={{
              chart: {
                type: 'bar',
                height: 'auto'
              },
              plotOptions: {
                bar: {
                  borderRadius: 5,
                  dataLabels: {
                    position: 'top', // top, center, bottom
                  },
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
                width: 2,
                colors: ['transparent']
              },
              xaxis: {
                categories: Object.keys(charData).map((key) => charData[key].name),
              },
              yaxis: {
                max: 10, // Establecer el valor máximo del eje Y
              },
              fill: {
                opacity: 1
              },
              tooltip: {
                y: {
                  formatter: function (val) {
                    return val
                  }
                }
              }
            }
            }
            series={
              user.role_str !== "student" ?
                [
                  {
                    name: text,
                    data: Object.keys(charData).map((key) => charData[key][text])
                  }
                ]
                :
                [
                  {
                    name: text,
                    data: Object.keys(charData).map((key) => charData[key][text])
                  }, {
                    name: t("DASHBOARD.your_mark"),
                    data: Object.keys(charData).map((key) => charData[key][text2])
                  }
                ]
            }
            type="bar" height={'95%'} />
        )
      }


    </section>
  );
}