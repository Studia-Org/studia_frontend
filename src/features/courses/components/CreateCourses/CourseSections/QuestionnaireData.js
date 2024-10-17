import { useTranslation } from "react-i18next"

const QuestionnaireData = () => {
    const { t, i18n } = useTranslation();


    const SRLOQuestionnaireData = {
        attributes: {
            Title: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.title"),
            description: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.description"),
            autocorrect: false,
            editable: false,
            language: i18n.language,
            type: "scaling",
            Options: {
                questionnaire: {
                    editable: false,
                    type: "SRL-O",
                    title: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.title"),
                    description: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SRLO.description"),
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
    const SELF_REFLECTIONDATA = {
        attributes: {
            Title: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_REFLECTIONDATA.title"),
            description: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_REFLECTIONDATA.description"),
            autocorrect: false,
            editable: false,
            language: i18n.language,
            type: "standard",

            Options: {
                questionnaire: {
                    editable: false,
                    type: "Empty",
                    title: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_REFLECTIONDATA.title"),
                    description: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_REFLECTIONDATA.description"),
                    questions: [
                        {
                            question: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_REFLECTIONDATA.QUESTIONS.QUESTION_1"),
                            options: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_REFLECTIONDATA.OPTIONS.QUESTION_1", { returnObjects: true })
                        },
                        {
                            question: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_REFLECTIONDATA.QUESTIONS.QUESTION_2"),
                            options: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_REFLECTIONDATA.OPTIONS.QUESTION_2", { returnObjects: true })
                        },
                        {
                            question: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_REFLECTIONDATA.QUESTIONS.QUESTION_3"),
                            options: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_REFLECTIONDATA.OPTIONS.QUESTION_3", { returnObjects: true })
                        },
                        {
                            question: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_REFLECTIONDATA.QUESTIONS.QUESTION_4"),
                            options: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_REFLECTIONDATA.OPTIONS.QUESTION_4", { returnObjects: true })
                        },
                        {
                            question: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_REFLECTIONDATA.QUESTIONS.QUESTION_5"),
                            options: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_REFLECTIONDATA.OPTIONS.QUESTION_5", { returnObjects: true })
                        },
                        {
                            question: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_REFLECTIONDATA.QUESTIONS.QUESTION_6"),
                            options: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_REFLECTIONDATA.OPTIONS.QUESTION_6", { returnObjects: true })
                        }

                    ],
                    correctAnswers: {},

                }
            }
        }
    };

    const EmptyQuestionnaireData = {
        attributes: {
            Title: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.EMPTY.title"),
            description: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.EMPTY.description"),
            autocorrect: false,
            editable: true,
            language: i18n.language,
            type: "standard",
            Options: {
                questionnaire: {
                    editable: true,
                    type: "Empty",
                    title: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.EMPTY.title"),
                    description: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.EMPTY.description"),
                    questions:
                        [],
                    correctAnswers: {}
                }
            }

        }
    }

    const PlannificationQuestionnaireData = {
        attributes: {
            Title: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.PLANNING.title"),
            description: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.PLANNING.description"),
            autocorrect: false,
            editable: true,
            type: "standard",
            Options: {
                questionnaire: {
                    title: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.PLANNING.title"),
                    description: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.PLANNING.description"),
                    editable: true,
                    language: i18n.language,
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
            Title: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.title"),
            description: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.description"),
            autocorrect: false,
            editable: true,
            language: i18n.language,
            type: "standard",
            Options: {
                questionnaire: {
                    title: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.title"),
                    description: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.description"),
                    editable: true,
                    type: "Self-Assessment",
                    questions:
                        [
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.QUESTIONS.QUESTION_1"),
                                "options":
                                    [
                                        { id: 1, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_1") },
                                        { id: 2, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_2") },
                                        { id: 3, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_3") },
                                        { id: 4, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_4") },
                                        { id: 5, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_5") },
                                    ]
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.QUESTIONS.QUESTION_2"),
                                "options":
                                    [
                                        { id: 1, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_1") },
                                        { id: 2, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_2") },
                                        { id: 3, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_3") },
                                        { id: 4, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_4") },
                                        { id: 5, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_5") },
                                    ]
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.QUESTIONS.QUESTION_3"),
                                "options":
                                    [
                                        { id: 1, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_1") },
                                        { id: 2, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_2") },
                                        { id: 3, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_3") },
                                        { id: 4, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_4") },
                                        { id: 5, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_5") },
                                    ]
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.QUESTIONS.QUESTION_4"),
                                "options":
                                    [
                                        { id: 1, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_1") },
                                        { id: 2, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_2") },
                                        { id: 3, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_3") },
                                        { id: 4, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_4") },
                                        { id: 5, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_5") },
                                    ]
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.QUESTIONS.QUESTION_5"),
                                "options":
                                    [
                                        { id: 1, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_1") },
                                        { id: 2, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_2") },
                                        { id: 3, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_3") },
                                        { id: 4, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_4") },
                                        { id: 5, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_5") },
                                    ]
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.QUESTIONS.QUESTION_6"),
                                "options":
                                    [
                                        { id: 1, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_1") },
                                        { id: 2, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_2") },
                                        { id: 3, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_3") },
                                        { id: 4, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_4") },
                                        { id: 5, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_5") },
                                    ]
                            },
                            {
                                "question": t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.QUESTIONS.QUESTION_7"),
                                "options":
                                    [
                                        { id: 1, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_1") },
                                        { id: 2, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_2") },
                                        { id: 3, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_3") },
                                        { id: 4, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_4") },
                                        { id: 5, label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS.OPTION_5") },
                                    ]
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
        SelfAssesmentData,
        SELF_REFLECTIONDATA
    };
}

export default QuestionnaireData;