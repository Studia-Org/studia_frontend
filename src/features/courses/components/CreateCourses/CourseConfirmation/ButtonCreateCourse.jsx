import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { getToken } from '../../../../../helpers';
import { API } from '../../../../../constant';
import { MoonLoader } from 'react-spinners';


export const ButtonCreateCourse = ({ createCourseSectionsList, courseBasicInfo }) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const isValidCourseBasicInfo = (courseBasicInfo) => {
        if (!courseBasicInfo) {
            throw new Error("courseBasicInfo is missing");
        }
        const requiredAttributes = ['courseName', 'description', 'cover', 'courseType', 'evaluator'];
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
            })
        })
        return true;
    };

    async function createCourse() {

        try {
            isValidCourseBasicInfo(courseBasicInfo)
            isValidCourse(createCourseSectionsList)
            setIsLoading(true)
            let allSections = []
            for (const section of createCourseSectionsList) {
                let allSubsections = []

                for (const subsection of section.subsections) {
                    let newSubsection = {}
                    if (subsection?.questionnaire) {
                        const questionnaire = {
                            Title: subsection.questionnaire.attributes.Title,
                            description: subsection.questionnaire.attributes.description,
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
                        newSubsection =
                        {
                            title: subsection.title,
                            fase: subsection.fase,
                            finished: false,
                            start_date: new Date(subsection.start_date).toISOString(),
                            end_date: new Date(subsection.end_date).toISOString(),
                            paragraphs: null,
                            description: subsection.questionnaire.attributes.description?.slice(0, 140) || 'description',
                            landscape_photo: null,
                            questionnaire: data.data.id,
                            users: null,
                            files: null,
                            content: subsection.content,
                        }
                    } else {
                        const formData = new FormData();
                        let filesData = null
                        if (subsection.files.length > 0) {
                            for (const file of subsection.files) {
                                formData.append('files', file.file);
                            }
                            const response = await fetch(`${API}/upload`, {
                                method: 'POST',
                                headers: {
                                    Authorization: `Bearer ${getToken()}`
                                },
                                body: formData,
                            });
                            filesData = await response.json();
                        }

                        newSubsection =
                        {
                            title: subsection.title,
                            fase: subsection.fase,
                            finished: false,
                            start_date: new Date(subsection.start_date).toISOString(),
                            end_date: new Date(subsection.end_date).toISOString(),
                            paragraphs: null,
                            description: subsection.description?.slice(0, 140) || 'description',
                            landscape_photo: null,
                            questionnaire: null,
                            users: null,
                            files: filesData?.map((file) => file.id),
                            content: subsection.content,
                        }

                        if (subsection?.landscape_photo.length > 0) {
                            formData.delete('files');
                            formData.append('files', subsection.landscape_photo[0].file);
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

                if (section?.task?.files.length > 0) {
                    for (const file of section.task.files) {
                        newFormData.append('files', file);
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
            }

            const newCourse = {
                title: courseBasicInfo.courseName,
                description: courseBasicInfo.description,
                cover: null,
                course_type: courseBasicInfo.courseType,
                professor: courseBasicInfo.evaluator,
                tags: courseBasicInfo.tags,
                sections: allSections,
                start_date: new Date(),
                end_date: new Date(),
            }
            const formData = new FormData();
            formData.append('files', courseBasicInfo.cover[0].file);
            const coverUpload = await fetch(`${API}/upload/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${getToken()}`
                },
                body: formData,
            });
            const data = await coverUpload.json();
            newCourse.cover = data[0].id;

            const createCourseFinal = await fetch(`${API}/courses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ data: newCourse }),
            })
            const dataFinal = await createCourseFinal.json();
            const newForumCourse = {
                course: dataFinal.data.id,
                posts: null
            }

            const createForum = await fetch(`${API}/forums`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ data: newForumCourse }),
            })
            const dataForum = await createForum.json();

            const updateCourse = await fetch(`${API}/courses/${dataFinal.data.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ data: { forum: dataForum.data.id } }),
            })
            const dataUpdate = await updateCourse.json();
            message.success('Course created successfully');
            setIsLoading(false)
            navigate(`/app/courses/`)
        }
        catch (e) {
            setIsLoading(false)
            message.error(e.message)
        }

    }
    if (isLoading) {
        return (
            <div className='absolute left-0 top-0 h-screen w-screen bg-indigo-400 opacity-60 flex items-center justify-center z-50'>
                <MoonLoader color="#363cd6" size={80} />
            </div>
        )
    } else {
        return (
            <button onClick={createCourse} class="flex justify-center items-center mb-5 text-lg font-medium  bg-gradient-to-r from-[#657DE9] to-[#6E66D6] hover:from-pink-500 hover:to-purple-600 text-white py-3 px-6 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out hover:scale-110 hover:brightness-110 hover:animate-pulse active:scale-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mr-2 w-5 h-5">
                    <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 00-1.898 0l-.683 2.051a1 1 0 01-.633.633l-2.051.683a1 1 0 000 1.898l2.051.684a1 1 0 01.633.632l.683 2.051a1 1 0 001.898 0l.683-2.051a1 1 0 01.633-.633l2.051-.683a1 1 0 000-1.898l-2.051-.683a1 1 0 01-.633-.633L6.95 5.684zM13.949 13.684a1 1 0 00-1.898 0l-.184.551a1 1 0 01-.632.633l-.551.183a1 1 0 000 1.898l.551.183a1 1 0 01.633.633l.183.551a1 1 0 001.898 0l.184-.551a1 1 0 01.632-.633l.551-.183a1 1 0 000-1.898l-.551-.184a1 1 0 01-.633-.632l-.183-.551z" />
                </svg>
                Generate Course
            </button>
        )
    }
}
