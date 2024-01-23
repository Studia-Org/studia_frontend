import { API, BEARER } from "../constant";
import { getToken } from "../helpers";

export async function fetchUserInformationComplete() {
    try {
        const response = await fetch(`${API}/users/me?populate=subsections_completed.activity`, {
            headers: { Authorization: `${BEARER} ${getToken()}` },
        });
        const data = await response.json();
        return data;

    } catch (error) {
        console.error(error);
        throw error;
    }
}