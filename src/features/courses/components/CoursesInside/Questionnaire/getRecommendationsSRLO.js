

export function getRecommendationsSRLO(userResponses, t) {
    const recomendationList = []
    const sizeSequence = [4, 5, 3, 5, 5, 5, 3, 4, 5, 5];
    let posicionSecuencia = 0;

    sizeSequence.forEach((size, index) => {
        const grupo = userResponses.slice(posicionSecuencia, posicionSecuencia + size);
        posicionSecuencia += size;

        // Calcular la media del grupo actual
        const respuestasNumeros = grupo.map(response => transformToNumber(response.answer, t));
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


function transformToNumber(response, t) {
    switch (response) {
        case t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options.1"):
            return 1
        case t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options.2"):
            return 2
        case t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options.3"):
            return 3
        case t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options.4"):
            return 4
        case t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options.5"):
            return 5
        case t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options.6"):
            return 6
        case t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options.7"):
            return 7
        default:
            return 4
    }
}