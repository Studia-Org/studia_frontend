import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API } from '../../../../../constant'
import { Select, Avatar, message, Button, Popconfirm } from 'antd';
import { getToken } from '../../../../../helpers';
import { useParams } from 'react-router-dom';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond/dist/filepond.min.css';
import TagsInput from 'react-tagsinput'
import { AddParticipants } from './AddParticipants';

registerPlugin(FilePondPluginImagePreview);




export const CourseSettings = ({ setSettingsFlag, courseData, setCourseData }) => {
    const navigate = useNavigate()
    const [students, setStudents] = useState([])
    const [evaluators, setEvaluators] = useState([])
    const [selected, setSelected] = useState()
    const [selectedEvaluator, setSelectedEvaluator] = useState()
    const [loading, setLoading] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)
    let { courseId } = useParams();


    const fetchUsers = async () => {
        const getAllUsers = await fetch(`${API}/users?populate=*`)
        const data = await getAllUsers.json();
        setStudents(data)
        setEvaluators(data.filter(item => item?.role_str === 'admin' || item?.role_str === 'professor'))
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    function addStudentButton() {
        if (courseData.students.data.find(item => item.id === selected.id)) {
            message.error('Student already added')
        } else {
            setCourseData(prevState => ({
                ...prevState,
                students: {
                    data: [...prevState.students.data, selected]
                }
            }))
        }
    }

    function addEvaluatorButton() {
        if (courseData.evaluators.data.find(item => item.id === selectedEvaluator.id)) {
            message.error('Evaluator already added')
        } else {
            setCourseData(prevState => ({
                ...prevState,
                evaluators: {
                    data: [...prevState.evaluators.data, selectedEvaluator]
                }
            }))
        }
    }



    const deleteCourse = async () => {
        setLoadingDelete(true)
        try {
            courseData.sections.data.forEach(async (section) => {
                section.attributes.subsections.data.forEach(async (subsection) => {
                    if (subsection.attributes.activity.data) {
                        await fetch(`${API}/activities/${subsection.attributes.activity.data.id}`, {
                            method: 'DELETE',
                            headers: {
                                Authorization: `Bearer ${getToken()}`
                            }
                        })
                    }
                    if (subsection.attributes.questionnaire.data) {
                        await fetch(`${API}/questionnaires/${subsection.attributes.questionnaire.data.id}`, {
                            method: 'DELETE',
                            headers: {
                                Authorization: `Bearer ${getToken()}`
                            }
                        })
                    }
                    await fetch(`${API}/subsections/${subsection.id}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${getToken()}`
                        }
                    })
                })
                await fetch(`${API}/sections/${section.id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                })
            })
            await fetch(`${API}/courses/${courseId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            })
            navigate('/app/courses')
            setLoadingDelete(false)
        } catch (error) {
            setLoadingDelete(false)
            message.error(error)
        }
    }


    const saveChanges = async () => {
        setLoading(true)
        if (courseData.cover.data.attributes.url.length === 0) {
            message.error('Please upload a cover image')
            return;
        }
        try {
            const formData = new FormData();
            formData.append('files', courseData.cover.data.attributes.url[0]);
            const uploadCover = await fetch(`${API}/upload`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${getToken()}`
                },
                body: formData
            })
            const uploadCoverData = await uploadCover.json();
            const response = await fetch(`${API}/courses/${courseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    data:
                    {
                        title: courseData.title,
                        description: courseData.description,
                        tags: courseData.tags,
                        cover: uploadCoverData[0].id,
                        students: courseData.students.data.map(item => item.id),
                        evaluators: courseData.evaluators.data.map(item => item.id)
                    }
                })
            })
            if (response.ok) {
                message.success('Course updated successfully');
                setSettingsFlag(false)
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData);
                message.error('Something went wrong');
            }
            setLoading(false)
        } catch (error) {
            message.error(error)
        }
    }

    function deleteStudent(student) {
        setCourseData(prevState => ({
            ...prevState,
            students: {
                data: prevState.students.data.filter(item => item.id !== student.id)
            }
        }))
    }

    function deleteEvaluator(evaluator) {
        setCourseData(prevState => ({
            ...prevState,
            evaluators: {
                data: prevState.evaluators.data.filter(item => item.id !== evaluator.id)
            }
        }))
    }

    useEffect(() => {
        if (students.length > 0) {
            setSelected(students[0]);
        }
        if (evaluators.length > 0) {
            setSelectedEvaluator(evaluators[0]);
        }
    }, [students]);

    return (
        <div className="flex-1 mb-10">
            <div className="ml-2 max-w-3xl pt-5 px-4 sm:px-6  lg:px-8">
                <button className='text-sm flex items-center pb-5 ' onClick={() => setSettingsFlag(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                    </svg>
                    <p className='ml-1'>Go back to course</p>
                </button>
                <h1 className="text-3xl font-bold tracking-tight text-blue-gray-900">Edit Course</h1>
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                    <div className="sm:col-span-6 flex mt-8 items-center">
                        <div>
                            <h2 className="text-lg font-medium text-blue-gray-900 ">Course info</h2>
                            <p className="mt-1 text-sm text-gray-500">
                                This information will be displayed publicly to the students.
                            </p>
                        </div>
                        <Popconfirm
                            title="Delete the course"
                            description="Are you sure to delete this course?"
                            onConfirm={() => deleteCourse()}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button loading={loadingDelete} danger className='ml-auto bg-[#ff4d4f] hover:bg-[#ff4d50c5] !text-white'>
                                Delete Course
                            </Button>
                        </Popconfirm>

                        <hr className='mt-5' />
                    </div>

                    <div className="sm:col-span-6">
                        <label htmlFor="first-name" className="block text-sm font-medium text-blue-gray-900 mb-2">
                            Course name
                        </label>
                        <input
                            type="text"
                            name="first-name"
                            value={courseData.title}
                            onChange={(e) => setCourseData(prevState => ({ ...prevState, title: e.target.value }))}
                            id="first-name"
                            autoComplete="given-name"
                            className="mt-1 block w-full rounded-md border-blue-gray-300 text-blue-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="sm:col-span-6">
                        <label htmlFor="description" className="block text-sm font-medium text-blue-gray-900">
                            Description
                        </label>
                        <div className="mt-2">
                            <textarea
                                id="description"
                                name="description"
                                value={courseData.description}
                                onChange={(e) => setCourseData(prevState => ({ ...prevState, description: e.target.value }))}
                                rows={4}
                                className="block w-full rounded-md border-blue-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                defaultValue={''}
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-6">
                        <label htmlFor="description" className="block text-sm font-medium text-blue-gray-900 mb-2">
                            Cover
                        </label>
                        <FilePond
                            files={courseData?.cover?.data?.attributes.url}
                            allowMultiple={false}
                            onupdatefiles={(fileItems) => {
                                setCourseData(prevState => ({
                                    ...prevState,
                                    cover: {
                                        data: {
                                            attributes: {
                                                url: fileItems.map(item => item.file)
                                            }
                                        }
                                    }
                                }))
                            }}
                            maxFiles={1}
                        />
                    </div>
                    <div className="sm:col-span-6">
                        <label htmlFor="description" className="block text-sm font-medium text-blue-gray-900 mb-2">
                            Tags
                        </label>
                        <TagsInput value={courseData.tags} onChange={(e) => setCourseData(prevState => ({ ...prevState, tags: e }))} />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-y-6 pt-8 sm:grid-cols-6 sm:gap-x-6">
                    <div className="sm:col-span-6">
                        <h2 className="text-lg font-medium text-blue-gray-900">Participants</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Edit the number of students and evaluators for this course.
                        </p>
                        <hr className='mt-5' />
                    </div>
                    <AddParticipants participants={students} addedParticipants={courseData.students.data}
                        addParticipant={addStudentButton} deleteParticipant={deleteStudent} setSelected={setSelected} addType={'Students'} />

                    <AddParticipants participants={evaluators} addedParticipants={courseData?.evaluators?.data}
                        addParticipant={addEvaluatorButton} deleteParticipant={deleteEvaluator} setSelected={setSelectedEvaluator} addType={'Evaluators'} />

                </div>

                <div className="flex justify-end pt-8 items-center">
                    <Button
                        onClick={() => setSettingsFlag(false)}
                        type="button"
                        className="rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-blue-gray-900 shadow-sm hover:bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Cancel
                    </Button>
                    <Button
                        loading={loading}
                        onClick={() => saveChanges()}
                        className=" ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600  px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div >
    )
}
