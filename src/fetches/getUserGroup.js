import { API } from "../constant";

export async function getUserGroup({ user, activityId }) {

    const response = await fetch(`${API}/groups?populate[users][fields][0]=*` +
        `&populate[users][populate][profile_photo][fields][0]=*` +
        `&populate[activity][fields][0]=title` +
        `&populate[qualification][fields][0]=*` +
        `&filters[users][id]=${user.id}` +
        `&filters[activity][id]=${activityId}`,
    )
    const data = await response.json();
    if (data.data.length === 0) {
        return null;
    }
    return data.data[0].attributes;
}