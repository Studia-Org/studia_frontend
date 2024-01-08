export const MSLQuestionnaireData = {
    attributes: {
        Title: "MSLQ Questionnaire",
        description: "Questionnaire for measuring student learning and motivation",
        Options: {
            questionnaire: {
                title: "MSLQ Questionnaire",
                description: "Questionnaire for measuring student learning and motivation",
                questions: [
                    {
                        "question": "I am interested in the content of this course.",
                        "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
                    },
                    {
                        "question": "I believe the course material is relevant to my goals.",
                        "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
                    },
                    {
                        "question": "I am confident in my ability to master the material in this course.",
                        "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
                    },
                    {
                        "question": "I often set specific goals for my learning in this course.",
                        "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
                    },
                    {
                        "question": "I use a variety of learning strategies to understand the course material.",
                        "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
                    },
                    {
                        "question": "I am motivated to do well in this course.",
                        "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
                    },
                    {
                        "question": "I seek help from the instructor or classmates when I don't understand the material.",
                        "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
                    },
                    {
                        "question": "I manage my time effectively to complete assignments and study for exams.",
                        "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
                    },
                    {
                        "question": "I feel a sense of accomplishment when I successfully complete a challenging task.",
                        "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
                    },
                    {
                        "question": "I enjoy collaborating with classmates on group projects.",
                        "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
                    }
                ]
            }
        }
    }
}

export const EmptyQuestionnaireData = {
    attributes: {
        Title: "Empty Questionnaire",
        description: "Empty Questionnaire",
        Options: {
            questionnaire: {
                title: "Empty Questionnaire",
                description: "Empty Questionnaire",
                questions:
                    []
            }
        }
    }
}

export const PlannificationQuestionnaireData = {
    attributes: {
        Title: "Plannification Questionnaire",
        description: "Questionnaire for measuring student plannification",
        Options: {
            questionnaire: {
                title: "Plannification Questionnaire",
                description: "Questionnaire for measuring student plannification",
                questions:
                    [
                        {
                            "question": "What is your primary objective for this task?",
                            "type": "open-ended"
                        },
                        {
                            "question": "How would you rate your current knowledge level on the topic?",
                            "options": "open-ended"
                        },
                        {
                            "question": "What specific subtopics are you planning to focus on?",
                            "options": "open-ended"
                        },
                        {
                            "question": "How do you plan to gather information for your research?",
                            "options": "open-ended"
                        },
                        {
                            "question": "What time frame have you set for completing this task?",
                            "options": "open-ended"
                        },
                        {
                            "question": "What strategies do you plan to use for self-regulated learning during this task?",
                            "options": "open-ended"
                        }
                    ]
            }
        }
    }
}