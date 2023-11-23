import React, { useState, useEffect } from 'react'
import { API } from '../../../../constant'
import { Select } from 'antd';



export const CourseSettings = ({ setSettingsFlag, courseData, setCourseData }) => {
    const [students, setStudents] = useState([])
    const [selected, setSelected] = useState()

    console.log(students)

    const onChange = (value) => {
        setSelected(value)
    };

    const onSearch = (value) => {
        console.log('search:', value);
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
        setCourseData(prevState => ({
            ...prevState,
            students: {
                data: [...prevState.students.data, selected]
            }
        }))
    }

    const saveChanges = async () => {

    }

    const filterOption = (input, option) =>
        (option?.name ?? '').toLowerCase().includes(input.toLowerCase());


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
                            This information will be displayed publicly so be careful what you share.
                        </p>
                        <hr className='mt-5' />
                    </div>

                    <div className="sm:col-span-6">
                        <label htmlFor="first-name" className="block text-sm font-medium text-blue-gray-900">
                            Course name
                        </label>
                        <input
                            type="text"
                            name="first-name"
                            value={courseData.title}
                            id="first-name"
                            autoComplete="given-name"
                            className="mt-1 block w-full rounded-md border-blue-gray-300 text-blue-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="sm:col-span-6">
                        <label htmlFor="description" className="block text-sm font-medium text-blue-gray-900">
                            Description
                        </label>
                        <div className="mt-1">
                            <textarea
                                id="description"
                                name="description"
                                value={courseData.description}
                                rows={4}
                                className="block w-full rounded-md border-blue-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                defaultValue={''}
                            />
                        </div>
                        <p className="mt-3 text-sm text-blue-gray-500">
                            Brief description for your profile. URLs are hyperlinked.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-y-6 pt-8 sm:grid-cols-6 sm:gap-x-6">
                    <div className="sm:col-span-6">
                        <h2 className="text-lg font-medium text-blue-gray-900">Participants</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            This information will be displayed publicly so be careful what you share.
                        </p>
                        <hr className='mt-5' />
                    </div>
                    <div className='sm:col-span-6'>
                        <div className="space-y-2">
                            <div className="space-y-1">
                                <label htmlFor="add-team-members" className="block text-sm font-medium text-gray-700">
                                    Add students
                                </label>
                                <p id="add-team-members-helper" className="sr-only">
                                    Search by name
                                </p>
                                <div className="flex mt-4 items-center">
                                    <div className="flex-grow">
                                        <Select
                                            className='w-full'
                                            showSearch
                                            placeholder="Select a student"
                                            optionFilterProp="children"
                                            onChange={onChange}
                                            onSearch={onSearch}
                                            filterOption={filterOption}
                                            options={students}
                                            optionLabelProp='name'
                                        />
                                    </div>
                                    <span className="ml-3">
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
                                        <li key={person.email} className="flex py-4">
                                            <img className="h-10 w-10 rounded-full" src={person.profile_photo.url} alt="" />
                                            <div className="ml-3 flex flex-col">
                                                <span className="text-sm font-medium text-gray-900">{person.name}</span>
                                                <span className="text-sm text-gray-500">{person.email}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="flex justify-end pt-8">
                    <button
                        onClick={() => setSettingsFlag(false)}
                        type="button"
                        className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-blue-gray-900 shadow-sm hover:bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => saveChanges()}
                        className=" ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}
