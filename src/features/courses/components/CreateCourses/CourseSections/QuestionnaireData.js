import { useTranslation } from "react-i18next"

const QuestionnaireData = () => {
    const { t } = useTranslation();

    const SRLOQuestionnaireData = {
        attributes: {
            Title: "SRL-O Questionnaire",
            description: "Questionnaire for measuring student self-regulated learning",
            autocorrect: false,
            editable: false,
            type: "scaling",
            Options: {
                questionnaire: {
                    editable: false,
                    type: "SRL-O",
                    title: "SRL-O Questionnaire",
                    description: "Questionnaire for measuring student self-regulated learning",
                    questions:
                        [
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_1"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_2"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_3"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_4"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_5"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_6"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_7"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_8"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_9"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },

                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_10"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_11"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_12"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_13"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_14"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_15"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_16"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_17"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_18"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },

                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_19"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_20"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_21"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_22"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_23"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_24"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_25"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_26"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_27"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_28"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_29"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_30"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_31"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_32"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_33"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_34"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_35"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_36"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_37"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_38"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_39"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_40"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_41"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.QUESTIONS.QUESTION_42"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                        ],
                    correctAnswers: {}
                }
            }
        }
    }

    const EmptyQuestionnaireData = {
        attributes: {
            Title: "Empty Questionnaire",
            description: "Empty Questionnaire",
            autocorrect: false,
            editable: true,
            type: "standard",
            Options: {
                questionnaire: {
                    editable: true,
                    type: "Empty",
                    title: "Empty Questionnaire",
                    description: "Empty Questionnaire",
                    questions:
                        [],
                    correctAnswers: {}
                }
            }

        }
    }

    const PlannificationQuestionnaireData = {
        attributes: {
            Title: "Plannification Questionnaire",
            description: "Questionnaire for measuring student plannification",
            autocorrect: false,
            editable: true,
            type: "standard",
            Options: {
                questionnaire: {
                    title: "Plannification Questionnaire",
                    description: "Questionnaire for measuring student plannification",
                    editable: true,
                    type: "Plannification",
                    questions:
                        [
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.PLANNING.QUESTIONS.QUESTION_1"),
                                "type": "open-ended"
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.PLANNING.QUESTIONS.QUESTION_2"),
                                "options": "open-ended"
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.PLANNING.QUESTIONS.QUESTION_3"),
                                "options": "open-ended"
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.PLANNING.QUESTIONS.QUESTION_4"),
                                "options": "open-ended"
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.PLANNING.QUESTIONS.QUESTION_5"),
                                "options": "open-ended"
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.PLANNING.QUESTIONS.QUESTION_6"),
                                "options": "open-ended"
                            }
                        ],
                    correctAnswers: {}
                }
            }
        }
    }

    const SelfAssesmentData = {
        attributes: {
            Title: "Self-Assessment Questionnaire",
            description: "Questionnaire for measuring the performance and progress of students.",
            autocorrect: false,
            editable: true,
            type: "standard",
            Options: {
                questionnaire: {
                    title: "Self-Assessment Questionnaire",
                    description: "Questionnaire for measuring student self-assessment",
                    editable: true,
                    type: "Self-Assessment",
                    questions:
                        [
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.QUESTIONS.QUESTION_1"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.QUESTIONS.QUESTION_2"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.QUESTIONS.QUESTION_3"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.QUESTIONS.QUESTION_4"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.QUESTIONS.QUESTION_5"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.QUESTIONS.QUESTION_6"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.QUESTIONS.QUESTION_7"),
                                "options": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.GENERAL_OPTIONS.options", { returnObjects: true })
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.QUESTIONS.QUESTION_8"),
                                "type": "open-ended"
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.QUESTIONS.QUESTION_9"),
                                "type": "open-ended"
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.QUESTIONS.QUESTION_10"),
                                "type": "open-ended"
                            },
                        ],
                    correctAnswers: {}
                }
            }
        }
    }

    return {
        SRLOQuestionnaireData,
        EmptyQuestionnaireData,
        PlannificationQuestionnaireData,
        SelfAssesmentData
    };
}

export default QuestionnaireData;