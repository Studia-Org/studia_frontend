import { API } from "../constant";

export async function fetchAllCoursesFromUser(userId) {
    const response = await fetch(`${API}/courses/?populate=sections.subsections.activity,students`, {
        method: 'GET',
    });
    const data = await response.json();
    const coursesList = []
    data.data.forEach(course => {
        course.attributes.students.data.forEach(student => {
            if (student.id === userId) {
                coursesList.push(course)
            }
        })
    })
    return coursesList;
}