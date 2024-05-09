import { API, BEARER } from "../constant";
import { getToken } from "../helpers";

export async function fetchActivityHasGroups({ activityId }) {
    try {
        const response = await fetch(`${API}/groups?pagination[pageSize]=100&populate[users][populate][profile_photo][fields][0]=url&filters[activity][id]=${activityId}`, {
            headers: { Authorization: `${BEARER} ${getToken()}` },
        });
        const data = await response.json();
        return data.data;

    } catch (error) {
        console.error(error);
        throw error;
    }
}

