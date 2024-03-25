import { API } from "../../../constant";
import { getToken } from "../../../helpers";

export function updateActivityPonderation({ activityId, ponderation }) {
    return fetch(`${API}/updateQualificationsByPonderations`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
            ponderationStudent: ponderation,
            activityId: activityId
        })

    }).then(response => response.json())
        .then(data => data)
        .catch(error => error)
}