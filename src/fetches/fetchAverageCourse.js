import { API } from "../constant";

export async function fetchAverageCourse({ courseId, user }) {
    let userId = user.id;
    console.log(user.qualifications);
    try {
        const response = await fetch(`${API}/courses/${courseId}?populate=sections.subsections.activity.qualifications`);

        const data = await response.json();
        const sectionData = data.data.attributes.sections.data;

        if (sectionData.length === 0) {
            return { averageMainActivity: 0, averageMainActivityUser: 0 };
        }

        const averagesMainActivity = [];
        const totalQualifications = {};

        sectionData.forEach((section) => {
            const subsections = section.attributes.subsections.data;

            subsections.forEach((subsection) => {
                const activity = subsection.attributes.activity.data?.attributes;
                if (activity) {
                    const ponderation = activity.ponderation || 0;
                    const qualifications = activity.qualifications.data.map(
                        (qualification) => qualification.attributes.qualification
                    );
                    qualifications.forEach((qualification) => {
                        const rounded = Math.round(qualification);
                        totalQualifications[rounded] = (totalQualifications[rounded] || 0) + 1;
                    });
                    const averageMainActivity =
                        qualifications.reduce((acc, qualification) => acc + qualification, 0) / Math.max(qualifications.length, 1);
                    averagesMainActivity.push(averageMainActivity * ponderation);
                }
            });
        });



        const totalPonderation = sectionData.reduce((acc, section) => {
            const subsections = section.attributes.subsections.data;
            subsections.forEach((subsection) => {
                if (subsection.attributes && subsection.attributes.activity.data?.attributes) {
                    const ponderation = subsection.attributes.activity.data.attributes.ponderation || 0;
                    acc += ponderation;
                }
            });
            return acc;
        }, 0);

        const averageMainActivity = averagesMainActivity.reduce((acc, value) => acc + value, 0) / Math.max(totalPonderation, 1);

        if (userId === null) {
            return { averageMainActivity };
        }
        let userQualifications = [];
        sectionData.forEach((section) => {
            const subsections = section.attributes.subsections.data;
            subsections.forEach((subsection) => {
                const activity = subsection.attributes.activity.data?.attributes;
                if (activity) {
                    const ponderation = activity.ponderation || 0;
                    user.qualifications.forEach((qualification) => {
                        activity.qualifications.data.forEach((qualificationActivity) => {
                            if (qualificationActivity.id === qualification.id) {
                                userQualifications.push(qualification.qualification * (ponderation / 100));
                            }
                        })
                    })
                }
            });
        })
        console.log(userQualifications);
        const sumAllQualifications = userQualifications.reduce((acc, qualification) => acc + qualification, 0);
        console.log(sumAllQualifications);
        const averageMainActivityUser =
            userQualifications.reduce((acc, qualification) => acc + qualification, 0) / Math.max(sectionData.length, 1);

        return {
            averageMainActivity: parseFloat(averageMainActivity.toFixed(2)),
            averageMainActivityUser: parseFloat(averageMainActivityUser.toFixed(2)),
            totalQualifications
        };

    } catch (error) {
        console.error(error);
        return { averageMainActivity: 0, averageMainActivityUser: 0, totalQualifications: 0 };
    }
}

