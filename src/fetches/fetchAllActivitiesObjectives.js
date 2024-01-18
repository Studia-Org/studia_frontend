import { API } from "../constant";
import { getToken } from "../helpers";


export async function fetchAllActivitiesObjectives({ courseId }) {
    try {
        const response = await fetch(
            `${API}/courses/${courseId}?populate=sections.subsections.activity.categories`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`
                },
            }
        );
        const data = await response.json();
        const allObjectives = []
        data.data.attributes.sections.data.forEach(section => {
            section.attributes.subsections.data.forEach(subsection => {
                subsection.attributes.activity.data?.attributes.categories?.forEach(category => {
                    if (!allObjectives.includes(category)) {
                        allObjectives.push(category)
                    }
                })
            })
        })
        return allObjectives
    } catch (error) {
        console.error(error);
    }
}
