import { message } from "antd";
import { API } from "../../../../../constant";
import { fetchCourseInformation } from "../../../../../fetches/fetchCourseInformation";
import { getToken } from "../../../../../helpers";

export async function replicateCourse(courseId) {
    try {
        const { allData } = await fetchCourseInformation({ courseId });
        let sectionData = [];

        for (const section of allData.sections.data) {
            let subsectionData = [];

            for (const subsection of section.attributes.subsections.data) {
                let activityData = {}, questionnaireData = {};

                //2. Create the activity
                const activityResponse = await fetch(`${API}/activities`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify(
                        { data: subsection.attributes.activity.data.attributes }
                    )
                });
                activityData = await activityResponse.json();

                //3. Create the questionnaire if it exists
                if (subsection.attributes.questionnaire && subsection.attributes.questionnaire.data) {
                    const questionnaireResponse = await fetch(`${API}/questionnaires`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${getToken()}`,
                        },
                        body: JSON.stringify(
                            { data: subsection.attributes?.questionnaire?.data?.attributes }
                        )
                    });
                    questionnaireData = await questionnaireResponse.json();
                }

                //4. Create the subsection
                console.log(subsection.attributes.title);
                const subsectionResponse = await fetch(`${API}/subsections`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify(
                        {
                            data: {
                                activity: activityData.data.id,
                                questionnaire: questionnaireData.data.id,
                                title: subsection.attributes.title,
                                fase: subsection.attributes.fase,
                                description: subsection.attributes.description,
                                start_date: subsection.attributes.start_date,
                                end_date: subsection.attributes.end_date,
                                content: subsection.attributes.content,
                                files: subsection.attributes?.files,
                            }
                        }
                    )
                });
                const subsectionDataJSON = await subsectionResponse.json();
                subsectionData.push(subsectionDataJSON.data.id);
            }

            //5. Create the section
            const sectionResponse = await fetch(`${API}/sections`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(
                    {
                        data: {
                            subsections: subsectionData,
                            title: section.attributes.title,
                        }
                    }
                )
            });
            const sectionDataJSON = await sectionResponse.json();
            sectionData.push(sectionDataJSON.data.id);
        }

        //6. Create the course
        const courseResponse = await fetch(`${API}/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(
                {
                    data: {
                        sections: sectionData,
                        title: allData.title,
                        description: allData.description,
                        start_date: allData.start_date,
                        end_date: allData.end_date,
                        professor: allData.professor.data.id,
                        cover: allData.cover,
                        studentManaged: false,
                        tags: allData.tags,
                    }
                }
            )
        });

        //si ha salido todo bien return un 200
        message.success('Course duplicated successfully');
        return courseResponse.status;
    } catch (error) {
        console.error(error);
    }
}