import { API, BEARER } from "../constant";
import { getToken } from "../helpers";

export async function fetchCreateGroups({ activityId, groups }) {
    const response = await fetch(`${API}/create_groups`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
            activityId,
            groups
        })
    }
    );
    const data = await response.json();
    return data;
}
