import { API } from "../constant";

export async function fetchStudentsAverageWithLabel(courseId) {
    try {
        const dataToReturn = {};

        const dataStudents = {}
        const dataActivities = {}

        const response = await fetch(`${API}/courses/${courseId}?populate=students.qualifications,sections.subsections.activity.qualifications`);
        const data = await response.json();
        console.log(data);

        //Incializamos el objeto que vamos a devolver con los nombres de todos los estudiantes
        data.data.attributes.students.data.forEach(student => {
            dataStudents[student.attributes.name] = [];
        });

        data.data.attributes.sections.data.forEach(section => {
            section.attributes.subsections.data.forEach(subsection => {
                const activity = subsection.attributes.activity?.data?.attributes;

                if (activity && activity.qualifications.data) {
                    let activityQualifications = activity.qualifications.data;
                    const averageQualification = activityQualifications.reduce((sum, qualification) => sum + qualification.attributes.qualification, 0) / activityQualifications.length;

                    dataActivities[activity.title] = averageQualification.toFixed(2) || 0;

                    data.data.attributes.students.data.forEach(student => {
                        const studentQualifications = student.attributes.qualifications.data;

                        studentQualifications.forEach(qualificationStudent => {
                            const matchingQualification = activityQualifications.find(qualificationActivity => qualificationStudent.id === qualificationActivity.id);

                            if (matchingQualification) {
                                dataStudents[student.attributes.name].push(qualificationStudent.attributes.qualification);
                            }
                        });
                    });
                }
            });
        });

        const cleanActivities = Object.fromEntries(
            Object.entries(dataActivities).filter(([key, value]) => value !== 'NaN')
        );

        for (const student in dataStudents) {
            const total = dataStudents[student].reduce((acc, value) => acc + value, 0)
            const average = total / dataStudents[student].length || 0
            dataStudents[student] = average.toFixed(2)
        }
        dataToReturn['students'] = dataStudents;
        dataToReturn['activities'] = cleanActivities;

        return dataToReturn

    } catch (error) {
        console.error(error);
        throw error;
    }
}