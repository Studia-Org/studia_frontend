

export function getRecommendationsSRLO(userResponses, t, language) {
    const recomendationList = []
    const sizeSequence = [4, 5, 3, 5, 5, 5, 3, 4, 5, 5];
    let posicionSecuencia = 0;

    sizeSequence.forEach((size, index) => {
        const grupo = userResponses.slice(posicionSecuencia, posicionSecuencia + size);
        posicionSecuencia += size;

        // Calcular la media del grupo actual
        const respuestasNumeros = grupo.map(response => transformToNumber(response.answer, language));
        const mediaGrupo = respuestasNumeros.reduce((a, b) => a + b, 0) / size;
        recomendationList.push(returnRecommendation(mediaGrupo, index, t) || null);
    })
    return recomendationList

}

function returnRecommendation(mediaGrupo, grupo, t) {
    switch (grupo) {
        case 0:
            if (mediaGrupo < 4) {
                return t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.RECOMMENDATION.CASE_0")
            }
            break;
        case 1:
            if (mediaGrupo < 4) {
                return t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.RECOMMENDATION.CASE_1")
            }
            break;
        case 2:
            if (mediaGrupo < 4) {
                return  t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.RECOMMENDATION.CASE_2")
            }
            break;
        case 3:
            if (mediaGrupo < 4) {
                return  t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.RECOMMENDATION.CASE_3")
            }
            break;
        case 4:
            if (mediaGrupo < 4) {
                return  t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.RECOMMENDATION.CASE_4")
            }
            break;
        case 5:
            if (mediaGrupo < 4) {
                return  t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.RECOMMENDATION.CASE_5")
            }
            break;
        case 6:
            if (mediaGrupo < 4) {
                return  t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.RECOMMENDATION.CASE_6")
            }
            break;
        case 7:
            if (mediaGrupo < 4) {
                return  t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.RECOMMENDATION.CASE_7")
            }
            break;
        case 8:
            if (mediaGrupo < 4) {
                return  t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.RECOMMENDATION.CASE_8")
            }
            break;
        case 9:
            if (mediaGrupo < 4) {
                return  t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.RECOMMENDATION.CASE_9")
            }
            break;
        default:
            return  t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.RECOMMENDATION.CASE_0")
    }
}


function transformToNumber(response, language) {
    const translations = {
        en: {
            "Strongly Disagree": 1,
            "Disagree": 2,
            "Somewhat Disagree": 3,
            "Neutral": 4,
            "Somewhat Agree": 5,
            "Agree": 6,
            "Strongly Agree": 7
        },
        es: {
            "Totalmente en desacuerdo": 1,
            "En desacuerdo": 2,
            "Algo en desacuerdo": 3,
            "Neutral": 4,
            "Algo de acuerdo": 5,
            "De acuerdo": 6,
            "Totalmente de acuerdo": 7
        },
        ca: {
            "Totalment en desacord": 1,
            "En desacord": 2,
            "Una mica en desacord": 3,
            "Neutral": 4,
            "Una mica d'acord": 5,
            "D'acord": 6,
            "Totalment d'acord": 7
        }
    };

    const currentLang = translations[language] || translations['en'];
    return currentLang[response] || 4; 
}