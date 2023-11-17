import React from 'react'
import { message } from 'antd';
import { getToken } from '../../../../../helpers';
import { API } from '../../../../../constant';

export const ButtonCreateCourse = ({ createCourseSectionsList, courseBasicInfo }) => {

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
            //isValidCourseBasicInfo(courseBasicInfo)
            //isValidCourse(createCourseSectionsList)
            const course = {
                course: {
                    name: courseBasicInfo.courseName,
                    description: courseBasicInfo.description,
                    cover: courseBasicInfo.cover,
                    course_type: courseBasicInfo.courseType,
                    evaluator: courseBasicInfo.evaluator,
                    sections: createCourseSectionsList
                }
            }

            for (const section of createCourseSectionsList) {
                for (const subsection of section.subsections) {
                    console.log(subsection);
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
                        //TODO for para subir las files
                        const data = await response.json();
                        const newSubsection =
                        {
                            title: subsection.title,
                            fase: subsection.fase,
                            finished: false,
                            start_date: subsection.start_date,
                            end_date: subsection.end_date,
                            paragraphs: null,
                            description: subsection.description,
                            landscape_photo: subsection?.landscape_photo,
                            questionnaire: data.data.id,
                            users: null,
                            files: subsection.files,
                            content: subsection.content,
                        }
                    }
                }
            }
        }
        catch (e) {
            alert(e.message)
        }
    }

    return (
        <button onClick={createCourse} class="flex justify-center items-center mb-5 text-lg font-medium  bg-gradient-to-r from-[#657DE9] to-[#6E66D6] hover:from-pink-500 hover:to-purple-600 text-white py-3 px-6 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out hover:scale-110 hover:brightness-110 hover:animate-pulse active:scale-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mr-2 w-5 h-5">
                <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 00-1.898 0l-.683 2.051a1 1 0 01-.633.633l-2.051.683a1 1 0 000 1.898l2.051.684a1 1 0 01.633.632l.683 2.051a1 1 0 001.898 0l.683-2.051a1 1 0 01.633-.633l2.051-.683a1 1 0 000-1.898l-2.051-.683a1 1 0 01-.633-.633L6.95 5.684zM13.949 13.684a1 1 0 00-1.898 0l-.184.551a1 1 0 01-.632.633l-.551.183a1 1 0 000 1.898l.551.183a1 1 0 01.633.633l.183.551a1 1 0 001.898 0l.184-.551a1 1 0 01.632-.633l.551-.183a1 1 0 000-1.898l-.551-.184a1 1 0 01-.633-.632l-.183-.551z" />
            </svg>
            Generate Course
        </button>
    )
}
