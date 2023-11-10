import { API, BEARER } from "../constant";

export function fetchLogUserLogging({ data, token }) {
    const log = data.log;
    const logData = log.logins;
    const currentDate = new Date().toLocaleString();
    logData[currentDate] = navigator.userAgent;
    console.log(logData);
    fetch(`${API}/logs/${log.id}`, {
        method: "PUT",
        headers: {
            Authorization: `${BEARER} ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            data: log,
        }),
    })
        .then(res => res.json())
        .then(updatedData => {
        })
        .catch(error => {
        });
}