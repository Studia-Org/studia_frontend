import React, { useEffect, useState } from 'react'
import { TableRowsStudents } from './TableRowsStudents'
import { TableRowsGroups, saveChangesButtonGroups } from './TableRowsGroups'
import { Button, Select, message } from "antd"
import { API } from '../../../constant';
import { getToken } from '../../../helpers';
import { useAuthContext } from '../../../context/AuthContext';


export const QualificationsTable = ({ students, activities, setStudents, setUploadQualificationsFlag, setActivities }) => {
    const [isEditChecked, setIsEditChecked] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState
        (JSON.stringify({ id: activities[0]?.id, title: activities[0]?.attributes?.title, groupActivity: activities[0]?.attributes?.groupActivity }));
    const [thereIsChanges, setThereIsChanges] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editedGrades, setEditedGrades] = useState({});
    const [editActivity, setSetEditActivity] = useState({});
    const { user } = useAuthContext()
    const [filteredActivity, setFilteredActivity] = useState(activities.find(activity => activity.id === JSON.parse(selectedActivity).id))
    const [loading, setLoading] = useState(false)
    const [groups, setGroups] = useState([])

    const tableOptions = {
        "questionnaire": "Questionnaire Completed",
        "peerReview": "Average grade received",
    }
    const handleToggleChange = () => {
        setIsEditChecked(!isEditChecked);
    };

    const saveChangesButton = async () => {
        setLoading(true)
        for (const studentId in editedGrades) {
            let grade =
                students
                    .find(student => student.id === Number(studentId))?.attributes.qualifications.data
                    .find(qualification => qualification?.attributes.activity.data?.id === JSON.parse(selectedActivity).id)


            const student = editedGrades[studentId];
            if (grade) {
                const response = await fetch(`${API}/qualifications/${grade.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify({
                        data: {
                            qualification: student.qualification,
                            comments: student.comments,
                        }
                    }),
                })
                const data = await response.json();
                data.data.attributes.activity = grade.attributes.activity;
                data.data.attributes.file = grade.attributes.file;
                setStudents(prevState => {
                    const newStudents = [...prevState];
                    const studentIndex = newStudents.findIndex(student => student.id === Number(studentId));
                    const qualificationIndex = newStudents[studentIndex].attributes.qualifications.data.findIndex(qualification => qualification.id === grade.id);
                    newStudents[studentIndex].attributes.qualifications.data[qualificationIndex] = data.data;
                    return newStudents;
                })
            } else {
                const response = await fetch(`${API}/qualifications`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify({
                        data: {
                            activity: JSON.parse(selectedActivity).id,
                            user: studentId,
                            comments: student.comments,
                            evaluator: user.id,
                            qualification: student.qualification,
                            file: null,
                            delivered: true
                        }
                    }),
                })
                const data = await response.json();
                data.data.attributes.activity = { data: activities.find((activity) => activity.id === JSON.parse(selectedActivity).id) };
                data.data.attributes.file = { data: null }
                setStudents(prevState => {
                    const newStudents = [...prevState];
                    const studentIndex = newStudents.findIndex(student => student.id === Number(studentId));
                    newStudents[studentIndex].attributes.qualifications.data.push(data.data);
                    return newStudents;
                })
            }
        }
        setThereIsChanges(false);
        setIsEditChecked(false);
        setLoading(false)
        message.success('Changes saved successfully!');

    };

    useEffect(() => {
        const parsedActivityFull = JSON.parse(selectedActivity)
        const AllFilteredGroups = students.filter((student) => student.attributes.groups?.data
            .find(group => group.attributes.activity?.data?.id === parsedActivityFull.id))
            .map((group) => group.attributes.groups.data.find(group => group.attributes.activity?.data?.id === parsedActivityFull.id))

        const filteredGroupsIds = AllFilteredGroups.map(group => group.id)
        const filteredGroupsIdsUnique = [...new Set(filteredGroupsIds)]
        const filteredGroups = filteredGroupsIdsUnique.map(id => AllFilteredGroups.find(group => group.id === id))
        setGroups(filteredGroups)
    }, [students])

    function renderTableRows() {
        const parsedActivityFull = JSON.parse(selectedActivity)
        if (parsedActivityFull.groupActivity) {
            const AllFilteredGroups = students.filter((student) => student.attributes.groups?.data
                .find(group => {
                    if (filteredActivity.attributes.type === 'peerReview') {
                        return group.attributes.activity?.data?.id === filteredActivity?.attributes?.task_to_review?.data?.id
                    }
                    return group.attributes.activity?.data?.id === parsedActivityFull.id
                }))
                .map((group) => group.attributes.groups.data.find(group => {
                    if (filteredActivity.attributes.type === 'peerReview') {
                        return group.attributes.activity?.data?.id === filteredActivity?.attributes?.task_to_review?.data?.id
                    }
                    return group.attributes.activity?.data?.id === parsedActivityFull.id
                }))

            const filteredGroupsIds = AllFilteredGroups.map(group => group.id)
            const filteredGroupsIdsUnique = [...new Set(filteredGroupsIds)]
            const filteredGroups = filteredGroupsIdsUnique.map(id => AllFilteredGroups.find(group => group.id === id))
            if (groups.length === 0) setGroups(filteredGroups)

            return (
                filteredGroups.map((group) => {
                    return <TableRowsGroups
                        key={group.id}
                        group={group}
                        activity={parsedActivityFull}
                        isEditChecked={isEditChecked}
                        setThereIsChanges={setThereIsChanges}
                        editedGrades={editedGrades}
                        setEditedGrades={setEditedGrades}
                        setStudents={setStudents}
                        activities={activities}
                        activityFull={filteredActivity}
                        isPeerReview={filteredActivity.attributes.BeingReviewedBy.data !== null}
                        BeingReviewedBy={filteredActivity.attributes.BeingReviewedBy.data}
                        setEditActivity={setSetEditActivity}
                    />
                })
            )

        } else {
            const filteredStudents = students.filter((student) =>
                student.attributes.name.toLowerCase().includes(searchTerm.toLowerCase())
            )

            return (
                <>
                    {filteredStudents.map((student) => {
                        return <TableRowsStudents
                            key={student.id}
                            student={student}
                            activity={selectedActivity}
                            isEditChecked={isEditChecked}
                            setThereIsChanges={setThereIsChanges}
                            editedGrades={editedGrades}
                            activities={activities}
                            setEditedGrades={setEditedGrades}
                            isPeerReview={filteredActivity.attributes.BeingReviewedBy.data !== null}
                            activityFull={filteredActivity}
                            setEditActivity={setSetEditActivity}

                        />
                    })}
                </>
            );
        }
    }

    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const activityOptions = activities
        .filter(activity => activity.attributes.evaluable === true)
        .map(activity => ({
            value: JSON.stringify({ id: activity.id, title: activity.attributes.title, groupActivity: activity.attributes.groupActivity }),
            label: activity.attributes.title,
        }));
    return (
        <>
            {
                activities.length > 0 ?
                    <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-20">
                        <div class=" pb-4 bg-white  p-5">
                            <div className='flex items-center justify-between'>
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
                                <label className="relative inline-flex items-center ml-5 mr-auto cursor-pointer">
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
                            <div className='flex items-center justify-between mt-5 gap-x-5 '>
                                <Select
                                    showSearch
                                    className='w-full cursor-pointer'
                                    placeholder="Select an activity"
                                    optionFilterProp="children"
                                    value={selectedActivity}
                                    onChange={(value) => {
                                        setSelectedActivity(value);
                                        setFilteredActivity(activities.find(activity => activity.id === JSON.parse(value).id))
                                    }}
                                    filterOption={filterOption}
                                    options={activityOptions}
                                />
                                {
                                    isEditChecked && (
                                        <Button loading={loading} type='primary' disabled={!thereIsChanges} onClick={() => {
                                            if (filteredActivity.attributes.BeingReviewedBy.data !== null &&
                                                new Date(filteredActivity.attributes.BeingReviewedBy.data?.attributes?.deadline) > new Date()) {
                                                message.error('Peer review has not ended yet! You must wait until the deadline to save changes.')
                                                return
                                            }

                                            if (JSON.parse(selectedActivity).groupActivity) {
                                                setLoading(true)
                                                saveChangesButtonGroups(editedGrades, groups, selectedActivity, user, students, setStudents)
                                                setThereIsChanges(false);
                                                setIsEditChecked(false);
                                                setLoading(false)
                                            } else {
                                                saveChangesButton()
                                            }
                                            if (Object.keys(editActivity).length > 0) {
                                                //TODO save changes for peer review ponderation
                                                // const response = updateActivityPonderation({
                                                //     activityId: editActivity[filteredActivity.id].id,
                                                //     ponderation: editActivity[filteredActivity.id].ponderationStudent
                                                // })
                                                // // edit ponderation
                                                // let filteredActivityCopy = { ...filteredActivity }
                                                // filteredActivityCopy.attributes.ponderationStudent = editActivity[filteredActivity.id].ponderationStudent
                                                // setFilteredActivity(filteredActivityCopy)
                                                // setSetEditActivity({})
                                            }
                                        }
                                        }>
                                            Save Changes
                                        </Button>
                                    )
                                }
                            </div>
                        </div>
                        {
                            filteredActivity.attributes.BeingReviewedBy.data !== null &&
                            new Date(filteredActivity.attributes.BeingReviewedBy.data?.attributes?.deadline) > new Date() &&
                            <div className="px-4 py-2 text-red-700 bg-red-100 border border-red-400 rounded" role="alert">
                                <strong className="text-sm font-bold">Attention!</strong>
                                <span className="block text-sm sm:inline"> Peer review deadline is on {new Date(filteredActivity.attributes.BeingReviewedBy.data.attributes.deadline).toLocaleDateString()}</span>
                            </div>
                        }
                        <table class="w-full text-sm text-left text-gray-500 ">
                            <thead class="text-xs text-gray-700 uppercase bg-gray-50  ">
                                <tr>
                                    {
                                        JSON.parse(selectedActivity).activityGroup ?
                                            <th scope="col" class="px-6 py-3">
                                                Groups
                                            </th>
                                            :
                                            <th scope="col" class="px-6 py-3">
                                                Name
                                            </th>
                                    }
                                    <th scope="col" class="px-6 py-3">
                                        Qualification
                                    </th>
                                    <th scope="col" class="px-6 py-3 ">
                                        Comment
                                    </th>
                                    {filteredActivity.attributes.BeingReviewedBy.data !== null &&
                                        <th scope="col" class="px-6 py-3">
                                            Professor qualification
                                        </th>
                                    }
                                    <th scope="col" class="px-6 py-3">
                                        {
                                            filteredActivity.attributes.BeingReviewedBy.data !== null ?
                                                tableOptions["peerReview"] :
                                                tableOptions[filteredActivity.attributes.type] || 'Files'
                                        }
                                    </th>
                                    {filteredActivity.attributes.BeingReviewedBy.data !== null &&
                                        <th scope="col" class="px-6 py-3">
                                            Professor - Students ponderation
                                        </th>
                                    }
                                    <th scope="col" class="px-6 py-3">
                                        Last modified
                                    </th>
                                </tr>
                            </thead>
                            <tbody key={selectedActivity + filteredActivity.attributes.ponderationStudent}>
                                {students && renderTableRows()}
                            </tbody>
                        </table>
                    </div>
                    :
                    <div className='relative flex flex-col items-center justify-center w-2/4 px-20 mx-auto mt-20 bg-white rounded-md shadow-md'>
                        <h1 className='mt-10 text-2xl font-bold text-center text-black'>There are no evaluable activities on this course!</h1>
                        <p className='my-6 text-sm font-medium text-center text-gray-600'>To add activities to your course, you can follow these simple steps: </p>
                        <ol className='mb-5 text-sm font-medium text-gray-600'>
                            <li>1. Navigate to 'Home' menu.</li>
                            <li>2. Access the course you are teaching.</li>
                            <li>3. Navigate to the 'Edit Course' menu or 'Course Content' section.</li>
                            <li>4. Here, you will find the option to 'Add Activities' or 'Create New Content.'</li>
                        </ol>
                        <img className='w-48 mb-10' src="https://liferay-support.zendesk.com/hc/article_attachments/360032795211/empty_state.gif" alt="" />
                    </div>
            }
        </>
    )
}
