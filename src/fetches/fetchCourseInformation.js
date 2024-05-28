import { API } from "../constant";
export async function fetchCourseInformation({ courseId }) {
  try {
    const response = await fetch(
      `${API}/courses/${courseId}?populate=sections.subsections.activity,sections.subsections.paragraphs,students.profile_photo,students.qualifications.activity,students.qualifications.file,professor.profile_photo,sections.subsections.landscape_photo,sections.subsections.questionnaire,` +
      `students.groups.qualifications.file,students.groups.qualifications.activity, students.groups.users,students.groups.users.profile_photo,students.groups.activity,cover`);
    const data = await response.json();
    return {
      courseInformation: data?.data?.attributes?.sections?.data ?? [],
      students: data?.data?.attributes?.students ?? [],
      professor: data?.data?.attributes?.professor?.data,
      allData: data?.data?.attributes,
    };
  } catch (error) {
    console.error(error);
  }
}
