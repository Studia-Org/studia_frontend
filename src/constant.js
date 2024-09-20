export const API = "https://uptitude-backend-production.up.railway.app/api";
const port = process.env.REACT_APP_API_PORT || 1337;
const host = process.env.REACT_APP_API_HOST || "localhost";
//export const API = `http://${host}:${port}/api`;
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
    "Citizenship competence": {
        color: "green",
        criteria: [
            "Analyze and understand ideas related to the social and civic dimension of one's own identity, as well as the social, historical, and normative facts that determine it, demonstrating respect for norms, empathy, equity, and a constructive spirit in interaction with others in various socio-institutional contexts.",
            "Analyze and assume, based on principles and values, the values of European integration, the legal order of the Spanish state and Catalonia, and human rights, participating in community activities, decision-making, and conflict resolution, with a democratic attitude, respect for diversity, and commitment to global welfare and social cohesion.",
            "Analyze and understand ethical and social problems in areas such as gender equality, demonstrating one's own values and those of others, acting responsibly with judgments to address narratives with a non-androcentric and ethnocentric perspective, respectful of differences and opposed to all forms of oppression and violence.",
            "Interpret systematic relations of interdependence, eco-dependence, and interconnection between local and global actions, consciously and motivatedly adopting a sustainable and eco-socially responsible lifestyle."
        ]
    },
    "Digital competence": {
        color: "indigo",
        criteria: [
            "Conduct advanced searches on the internet based on criteria of validity, quality, timeliness, and reliability, selecting them critically and archiving them to recover, reference, and reuse these searches, respecting intellectual property.",
            "Manage and use one's own digital personal learning environment to build new knowledge and create digital content.",
            "Participate, collaborate, and interact using tools or virtual platforms to communicate, work collaboratively, and share content, data, and information, managing one's actions responsibly.",
            "Develop simple software applications and creative and sustainable technological solutions to solve specific problems or respond to proposed challenges."
        ]
    },
    "Entrepreneurial competence": {
        color: "pink",
        criteria: [
            "Analyze needs and opportunities, and tackle challenges with critical thinking, weighing their sustainability and assessing the impact on the environment, to present innovative, ethical, and sustainable ideas and solutions aimed at creating value in personal, social, cultural, or economic areas.",
            "Evaluate one's strengths and weaknesses, using self-awareness and self-efficacy strategies, understanding the different operations of the economy and finance, and applying economic and financial knowledge in specific actions.",
            "Develop the process of creating valuable ideas or solutions and sustainable innovative projects, recognizing the value of failure and errors to improve proposals and create innovative value prototypes."
        ]
    }
};
