import { API } from "../constant";
import { getToken } from "../helpers";


export async function fetchPeerReviewAnswers(activityId) {
    try {
        const response = await fetch(
            `${API}/peer-review-answers` +
            `?populate[user][populate][profile_photo][fields][0]=*` +
            `&populate[qualification][populate][activity][fields][0]=*` +
            `&populate[qualification][populate][user][populate][profile_photo][fields][0]=*` +
            '&filters[qualification][activity][id]=' + activityId,

            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`
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
