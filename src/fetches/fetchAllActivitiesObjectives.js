import { is } from "date-fns/locale";
import { API, BEARER } from "../constant";
import { useAuthContext } from "../context/AuthContext";
import { getToken } from "../helpers";



export async function fetchAllActivitiesObjectives({ courseId }) {
    try {

        const responseUser = await fetch(`${API}/users/me?populate=subsections_completed.activity,user_objectives`, {
            headers: { Authorization: `${BEARER} ${getToken()}` },
        });
        const dataUser = await responseUser.json();

        const allUserCategories = dataUser.user_objectives.reduce((categories, obj) => {
            obj.categories.forEach(category => {
                if (!categories.includes(category)) {
                    categories.push(category);
                }
            });
            return categories;
        }, []);

        const response = await fetch(
            `${API}/courses/${courseId}?populate=sections.subsections.activity,sections.subsections.paragraphs,students.profile_photo,students.qualifications.activity,students.qualifications.file,professor.profile_photo,sections.subsections.landscape_photo,sections.subsections.questionnaire`
            , {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`
                },
            }
        );
        const data = await response.json();
        const info = {
            courseInformation: data?.data?.attributes?.sections?.data ?? [],
            students: data?.data?.attributes?.students ?? [],
            professor: data?.data?.attributes?.professor?.data
        }

        const userSubsectionsCompletedCourse = []
        info.courseInformation.forEach((section) => {
            section.attributes.subsections.data.forEach((subsection) => {
                subsection?.attributes.activity?.data?.attributes.categories?.forEach((category) => {
                    dataUser.subsections_completed.forEach((subsection_completed) => {
                        if (subsection_completed?.activity?.id === subsection?.attributes?.activity?.data?.id) {
                            userSubsectionsCompletedCourse.push(subsection_completed)
                        }
                    })
                })
            })
        });

        const objectivesCompleted = {};
        info.courseInformation.forEach((section) => {
            section.attributes.subsections.data.forEach((subsection) => {
                subsection?.attributes.activity?.data?.attributes.categories?.forEach((category) => {
                    if (userSubsectionsCompletedCourse.length !== 0) {
                        userSubsectionsCompletedCourse?.forEach((subsection_completed) => {
                            if (subsection_completed.activity.id === subsection.attributes.activity.data.id) {
                                const existingObjective = objectivesCompleted[category];
                                const i_completed = existingObjective ? existingObjective.i_completed + 1 : 1;
                                const i_repeat = existingObjective ? existingObjective.i_repeat + 1 : 1;
                                const objective = { objective: category, i_completed, i_repeat };
                                objectivesCompleted[category] = objective;
                            } else {
                                const existingObjective = objectivesCompleted[category];
                                const i_completed = existingObjective ? existingObjective.i_completed : 0;
                                const i_repeat = existingObjective ? existingObjective.i_repeat + 1 : 1;
                                const objective = { objective: category, i_completed, i_repeat };
                                objectivesCompleted[category] = objective;
                            }
                        })
                    } else {
                        const existingObjective = objectivesCompleted[category];
                        const i_completed = existingObjective ? existingObjective.i_completed : 0;
                        const i_repeat = existingObjective ? existingObjective.i_repeat + 1 : 1;
                        const objective = { objective: category, i_completed, i_repeat };
                        objectivesCompleted[category] = objective;
                    }
                })
            })
        });
        const finalList = []
        const objectivesCompletedArray = Object.values(objectivesCompleted);
        const objectivesCompletedArraySorted = objectivesCompletedArray.sort((a, b) => b.i_completed - a.i_completed);
        objectivesCompletedArraySorted.forEach((objective) => {
            const isUserObjective = allUserCategories.includes(objective.objective);
            if (objective.i_completed > 0) {
                finalList.push({ objective: objective.objective, percentage: Math.round(objective.i_completed / objective.i_repeat * 100), isUserObjective: isUserObjective })
            } else {
                finalList.push({
                    objective: objective.objective, percentage: 0, isUserObjective: isUserObjective
                })
            }
        })
        return finalList;

    } catch (error) {
        console.error(error);
    }
}
