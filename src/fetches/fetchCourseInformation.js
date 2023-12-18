import { API } from "../constant";

export async function fetchCourseInformation({ courseId }) {
  try {
    const response = await fetch(
      `${API}/courses/${courseId}?populate=sections.subsections.activity,sections.subsections.paragraphs,students.profile_photo,professor.profile_photo,sections.subsections.landscape_photo,sections.subsections.questionnaire`
    );
    const data = await response.json();
    return {
      courseInformation: data?.data?.attributes?.sections?.data ?? [],
      students: data?.data?.attributes?.students ?? [],
      professor: data?.data?.attributes?.professor?.data,
    };
  } catch (error) {
    console.error(error);
  }
}
