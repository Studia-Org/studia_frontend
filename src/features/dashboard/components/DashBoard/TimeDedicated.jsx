import { BarChart, Title } from "@tremor/react";
import { useEffect, useState } from "react";
import { fetchAverageCourse } from "../../../../fetches/fetchAverageCourse";
import { useAuthContext } from "../../../../context/AuthContext";
import { set } from "date-fns";

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
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [charData, setCharData] = useState([]);

  useEffect(() => {
    async function getAverageAndQualification() {
      setLoading(true);
      const userId = user.id;
      const dict = {};

      // Utilizar Promise.all para esperar a que todas las promesas se resuelvan
      await Promise.all(courses.map(async (course) => {
        dict[course.title] = await fetchAverageCourse({ courseId: course.id, userId });
      }));
      console.log(dict);
      // Imprimir el diccionario después de que todas las promesas se hayan resuelto
      setCharData(
        Object.keys(dict).map((key) => {
          return {
            name: key,
            "Average course": dict[key].averageMainActivity,
            "Your mark": dict[key].averageMainActivityUser,

          };
        })
      );

      //const qualification = await fetchSingleQualification({ activityId, userId })
      setLoading(false);
    }

    getAverageAndQualification();

  }, [courses]);



  return (
    <section className=" p-5 bg-white shadow-lg w-full rounded-lg box-border">
      <Title>Average course marks</Title>
      <BarChart
        className="mx-auto my-auto w-[95%] h-full py-5"
        data={charData}
        index="name"
        categories={[
          "Average course",
          "Your mark",
        ]}
        colors={["emerald", "violet"]}
        yAxisWidth={48}
      />
    </section>
  );
}