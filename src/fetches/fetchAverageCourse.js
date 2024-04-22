import { API } from "../constant";
import { getToken } from "../helpers";

export async function fetchAverageCourse({ courseId, user }) {
    try {
        const response = await fetch(`${API}/courses/${courseId}?populate=sections.subsections.activity.qualifications`,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }

            });
        const data = await response.json();
        const sectionData = data.data.attributes.sections.data;

        if (sectionData.length === 0) {
            return { averageMainActivity: 0, averageMainActivityUser: 0, totalQualifications: 0 };
        }

        const { averagesMainActivity, totalQualifications } = processSectionData(sectionData);
        const userQualifications = processUserQualifications(sectionData, user);

        const averageMainActivity = calculateWeightedAverage(averagesMainActivity) / Math.max(sectionData.length, 1);
        const averageMainActivityUser = calculateWeightedAverage(userQualifications) / Math.max(sectionData.length, 1);

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

function processSectionData(sectionData) {
    const averagesMainActivity = [];
    const totalQualifications = {};
    sectionData.forEach((section) => {
        const subsections = section.attributes.subsections.data;

        subsections.forEach((subsection) => {
            const activity = subsection.attributes.activity.data?.attributes;

            if (activity) {
                const { ponderation, qualifications } = processActivity(activity);

                qualifications.forEach((qualification) => {
                    const rounded = Math.round(qualification);
                    totalQualifications[rounded] = (totalQualifications[rounded] || 0) + 1;
                });

                const averageMainActivity =
                    qualifications.reduce((acc, qualification) => acc + qualification, 0) / Math.max(qualifications.length, 1);

                averagesMainActivity.push(averageMainActivity * (ponderation / 100));
            }
        });
    });

    return { averagesMainActivity, totalQualifications };
}

function processActivity(activity) {
    const ponderation = activity.ponderation || 0;
    const qualifications = activity.qualifications.data.map(
        (qualification) => qualification.attributes.qualification
    );

    return { ponderation, qualifications };
}


function processUserQualifications(sectionData, user) {
    const userQualifications = [];

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
                    });
                });
            }
        });
    });

    return userQualifications;
}

function calculateWeightedAverage(values) {
    return values.reduce((acc, value) => acc + value, 0);
}
