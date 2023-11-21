export async function fetchDataMSLQuestionnaire() {
    try {
        const response = await fetch('http://localhost:1337/api/questionnaires/5');
        if (!response.ok) {
            throw new Error(`La solicitud falló con el código ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

export async function fetchDataPlannificationQuestionnaire() {
    try {
        const response = await fetch('http://localhost:1337/api/questionnaires/7');
        if (!response.ok) {
            throw new Error(`La solicitud falló con el código ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

export async function fetchDataEmptyQuestionnaire() {
    try {
        const response = await fetch('http://localhost:1337/api/questionnaires/8');
        if (!response.ok) {
            throw new Error(`La solicitud falló con el código ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

