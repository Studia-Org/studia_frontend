import { API } from "../constant";

export async function fetchAverageQualificationOneActivity({ activityId }) {
    try {
        const response = await fetch(`${API}/qualifications?` +
            `fields[0]=qualification&` +
            `populate[activity][fields][0]=title&` +
            `filters[activity][id]=${activityId}`);

        const data = await response.json();

        const qualificationsList = data.data.map((qualification) => {
            return qualification.attributes.qualification;
        });

        if (qualificationsList.length > 0) {
            const sum = qualificationsList.reduce((acc, element) => acc + element, 0);
            return sum / qualificationsList.length;
        } else {
            return 0;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}