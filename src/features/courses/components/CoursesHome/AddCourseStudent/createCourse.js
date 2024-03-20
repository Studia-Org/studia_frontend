import { message } from "antd";
import { API } from "../../../../../constant";

function calculateListOfDates(startDate, endDate, numberOfSubsections) {
    //En funcion de las fechas de inicio y fin y el numbero de subsections, se genera una lista de tuplas con start_date y end_date, la start_date de la primera tupla es la fecha de inicio del curso y la end_date de la ultima tupla es la fecha de fin del curso, 
    // las fechas intermedias se calculan en funcion del numero de subsections, por ejemplo si el curso dura 30 dias y tiene 3 subsections, la primera fecha sera la fecha de inicio, la segunda fecha sera la fecha de inicio + 10 dias, la tercera fecha sera la fecha de inicio + 20 dias y la cuarta fecha sera la fecha de fin
    // la start_date tiene que empezar a las 00:00:00 y la end_date tiene que terminar a las 23:59:59

    const diffDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const daysPerSubsection = diffDays / numberOfSubsections
    let dates = []
    let currentDate = startDate
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    for (let i = 0; i < numberOfSubsections; i++) {
        let newDate = new Date(currentDate)
        newDate.setDate(newDate.getDate() + daysPerSubsection)
        let start_date_hours = new Date(currentDate).setUTCHours(0, 0, 0)
        let end_date_hours = new Date(newDate).setUTCHours(23, 59, 59)
        dates.push([new Date(start_date_hours).toISOString(), new Date(end_date_hours).toISOString()])
        currentDate = new Date(newDate.getTime() + MS_PER_DAY)
    }
    return dates

}

export async function createCourse(seletedCourseTemp, userID, data) {
    const token = process.env.REACT_APP_API_TOKEN;
    let allSections = [], forumIds = [], startDate = null, endDate = null, createdActivities = {}, index = 0
    console.log(data[0].subsections.length)
    const courseDates = calculateListOfDates(seletedCourseTemp.startDate, seletedCourseTemp.endDate, data[0].subsections.length)

    console.log(courseDates)


    try {
        for (const section of data) {
            let allSubsections = []
            for (const subsection of section.subsections) {
                startDate = courseDates[index][0]
                endDate = courseDates[index][1]
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
                        start_date: startDate,
                        deadline: endDate,
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
                        start_date: startDate,
                        end_date: endDate,
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
                                deadline: endDate,
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
                        start_date: startDate,
                        end_date: endDate,
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
                deadline: endDate,
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
            studentManaged: true,
            sections: allSections,
            students: [userID],
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
            const imageUrl = 'https://res.cloudinary.com/dnmlszkih/image/upload/v1710869993/oe3b0pbbss7m671e3gbx.jpg';
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