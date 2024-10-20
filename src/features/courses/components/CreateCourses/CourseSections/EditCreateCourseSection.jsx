import React, { useState, useRef, useEffect, useCallback } from 'react'
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CreateCourseSubsectionsList } from './CreateCourseSubsectionsList';
import { CreateCourseEditSubsection } from './CreateCourseEditSubsection';
import { SubsectionItems } from './SubsectionItems';
import { CreateCourseTimelineSubsection } from './CreateCourseTimelineSubsection';
import { motion } from 'framer-motion';
import { message, Button, Tag, Tour } from 'antd';
import { CreateTask } from './CreateTask';
import { useTranslation } from 'react-i18next';

export const EditCreateCourseSection = ({ setEditCourseSectionFlag, sectionToEdit, createCourseSectionsList, task, setTask, subsectionToEditError = null, setSubsectionToEditError,
    createCourseSectionsListCopy, setCreateCourseSectionsListCopy, setCreateCourseSectionsList, categories, setCategories, setSubsectionErrors, subsectionErrors }) => {
    const [subsectionsToEdit, setSubsectionsToEdit] = useState((createCourseSectionsListCopy?.filter((section) => section.id === sectionToEdit.id)[0]))

    const [editSubsectionFlag, setEditSubsectionFlag] = useState(subsectionToEditError ? true : false)
    const [subsectionEditing, setSubsectionEditing] = useState(
        subsectionToEditError ? subsectionsToEdit.subsections.find((subsection) => subsection.id === subsectionToEditError) : null
    )
    const [thereIsChanges, setThereIsChanges] = useState(false)
    const [editTaskFlag, setEditTaskFlag] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();

    const intervalRef = useRef(null);

    const { t } = useTranslation();

    const ref = useRef(null);
    const ref0 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);
    const ref4 = useRef(null);


    const [open, setOpen] = useState(false);
    const steps = [
        {
            title: 'Welcome to the edit section page!',
            description: (
                <>
                    <p>First of all, for defining your section you need to understand the basis of the section sequence. The realization of the task you definied will be divided in 3 parts,
                        Forethought, Performance and Self-reflection.</p>
                    <ul className='my-3 ml-3'>
                        <li>
                            <span className='font-bold'>Forethought:</span> Planning of the task, where students will define the task,  goal,  time and the resources they will need to complete it.
                        </li>
                        <li>
                            <span className='font-bold'>Performance:</span> Execution of the task, where the student is going to implement what he planificated.
                        </li>
                        <li>
                            <span className='font-bold'>Self-reflection:</span> Evaluation and reflection of the task.
                        </li>
                    </ul>

                    <p>You can define the sequence of the section by dragging and dropping them in the desired order. Aptitude offers you a variety of items and sequences for making this process easier.</p>
                </>
            ),
            nextButtonProps: { className: 'bg-[#1677ff] text-white' },
            target: null,
        },
        {
            title: 'Sequence',
            description: (
                <>
                    <p>On this area whenever you add any item you will be able to see how is the sequence forming, you can also drag and drop to reorder the sequence if you need to.</p>
                </>
            ),
            placement: 'right',
            nextButtonProps: { className: 'bg-[#1677ff] text-white' },
            target: () => ref.current,
        },
        {
            title: 'Edit Task',
            description: (
                <>
                    <p>If you need to edit the task you previously created.</p>
                </>
            ),
            placement: 'right',
            nextButtonProps: { className: 'bg-[#1677ff] text-white' },
            target: () => ref0.current,
        },
        {
            title: 'Timeline',
            description: (
                <>
                    <p>This is the timeline of the section, whenever a subsection is created with its corresponding dates, it will be placed on the timeline for a general view of the section.</p>
                </>
            ),
            placement: 'right',
            nextButtonProps: { className: 'bg-[#1677ff] text-white' },
            target: () => ref2.current,
        },
        {
            title: 'Items',
            description: (
                <>
                    <p>Finally, on this area you will be able to add items to the sequence, Uptitude offers you the possiblity of adding directly a complete sequence on the <strong>Pre-Made sequences</strong>  tab,
                        those sequences are tested and proved to be effective for the development of the course. On the other hand, you can add items to the sequence manually on the <strong>Add items to the sequence</strong>  tab.
                    </p>
                </>
            ),
            placement: 'left',
            nextButtonProps: { className: 'bg-[#1677ff] text-white' },
            target: () => ref3.current,
        },
        {
            title: 'Save Changes',
            description: (
                <>
                    <p>When you end editing the section, click on this button to reflect the changes on Course Visualization </p>
                </>
            ),
            placement: 'bottom',
            nextButtonProps: { className: 'bg-[#1677ff] text-white' },
            target: () => ref4.current,
        }
    ];

    const saveChanges = (autosave = false, createCourseSectionsListCopyTest) => {
        const copyObject = JSON.parse(JSON.stringify(createCourseSectionsListCopyTest));
        setCreateCourseSectionsList(copyObject);
        localStorage.setItem('createCourseSectionsList', JSON.stringify(createCourseSectionsListCopyTest));

        if (autosave) {
            messageApi
                .open({
                    type: 'loading',
                    content: 'Auto-saving...',
                    duration: 1.5,
                })
                .then(() => {
                    setThereIsChanges(false);
                    message.success('Changes auto-saved', 2.5)
                });
        } else {
            setThereIsChanges(false);
            setEditSubsectionFlag(false);
            message.success(t("ACTIVITY.changed_saved_success"));
        }
    };
    const deleteChanges = () => {
        setCreateCourseSectionsListCopy(createCourseSectionsList);
        setThereIsChanges(false);
        setEditSubsectionFlag(false);
        message.success(t("ACTIVITY.changes_discarded"));
    }

    useEffect(() => {
        setSubsectionsToEdit((createCourseSectionsListCopy.filter((section) => section.id === sectionToEdit.id)[0]))
        setThereIsChanges(JSON.stringify(createCourseSectionsListCopy) !== JSON.stringify(createCourseSectionsList))

    }, [createCourseSectionsListCopy, createCourseSectionsList])

    useEffect(() => {
        const autoSave = () => {
            if (thereIsChanges) {
                saveChanges(true, createCourseSectionsListCopy);
            }
        };
        intervalRef.current = setInterval(autoSave, 30000); // 30 segundos
        return () => {
            clearInterval(intervalRef.current);
        };
    }, [thereIsChanges]);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        try {
            setCreateCourseSectionsListCopy((courses) => {
                const updatedCourses = createCourseSectionsListCopy.map((course) => {
                    if (course.id === sectionToEdit.id) {
                        const sectionCopy = { ...course };
                        const oldIndex = sectionCopy.subsections.findIndex(c => c.id === active.id);
                        const newIndex = sectionCopy.subsections.findIndex(c => c.id === over.id);

                        if (!isValidMove(sectionCopy.subsections, oldIndex, newIndex)) {
                            message.error(t("CREATE_COURSES.ERROR.invalid_move_section_order"));
                        } else {
                            sectionCopy.subsections = arrayMove(sectionCopy.subsections, oldIndex, newIndex);
                            return sectionCopy;
                        }
                    }
                    return course;
                });

                return updatedCourses;
            });
        } catch (error) {
            message.error(error.message);
        }
    }

    const isValidMove = (subsections, oldIndex, newIndex) => {
        const movedSubsection = subsections[oldIndex];

        if (newIndex < 0 || newIndex >= subsections.length) {
            return false;
        }

        const validFasesOrder = ['forethought', 'performance', 'self-reflection'];
        const currentFase = movedSubsection.fase;
        const targetFase = subsections[newIndex].fase;
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


    const handleClick = () => {
        setOpen(true);
        document.body.style.overflow = 'hidden';
    };

    return (
        <div className='text-base font-normal'>
            {contextHolder}
            <Tour open={open} className=''
                onFinish={() => {
                    setOpen(false)
                    document.body.style.overflow = 'auto'
                }} onClose={() => {
                    setOpen(false)
                    document.body.style.overflow = 'auto'
                }} steps={steps} nextButtonProps={{ style: { backgroundColor: 'blue' } }} />
            <button onClick={() => { setEditCourseSectionFlag(false); setSubsectionToEditError(null) }} className='flex items-center duration-100 hover:-translate-x-1'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                </svg>
                <p className='ml-1 text-sm '>{t("CREATE_COURSES.COURSE_SECTIONS.CREATE_TASK.back_to_course")}</p>
            </button>

            {
                !task[sectionToEdit.id] || editTaskFlag ?
                    <CreateTask task={task} setTask={setTask} section={sectionToEdit} setCreateCourseSectionsList={setCreateCourseSectionsList}
                        setCreateCourseSectionsListCopy={setCreateCourseSectionsListCopy} setEditTaskFlag={setEditTaskFlag} categories={categories} setCategories={setCategories} />
                    :
                    <div className='flex'>
                        <div className='w-1/2 pl-5 pr-10 '>
                            <div className='flex items-center gap-2 mt-5'>
                                <h1 className='text-2xl font-bold '>{t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.title")}</h1>
                                <svg
                                    onClick={handleClick}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="w-5 h-5 cursor-pointer"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z"
                                        clipRule="evenodd"
                                    />
                                </svg>

                            </div>
                            <div className='flex items-center justify-between mt-5'>
                                <div className='flex items-center gap-2'>
                                    <h2 className='text-xl font-medium '>{sectionToEdit.name}</h2>
                                    <Tag color="#108ee9">{t("CREATE_COURSES.COURSE_SECTIONS.CREATE_TASK.section")}</Tag>
                                </div>
                                <section className='flex gap-x-3'>
                                    <Button ref={ref4} disabled={!thereIsChanges} danger onClick={() => deleteChanges()} >{t("COMMON.cancel")}</Button>
                                    <Button ref={ref4} disabled={!thereIsChanges} type='primary' onClick={() => saveChanges(false, createCourseSectionsListCopy)} className='bg-[#1677ff] text-white '>{t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.save_changes")}</Button>
                                </section>
                            </div>
                            <div ref={ref} className='p-5 mt-5 mb-5 text-base font-medium bg-white rounded-md shadow-md'>
                                <div className='flex items-center'>
                                    <h3 className=''>{t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.course_sequence")}</h3>
                                    <Button ref={ref0} className='ml-auto' onClick={() => { setEditTaskFlag(true); setSubsectionToEditError(null) }}>
                                        {t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.edit_task")}
                                    </Button>
                                </div>
                                <p className='text-xs font-normal text-gray-400'>{t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.course_sequence_text")}</p>
                                {
                                    subsectionsToEdit.subsections.length > 0 ?
                                        <div className='mt-6 space-y-3 h-[20rem] duration-700 overflow-y-auto overflow-x-hidden'>
                                            <DndContext
                                                collisionDetection={closestCenter}
                                                onDragEnd={handleDragEnd}>
                                                <SortableContext
                                                    items={subsectionsToEdit.subsections}
                                                    strategy={verticalListSortingStrategy}>
                                                    <ol className="relative ml-10 border-l border-gray-300 border-dashed">
                                                        {subsectionsToEdit.subsections.map((subsection) => (
                                                            <motion.li
                                                                key={subsection.id}
                                                                initial={{ opacity: 0, x: -50 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                exit={{ opacity: 0, x: 50 }}>
                                                                <CreateCourseSubsectionsList setSubsectionErrors={setSubsectionErrors} subsection={subsection}
                                                                    subsectionErrors={subsectionErrors}
                                                                    setCreateCourseSectionsList={setCreateCourseSectionsListCopy} sectionId={sectionToEdit.id} section={sectionToEdit}
                                                                    setEditSubsectionFlag={setEditSubsectionFlag} setSubsectionEditing={setSubsectionEditing} key={subsection.id} ref2={ref2} />
                                                            </motion.li>
                                                        ))}
                                                    </ol>
                                                </SortableContext>
                                            </DndContext>
                                        </div>
                                        :
                                        <div>
                                            <p className='mt-6 text-sm italic font-normal text-gray-500'>{t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.empty_sequence")}</p>
                                        </div>
                                }
                                <p className='mt-8 text-xs font-normal text-gray-400'>{t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.draganddrop")}</p>
                            </div>
                            <CreateCourseTimelineSubsection ref2={ref2} createCourseSectionsList={createCourseSectionsListCopy} sectionId={sectionToEdit.id} />
                        </div>
                        <div className='w-1/2'>
                            {
                                editSubsectionFlag ?
                                    <CreateCourseEditSubsection
                                        key={subsectionEditing.id}
                                        categories={categories}
                                        setCategories={setCategories}
                                        allSubsections={subsectionsToEdit}
                                        subsection={subsectionEditing}
                                        setEditSubsectionFlag={setEditSubsectionFlag} setCreateCourseSectionsList={setCreateCourseSectionsListCopy} createCourseSectionsList={createCourseSectionsListCopy} setSubsectionEditing={setSubsectionEditing} task={task} setTask={setTask} sectionId={sectionToEdit.id} />
                                    :
                                    createCourseSectionsList &&
                                    <SubsectionItems
                                        setCreateCourseSectionsList={setCreateCourseSectionsListCopy}
                                        sectionToEdit={sectionToEdit} ref3={ref3}
                                        sectionTask={createCourseSectionsList?.filter((section) => section.id === sectionToEdit.id)[0].task} />


                            }
                        </div>
                    </div>
            }
        </div>
    )
}
