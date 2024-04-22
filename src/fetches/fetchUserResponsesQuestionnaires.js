import { API } from "../constant";

export const fetchUserResponsesQuestionnaires = async (idQuestionnaire) => {
    try {
        const response = await fetch(`${API}/user-response-questionnaires?populate=questionnaire,user.profile_photo,user.qualifications.activity.subsection.questionnaire`);
        const data = await response.json();
        const questionnaireResponses = data.data.filter((response) => response.attributes.questionnaire?.data?.id === idQuestionnaire);
        questionnaireResponses.forEach((response) => {
            response.attributes.user?.data.attributes.qualifications?.data.forEach((qualification) => {
                if (qualification.attributes.activity?.data?.attributes.subsection?.data?.attributes.questionnaire?.data?.id === idQuestionnaire) {
                    response.attributes.qualification = qualification;
                }
            })
        })
        return questionnaireResponses;
    } catch (error) {
        console.error('Error al obtener las respuestas del cuestionario:', error);
        throw error;
    }
};
