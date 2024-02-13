import { useEffect, useState } from "react"
import { fetchUserInformationComplete } from "../../../../../fetches/fetchUsersFromCourse"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "antd";
import { set } from "date-fns";


function CreateGroups({ activityId, courseId, activityData }) {
    const [students, setStudents] = useState([])
    const numberOfStudentsPerGroup = activityData.activity.data.attributes.numberOfStudentsperGroup
    const [totalStudents, setTotalStudents] = useState(0)
    useEffect(() => {
        async function fetchUsersFromCourse() {

            try {
                const data = await fetchUserInformationComplete({ courseId })
                //create array of arrays empty to fill with students
                let groups = []
                groups.push(data.data.attributes.students.data)
                setTotalStudents(data.data.attributes.students.data.length)
                for (let i = 0; i < Math.ceil(data.data.attributes.students.data.length / numberOfStudentsPerGroup); i++) {
                    groups.push([])
                }
                setStudents(groups)
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
        setStudents(studentsCopy)
    }


    return (
        <section>
            <div className="flex gap-2">
                <Button
                    className="mb-4"
                    type="primary"
                    onClick={() => {
                        setStudents([...students, []]);
                    }}
                >
                    Add new group
                </Button>
                <Button
                    className="mb-4"
                    danger
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
                    onClick={createGroupsAutomatically}
                >
                    Create groups automatically
                </Button>
                <Button
                    className="mb-4"
                    type="primary"
                    onClick={() => { console.log(students) }}>
                    Save groups
                </Button >
            </div>
            <h2>Activity was created to have {numberOfStudentsPerGroup} students per group</h2>
            <DragDropContext onDragEnd={onDragEnd} >

                <div className="flex flex-wrap max-w-[100%] gap-y-3">
                    {
                        students.map((group, index) => {
                            return (
                                <Droppable key={index} droppableId={`${index}`}>
                                    {(provided) => (
                                        <article className="flex flex-col gap-2 p-2">
                                            {
                                                index === 0 ?
                                                    <p>Students</p> :
                                                    <p>Group {index}</p>
                                            }
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
                                                                                src={student?.attributes.profile_photo.data.attributes.url} />
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
                                </Droppable>
                            )
                        })
                    }
                </div>
            </DragDropContext>
        </section >

    )
}

export default CreateGroups