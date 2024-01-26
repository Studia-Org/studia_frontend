import { API } from "../constant";

export async function fetchAverageSubSectionMark({ courseId, userId = null, sectionId }) {

    const response = await fetch(`${API}/courses/${courseId}?` +
        `populate[sections][fields][0]=id&` +
        `populate[sections][populate][activity][fields][0]=id&` +
        `populate[sections][populate][activity][populate][qualifications][fields][0]=qualification&` +
        `populate[sections][populate][activity][populate][qualifications][populate][user][fields][0]=id&` +
        `populate[sections][populate][subsections][fields][0]=id&` +
        `populate[sections][populate][subsections][populate][activity][fields][0]=ponderation&` +
        `populate[sections][populate][subsections][populate][activity][populate][qualifications][fields][0]=qualification&` +
        `populate[sections][populate][subsections][populate][activity][populate][qualifications][populate][user][fields][0]=id`);

    const data = await response.json();
    const sectionData = data.data.attributes.sections.data
        .filter(section => section.id === sectionId)[0];

    let list = [];
    if (!sectionData || !sectionData.attributes || !sectionData.attributes.subsections || !sectionData.attributes.subsections.data) {
        console.error('Datos de sección no válidos.');
        return null;
    }
    sectionData.attributes.subsections.data.forEach(section => {
        list.push(averageSubsection(section, userId));
    });


}
function averageSubsection(sectionData, userId = null) {
    // Verificar si hay datos válidos en la sección
    if (!sectionData || !sectionData.attributes || !sectionData.attributes.activity || !sectionData.attributes.activity.data || !sectionData.attributes.activity.data.attributes) {
        console.error('Datos de sección no válidos.');
        return null;
    }

    const activityData = sectionData.attributes.activity.data.attributes;

    const qualifications = activityData.qualifications.data || [];
    const ponderation = activityData.ponderation || 1;

    if (!qualifications || qualifications.length === 0) {
        console.error('Lista de calificaciones vacía.');
        return null;
    }

    // Calcular el promedio ponderado
    let totalWeightedScore = 0;
    let totalWeightedUserScore = 0;
    qualifications.forEach((qualification) => {
        const qualificationAttributes = qualification.attributes;
        const qualificationValue = qualificationAttributes.qualification;
        totalWeightedScore += qualificationValue || 0;

        if (qualificationAttributes.user.data.id === userId) {
            totalWeightedUserScore += qualificationValue
        }

    });

    // Calcular el promedio ponderado final
    const average = totalWeightedScore / qualifications.length;
    const userQualification = totalWeightedUserScore;
    return { average, ponderation, userQualification };
}
