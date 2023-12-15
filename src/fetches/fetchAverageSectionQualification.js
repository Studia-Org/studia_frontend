import { API } from "../constant";

export async function fetchAverageQualificationOneSection({ courseId, userId = null }) {
    try {
        const response = await fetch(`${API}/courses/${courseId}?` +
            `populate[sections][fields][0]=id&` +
            `populate[sections][populate][activity][fields][0]=id&` +
            `populate[sections][populate][activity][populate][qualifications][fields][0]=qualification&` +
            `populate[sections][populate][activity][populate][qualifications][populate][user][fields][0]=id&` +
            `populate[sections][populate][subsections][fields][0]=id`);

        const data = await response.json();
        console.log("data", data)
        const sectionData = data.data.attributes.sections.data;

        // Filter and flatten qualifications for the specified user


        const qualifications = sectionData
            .flatMap(section => section.attributes.activity.data.attributes.qualifications.data)
            .map(qualification => qualification.attributes.qualification)
            .filter(qualification => qualification !== null);

        // Calculate the average
        let sum = qualifications.reduce((acc, qualification) => acc + qualification, 0);
        const averageMainActivity = sum / qualifications.length;

        if (userId === null) {
            return { averageMainActivity };
        }
        const userQualifications = sectionData
            .flatMap(section => section.attributes.activity.data.attributes.qualifications.data)
            .filter(qualification => qualification.attributes.user.data.id === userId)
            .map(qualification => qualification.attributes.qualification)
            .filter(qualification => qualification !== null);

        sum = userQualifications.reduce((acc, qualification) => acc + qualification, 0);
        const averageMainActivityUser = userQualifications.length > 0 ? sum / userQualifications.length : 0;

        return { averageMainActivity, averageMainActivityUser };

    } catch (error) {
        console.error(error);
        throw error;
    }
}