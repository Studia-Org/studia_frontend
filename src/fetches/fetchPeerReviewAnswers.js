import { API } from "../constant";
import { getToken } from "../helpers";


export async function fetchPeerReviewAnswers() {
    try {
        const response = await fetch(
            `${API}/peer-review-answers?populate=user.profile_photo,qualification.activity,qualification.user.profile_photo`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`
                },
            }
        );
        const data = await response.json();
        return data?.data ?? []
    } catch (error) {
        console.error(error);
    }
}
