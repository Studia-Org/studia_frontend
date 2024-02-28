import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "../CreateGroups"
import { BackButton } from '../BackToCourse'
import { useEffect, useState } from "react";
import { Divider } from "antd";




function CreatePeers({ students: allStudents, setCreatePeerReview, activityToReview }) {

    const [students, setStudents] = useState([])
    const [studentsToReview, setStudentsToReview] = useState([])
    const activityToReviewWasInGroups = activityToReview?.attributes?.groupActivity
    const studentsPerGroup = activityToReview?.attributes?.numberOfStudentsperGroup
    const height = studentsPerGroup * 52 + "px"
    useEffect(() => {
        const added = []

        const qualificationsToReview = allStudents.map((student) => {
            const studentQualification = !activityToReviewWasInGroups ?
                student.attributes.qualifications.data
                    .find((qualification) => qualification.attributes.activity?.data.id === activityToReview.id)
                : student.attributes.groups?.data?.find((group) =>
                    group.attributes.activity?.data.id === activityToReview.id
                )
            if (activityToReviewWasInGroups) {
                // check if qualification has already been created
                if (studentQualification && !added.includes(studentQualification.id)) {
                    added.push(studentQualification.id)
                    // add profile photo to the user
                    studentQualification.attributes.users.data = studentQualification.attributes.users.data.map((user) => {
                        if (user.id === student.id) user.attributes.profile_photo = student.attributes.profile_photo
                        else user.attributes.profile_photo = allStudents.find((student) => student.id === user.id).attributes.profile_photo
                        return user
                    })

                    return {
                        qualification: studentQualification.attributes.qualification.data,
                        users: studentQualification.attributes.users.data.map((user) => user)
                    }
                }
            }
        }).filter(Boolean)
        const groups = []
        groups.push(allStudents)
        for (let i = 0; i < qualificationsToReview.length; i++) {
            groups.push([])
        }
        setStudents(groups)
        setStudentsToReview(qualificationsToReview)


    }, [allStudents])


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

    return (
        <div className='p-5'>
            <BackButton text={"Back to peer reviews"} onClick={() => setCreatePeerReview(false)} />
            <h2 className='mt-10 mb-2 text-lg font-medium'>Peer Review </h2>
            <p className='mb-1 text-sm text-gray-700'>Peer review was designed to be reviewed by {studentsPerGroup} students each activity</p>
            <p className='mb-1 text-sm text-gray-700'>Assign students to review each activity</p>

            <Divider />
            <section>
                <DragDropContext className="mt-5" onDragEnd={onDragEnd}  >
                    <div className="flex gap-3">
                        <StrictModeDroppable key={0} droppableId={`${0}`} >
                            {(provided) => (
                                <section className={`flex flex-col gap-2 p-2 sticky}`}>
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
                                </section>
                            )}
                        </StrictModeDroppable>
                        <section className="flex flex-wrap max-w-[100%] h-fit gap-3 mt-2">
                            {
                                studentsToReview.map((student, index) => {
                                    return (
                                        <section className="flex flex-col gap-y-2">
                                            <p className="text-sm text-gray-700">Activity from </p>
                                            <ul style={{ height: height }} className="bg-white rounded-lg">
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
                                            <p className="text-sm text-gray-700">Users who are going to review</p>
                                            <StrictModeDroppable key={index + 1} droppableId={`${index + 1}`}>
                                                {(provided) => (
                                                    <ul className={`flex flex-col gap-y-4 w-[300px] min-h-[200px] bg-white rounded-lg p-2 overflow-x-clip`}
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}>
                                                        {
                                                            students.length > 0 && students[index + 1].map((student, index) => {
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
    )
}

export default CreatePeers