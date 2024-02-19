import { useEffect, useState } from "react"
import { fetchUsersInformationComplete } from "../../../../../fetches/fetchUsersFromCourse"
import { fetchActivityHasGroups } from "../../../../../fetches/fetchActivityGroups.js"
import { fetchCreateGroups } from "../../../../../fetches/fetchCreateGroups.js"

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button, Divider, message } from "antd";
import { MoonLoader } from "react-spinners";

function CreateGroups({ activityId, courseId, activityData }) {
    const [students, setStudents] = useState([])
    // const numberOfStudentsPerGroup = activityData.activity.data.attributes.numberOfStudentsperGroup
    const numberOfStudentsPerGroup = 3
    const [totalStudents, setTotalStudents] = useState(0)
    const [loading, setLoading] = useState(true)
    const [creatingGroups, setCreatingGroups] = useState(false)
    const [activityHasStarted] = useState(new Date(activityData.activity.data.attributes.start_date) < new Date())

    useEffect(() => {
        async function fetchUsersFromCourse() {

            try {
                const data = await fetchUsersInformationComplete({ courseId })
                const dataGroups = await fetchActivityHasGroups({ activityId })
                //create array of arrays empty to fill with students
                let groups = []
                setTotalStudents(data.data.attributes.students.data.length)
                if (dataGroups.length > 0) {
                    groups.push([])
                    dataGroups.forEach(group => {
                        //transfrom id into strings
                        group.attributes.users.data.forEach(user => {
                            user.id = user.id.toString()
                        })
                        groups.push(group.attributes.users.data)
                    })
                }
                else {
                    groups.push(data.data.attributes.students.data)
                    for (let i = 0; i < Math.ceil(data.data.attributes.students.data.length / numberOfStudentsPerGroup); i++) {
                        groups.push([])
                    }
                }
                setStudents(groups)
                setLoading(false)
            } catch (error) {
                console.error(error)
            }
        }
        fetchUsersFromCourse()
    }, [])

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        console.log(result)
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
        const { source, destination } = result;
        if (!destination && activityHasStarted) {
            message.error("Activity has started, you can't modify the groups")
            return
        }

        // dropped outside the list
        if (!destination) {
            return;
        }
        const sInd = +source.droppableId;
        const dInd = +destination.droppableId;

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
            while (groupIndex <= Math.ceil(totalStudents / numberOfStudentsPerGroup)) {
                studentsCopy[groupIndex] = studentsCopy[groupIndex] || []

                if (studentsCopy[groupIndex].length < numberOfStudentsPerGroup) {
                    studentsCopy[groupIndex].push(student)
                    break
                }
                groupIndex++
            }
        })
        studentsCopy[0] = []
        if (studentsCopy[studentsCopy.length - 1].length <= numberOfStudentsPerGroup / 2) {
            const studentsToDistribute = studentsCopy[studentsCopy.length - 1]
            studentsToDistribute.forEach(student => {
                let groupIndex = 1
                studentsCopy[groupIndex].push(student)
                groupIndex++
            })
            studentsCopy.pop()
        }
        setStudents(studentsCopy)
    }

    async function saveGroups() {
        //save groups in the backend
        //fetch to update groups
        if (students[0].length !== 0) return message.error("There are students without group")
        // check if groups are balanced
        const groupsBalanced = students.slice(1).every(group => group.length === numberOfStudentsPerGroup)
        const groupsWithMoreStudents = students.slice(1).filter(group => group.length > numberOfStudentsPerGroup)
        const groupsWithLessStudents = students.slice(1).filter(group => group.length < numberOfStudentsPerGroup)

        if (!groupsBalanced && (groupsWithLessStudents.length > 0 && groupsWithMoreStudents.length > 0)) {
            return message.error("Groups are not balanced")
        }
        try {

            setCreatingGroups(true)
            const groups = students.slice(1)

            const response = await fetchCreateGroups({ activityId, groups })

            if (response.response.status === 200) {
                message.success("Groups saved successfully")
            } else {
                throw new Error("Error saving groups")
            }
        }
        catch (error) {
            message.error(error.message)
        }
        finally {
            setCreatingGroups(false)
        }
    }
    return (loading ?
        <div className="flex items-center justify-center flex-1 w-full min-h-[200px] lg:min-h-[500px] h-full">
            <MoonLoader color="#1E40AF" size={80} />
        </div>
        :
        <section>
            <div className="flex gap-2">
                <Button
                    className="mb-4"
                    type="primary"
                    disabled={activityHasStarted}
                    onClick={() => {
                        setStudents([...students, []]);
                    }}
                >
                    Add new group
                </Button>
                <Button
                    className="mb-4"
                    danger
                    disabled={activityHasStarted}
                    onClick={() => {
                        //check if there are students in the group
                        if (students.length === 1) return
                        if (students[students.length - 1].length > 0) {
                            const copyStudents = [...students]
                            const newGroup = [...copyStudents[0], ...copyStudents[copyStudents.length - 1]]
                            copyStudents[0] = newGroup
                            copyStudents.pop()
                            setStudents(copyStudents)
                        }
                        else {
                            setStudents(students.slice(0, students.length - 1));
                        }
                    }}>
                    Delete last group
                </Button>
                <Button
                    className="mb-4"
                    type="primary"
                    disabled={activityHasStarted}
                    onClick={createGroupsAutomatically}
                >
                    Create groups automatically
                </Button>
                <Button
                    className="mb-4"
                    type="primary"
                    loading={creatingGroups}
                    disabled={activityHasStarted}
                    onClick={saveGroups}>
                    Save groups
                </Button >
            </div>
            {activityHasStarted && <p className="text-xs text-red-500">Activity has started, you can't modify the groups</p>}
            <Divider className="mt-1" />
            <h2> Activity was created to have {numberOfStudentsPerGroup} students per group</h2>
            <Divider />
            <DragDropContext className="mt-5" onDragEnd={onDragEnd}  >
                <div className="flex gap-y-3">
                    <StrictModeDroppable key={0} droppableId={`${0}`} isDropDisabled={activityHasStarted}>
                        {(provided) => (
                            <article className={`flex flex-col gap-2 p-2 sticky}`}>
                                <p>Students</p>
                                <ul className={`flex flex-col gap-y-4 w-[300px] min-h-[200px] bg-white rounded-lg p-2 overflow-x-clip`}
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}>
                                    {
                                        students.length > 0 && students[0].map((student, index) => {
                                            return (
                                                <Draggable key={student.id} draggableId={student.id.toString()} index={index}>
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
                            </article>
                        )}
                    </StrictModeDroppable>
                    <div className="flex flex-wrap max-w-[100%] h-fit gap-y-3">
                        {
                            students.map((group, index) => {
                                if (index === 0) return null
                                return (
                                    <StrictModeDroppable key={index} droppableId={`${index}`} isDropDisabled={activityHasStarted}>
                                        {(provided) => (
                                            <article className={`flex flex-col gap-2 p-2 `}>
                                                <p>Group {index}</p>
                                                <ul className={`flex flex-col gap-y-4 w-[300px] min-h-[200px] bg-white rounded-lg p-2 overflow-x-clip`}
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}>
                                                    {
                                                        group.map((student, index) => {
                                                            return (
                                                                <Draggable key={student.id} draggableId={student.id.toString()} index={index}>
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
                                            </article>
                                        )}
                                    </StrictModeDroppable>
                                )
                            })
                        }
                    </div>
                </div>
            </DragDropContext>
        </section >

    )
}

export default CreateGroups




export const StrictModeDroppable = ({ children, ...props }) => {
    const [enabled, setEnabled] = useState(false);
    useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, []);
    if (!enabled) {
        return null;
    }
    return <Droppable {...props}>{children}</Droppable>;
};


