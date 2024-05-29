import { API } from "../constant";
import { getToken } from "../helpers";


export async function fetchPeerReviewAnswers(activityId) {
    try {
        const response = await fetch(
            `${API}/peer-review-answers` +
            `?populate[user][populate][profile_photo][fields][0]=*` +
            `&populate[group][populate][users][populate][profile_photo][fields][0]=*` +
            `&populate[user][populate][groups][populate][activity][fields][0]=*` +
            `&populate[user][populate][groups][populate][users][fields][0]=*` +
            `&populate[user][populate][groups][populate][users][populate][profile_photo][fields][0]=url` +
            `&populate[qualifications][populate][activity][fields][0]=*` +
            `&populate[qualifications][populate][user][populate][profile_photo][fields][0]=*` +
            `&populate[qualifications][populate][group][populate][users][populate][profile_photo][fields][0]=*` +

            '&filters[qualifications][activity][id]=' + activityId, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
        );
        const data = await response.json();
        try {

            return data.data ?? []

        } catch (error) {
            return []
        }
    } catch (error) {
        console.error(error);
    }
}
