import { message } from "antd";
import { TFGExtendedCourseData } from "./coursesData";
import { API } from "../../../../../constant";

export async function createCourse(seletedCourseTemp) {
    const token = '13a85ddfa7db25ae924218cb1a1dcb4cc939375fa4ffa718684e3a298a0689f96416b76e0ac96879926eb07d6bd2ffebe922f9d3e3ec9bfcb267d743bb946b6541af0e1c8cc01609e2316325f6269a7dd0b9c7c6d697687603e5344134e8591ee25f91565bcebedd1d757d8c3c098b83e654d0f098b0228920121b94d8e300e5'
    const createdActivities = {}
    let allSections = []
    let forumIds = []
    try {
        for (const section of TFGExtendedCourseData) {
            let allSubsections = []
            for (const subsection of section.subsections) {
                let newSubsection = {}
                if (subsection?.questionnaire) {
                    const questionnaire = {
                        Title: subsection.questionnaire.attributes.Title,
                        type: subsection.questionnaire.attributes.type,
                        description: subsection.questionnaire.attributes.description,
                        editable: subsection.questionnaire.attributes.editable,
                        Options: subsection.questionnaire.attributes.Options,
                    };
                    const response = await fetch(`${API}/questionnaires`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ data: questionnaire }),
                    });
                    const data = await response.json();

                    const activity = {
                        title: subsection.title,
                        start_date: new Date(subsection.start_date).toISOString(),
                        deadline: new Date(subsection.end_date).toISOString(),
                        ponderation: 0,
                        type: 'questionnaire',
                        file: null,
                        description: subsection.questionnaire.attributes.description,
                        order: 5,
                        evaluable: false,
                        qualifications: null,
                        evaluators: null,
                        categories: Object.keys(subsection.activity.categories),
                    }

                    if (subsection.activity) {
                        activity.ponderation = subsection.activity.ponderation
                        activity.evaluable = subsection.activity.evaluable
                    }

                    const createActivity = await fetch(`${API}/activities`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ data: activity }),
                    })
                    const dataActivity = await createActivity.json();


                    newSubsection =
                    {
                        title: subsection.title,
                        fase: subsection.fase,
                        finished: false,
                        start_date: new Date(subsection.start_date).toISOString(),
                        end_date: new Date(subsection.end_date).toISOString(),
                        description: subsection.questionnaire.attributes.description?.slice(0, 140) || 'description',
                        landscape_photo: null,
                        questionnaire: data.data.id,
                        users: null,
                        activity: dataActivity.data.id,
                        files: null,
                        content: subsection.content,
                    }
                } else {
                    const formData = new FormData();
                    let filesData = null
                    if (subsection.files.length > 0) {
                        for (const file of subsection.files) {
                            formData.append('files', file.originFileObj);
                        }
                        const response = await fetch(`${API}/upload`, {
                            method: 'POST',
                            headers: {
                                Authorization: `Bearer ${token}`
                            },
                            body: formData,
                        });
                        filesData = await response.json();

                    }
                    if ('id' in subsection.activity) {
                        delete subsection.activity.id;
                    }
                    if (subsection.activity.type === 'peerReview') {
                        subsection.activity.task_to_review = createdActivities[subsection.activity.task_to_review]
                    }

                    const createActivity = await fetch(`${API}/activities`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            data:
                            {
                                ...subsection.activity,
                                title: subsection.title,
                                categories: Object.keys(subsection.activity.categories)
                            }
                        }),
                    })
                    const dataActivity = await createActivity.json();
                    createdActivities[subsection.id] = dataActivity.data.id
                    newSubsection =
                    {
                        title: subsection.title,
                        fase: subsection.fase,
                        finished: false,
                        start_date: new Date(subsection.start_date).toISOString(),
                        end_date: new Date(subsection.end_date).toISOString(),
                        description: subsection.description?.slice(0, 140) || 'description',
                        landscape_photo: null,
                        questionnaire: null,
                        activity: dataActivity.data.id,
                        users: null,
                        files: filesData?.map((file) => file.id),
                        content: subsection.content,
                    }

                    if (subsection?.landscape_photo.length > 0) {
                        formData.delete('files');
                        formData.append('files', subsection.landscape_photo[0].originFileObj);
                        const response = await fetch(`${API}/upload`, {
                            method: 'POST',
                            headers: {
                                Authorization: `Bearer ${token}`
                            },
                            body: formData,
                        });
                        const data = await response.json();
                        newSubsection.landscape_photo = data[0].id;
                    }
                }
                const createSubsection = await fetch(`${API}/subsections`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ data: newSubsection }),
                });
                const data = await createSubsection.json();
                allSubsections.push(data.data.id)
            }

            let filesdata2 = null
            const newFormData = new FormData();

            if (section?.task?.files.length > 0) {
                for (const file of section.task.files) {
                    newFormData.append('files', file.originFileObj);
                }
                const uploadFiles = await fetch(`${API}/upload`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: newFormData,
                });
                filesdata2 = await uploadFiles.json();
            }

            const activity = {
                title: section.task.title,
                deadline: new Date(section.task.deadline).toISOString(),
                ponderation: 0,
                type: section.task.type,
                file: filesdata2?.map((file) => file.id),
                description: section.task.description,
                order: 5,
                evaluable: section.task.evaluable,
                qualifications: null,
                evaluators: null,
                categories: section.task.categories,
            }
            const createActivity = await fetch(`${API}/activities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ data: activity }),
            })
            const dataActivity = await createActivity.json();

            let newSection = {
                title: section.name,
                subsections: allSubsections,
                activity: dataActivity.data.id,
            }
            const createSection = await fetch(`${API}/sections`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ data: newSection }),
            })
            const data = await createSection.json();
            allSections.push(data.data.id)

            const createForum = await fetch(`${API}/forums`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    data: {
                        title: section.task.title,
                        posts: null
                    }
                }),
            })
            const dataForum = await createForum.json();
            forumIds.push(dataForum.data.id)
        }

        const createNewsForum = await fetch(`${API}/forums`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                data: {
                    title: 'News',
                    posts: null
                }
            }),
        })
        const newsForum = await createNewsForum.json();
        forumIds.push(newsForum.data.id)

        const newCourse = {
            title: seletedCourseTemp.title,
            description: seletedCourseTemp.description,
            tags: seletedCourseTemp.tags,
            sections: allSections,
            start_date: seletedCourseTemp.startDate,
            end_date: seletedCourseTemp.endDate,
        }

        if (seletedCourseTemp.cover) {
            const formData = new FormData();
            formData.append('files', seletedCourseTemp.cover.originFileObj);
            const coverUpload = await fetch(`${API}/upload/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            const data = await coverUpload.json();
            newCourse.cover = data[0].id;
        } else {
            const imageUrl = 'https://www.21kschool.com/es/wp-content/uploads/sites/36/2021/01/rptgtpxd-1396254731.jpg';
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
            const file = new File([blob], fileName, { type: blob.type });
            const formData = new FormData();
            formData.append('files', file);

            const coverUpload = await fetch(`${API}/upload/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            const data = await coverUpload.json();
            newCourse.cover = data[0].id;
        }


        const createCourseFinal = await fetch(`${API}/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ data: newCourse }),
        })
        const dataFinal = await createCourseFinal.json();


        await fetch(`${API}/courses/${dataFinal.data.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                data: {
                    forums: {
                        connect: forumIds
                    }
                }
            }),
        })
        message.success('Course created successfully');
    }
    catch (e) {
        message.error(e.message)
    }
}