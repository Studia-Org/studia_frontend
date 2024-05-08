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
    const [coverChanged, setCoverChanged] = useState(courseData.cover.data.attributes.url[0])
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


    function addStudentButton(student) {
        if (courseData.students.data.find(item => item.id === student.id)) {
            message.error('Student already added')
        } else {
            setCourseData(prevState => ({
                ...prevState,
                students: {
                    data: [...prevState.students.data, student]
                }
            }))
        }

    }

    function addEvaluatorButton(evaluator) {
        if (courseData.evaluators.data.find(item => item.id === evaluator.id)) {
            message.error('Evaluator already added')
        } else {
            setCourseData(prevState => ({
                ...prevState,
                evaluators: {
                    data: [...prevState.evaluators.data, evaluator]
                }
            }))
        }
    }



    const deleteCourse = async () => {
        const token = process.env.REACT_APP_ADMIN_TOKEN;
        setLoadingDelete(true)
        try {
            courseData.sections.data.forEach(async (section) => {
                section.attributes.subsections.data.forEach(async (subsection) => {
                    if (subsection.attributes.activity.data) {
                        await fetch(`${API}/activities/${subsection.attributes.activity.data.id}`, {
                            method: 'DELETE',
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                    }
                    if (subsection.attributes.questionnaire.data) {
                        await fetch(`${API}/questionnaires/${subsection.attributes.questionnaire.data.id}`, {
                            method: 'DELETE',
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                    }
                    await fetch(`${API}/subsections/${subsection.id}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                })
                await fetch(`${API}/sections/${section.id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            })
            await fetch(`${API}/courses/${courseId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
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
            const data = {
                title: courseData.title,
                description: courseData.description,
                tags: courseData.tags,
                students: courseData.students.data.map(item => item.id),
                evaluators: courseData.evaluators.data.map(item => item.id)
            }

            if (coverChanged.name !== courseData.cover.data.attributes.url[0].name
                || coverChanged.size !== courseData.cover.data.attributes.url[0].size) {
                message.error('uploading cover image')
                const formData = new FormData();
                formData.append('files', courseData.cover.data.attributes.url[0]);
                const uploadCover = await fetch(`${API}/upload`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    },
                    body: formData
                })
                if (!uploadCover.ok) {
                    message.error('Error uploading cover image')
                    setLoading(false)
                    return;
                }
                const uploadCoverData = await uploadCover.json();
                data.cover = uploadCoverData[0].id
            }
            const response = await fetch(`${API}/courses/${courseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    data: data
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
            setLoading(false)
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
            <div className="max-w-3xl px-4 pt-5 ml-2 sm:px-6 lg:px-8">
                <h1 className="text-xl font-bold tracking-tight text-blue-gray-900">Edit Course</h1>
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                    <div className="flex items-center mt-8 sm:col-span-6">
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
                        <label htmlFor="first-name" className="block mb-2 text-sm font-medium text-blue-gray-900">
                            Course name
                        </label>
                        <input
                            type="text"
                            name="first-name"
                            value={courseData.title}
                            onChange={(e) => setCourseData(prevState => ({ ...prevState, title: e.target.value }))}
                            id="first-name"
                            autoComplete="given-name"
                            className="block w-full mt-1 rounded-md shadow-sm border-blue-gray-300 text-blue-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                                className="block w-full rounded-md shadow-sm border-blue-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                defaultValue={''}
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-6">
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-blue-gray-900">
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
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-blue-gray-900">
                            Tags
                        </label>
                        <TagsInput value={courseData.tags} onChange={(e) => setCourseData(prevState => ({ ...prevState, tags: e }))} />
                    </div>
                </div>

                {
                    !courseData.studentManaged && (
                        <div className="grid grid-cols-1 pt-8 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                            <div className="sm:col-span-6">
                                <h2 className="text-lg font-medium text-blue-gray-900">Participants</h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Edit the number of students and evaluators for this course.
                                </p>
                                <hr className='mt-5' />
                            </div>
                            <AddParticipants participants={students} addedParticipants={courseData.students.data} selected={selected}
                                addParticipant={addStudentButton} deleteParticipant={deleteStudent} setSelected={setSelected} addType={'Students'} />

                            <AddParticipants participants={evaluators} addedParticipants={courseData?.evaluators?.data} selected={selectedEvaluator}
                                addParticipant={addEvaluatorButton} deleteParticipant={deleteEvaluator} setSelected={setSelectedEvaluator} addType={'Evaluators'} />
                        </div>
                    )
                }

                <div className="flex items-center justify-end pt-8">
                    <Button
                        onClick={() => setSettingsFlag(false)}
                        type="button"
                        className="px-4 text-sm font-medium bg-white border border-gray-300 rounded-md shadow-sm text-blue-gray-900 hover:bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Cancel
                    </Button>
                    <Button
                        loading={loading}
                        onClick={() => saveChanges()}
                        className="inline-flex justify-center px-4 ml-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div >
    )
}
