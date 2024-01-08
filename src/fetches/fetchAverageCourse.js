import { API } from "../constant";

export async function fetchAverageCourse({ courseId, userId = null }) {
    try {
        const response = await fetch(`${API}/courses/${courseId}?` +
            `populate[sections][fields][0]=id&` +
            `populate[sections][populate][activity][fields][0]=ponderation&` +
            `populate[sections][populate][activity][populate][qualifications][fields][0]=qualification&` +
            `populate[sections][populate][activity][populate][qualifications][populate][user][fields][0]=id&` +
            `populate[sections][populate][subsections][fields][0]=id`);

        const data = await response.json();
        const sectionData = data.data.attributes.sections.data;

        if (sectionData.length === 0) {
            return { averageMainActivity: 0, averageMainActivityUser: 0 };
        }

        const ponderations = sectionData
            .flatMap(section => section.attributes.activity.data.attributes.ponderation)
            .filter(ponderation => ponderation !== null);

        let averagesMainActivity = [];
        let totalQualifications = {}
        sectionData.forEach(section => {
            if (section.attributes.activity.data.attributes.qualifications.data.length === 0) {
                averagesMainActivity.push(0);
                return;
            }
            const qualifications = section.attributes.activity.data.attributes.qualifications.data
                .map(qualification => qualification.attributes.qualification)
                .filter(qualification => qualification !== null);
            qualifications.forEach(qualification => {
                const rounded = Math.round(qualification);
                totalQualifications[rounded] = totalQualifications[rounded] + 1 || 1;
            })
            let averageMainActivity = qualifications.reduce((acc, qualification) => acc + qualification, 0);
            if (qualifications.length !== 0) averagesMainActivity.push(averageMainActivity /= qualifications.length)
        })

        averagesMainActivity.forEach((averageMainActivity, index) => {
            averagesMainActivity[index] = averageMainActivity * ponderations[index]
        })


        const averageMainActivity = averagesMainActivity.reduce((acc, averageMainActivity) => acc + averageMainActivity, 0);

        if (userId === null) {
            console.log({ averageMainActivity, totalQualifications })
            return { averageMainActivity };
        }
        const userQualifications = sectionData
            .flatMap(section => section.attributes.activity.data.attributes.qualifications.data)
            .filter(qualification => qualification.attributes.user.data.id === userId)
            .map(qualification => qualification.attributes.qualification)
            .filter(qualification => qualification !== null);

        userQualifications.forEach((qualification, index) => userQualifications[index] = qualification * ponderations[index]);
        const averageMainActivityUser = userQualifications.reduce((acc, qualification) => acc + qualification, 0);

        return { averageMainActivity, averageMainActivityUser, totalQualifications };

    } catch (error) {
        console.error(courseId);
        return { averageMainActivity: 0, averageMainActivityUser: 0, totalQualifications: 0 };
    }
}