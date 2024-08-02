import { API } from "../constant";

export async function fetchQuestionnaireTimeByCourse({ courseId, userId = null }) {
    try {
        const response = await fetch(`${API}/courses/${courseId}?` +
            `populate[sections][fields][0]=id&populate[sections][populate][subsections][fields][0]=id&` +
            `populate[sections][populate][subsections][populate][questionnaire][fields][0]=id&` +
            `populate[sections][populate][subsections][populate][questionnaire][populate][user_response_questionnaires][fields][0]=timeToComplete&` +
            `populate[sections][populate][subsections][populate][questionnaire][populate][user_response_questionnaires][populate][user][fields][0]=id`);
        const data = await response.json();
        let totalTime = 0;
        let totalUserTime = 0;
        let totalUserQuestionnaire = 0;
        let totalQuestionnaire = 0;
        const sections = data.data.attributes.sections;
        sections.data.forEach(section => {
            section.attributes.subsections.data.forEach(subsection => {
                if (subsection === null) return;
                if (subsection.attributes.questionnaire === null ||
                    subsection.attributes.questionnaire.data === null) return;
                subsection.attributes.questionnaire.data.attributes.user_response_questionnaires.data.forEach(userResponse => {

                    const time = userResponse.attributes.timeToComplete;
                    const user = userResponse.attributes.user.data;
                    if (user === null) return;
                    if (user.id === userId) {
                        totalUserTime += convertirTiempoASeconds(time);
                        totalUserQuestionnaire++;
                    }
                    if (time) {
                        totalTime += convertirTiempoASeconds(time);
                        totalQuestionnaire++;
                    }
                });
            });
        });


        const tiempoPromedio = totalTime / totalQuestionnaire;
        const tiempoPromedioFormateado = format(tiempoPromedio);
        const tiempoUsuario = totalUserTime / totalUserQuestionnaire;
        const tiempoUsuarioFormateado = format(tiempoUsuario);
        return { tiempoPromedio, tiempoPromedioFormateado, tiempoUsuario, tiempoUsuarioFormateado, totalQuestionnaire };
    }
    catch (error) {
        console.error(error);
    }
}

function convertirTiempoASeconds(tiempo) {
    const partesTiempo = tiempo.split(":");
    return parseInt(partesTiempo[0]) * 3600 + parseInt(partesTiempo[1]) * 60 + parseInt(partesTiempo[2]);
}

function format(ms) {
    const date = new Date(1970, 0, 1, 0, 0, ms);
    let formattedTime = undefined;

    if (date.getHours() > 0) {
        formattedTime = date.toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        formattedTime = formattedTime + "hr";
    } else {
        formattedTime = date.toLocaleTimeString('en-US', { minute: "2-digit", second: "2-digit" });
        formattedTime = formattedTime + "min";
    }

    return formattedTime;
}
