import { API, BEARER } from "../constant";
import { getToken } from "../helpers";

export async function fetchUserHasNotReadNotificationDashboard(userId) {
    let notificationRead = false;
    try {
        const response = await fetch(`${API}/notifications?populate=users&filters[users][id]=${userId}`, {
            method: 'GET',
            headers: {
                Authorization: `${BEARER} ${getToken()}`,
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        data.data.forEach((notification) => {
            if (notification.attributes.readJSON[userId] === false) {
                notificationRead = true;
            }
        });
        return notificationRead;
    } catch (error) {

    }
}