import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "../CreateGroups"
import { BackButton } from '../BackToCourse'
import { useEffect, useState } from "react";
import { Button, Divider, message } from "antd";
import { useParams } from "react-router-dom";
import { API } from "../../../../../../constant";
import { getToken } from "../../../../../../helpers";
import { useAuthContext } from "../../../../../../context/AuthContext";
function CreatePeers({ students: allStudents, setCreatePeerReview, activityToReview, activity }) {

    const { user } = useAuthContext();
    const [students, setStudents] = useState([])
    const [studentsToReview, setStudentsToReview] = useState([])
    const [creatingGroups, setCreatingGroups] = useState(false)
    const { activityId } = useParams()
    const activityToReviewWasInGroups = activityToReview?.attributes?.groupActivity || false
    const studentsPerGroup = activityToReview?.attributes?.numberOfStudentsperGroup
    const usersToPair = activity?.attributes?.usersToPair
    const [activityHasStarted] = useState(new Date(activity.attributes.start_date) < new Date())
    const [groupWithMoreStudents, setGroupWithMoreStudents] = useState(null)
    const [buttonTextPeerReview, setButtonTextPeerReview] = useState("Create peers")
    const height = Math.max(studentsPerGroup, 1) * 52 + "px"
    useEffect(() => {
        const added = []
        const qualificationsToReview = allStudents.map((student) => {
            const studentQualification = !activityToReviewWasInGroups ?
                student.attributes.qualifications.data
                    .find((qualification) => {
                        return qualification.attributes.activity?.data?.id === activityToReview.id
                    })
                : student.attributes.groups?.data?.find((group) =>
                    group.attributes.activity?.data?.id === activityToReview.id
                )
            if (activityToReviewWasInGroups) {

                // check if qualification has already been created
                if (studentQualification && studentQualification?.attributes?.qualifications?.data?.length > 0 && !added.includes(studentQualification.id)) {
                    added.push(studentQualification.id)
                    // add profile photo to the user
                    studentQualification.attributes.users.data = studentQualification.attributes.users.data.map((user) => {
                        if (user.id === student.id) user.attributes.profile_photo = student.attributes.profile_photo
                        else user.attributes.profile_photo = allStudents.find((student) => student.id === user.id).attributes.profile_photo
                        return user
                    })

                    const qual = studentQualification.attributes.qualifications.data.find((qualification) => qualification.attributes.activity.data.id === activityToReview.id)
                    if (qual) {
                        return {
                            qualification: studentQualification.attributes.qualifications.data.find((qualification) => qualification.attributes.activity.data.id === activityToReview.id),
                            users: studentQualification.attributes.users.data.map((user) => user)
                        }
                    }
                    return null
                }
            } else {
                if (studentQualification && !added.includes(studentQualification.id)) {
                    added.push(studentQualification.id)
                    studentQualification.attributes.id = studentQualification.id
                    return {
                        qualification: studentQualification.attributes,
                        users: [student]
                    }
                }
            }
        }).filter(Boolean)


        const groups = []
        // multiplacte each student hisself by the number of times they have to review usersToPair
        const studentsDuplicated = []
        if (activity.attributes.groupActivity) {
            const add = []
            const groups = allStudents.map((student) => {
                return student.attributes.groups?.data?.find((group) => {
                    if (add.includes(group.id)) return false
                    add.push(group.id)
                    return group.attributes.activity?.data?.id === activityToReview.id
                })
            }).filter(Boolean)

            groups.forEach((group, index) => {
                for (let i = 0; i < usersToPair; i++) {
                    const groupCopy = { ...group }
                    groupCopy.draggableId = Math.random().toString(36)
                    studentsDuplicated.push(groupCopy)
                }
            })
        }
        else {
            allStudents.forEach((student, index) => {
                for (let i = 0; i < usersToPair; i++) {
                    const studentCopy = { ...student }
                    studentCopy.draggableId = Math.random().toString(36)
                    studentsDuplicated.push(studentCopy)
                }
            })
        }

        groups.push(studentsDuplicated)
        let query = `populate[qualifications][populate][peer_review_qualifications]=id` +
            `&populate[qualifications][populate][user][fields][0]=id` +
            `&populate[qualifications][populate][group][fields][0]=id`

        fetch(`${API}/activities/${activity.id}?${query}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
            .then(({ data }) => {
                const qualificationsAlreadyDone = data.attributes.qualifications.data
                for (let i = 0; i < qualificationsToReview.length; i++) {
                    const group = []
                    const qualificationToReview = qualificationsToReview[i].qualification
                    const find = qualificationsAlreadyDone
                        .filter((qualification) => qualification.attributes.peer_review_qualifications.data?.find((peer) => {
                            return peer.id === qualificationToReview?.id
                        }))

                    if (find.length > 0) {
                        find.forEach((qualification) => {
                            if (activity.attributes.groupActivity) {
                                const group_qualification = studentsDuplicated.find((group) => group.id === qualification.attributes.group.data.id)
                                const studentIndex = studentsDuplicated.findIndex((group) => group.id === qualification.attributes.group.data.id)
                                studentsDuplicated.splice(studentIndex, 1)
                                const activityToReview = qualificationToReview.attributes.activity.data.id
                                const findQualification = group_qualification?.attributes?.qualifications?.data?.find((qualification) => {
                                    return qualification?.attributes?.activity?.data?.id === activityToReview
                                })
                                if (!findQualification) {
                                }
                                if (findQualification) {
                                    group.push({ ...group_qualification, draggableId: Math.random().toString(36) })
                                }
                            }
                            else {
                                const student = studentsDuplicated.find((user) => user.id === qualification.attributes.user.data.id)
                                const studentIndex = studentsDuplicated.findIndex((user) => user.id === qualification.attributes.user.data.id)
                                studentsDuplicated.splice(studentIndex, 1)
                                group.push({ ...student, draggableId: Math.random().toString(36) })
                            }
                        })
                    }
                    groups.push(group)
                }
                if (qualificationsAlreadyDone.length > 0) setButtonTextPeerReview("Update peers")

                const groupWithMoreStudents = qualificationsToReview.find((group) => group.users.length > studentsPerGroup)
                setGroupWithMoreStudents(groupWithMoreStudents)

                setStudents(groups)
                setStudentsToReview(qualificationsToReview)
            })

    }, [allStudents])

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };
    const move = (source, destination, droppableSource, droppableDestination) => {
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const [removed] = sourceClone.splice(droppableSource.index, 1);

        destClone.splice(droppableDestination.index, 0, removed);

        const result = {};
        result[droppableSource.droppableId] = sourceClone;
        result[droppableDestination.droppableId] = destClone;

        return result;
    };
    function onDragEnd(result) {
        const { source, destination, draggableId } = result;
        // dropped outside the list
        // if (activityHasStarted) return message.error("Activity has started, you can't modify the peers")
        if (!destination) {
            return message.error("You can't drop the student outside the list")
        }
        const sInd = +source.droppableId;
        const dInd = +destination.droppableId;
        if (dInd !== 0) {
            const student = students[sInd].find((student) => student.draggableId === draggableId)

            let studentExistInDestination = students[dInd].find((user) => user.id === student.id)
            let studentExist = studentsToReview[dInd - 1].users.find((user) => user.id === student.id)

            let groupExistInDestination = students[dInd].find((group) => group.id === student.id)
            let groupExist = studentsToReview[dInd - 1].users.some((user) => {
                return student?.attributes?.users?.data?.find((student) => {
                    return student.id === user.id
                })
            })
            if (activity.attributes.groupActivity) {
                studentExist = false;
                studentExistInDestination = false;
            }
            else {
                groupExist = false;
                groupExistInDestination = false;
            }

            if (groupExistInDestination) {
                message.error("Group already exists in this group")
                return
            }
            if (groupExist) {
                message.error("Group can't review his own activity")
                return
            }
            if (studentExistInDestination) {
                message.error("Student already exists in this group")
                return
            }
            if (studentExist) {
                message.error("Student can't review his own activity")
                return
            }
        }

        if (sInd === dInd) {
            const items = reorder(students[sInd], source.index, destination.index);
            const newState = [...students];
            newState[sInd] = items;
            setStudents(newState);

        } else {

            const result = move(students[sInd], students[dInd], source, destination);
            const newState = [...students];

            newState[sInd] = result[sInd];
            newState[dInd] = result[dInd];
            setStudents(newState);
        }
    }
    function createGroupsAutomatically() {
        let studentsCopy = [...students]
        // move all students to the first group
        studentsCopy.forEach((group, index) => {
            if (index !== 0) {
                studentsCopy[0] = [...studentsCopy[0], ...group]
                studentsCopy[index] = []
            }
        })
        const studentsToDistribute = studentsCopy[0]
        //shuffle students
        for (let i = studentsToDistribute.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [studentsToDistribute[i], studentsToDistribute[j]] = [studentsToDistribute[j], studentsToDistribute[i]];
        }

        studentsToDistribute.forEach(student => {
            let groupIndex = 1
            while (groupIndex < studentsToReview.length + 1) {
                studentsCopy[groupIndex] = studentsCopy[groupIndex] || []

                let studentExist = studentsToReview[groupIndex - 1].users.find((user) => user.id === student.id)
                let studentExistInDestination = studentsCopy[groupIndex].find((user) => user.id === student.id)
                let groupExistInDestination = studentsCopy[groupIndex].find((group) => group.id === student.id)
                let groupExist = studentsToReview[groupIndex - 1].users.some((user) => {
                    return student?.attributes?.users?.data?.find((student) => {
                        return student.id === user.id
                    })

                })
                if (activity.attributes.groupActivity) {
                    studentExist = false;
                    studentExistInDestination = false;
                }
                else {
                    groupExist = false;
                    groupExistInDestination = false;
                }

                if (studentsCopy[groupIndex].length < usersToPair && !studentExist && !studentExistInDestination && !groupExistInDestination && !groupExist) {
                    studentsCopy[groupIndex].push(student)
                    break
                }
                groupIndex++
            }
        })
        //delete students from the first group that were moved to another group
        studentsCopy[0] = studentsCopy[0].filter((student) => studentsCopy.find((user, index) => {
            if (index === 0) return false
            return user.find((user) => user.draggableId === student.draggableId)
        }) === undefined)

        //distribute students that were left 
        studentsCopy[0].forEach(student => {
            let groupIndex = 1
            while (groupIndex < studentsToReview.length + 1) {
                studentsCopy[groupIndex] = studentsCopy[groupIndex] || []

                const studentExist = studentsToReview[groupIndex - 1].users.find((user) => user.id === student.id)
                const studentExistInDestination = studentsCopy[groupIndex].find((user) => user.id === student.id)
                const groupExistInDestination = studentsCopy[groupIndex].find((group) => group.id === student.id)
                const groupExist = studentsToReview[groupIndex - 1].users.some((user) => {
                    return student?.attributes?.users?.data?.find((student) => {

                        return student.id === user.id
                    })

                })
                if (!studentExist && !studentExistInDestination && !groupExistInDestination && !groupExist) {
                    studentsCopy[groupIndex].push(student)
                    break
                }
                groupIndex++
            }
        })
        studentsCopy[0] = studentsCopy[0].filter((student) => studentsCopy.find((user, index) => {
            if (index === 0) return false
            return user.find((user) => user.draggableId === student.draggableId)
        }) === undefined)
        //sort students by name
        studentsCopy.forEach((group) => {
            group.sort((a, b) => {
                if (a.attributes.name < b.attributes.name) {
                    return -1;
                }
                if (a.attributes.name > b.attributes.name) {
                    return 1;
                }
                return 0;
            })
        })

        setStudents(studentsCopy)
    }

    async function saveGroups() {
        setCreatingGroups(true)
        const peers = students.map((group, index) => {
            if (index === 0) return null
            const data = {
                qualifications: studentsToReview[index - 1].qualification.id,
                activity: +activityId
            }
            if (activity.attributes.groupActivity) {
                data.groups = group.map((group) => group.id)
            } else {
                data.users = group.map((student) => student.id)
            }
            return data
        }).filter(Boolean)
        const response = await fetch(`${API}/create_peers`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({ peers, peerInGroups: activity.attributes.groupActivity, updatedBy: user.id })
            }
        )
        if (response.ok) {
            message.success("Peers created successfully")
        }
        else {
            message.error("Error creating peers")
        }

        setCreatingGroups(false)

    }
    return (
        <>
            <div className='p-10'>
                <div className="-m-5">
                    <BackButton text={"Back to peer reviews"} onClick={() => setCreatePeerReview(false)} />
                </div>
                <h2 className='mt-10 mb-2 text-lg font-medium'>Peer Review </h2>
                <p className='mb-1 text-sm text-gray-700'>Peer review was designed to <b>each student review {usersToPair} activities</b></p>
                <p className='mb-1 text-sm text-gray-700'>Assign students to review each activity</p>

                <div className="flex gap-2 mt-5">
                    <Button
                        className="mb-4"
                        type="primary"
                        disabled={activityHasStarted && false}
                        onClick={createGroupsAutomatically}
                    >
                        Create peers automatically
                    </Button>
                    <Button
                        className="mb-4"
                        type="primary"
                        loading={creatingGroups}
                        disabled={activityHasStarted && false}
                        onClick={saveGroups}>
                        {buttonTextPeerReview}
                    </Button >
                </div>
                {/* disable text for ludmila */}
                {/* {activityHasStarted && <p className="text-xs text-red-500">Activity has started, you can't modify the peers</p>} */}
                <Divider className="mt-2" />
                {!activityToReviewWasInGroups && studentsToReview.length < allStudents.length
                    && <p className="mb-2 text-sm text-red-500">There are students who have not delivered the activity</p>}
                {activityToReviewWasInGroups &&
                    (studentsToReview.length < (groupWithMoreStudents ?
                        Math.floor((allStudents.length) / studentsPerGroup) :
                        Math.ceil((allStudents.length) / studentsPerGroup)))
                    && <p className="mb-2 text-sm text-red-500">There are groups who have not delivered the activity</p>}
                <section>
                    <DragDropContext className="mt-5" onDragEnd={onDragEnd}   >
                        <div className="flex gap-3">
                            {/* forzar activacion  */}
                            <StrictModeDroppable key={0} droppableId={`${0}`} isDropDisabled={activityHasStarted && false} >
                                {(provided) => (
                                    <section className={`flex flex-col gap-2 p-2 sticky}`}>
                                        {
                                            activity.attributes.groupActivity ?
                                                <p>Groups</p>
                                                : <p>Students</p>
                                        }
                                        <ul className={`flex flex-col gap-y-4 w-[300px] min-h-[200px] bg-white rounded-lg p-2 overflow-x-clip`}
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}>
                                            {
                                                students.length > 0 && students[0].map((student, index) => {
                                                    if (activity.attributes.groupActivity) {
                                                        return (
                                                            <Draggable key={student.draggableId} draggableId={student.draggableId} index={index}>
                                                                {(provided) => (
                                                                    <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                                                        className="p-2 shadow-md list-none active::cursor-grabbing bg-white  w-[280px] overflow-x-clip rounded-lg ">
                                                                        <article className='flex flex-col h-full gap-y-2 '>
                                                                            {
                                                                                student.attributes.users.data.map((user, index) => {
                                                                                    return (
                                                                                        <section className="flex">
                                                                                            <img alt='profile student' className="w-6 h-6 rounded-full"
                                                                                                src={user?.attributes?.profile_photo?.data?.attributes?.url} />
                                                                                            <div className="pl-3 text-left">
                                                                                                <p className="text-sm font-semibold">{user?.attributes.name}</p>
                                                                                                <p className="text-xs font-normal text-gray-500">{user?.attributes.email}</p>
                                                                                            </div>

                                                                                        </section>
                                                                                    )
                                                                                })
                                                                            }

                                                                        </article>
                                                                    </li>
                                                                )}
                                                            </Draggable>
                                                        )
                                                    }
                                                    return (
                                                        <Draggable key={student.draggableId} draggableId={student.draggableId} index={index}>
                                                            {(provided) => (
                                                                <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                                                    className="p-2 shadow-md list-none active::cursor-grabbing bg-white  w-[280px] overflow-x-clip rounded-lg ">
                                                                    <article className='flex items-center h-full '>
                                                                        <img alt='profile student' className="w-6 h-6 rounded-full"
                                                                            src={student?.attributes?.profile_photo?.data?.attributes?.url} />
                                                                        <div className="pl-3 text-left">
                                                                            <p className="text-sm font-semibold">{student?.attributes.name}</p>
                                                                            <p className="text-xs font-normal text-gray-500">{student?.attributes.email}</p>
                                                                        </div>
                                                                    </article>
                                                                </li>
                                                            )}
                                                        </Draggable>
                                                    )
                                                })
                                            }
                                            {provided.placeholder}

                                        </ul>
                                    </section>
                                )}
                            </StrictModeDroppable>
                            <section>
                                {studentsToReview.length === 0 && <p className="text-sm text-red-500">No students to review</p>}
                                {studentsToReview.length === 0 && <p className="text-sm text-red-500">No students have submitted the activity</p>}
                            </section>
                            <section className="flex flex-wrap max-w-[100%] h-fit gap-3 mt-2">
                                {
                                    studentsToReview.map((student, index) => {
                                        return (
                                            <section className="flex flex-col gap-y-2">
                                                <p className="text-sm text-gray-700">Activity done by </p>
                                                <ul style={{ minHeight: height }} className="bg-white rounded-lg">
                                                    {
                                                        student.users.map((user, index) => {
                                                            return <li key={user.id} className={`p-2 list-none w-[300px] overflow-x-clip `}>
                                                                <article className='flex items-center h-full '>
                                                                    <img alt='profile student' className="w-6 h-6 rounded-full"
                                                                        src={user?.attributes?.profile_photo?.data?.attributes?.url} />
                                                                    <div className="pl-3 text-left">
                                                                        <p className="text-sm font-semibold">{user?.attributes.name}</p>
                                                                        <p className="text-xs font-normal text-gray-500">{user?.attributes.email}</p>
                                                                    </div>
                                                                </article>
                                                            </li>
                                                        })
                                                    }
                                                </ul>
                                                {
                                                    activity.attributes.groupActivity ?
                                                        <p className="text-sm text-gray-700">Group who are going to review</p>
                                                        : <p className="text-sm text-gray-700">Users who are going to review</p>
                                                }
                                                {/* forzar activacion */}
                                                <StrictModeDroppable key={index + 1} droppableId={`${index + 1}`} isDropDisabled={activityHasStarted && false}>
                                                    {(provided) => (
                                                        <ul className={`flex flex-col gap-y-4 w-[300px] min-h-[200px] bg-white rounded-lg p-2 overflow-x-clip`}
                                                            {...provided.droppableProps}
                                                            ref={provided.innerRef}>
                                                            {
                                                                students.length > 0 && students[index + 1].map((student, index) => {
                                                                    if (activity.attributes.groupActivity) {
                                                                        return (
                                                                            <Draggable key={student.draggableId} draggableId={student.draggableId} index={index}>
                                                                                {(provided) => (
                                                                                    <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                                                                        className="p-2 shadow-md list-none active::cursor-grabbing bg-white  w-[280px] overflow-x-clip rounded-lg ">
                                                                                        <article className='flex flex-col h-full gap-y-2 '>
                                                                                            {
                                                                                                student.attributes.users.data.map((user, index) => {
                                                                                                    return (
                                                                                                        <section className="flex">
                                                                                                            <img alt='profile student' className="w-6 h-6 rounded-full"
                                                                                                                src={user?.attributes?.profile_photo?.data?.attributes?.url} />
                                                                                                            <div className="pl-3 text-left">
                                                                                                                <p className="text-sm font-semibold">{user?.attributes.name}</p>
                                                                                                                <p className="text-xs font-normal text-gray-500">{user?.attributes.email}</p>
                                                                                                            </div>

                                                                                                        </section>
                                                                                                    )
                                                                                                })
                                                                                            }

                                                                                        </article>
                                                                                    </li>
                                                                                )}
                                                                            </Draggable>
                                                                        )
                                                                    }
                                                                    return (
                                                                        <Draggable key={student.draggableId} draggableId={student.draggableId} index={index}>
                                                                            {(provided) => (
                                                                                <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                                                                    className="p-2 shadow-md list-none active::cursor-grabbing bg-white  w-[280px] overflow-x-clip rounded-lg ">
                                                                                    <article className='flex items-center h-full '>
                                                                                        <img alt='profile student' className="w-6 h-6 rounded-full"
                                                                                            src={student?.attributes?.profile_photo?.data?.attributes?.url} />
                                                                                        <div className="pl-3 text-left">
                                                                                            <p className="text-sm font-semibold">{student?.attributes.name}</p>
                                                                                            <p className="text-xs font-normal text-gray-500">{student?.attributes.email}</p>
                                                                                        </div>
                                                                                    </article>
                                                                                </li>
                                                                            )}
                                                                        </Draggable>
                                                                    )
                                                                })
                                                            }
                                                            {provided.placeholder}

                                                        </ul>
                                                    )}
                                                </StrictModeDroppable>
                                            </section>
                                        )
                                    })
                                }
                            </section>
                        </div>
                    </DragDropContext>
                </section >
            </div>
        </>
    )
}

export default CreatePeers