import { API, BEARER } from "../constant";

export function fetchLogUserLogging({ data, token }) {
    let log = data.log;
    const currentDate = new Date().toLocaleString();
    if (data.log === null || log.logins === undefined || log.logins === null) {
        log = {
            logins: {}
        };
    }
    let logData = log.logins;
    logData[currentDate] = navigator.userAgent;

    if (data.log === null) {
        fetch(`${API}/logs`, {
            method: "POST",
            headers: {
                Authorization: `${BEARER} ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: {
                    logins: logData,
                    user: data.id

                },
            }),
        })
            .then(res => res.json())
            .then(updatedData => {
            })
            .catch(error => {
            });
    }
    else {
        fetch(`${API}/logs/${data.log.id}`, {
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

}