import { useEffect, useState } from "react"
import { fetchUsersInformationComplete } from "../../../../../fetches/fetchUsersFromCourse"
import { fetchActivityHasGroups } from "../../../../../fetches/fetchActivityGroups.js"
import { fetchCreateGroups } from "../../../../../fetches/fetchCreateGroups.js"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button, Divider, Modal, message } from "antd";
import { MoonLoader } from "react-spinners";
import { UploadFiles } from "../../CreateCourses/CourseSections/UploadFiles.jsx";
import Papa from 'papaparse';
import csvIMG from '../../../../../assets/csvgroups.png'
import { Trans, useTranslation } from "react-i18next";
function CreateGroups({ activityId, courseId, activityData }) {
    const { t } = useTranslation()
    const [students, setStudents] = useState([])
    const numberOfStudentsPerGroup = activityData.activity.data.attributes.numberOfStudentsperGroup
    const [totalStudents, setTotalStudents] = useState(0)
    const [loading, setLoading] = useState(true)
    const [creatingGroups, setCreatingGroups] = useState(false)
    const [activityHasStarted] = useState(new Date(activityData.activity.data.attributes.start_date) < new Date())
    const [files, setFiles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [textSaveGroups, setTextSaveGroups] = useState(t("ACTIVITY.create_groups.save_groups"))
    const [isEditing, setIsEditing] = useState(null)
    const [tempName, setTempName] = useState(null)

    useEffect(() => {
        async function fetchUsersFromCourse() {

            try {
                const data = await fetchUsersInformationComplete({ courseId })
                const dataGroups = await fetchActivityHasGroups({ activityId })
                let groups = []
                setTotalStudents(data.data.attributes.students.data.length)
                if (dataGroups.length > 0) {
                    setTextSaveGroups(t("ACTIVITY.create_groups.update_groups"))
                    groups.push([])
                    dataGroups.forEach(group => {
                        //transfrom id into strings
                        group.attributes.users.data.forEach(user => {
                            user.id = user.id.toString()
                        })
                        if (group?.attributes?.GroupName) group.attributes.users.data.push({ groupId: group.id, GroupName: group.attributes.GroupName })
                        else group.attributes.users.data.push({ groupId: group.id })

                        groups.push(group.attributes.users.data)

                    })
                    //check if there are students without group
                    const studentsWithoutGroup = data.data.attributes.students.data
                        .filter(student => !groups.flat().some(group => +group.id === student.id))
                    groups[0] = studentsWithoutGroup
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
        // if (!destination && activityHasStarted) {
        //     message.error("Activity has started, you can't modify the groups")
        //     return
        // }

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
        //remove last element of each group if its a groupId
        studentsCopy = studentsCopy.map(group => {
            if (group.length > 0 && group[group.length - 1].groupId) {
                group.pop()
            }
            return group
        })
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
        // if (students[0].length !== 0) return message.error("There are students without group")
        // check if groups are balanced
        const groupsBalanced = students.slice(1).every(group => group.length === numberOfStudentsPerGroup)
        const groupsWithMoreStudents = students.slice(1).filter(group => group.length > numberOfStudentsPerGroup)
        const groupsWithLessStudents = students.slice(1).filter(group => group.length < numberOfStudentsPerGroup)

        // if (!groupsBalanced && (groupsWithLessStudents.length > 0 && groupsWithMoreStudents.length > 0)) {
        //     return message.error("Groups are not balanced")
        // }
        //check if there are empty groups
        const emptyGroups = students.slice(1).find(group => group.length === 0 || group.length === 1)
        if (emptyGroups && emptyGroups.length === 1 && emptyGroups[0].groupId) {
            return message.error(t("ACTIVITY.create_groups.empty_groups"))
        }
        if (emptyGroups && emptyGroups.length === 0) {
            return message.error(t("ACTIVITY.create_groups.empty_groups"))
        }
        try {

            setCreatingGroups(true)
            const groups = students.slice(1)

            const response = await fetchCreateGroups({ activityId, groups })

            if (response.response.status === 200) {
                message.success(t("ACTIVITY.create_groups.save_success"))
            } else {
                throw new Error(t("ACTIVITY.create_groups.save_error"))
            }
        }
        catch (error) {
            message.error(error.message)
        }
        finally {
            setCreatingGroups(false)
        }
    }
    const uploadCSV = async () => {
        setLoadingModal(true);
        if (files.length === 0) {
            message.error(t("ACTIVITY.create_groups.no_file_selected"));
            setLoading(false);
            return;
        }
        const file = files[0].originFileObj;
        const allStudents = students.flat()
        //delete groupID from students
        const groups = {}
        try {
            await new Promise((resolve, reject) => {
                Papa.parse(file, {
                    complete: function (results) {
                        try {
                            for (let i = 0; i < results.data.length; i++) {
                                var expresionRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                if (expresionRegular.test(results.data[i][0])) {
                                    const student = allStudents.find(student => student?.attributes?.email === results.data[i][0])
                                    if (student) {
                                        student.id = student.id.toString()
                                        groups[results.data[i][1]] = [...groups[results.data[i][1]] || [], student]
                                    }
                                }
                            }
                            setLoadingModal(false);
                            const arrGroups = Object.values(groups)
                            arrGroups.forEach((group, index) => {
                                group.push({ GroupName: Object.keys(groups)[index] })
                            })
                            const studentsWithoutGroup = allStudents.filter(student => !arrGroups.flat().some(group => group.id === student?.id))
                            const studentsWithouGroupIds = studentsWithoutGroup.map(student => {
                                if (student.groupId) return null
                                return student
                            }).filter(Boolean)
                            arrGroups.unshift(studentsWithouGroupIds)
                            setStudents(arrGroups)
                            setIsModalOpen(false);
                            message.success(t("ACTIVITY.create_groups.participants_imported"));
                            resolve();
                        } catch (error) {
                            setLoadingModal(false);
                            message.error(t("ACTIVITY.create_groups.participants_imported_error"));
                            reject();
                        }
                    }
                });
            });
        } catch (error) {
            message.error(t("ACTIVITY.create_groups.participants_imported_error"));
            setLoadingModal(false);
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
                    disabled={false}
                    onClick={() => {
                        setStudents([...students, []]);
                    }}
                >
                    {t("ACTIVITY.create_groups.add_new_group")}
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
                            //remove groupid from last element if it has one
                            copyStudents[copyStudents.length - 1] = copyStudents[copyStudents.length - 1].filter(student => !student.groupId)
                            const newGroup = [...copyStudents[0], ...copyStudents[copyStudents.length - 1]]
                            copyStudents[0] = newGroup
                            copyStudents.pop()
                            setStudents(copyStudents)
                        }
                        else {
                            setStudents(students.slice(0, students.length - 1));
                        }
                    }}>
                    {t("ACTIVITY.create_groups.delete_last_group")}
                </Button>
                <Button
                    className="mb-4"
                    type="primary"
                    disabled={activityHasStarted}
                    onClick={createGroupsAutomatically}
                >
                    {t("ACTIVITY.create_groups.create_groups_auto")}
                </Button>
                <Button
                    type="default"
                    className="inline-flex items-center gap-2 bg-gray-200"
                    disabled={activityHasStarted}
                    onClick={() => setIsModalOpen(true)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M4 2a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5V6.621a1.5 1.5 0 0 0-.44-1.06L9.94 2.439A1.5 1.5 0 0 0 8.878 2H4Zm4 9.5a.75.75 0 0 1-.75-.75V8.06l-.72.72a.75.75 0 0 1-1.06-1.06l2-2a.75.75 0 0 1 1.06 0l2 2a.75.75 0 1 1-1.06 1.06l-.72-.72v2.69a.75.75 0 0 1-.75.75Z" clipRule="evenodd" />
                    </svg>
                    <span>{t("ACTIVITY.create_groups.import_from_csv")}</span>
                </Button>
                <Modal title={t("ACTIVITY.create_groups.import_groups_from_csv")} open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    footer={[
                        <Button onClick={() => setIsModalOpen(false)} className='bg-gray-200'>
                            {t("COMMON.cancel")}
                        </Button>,
                        <Button type="primary" loading={loadingModal} onClick={uploadCSV}>
                            {t("COMMON.import")}
                        </Button>
                    ]}
                >
                    <p>{t("ACTIVITY.create_groups.please_upload_csv")}</p>
                    <ol className='mb-5 ml-10 list-disc'>
                        <li>{t("ACTIVITY.create_groups.column1")}</li>
                        <li>{t("ACTIVITY.create_groups.column2")}</li>
                    </ol>
                    <p>{t("COMMON.for_example")}</p>
                    <img className='my-3 max-h-[450px]' src={csvIMG} alt="" />
                    <UploadFiles fileList={files} accept={'.csv'} setFileList={setFiles} listType={'picture'} maxCount={1} />
                </Modal>
                <Button
                    className="mb-4"
                    type="primary"
                    loading={creatingGroups}
                    onClick={saveGroups}>
                    {textSaveGroups}
                </Button >

            </div>
            {/* //force enabled for ludmila course  */}
            {/* {activityHasStarted && <p className="text-xs text-red-500">Activity has started, you can't modify the groups</p>} */}
            <Divider className="mt-0" />
            <h2> <Trans i18nKey="ACTIVITY.create_groups.activity_created_for" components={{ numberOfStudentsPerGroup }} /></h2>
            {activityHasStarted && <small className="mb-0 text-red-500 ">{t("ACTIVITY.create_groups.when_activity_started")}</small>}
            <Divider />
            <DragDropContext className="mt-5" onDragEnd={onDragEnd}  >
                <div className="flex gap-y-3">
                    {/* //force enabled for ludmila course  */}
                    <StrictModeDroppable key={0} droppableId={`${0}`} isDropDisabled={activityHasStarted && false}>
                        {(provided) => (
                            <article className={`flex flex-col gap-2 p-2 sticky}`}>
                                <p>{t("ACTIVITY.create_groups.students")}</p>
                                <ul className={`flex flex-col gap-y-4 w-[300px] min-h-[200px] bg-white rounded-lg p-2 overflow-x-clip border`}
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
                                    //force enabled for ludmila course 
                                    <StrictModeDroppable key={index} droppableId={`${index}`} isDropDisabled={activityHasStarted && false}>
                                        {(provided) => (
                                            <article className={`flex flex-col gap-2 p-2 `}>
                                                {
                                                    isEditing === index ?
                                                        <label className="flex items-center gap-x-2">
                                                            <input
                                                                type="text"
                                                                defaultValue={group[group.length - 1]?.GroupName || "Group " + index}
                                                                onChange={(e) => { setTempName(e.target.value) }}
                                                                autoFocus
                                                                className="px-2 py-1 mr-2 border rounded"
                                                            />
                                                            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="green"
                                                                onClick={
                                                                    () => {
                                                                        const copyStudents = [...students]
                                                                        //try if not addd
                                                                        if (copyStudents[index][copyStudents[index].length - 1]) copyStudents[index][copyStudents[index].length - 1].GroupName = tempName
                                                                        else copyStudents[index].push({ GroupName: tempName })
                                                                        setStudents(copyStudents)
                                                                        setIsEditing(null)
                                                                        setTempName(null)
                                                                    }
                                                                }
                                                                className="p-1 bg-gray-200 rounded-md cursor-pointer w-7 h-7 hover:bg-gray-300 hover:scale-110">
                                                                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                            </svg>
                                                            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" onClick={() => { setIsEditing(null); setTempName(null) }}
                                                                className="p-1 bg-gray-200 rounded-md cursor-pointer w-7 h-7 hover:bg-gray-300 hover:scale-110">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                            </svg>
                                                        </label>
                                                        :
                                                        <p className="flex items-center cursor-pointer" onClick={() => setIsEditing(index)}>
                                                            {group[group.length - 1]?.GroupName || t("ACTIVITY.create_groups.group") + " " + index}
                                                            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4 ml-2 inline-block">
                                                                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                            </svg>
                                                        </p>
                                                }
                                                <ul className={`flex flex-col gap-y-2 w-[300px] min-h-[200px] bg-white rounded-lg p-2 overflow-x-clip border`}
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}>
                                                    {
                                                        group.map((student, index) => {
                                                            if (student.groupId || student.GroupName) return null
                                                            return (
                                                                <Draggable key={student.id} draggableId={student.id.toString()} index={index}>
                                                                    {(provided) => (
                                                                        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                                                            className="p-2 border list-none active::cursor-grabbing bg-white  w-[280px] overflow-x-clip rounded-lg ">
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


