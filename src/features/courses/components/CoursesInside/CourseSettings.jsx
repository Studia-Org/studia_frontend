import React, { useState, useEffect } from 'react'
import { API } from '../../../../constant'
import { Select, Avatar, message, Button } from 'antd';
import { getToken } from '../../../../helpers';
import { useParams } from 'react-router-dom';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond/dist/filepond.min.css';
import TagsInput from 'react-tagsinput'

registerPlugin(FilePondPluginImagePreview);

const { Option } = Select;


export const CourseSettings = ({ setSettingsFlag, courseData, setCourseData }) => {
    const [students, setStudents] = useState([])
    const [selected, setSelected] = useState()
    const [loading, setLoading] = useState(false)
    let { courseId } = useParams();

    const onChange = (value) => {
        setSelected(students.find(item => item.id === value))
    };

    const fetchStudents = async () => {
        const getAllUsers = await fetch(`${API}/users?populate=*`)
        const data = await getAllUsers.json();
        setStudents(data)
    }

    useEffect(() => {
        fetchStudents()
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
                        students: courseData.students.data.map(item => item.id)
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

    useEffect(() => {
        if (students.length > 0) {
            setSelected(students[0]);
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
                    <div className="sm:col-span-6">
                        <h2 className="text-lg font-medium text-blue-gray-900 mt-8">Course info</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            This information will be displayed publicly to the students.
                        </p>
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
                            files={courseData.cover.data?.attributes.url}
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
                    <div className='sm:col-span-6'>
                        <div className="space-y-2">
                            <div className="space-y-1">
                                <div className='flex items-center'>
                                    <label htmlFor="add-team-members" className="block text-sm font-medium text-gray-700">
                                        Add students
                                    </label>
                                    <label className='ml-auto block text-sm font-medium text-gray-700'>Student number: {courseData.students.data.length}</label>
                                </div>


                                <div className="flex items-center">
                                    <div className="flex-grow mt-3">
                                        <Select
                                            className='w-full'
                                            showSearch
                                            placeholder="Select a student"
                                            optionFilterProp="label"
                                            onChange={onChange}
                                            filterOption={true}
                                            optionLabelProp='label'
                                        >
                                            {students.map(item => (
                                                <Option key={item.id} value={item.id} label={item.name}>
                                                    <div className='flex items-center gap-3'>
                                                        <Avatar src={item.profile_photo.url}></Avatar>
                                                        <p className='font-medium'>{item.name}</p>
                                                    </div>
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>
                                    <span className="ml-3 mt-3">
                                        <button
                                            type="button"
                                            onClick={() => addStudentButton()}
                                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="-ml-2 mr-1 h-5 w-5 text-gray-400">
                                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                                            </svg>
                                            <span>Add</span>
                                        </button>
                                    </span>
                                </div>
                            </div>

                            <div className="border-b border-gray-200 overflow-y-auto max-h-[20rem]">
                                <ul className="divide-y divide-gray-200">
                                    {courseData.students.data.map((person) => (
                                        <li key={person.id} className="flex py-4 items-center">
                                            <img className="h-10 w-10 rounded-full" src={person?.attributes ? person?.attributes.profile_photo.data?.attributes.url : person?.profile_photo?.url} alt="" />
                                            <div className="ml-3 flex flex-col">
                                                <span className="text-sm font-medium text-gray-900">{person?.attributes ? person.attributes.name : person.name}</span>
                                                <span className="text-sm text-gray-500">{person?.attributes ? person.attributes.email : person.email}</span>
                                            </div>
                                            <svg onClick={() => deleteStudent(person)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="cursor-pointer w-5 h-5 ml-auto">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                                            </svg>

                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

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
        </div>
    )
}
