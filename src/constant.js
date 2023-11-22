const port = process.env.REACT_APP_API_PORT || 1337;
export const API = `http://localhost:${port}/api`;
export const AUTH_TOKEN = "authToken";
export const BEARER = "Bearer";
export const ACTIVITY_CATEGORIES = {
    "Team Work": "red",
    "Mark": "green",
    "List Comprehension": "yellow",
    "Homework": "blue",
    "Project": "purple",
    "Exam": "orange",
    "Quiz": "pink",
};