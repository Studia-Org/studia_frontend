const port = process.env.REACT_APP_API_PORT || 1337;
export const API = `http://192.168.31.36:${port}/api`;
export const AUTH_TOKEN = "authToken";
export const BEARER = "Bearer";
export const ACTIVITY_CATEGORIES = {
    "Team Work": "red",
    "List Comprehension": "yellow",
    "Homework": "blue",
    "Mark": "teal",
    "Project": "purple",
    "Exam": "orange",
    "Quiz": "pink",
};