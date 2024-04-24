//export const API = "https://studia-backend-prod.1.ie-1.fl0.io/api";
const port = process.env.REACT_APP_API_PORT || 1337;
const host = process.env.REACT_APP_API_HOST || "localhost";
export const API = `http://${host}:${port}/api`;
export const AUTH_TOKEN = "authToken";
export const BEARER = "Bearer";
export const ACTIVITY_CATEGORIES = {
    "Ethical commitment": {
        color: "red",
        criteria: [
            "Ability for self-criticism and critical thinking",
            "Ability to demonstrate attitudes consistent with ethical and deontological principles"
        ],
    },
    "Learning capability and responsibility": {
        color: "yellow",
        criteria: [
            "Ability for analysis, synthesis, global perspectives, and practical applications of knowledge",
            "Ability to make decisions and adapt to new situations"
        ],
    },
    "Teamwork": {
        color: "blue",
        criteria: [
            "Ability to collaborate with others and contribute to a common project",
            "Ability to collaborate in interdisciplinary and multicultural teams"
        ]
    },
    "Creative and entrepreneurial capacity": {
        color: "teal",
        criteria: [
            "Ability to formulate, design, and manage projects",
            " Ability to seek and integrate new knowledge and attitudes"
        ]
    },
    "Sustainability": {
        color: "purple",
        criteria: [
            "Ability to assess the social and environmental impact of actions in their field",
            "Ability to express integrated and systematic visions"
        ]
    },
    "Communicative ability": {
        color: "orange",
        criteria: [
            "Ability to understand and express oneself orally and in writing in Catalan and Spanish and in another language, using specialized language in the discipline",
            "Ability to search, use, and integrate information"
        ]
    },
};
