import React, { useState } from 'react'
import { TableRowsStudents } from './TableRowsStudents'
import { Button } from "antd"


export const QualificationsTable = ({ students, activities, setStudents, setUploadQualificationsFlag }) => {
    const [isEditChecked, setIsEditChecked] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleToggleChange = () => {
        setIsEditChecked(!isEditChecked);
    };


    function renderTableColumns(activitie) {
        return (
            <th scope="col" class="px-6 py-3">
                {activitie.attributes.title}
            </th>
        )
    }



    function renderTableRows() {
        const filteredStudents = students.filter((student) =>
            student.attributes.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <>
                {filteredStudents.map((student) => (
                    <TableRowsStudents
                        key={student.id}
                        student={student}
                        activities={activities}
                        isEditChecked={isEditChecked}
                        setStudents={setStudents}
                    />
                ))}
            </>
        );
    }


    return (
        <>
            {
                activities.length > 0 ?
                    <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-20">
                        <div class="flex items-center justify-between pb-4 bg-white  p-5">
                            <label for="table-search" class="sr-only">Search</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg class="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="table-search-users"
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    class="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                                    placeholder="Search for users" />
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer mr-auto ml-5">
                                <input
                                    type="checkbox"
                                    value=""
                                    className="sr-only peer"
                                    checked={isEditChecked}
                                    onChange={handleToggleChange}
                                />
                                <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`} />
                                <span className="ml-2 text-sm font-medium text-gray-900">Edit qualifications</span>
                            </label>

                            <Button onClick={() => setUploadQualificationsFlag(true)} className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5" type="default">
                                Upload qualifications
                            </Button>
                        </div>
                        <table class="w-full text-sm text-left text-gray-500 ">
                            <thead class="text-xs text-gray-700 uppercase bg-gray-50  ">
                                <tr>
                                    <th scope="col" class="px-6 py-3">
                                        Name
                                    </th>
                                    {activities && activities.map(renderTableColumns)}
                                </tr>
                            </thead>
                            <tbody>
                                {students && renderTableRows()}
                            </tbody>
                        </table>
                    </div>
                    :
                    <div className='relative bg-white rounded-md shadow-md mt-20 flex flex-col items-center justify-center w-2/4 px-20 mx-auto'>
                        <h1 className='text-2xl text-black font-bold mt-10 text-center'>There are no evaluable activities on this course!</h1>
                        <p className='font-medium my-6 text-sm text-center text-gray-600'>To add activities to your course, you can follow these simple steps: </p>
                        <ol className='text-sm font-medium mb-5 text-gray-600'>
                            <li>1. Navigate to 'Home' menu.</li>
                            <li>2. Access the course you are teaching.</li>
                            <li>3. Navigate to the 'Edit Course' menu or 'Course Content' section.</li>
                            <li>4. Here, you will find the option to 'Add Activities' or 'Create New Content.'</li>
                        </ol>
                        <img className='mb-10 w-48' src="https://liferay-support.zendesk.com/hc/article_attachments/360032795211/empty_state.gif" alt="" />
                    </div>
            }
        </>
    )
}
