import React, { useEffect, useState } from 'react'
import { SubsectionList } from './EditSection/SubsectionList';
import { Button, Divider, Empty, Input, InputNumber, Popconfirm, Select, Space, message } from 'antd';
import { getToken } from '../../../../helpers';
import { API } from '../../../../constant';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { SubsectionItems } from '../CreateCourses/CourseSections/SubsectionItems';
import { useCourseContext } from '../../../../context/CourseContext';
import { PeerReviewRubricModal } from '../CreateCourses/CourseSections/PeerReviewRubricModal';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@ant-design/icons';
import { sub } from 'date-fns';


export const EditSection = ({ setEditSectionFlag, sectionToEdit, setSectionToEdit }) => {

    const [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [sectionToEditTemp, setSectionToEditTemp] = useState(sectionToEdit);
    const [subsectionToEdit, setEditSubsection] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGroup, setIsGroup] = useState(false);
    const [items, setItems] = useState([1, 2, 3]);
    const [name, setName] = useState('');
    const inputRef = React.useRef();
    const { t } = useTranslation();
    const filteredSubsections = sectionToEditTemp?.attributes?.subsections?.data?.filter((sub) => sub?.attributes?.activity?.data?.attributes?.type?.toLowerCase() === 'task' ||
        sub?.attributes?.type?.toLowerCase() === 'task')
    const { setCourse } = useCourseContext();

    useEffect(() => {
        if (sectionToEditTemp !== sectionToEdit) {
            setDisabled(false);
        }
    }, [sectionToEditTemp, sectionToEdit])

    useEffect(() => {
        const peerReviewSubsection = sectionToEditTemp?.attributes?.subsections?.data?.find(
            (subsection) => {
                return subsection.attributes.activity?.type === 'peerReview' &&
                    subsection.attributes.activity?.task_to_review == null
            })
        if (peerReviewSubsection) {
            setEditSubsection(peerReviewSubsection);
            setDisabled(true);
        }
        else {
            setEditSubsection(null);
        }

    }, [sectionToEditTemp])

    if (sectionToEdit?.attributes?.subsections?.data?.length === 0) {
        return (
            <div>
                <button className='flex items-center mt-5 text-sm duration-150 hover:-translate-x-1 ' onClick={() => { setEditSectionFlag(false); setSectionToEdit(null) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                    </svg>
                    <p className='ml-1'>Go back to course</p>
                </button>
                We currently don't support creating new sections. Please contact us for more information.
            </div>
        )
    }
    const isValidMove = (subsections, oldIndex, newIndex) => {
        const movedSubsection = subsections[oldIndex].attributes;
        if (newIndex < 0 || newIndex >= subsections.length) {
            return false;
        }

        const validFasesOrder = ['forethought', 'performance', 'self-reflection'];
        const currentFase = movedSubsection.fase;
        const targetFase = subsections[newIndex].attributes.fase;
        const currentIndex = validFasesOrder.indexOf(currentFase);
        const targetIndex = validFasesOrder.indexOf(targetFase);

        if (currentIndex < targetIndex && newIndex !== targetIndex - 1) {
            return false;
        }

        if (currentIndex > targetIndex && newIndex !== targetIndex + 1) {
            return false;
        }

        if (currentFase === 'self-reflection' && (targetFase === 'forethought' || targetFase === 'performance')) {
            return false;
        }

        if (currentFase === 'performance' && targetFase === 'forethought') {
            return false;
        }

        return true;
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        try {
            if (active.id !== over.id) {
                const oldIndex = sectionToEditTemp.attributes.subsections.data.findIndex(c => c.id === active.id);
                const newIndex = sectionToEditTemp.attributes.subsections.data.findIndex(c => c.id === over.id);
                if (isValidMove(sectionToEditTemp.attributes.subsections.data, oldIndex, newIndex)) {
                    setSectionToEditTemp((prev) => {
                        const newSubsections = arrayMove(prev.attributes.subsections.data, oldIndex, newIndex);
                        return {
                            ...prev,
                            attributes: {
                                ...prev.attributes,
                                subsections: {
                                    data: newSubsections,
                                },
                            },
                        };
                    });
                }
            }
        } catch (error) {
            message.error(error.message);
        }
    }
    const checkIfSectionHadReorder = () => {
        return sectionToEdit.attributes.subsections.data.some(
            (subsection, index) => subsection?.id !== sectionToEditTemp.attributes.subsections.data[index].id
        );
    }


    const saveChanges = async () => {
        setLoading(true);
        const addedSubsections = sectionToEditTemp.attributes.subsections.data.filter(
            (tempSubsection) =>
                !sectionToEdit.attributes.subsections.data.some(
                    (originalSubsection) => originalSubsection.id === tempSubsection.id
                )
        );

        const deletedSubsections = sectionToEdit.attributes.subsections.data.filter(
            (originalSubsection) =>
                !sectionToEditTemp.attributes.subsections.data.some(
                    (tempSubsection) => tempSubsection.id === originalSubsection.id
                )
        );
        let newSubsectionTemp = []
        const listsubsections = {}
        await Promise.all([
            // Eliminar subsections
            Promise.all(
                //delete activities, questionnaires and subsections

                deletedSubsections.map(async (subSection) => {
                    if (subSection.attributes.activity) {
                        await fetch(`${API}/activities/${subSection.attributes.activity.data.id}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${getToken()}`,
                            },
                        });
                    }
                    if (subSection.attributes.questionnaire && subSection.attributes.questionnaire.data !== null) {
                        await fetch(`${API}/questionnaires/${subSection.attributes.questionnaire.data.id}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${getToken()}`,
                            },
                        }).catch((error) => {
                            message.error('An error occurred while deleting the questionnaire');
                        });
                    }
                }),
                deletedSubsections.map(async (subSection) => {
                    await fetch(`${API}/subsections/${subSection.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${getToken()}`,
                        },
                    }).catch((error) => {
                        message.error('An error occurred while deleting the subsection');
                    });
                })
            ),
            (async () => {
                const idActivities = {}
                for (const subSection of addedSubsections) {
                    let activityResponse = null;
                    let questionnaireResponse = null;

                    if (subSection.attributes.activity) {
                        if (subSection.attributes.activity.type === 'peerReview') {
                            subSection.attributes.activity.task_to_review = idActivities[subSection.attributes.activity.task_to_review] || subSection.attributes.activity.task_to_review;
                        }
                        const activity = await fetch(`${API}/activities`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${getToken()}`,
                            },
                            body: JSON.stringify({ data: subSection.attributes.activity }),
                        });
                        activityResponse = await activity.json();
                        idActivities[subSection.id] = activityResponse?.data?.id;
                    }

                    if (subSection?.attributes?.questionnaire?.attributes) {
                        const questionnaire = await fetch(`${API}/questionnaires`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${getToken()}`,
                            },
                            body: JSON.stringify({
                                data: subSection.attributes.questionnaire.attributes,
                            }),
                        })
                        questionnaireResponse = await questionnaire.json();
                    }

                    const newSubsection = await fetch(`${API}/subsections`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${getToken()}`,
                        },
                        body: JSON.stringify({
                            data: {
                                ...subSection.attributes,
                                activity: activityResponse?.data?.id,
                                questionnaire: questionnaireResponse?.data?.id,
                            },
                        }),
                    });
                    const responseSubsection = await newSubsection.json();
                    newSubsectionTemp.push(responseSubsection.data.id);
                    listsubsections[subSection.id] = responseSubsection.data.id
                }
            })(),
        ]);


        fetch(`${API}/sections/${sectionToEdit.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({
                data: {
                    subsections: {
                        connect: newSubsectionTemp
                    }
                },
            }),
        })

        // Finalmente comprobamos si se ha cambiado el orden de las subsecciones, si es asi, se actualiza el estado de la seccion
        if (checkIfSectionHadReorder()) {
            const subsectionListId = sectionToEditTemp.attributes.subsections.data.map((subsection) => {
                return listsubsections[subsection?.id] || subsection.id
            });
            await fetch(`${API}/sections/${sectionToEdit.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                    data: {
                        subsections: {
                            connect: []
                        }
                    },
                }),
            })
            await fetch(`${API}/sections/${sectionToEdit.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                    data: {
                        subsections: {
                            connect: subsectionListId
                        }
                    },
                }),
            })
        }

        setLoading(false);
        message.success('Changes saved');
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }
    const deleteSection = async () => {
        //Debemos eliminar las subsections que estén relacionadas con la sección, tambien la actividad, el cuestionario y las qualifications de la activity
        setLoadingDelete(true);
        try {
            const subsections = sectionToEdit.attributes.subsections.data;
            const activities = subsections.map((subsection) => subsection.attributes.activity);
            const questionnaires = subsections.map((subsection) => subsection.attributes.questionnaire);
            const qualifications = activities.flatMap((activity) => activity.data?.attributes.qualifications?.data.map((qualification) => qualification.id) || []);

            await Promise.all([
                // Eliminar las actividades
                Promise.all(
                    activities.map(async (activity) => {
                        if (activity.data) {
                            await fetch(`${API}/activities/${activity.data.id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${getToken()}`,
                                },
                            });
                        }
                    })
                ),
                // Eliminar los cuestionarios
                Promise.all(
                    questionnaires.map(async (questionnaire) => {
                        if (questionnaire.data) {
                            await fetch(`${API}/questionnaires/${questionnaire.data.id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${getToken()}`,
                                },
                            });
                        }
                    })
                ),
                // Eliminar las subsections
                Promise.all(
                    subsections.map(async (subsection) => {
                        await fetch(`${API}/subsections/${subsection.id}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${getToken()}`,
                            },
                        });
                    })
                ),
                // Eliminar las qualifications
                Promise.all(
                    qualifications.map(async (qualification) => {
                        await fetch(`${API}/qualifications/${qualification}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${getToken()}`,
                            },
                        });
                    })
                ),
            ])

            await fetch(`${API}/sections/${sectionToEdit.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                }
            })

            setCourse((prev) => {
                const updatedSections = prev.filter((section) => section.id !== sectionToEdit.id);
                return updatedSections;
            })
            setLoadingDelete(false);
            setEditSectionFlag(false);
            message.success('Section deleted');

        } catch (error) {
            setLoadingDelete(false);
            console.error(error);
            message.error('An error occurred while deleting the section');
        }
    }
    const handleSubsectionChange = (key, value) => {
        const copySubsection = { ...subsectionToEdit };
        if (key === 'peer_review') {
            //check if id is a activity or a subsection
            const sub = filteredSubsections.find((sub) => sub.id === value)
            const id = sub?.attributes?.activity?.data?.id || sub?.id
            copySubsection.attributes.activity.task_to_review = id;

            setEditSubsection(copySubsection);
        }
        if (key === 'group') {
            copySubsection.attributes.activity.groupActivity = value;
            setEditSubsection(copySubsection);
            setIsGroup(value);
        }
        if (key === 'usersToPair') {
            copySubsection.attributes.activity.usersToPair = value;
            setEditSubsection(copySubsection);
        }
        if (key === 'ponderation') {
            copySubsection.attributes.activity.ponderationStudent = value;
            setEditSubsection(copySubsection);
        }
    }
    const saveChangesPeerReview = () => {
        if (subsectionToEdit.attributes.activity.PeerReviewRubrica == null || Object.keys(subsectionToEdit.attributes.activity.PeerReviewRubrica).length === 0) {
            message.error('Please fill the rubric');
            return;
        }
        if (subsectionToEdit.attributes.activity.task_to_review === null) {
            message.error('Please select a task to review');
            return;
        }
        if (subsectionToEdit.attributes.activity.usersToPair === null) {
            subsectionToEdit.attributes.activity.usersToPair = 1;
        }
        if (subsectionToEdit.attributes.activity.ponderationStudent === null) {
            subsectionToEdit.attributes.activity.ponderationStudent = 0;
        }
        //add to the subsections array the subsection to edit
        const index = sectionToEditTemp.attributes.subsections.data.findIndex((sub) => sub.id === subsectionToEdit.id);
        const newSubsections = [...sectionToEditTemp.attributes.subsections.data];
        newSubsections[index] = subsectionToEdit;

        setSectionToEditTemp((prev) => {
            return {
                ...prev,
                attributes: {
                    ...prev.attributes,
                    subsections: {
                        data: newSubsections,
                    },
                },
            };
        });
        setEditSubsection(null);

    }

    return (
        <>
            <button className='flex items-center mt-5 text-sm duration-150 hover:-translate-x-1 ' onClick={() => { setEditSectionFlag(false); setSectionToEdit(null) }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                </svg>
                <p className='ml-1'>Go back to course</p>
            </button>
            <div className='flex gap-3 mt-5'>
                <div>
                    <p className='text-lg font-medium'>Edit course section</p>
                    <p className='text-sm text-gray-600'>Reorder the sequence or edit the content of your course section.</p>
                    <p className='text-sm text-gray-600'>If you want to edit dates or content, you must do it inside the subsections, here you can add or delete subsections.</p>
                </div>
                <div className='ml-auto'>
                    <Popconfirm
                        title="Save changes"
                        description="Are you sure you want to save changes?"
                        onConfirm={saveChanges}
                        disabled={disabled}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ className: 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2.5' }}
                    >
                        <Button loading={loading} disabled={disabled} type="primary" className='mr-3'>
                            Save changes
                        </Button>
                    </Popconfirm>
                    <Popconfirm
                        title="Delete the section"
                        description="Are you sure to delete this section?"
                        onConfirm={deleteSection}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ className: 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2.5' }}
                    >

                        <Button type="" danger className='bg-[#ff4d4f] hover:bg-[#ff4d50c5] !text-white'>
                            Delete Section
                        </Button>
                    </Popconfirm>
                </div>
            </div>
            <hr className='mt-3' />
            <div className='flex gap-10 '>
                <div className='w-1/2 h-full p-5 pr-24 mt-5 mb-5 text-base font-medium bg-white rounded-md shadow-md'>
                    <h3 >Course sequence</h3>
                    {
                        sectionToEditTemp.attributes.subsections.data.length > 0 ?
                            <div className='mt-6 space-y-3 duration-700 '>
                                <DndContext
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}>
                                    <SortableContext
                                        items={sectionToEditTemp.attributes.subsections.data}
                                        strategy={verticalListSortingStrategy}>
                                        <ol className="relative ml-10 border-l border-gray-300 border-dashed">
                                            {
                                                sectionToEditTemp.attributes?.subsections?.data.map((subsection) => (
                                                    <motion.li
                                                        key={subsection?.id}
                                                        initial={{ opacity: 0, x: -50 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 50 }}>
                                                        <SubsectionList key={subsection?.id}
                                                            subsection={subsection}
                                                            setSectionToEditTemp={setSectionToEditTemp}
                                                            setSubsectionEditing={setEditSubsection}
                                                            editable={subsection.attributes.activity?.type === 'peerReview'}
                                                            danger={subsection.attributes.activity?.type === 'peerReview' &&
                                                                (subsection?.attributes?.activity?.PeerReviewRubrica == null ||
                                                                    Object.keys(subsection?.attributes?.activity?.PeerReviewRubrica).length === 0
                                                                    || subsection?.attributes?.activity?.task_to_review == null
                                                                )}
                                                        />
                                                    </motion.li>
                                                ))
                                            }
                                        </ol>
                                    </SortableContext>
                                </DndContext>
                            </div>
                            :
                            <div>
                                <p className='mt-6 text-sm italic font-normal text-gray-500'>Start defining the sequence!</p>
                            </div>
                    }
                    <p className='mt-8 text-xs font-normal text-gray-400'>Drag and drop to reorder the sequence</p>
                </div>
                <div className='w-1/2'>
                    {
                        subsectionToEdit ?
                            <div className='flex flex-col justify-center p-5 mt-5 mb-5 space-y-2 bg-white'>
                                <PeerReviewRubricModal
                                    isModalOpen={isModalOpen}
                                    setIsModalOpen={setIsModalOpen}
                                    rubricData={subsectionToEdit?.attributes?.activity?.PeerReviewRubrica}
                                    setSubsectionEditing={setEditSubsection}
                                    context={'edit'}
                                />
                                <label className='text-sm text-gray-500 '>
                                    {t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.peer_review_rubric")} *
                                </label>
                                <Button onClick={() => {
                                    setIsModalOpen(true);
                                    document.body.style.overflow = 'hidden';
                                }}>
                                    {t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.peer_review_rubric_text")}
                                </Button>
                                <label className='text-sm text-gray-500 !mt-4'>
                                    {t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.peer_review_task")}  *
                                </label>
                                <Select
                                    defaultValue={() => {
                                        const act = filteredSubsections.find((sub) => sub.id === subsectionToEdit.attributes.activity?.task_to_review)
                                        if (act === undefined) {
                                            subsectionToEdit.attributes.activity.task_to_review = null
                                            return t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.select_task")
                                        }
                                        return act.id
                                    }
                                    }
                                    style={{ width: '100%' }}
                                    onChange={(task) => { handleSubsectionChange('peer_review', task) }}
                                    notFoundContent={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.no_evaluable_tasks")} />}
                                    options={
                                        //only take tasks that are not not reviewing
                                        filteredSubsections.filter((sub) => sub?.attributes?.activity?.data?.attributes?.BeingReviewedBy === null ||
                                            (sub?.attributes?.activity?.type === 'task'))
                                            .map((sub) => ({ label: sub?.attributes?.activity?.title || sub?.attributes?.activity?.data?.attributes?.title, value: sub.id }))


                                    }
                                />
                                <label className='text-sm text-gray-500 ' htmlFor=''>
                                    {t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.pairs_or_individual")}
                                </label>
                                <Select
                                    key={isGroup}
                                    defaultValue={isGroup}
                                    style={{ width: '100%', marginTop: '5px' }}
                                    onChange={(number) => { handleSubsectionChange('group', number) }}
                                    options={[{ label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.individual"), value: false }, { label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.groups"), value: true }]}
                                />

                                <label className='text-sm text-gray-500'>
                                    {t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.students_review",
                                        { students: isGroup ? t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.groups").toLowerCase() : t("ACTIVITY.create_groups.students").toLowerCase() })}
                                    *
                                </label>
                                <Select
                                    defaultValue={subsectionToEdit?.activity?.usersToPair || 1}
                                    style={{ width: '100%', marginTop: '5px' }}
                                    onChange={(number) => { handleSubsectionChange('usersToPair', number) }}
                                    dropdownRender={(menu) => (
                                        <>
                                            {menu}
                                            <Divider
                                                style={{
                                                    margin: '8px 0',
                                                }}
                                            />
                                            <Space
                                                style={{
                                                    padding: '0 8px 4px',
                                                }}
                                            >
                                                <Input
                                                    placeholder="Enter number of students"
                                                    className='rounded-md border border-[#d9d9d9] min-w-[230px]'
                                                    type='number'
                                                    min={1}
                                                    ref={inputRef}
                                                    value={name}
                                                    onChange={(event) => {
                                                        setName(event.target.value);
                                                    }}
                                                    onKeyDown={(e) => e.stopPropagation()}
                                                />

                                                <Button type="text" icon={<PlusOutlined />} onClick={(e) => {
                                                    e.preventDefault();
                                                    if (!name) {
                                                        message.error('Please enter a number')
                                                        return;
                                                    }
                                                    if (items.includes(name)) {
                                                        message.error('This number is already added')
                                                        return;
                                                    }
                                                    if (name <= 0) {
                                                        message.error('Negative students are not allowed')
                                                        return;
                                                    }
                                                    setItems([...items, name]);
                                                    setName('');
                                                    setTimeout(() => {
                                                        inputRef.current?.focus();
                                                    }, 0);
                                                }}>
                                                    Add item
                                                </Button>
                                            </Space>
                                        </>
                                    )}
                                    options={items.map((item) => ({
                                        label: item,
                                        value: item,
                                    }))}

                                />
                                <label className='text-sm text-gray-500 ' htmlFor=''>
                                    {t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.students_grade")} *
                                </label>
                                <InputNumber
                                    defaultValue={filteredSubsections.find((sub) => sub.id === subsectionToEdit?.activity?.task_to_review)?.activity?.ponderationStudent || 0}
                                    onChange={(value) => handleSubsectionChange('ponderation', value)}
                                    min={0}
                                    max={100}
                                    formatter={(value) => `${value}%`}
                                    parser={(value) => value.replace('%', '')}
                                />
                                <section className='flex justify-end w-full gap-2 mt-2'>
                                    <Button danger onClick={() => setEditSubsection(null)}>
                                        {t("COMMON.cancel")}
                                    </Button>
                                    <Button type='primary' onClick={saveChangesPeerReview}>
                                        {t("COMMON.save_changes")}
                                    </Button>
                                </section>
                            </div> :
                            <SubsectionItems setCreateCourseSectionsList={setSectionToEditTemp} sectionToEdit={sectionToEditTemp} context={'coursesInside'} />
                    }
                </div>
            </div>
        </>
    )
}
