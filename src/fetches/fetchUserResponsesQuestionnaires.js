import { API } from "../constant";

export const fetchUserResponsesQuestionnaires = async (idQuestionnaire) => {
    try {
        const response = await fetch(`${API}/user-response-questionnaires?populate=questionnaire,user.profile_photo`);
        const data = await response.json();
        const questionnaireResponses = data.data.filter((response) => response.attributes.questionnaire.data.id === idQuestionnaire);
        return questionnaireResponses;
    } catch (error) {
        console.error('Error al obtener las respuestas del cuestionario:', error);
        throw error;
    }
};
