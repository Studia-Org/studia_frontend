import { API } from "../constant";

export async function fetchSingleQualification({ activityId, userId }) {
    try {
        const response = await fetch(`${API}/qualifications?fields[0]=qualification&populate[activity][fields][0]&filters[activity][id]=${activityId}&populate[user][fields][0]&filters[user][id]=${userId}`);
        const data = await response.json();


        return data.data[0].attributes.qualification;

    } catch (error) {
        console.error(error);
        throw error;
    }
}