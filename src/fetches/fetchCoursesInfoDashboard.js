import { API } from "../constant";

export async function fetchCoursesInfoDashboard(user) {
    const userId = user.id;
    let response = null
    try {
        const courseList = []
        if (user.role_str === 'student') {
            response = await fetch(`${API}/courses?populate=professor.profile_photo,cover,students&filters[students]=${userId}`);
        } else {
            response = await fetch(`${API}/courses?populate=professor.profile_photo,cover,students`);
        }

        const data = await response.json();
        data.data.forEach(course => {
            if (user.role_str !== 'student') {
                if (course.attributes.professor.data.id === userId || course.attributes.evaluators?.data.includes(userId)) {
                    courseList.push({
                        id: course.id,
                        title: course.attributes.title,
                        cover: course.attributes.cover,
                        professor: course.attributes.professor.data,
                    })
                }
            } else {
                courseList.push({
                    id: course.id,
                    title: course.attributes.title,
                    cover: course.attributes.cover,
                    professor: course.attributes.professor.data,
                })
            }
        })
        return courseList;
    } catch (error) {
        console.error(error);
        throw error;
    }
}