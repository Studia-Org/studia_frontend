import { API, BEARER } from "../constant";
import { getToken } from "../helpers";

export async function fetchUsersInformationComplete({ courseId }) {
    try {
        const response = await fetch(`${API}/courses/${courseId}?populate[students][populate][profile_photo][fields][0]=url`, {
            headers: { Authorization: `${BEARER} ${getToken()}` },
        });
        const data = await response.json();
        return data;

    } catch (error) {
        console.error(error);
        throw error;
    }
}

