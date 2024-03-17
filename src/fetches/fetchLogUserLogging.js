import { API, BEARER } from "../constant";

export function fetchLogUserLogging({ data, token }) {
    let log = data.log;
    const currentDate = new Date().toLocaleString();
    if (log === undefined || log === null) {
        log = {
            logins: {}
        };
    }
    let logData = log.logins;
    logData[currentDate] = navigator.userAgent;

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