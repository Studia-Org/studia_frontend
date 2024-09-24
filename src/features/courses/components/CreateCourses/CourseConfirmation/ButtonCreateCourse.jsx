import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import { getToken } from '../../../../../helpers';
import { API } from '../../../../../constant';
import LoadingBar from 'react-top-loading-bar'
import { BeatLoader } from 'react-spinners';
import { useTranslation } from 'react-i18next';
import { ShowSectionErrors } from './ShowSectionErrors';


export const ButtonCreateCourse = ({ createCourseSectionsList, courseBasicInfo, subsectionErrors }) => {
    const { t } = useTranslation()

    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const navigate = useNavigate();

    function emptyLocalStorage() {
        localStorage.removeItem('courseBasicInfo')
        localStorage.removeItem('createCourseSectionsList')
        localStorage.removeItem('categories')
        localStorage.removeItem('task')
    }

    const isValidCourseBasicInfo = (courseBasicInfo) => {
        if (!courseBasicInfo) {
            throw new Error("courseBasicInfo is missing");
        }
        const requiredAttributes = ['courseName', 'description', 'cover', 'evaluator'];
        for (const attribute of requiredAttributes) {
            if (!courseBasicInfo[attribute]) {
                throw new Error(`Missing '${attribute}' in the course info`);
            }
        }
        return true;
    };

    const isValidCourse = (course) => {
        if (!course) {
            throw new Error("The course or subsections array is missing");
        }
        course.forEach((section) => {
            if (!section.task) {
                throw new Error(`Missing task in section ${section.name}`);
            }
            section.subsections.forEach((subsection) => {
                if (!subsection.start_date || !subsection.end_date) {
                    throw new Error(`Missing start_date or end_date in subsection ${subsection.title}`);
                }
                if (subsection.type === 'peerReview') {
                    const act = section.subsections.find((sub) => sub.id === subsection.activity.task_to_review)
                    if (!act) {
                        throw new Error(`Missing task to review in subsection ${subsection.title}`);
                    }
                }
            })
        })
        return false;
    };

    let courseHasErrors = false;
    if (subsectionErrors && typeof subsectionErrors === 'object') {
        courseHasErrors = Object.values(subsectionErrors).some(subsection =>
            Array.isArray(subsection.errors) && subsection.errors.length > 0
        );
    }

    async function createCourse() {

        try {
            isValidCourseBasicInfo(courseBasicInfo)
            isValidCourse(createCourseSectionsList)
            setIsLoading(true)
            let allSections = []
            let forumIds = []
            const totalIterations = createCourseSectionsList.reduce((acc, section) => acc + section.subsections.length, 0)
            const createdActivities = {}
            for (const section of createCourseSectionsList) {
                let allSubsections = []
                for (const subsection of section.subsections) {
                    setProgress((prev) => prev + 100 / totalIterations)
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
                                Authorization: `Bearer ${getToken()}`,
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
                                Authorization: `Bearer ${getToken()}`,
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
                                console.log(file.originFileObj)
                                formData.append('files', file.originFileObj);
                            }
                            
                            const response = await fetch(`${API}/upload/`, {
                                method: 'POST',
                                headers: {
                                    Authorization: `Bearer ${getToken()}`
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
                                Authorization: `Bearer ${getToken()}`,
                            },
                            body: JSON.stringify({
                                data:
                                {
                                    ...subsection.activity,
                                    title: subsection.title,
                                    start_date: new Date(subsection.start_date).toISOString(),
                                    deadline: new Date(subsection.end_date).toISOString(),
                                    categories: Object.keys(subsection.activity.categories)
                                }
                            }),
                        })
                        if (!createActivity.ok) {
                            throw new Error('Error creating activity')
                        }
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
                            files: Array.isArray(filesData) ? filesData.map((file) => file.id) : null,
                            content: subsection.content,
                        }

                        if (subsection?.landscape_photo.length > 0) {
                            formData.delete('files');
                            formData.append('files', subsection.landscape_photo[0].originFileObj);
                            const response = await fetch(`${API}/upload`, {
                                method: 'POST',
                                headers: {
                                    Authorization: `Bearer ${getToken()}`
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
                            Authorization: `Bearer ${getToken()}`,
                        },
                        body: JSON.stringify({ data: newSubsection }),
                    });
                    const data = await createSubsection.json();
                    allSubsections.push(data.data.id)
                }

                let filesdata2 = null
                const newFormData = new FormData();

                try {
                    if (section?.task?.files.length > 0) {
                        for (const file of section.task.files) {            
                            console.log(file.originFileObj)
                            newFormData.append('files', file.originFileObj);
                        }
                        const uploadFiles = await fetch(`${API}/upload`, {
                            method: 'POST',
                            headers: {
                                Authorization: `Bearer ${getToken()}`
                            },
                            body: newFormData,
                        });
                        
                        filesdata2 = await uploadFiles.json();
                    }
                } catch (error) {
                    message.error('Error uploading files');
                }


                const activity = {
                    title: section.task.title,
                    deadline: new Date(section.task.deadline).toISOString(),
                    ponderation: 0,
                    type: section.task.type,
                    file: Array.isArray(filesdata2) ? filesdata2.map((file) => file.id) : null,
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
                        Authorization: `Bearer ${getToken()}`,
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
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify({ data: newSection }),
                })
                const data = await createSection.json();
                allSections.push(data.data.id)

                const createForum = await fetch(`${API}/forums`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${getToken()}`,
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
                    Authorization: `Bearer ${getToken()}`,
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
            //search last date of the course from subsections
            const lastDate = createCourseSectionsList.reduce((acc, section) => {
                const lastSubsection = section.subsections.reduce((acc, subsection) => {
                    if (new Date(subsection.end_date) > new Date(acc)) {
                        return subsection.end_date
                    }
                    return acc
                }, 0)
                if (new Date(lastSubsection) > new Date(acc)) {
                    return lastSubsection
                }
                return acc
            }, 0)
            const newCourse = {
                title: courseBasicInfo.courseName,
                description: courseBasicInfo.description,
                cover: null,
                course_type: courseBasicInfo.courseType,
                professor: courseBasicInfo.evaluator,
                tags: courseBasicInfo.tags,
                sections: allSections,
                start_date: new Date(),
                end_date: new Date(lastDate),
            }
            const formData = new FormData();
            formData.append('files', courseBasicInfo.cover[0].originFileObj);
            console.log(courseBasicInfo.cover[0].originFileObj)
            try {
                const coverUpload = await fetch(`${API}/upload/`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: formData,
                });
                const data = await coverUpload.json();
                console.log(data)
                newCourse.cover = data[0].id;
            } catch (error) {
                setIsLoading(false)
                setProgress(100)
                message.error('Error uploading cover image');
            }
            const createCourseFinal = await fetch(`${API}/courses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ data: newCourse }),
            })
            const dataFinal = await createCourseFinal.json();


            await fetch(`${API}/courses/${dataFinal.data.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                    data: {
                        forums: {
                            connect: forumIds
                        }
                    }
                }),
            })
            emptyLocalStorage()
            message.success('Course created successfully');
            setIsLoading(false)
            navigate(`/app/courses/`)
        }
        catch (e) {
            console.error(e)
            setIsLoading(false)
            setProgress(100)
            message.error(e.message)
        }
        finally {
            setIsLoading(false)
            setProgress(100)
        }
    }
    return (
        <>
            <LoadingBar color='#6366f1' height={4} progress={progress} onLoaderFinished={() => setProgress(0)} shadow={true} />
            <button onClick={createCourse} disabled={isLoading || courseHasErrors}
                className={`flex justify-center items-center mb-5 text-lg font-medium py-3 px-6 rounded-lg shadow-lg transition-all duration-500 ease-in-out 
                ${isLoading || courseHasErrors ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#657DE9] to-[#6E66D6] hover:from-pink-500 hover:to-purple-600 hover:scale-110 hover:brightness-110 hover:animate-pulse active:scale-100 text-white'}`}>
                {
                    isLoading ?
                        <BeatLoader color='#FFFFFF' size={15} className='mr-2' />
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
                            <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 00-1.898 0l-.683 2.051a1 1 0 01-.633.633l-2.051.683a1 1 0 000 1.898l2.051.684a1 1 0 01.633.632l.683 2.051a1 1 0 001.898 0l.683-2.051a1 1 0 01.633-.633l2.051-.683a1 1 0 000-1.898l-2.051-.683a1 1 0 01-.633-.633L6.95 5.684zM13.949 13.684a1 1 0 00-1.898 0l-.184.551a1 1 0 01-.632.633l-.551.183a1 1 0 000 1.898l.551.183a1 1 0 01.633.633l.183.551a1 1 0 001.898 0l.184-.551a1 1 0 01.632-.633l.551-.183a1 1 0 000-1.898l-.551-.184a1 1 0 01-.633-.632l-.183-.551z" />
                        </svg>
                }
                {t("CREATE_COURSES.COURSE_VISUALIZATION.generate_course")}
            </button>
            {courseHasErrors &&
                <div className='flex items-center gap-2 mb-5'>
                    <p className='p-2 text-xs font-normal text-gray-500 border rounded bg-gray-50'>{t("CREATE_COURSES.COURSE_VISUALIZATION.principal_text")}</p>
                    <Button onClick={() => setIsModalOpen(true)} className='flex items-center justify-center h-full gap-2 text-center bg-gray-50'>
                        {t("CREATE_COURSES.COURSE_VISUALIZATION.errors")}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                        </svg>
                    </Button>
                    <ShowSectionErrors subsectionErrors={subsectionErrors} setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} />
                </div>}

        </>

    )

}
