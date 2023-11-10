import React, { useState, useEffect } from 'react'
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CreateCourseSubsectionsList } from './CreateCourseSubsectionsList';
import { CreateCourseEditSubsection } from './CreateCourseEditSubsection';
import { SubsectionItems } from '../CreateCourses/SubsectionItems';
import { CreateCourseTimelineSubsection } from './CreateCourseTimelineSubsection';
import { motion } from 'framer-motion';
import { message } from 'antd';

export const EditCreateCourseSection = ({ setEditCourseSectionFlag, setCreateCourseSectionsList, sectionToEdit, createCourseSectionsList, task, setTask }) => {
    console.log(createCourseSectionsList)
    const [subsectionsToEdit, setSubsectionsToEdit] = useState((createCourseSectionsList.filter((section) => section.id === sectionToEdit.id)[0]))
    const [editSubsectionFlag, setEditSubsectionFlag] = useState(false)
    const [subsectionEditing, setSubsectionEditing] = useState()


    useEffect(() => {
        setSubsectionsToEdit((createCourseSectionsList.filter((section) => section.id === sectionToEdit.id)[0]))
    }, [createCourseSectionsList])

    const handleDragEnd = (event) => {
        const { active, over } = event;

        try {
            setCreateCourseSectionsList((courses) => {
                const updatedCourses = createCourseSectionsList.map((course) => {
                    if (course.id === sectionToEdit.id) {
                        const sectionCopy = { ...course };
                        const oldIndex = sectionCopy.subsections.findIndex(c => c.id === active.id);
                        const newIndex = sectionCopy.subsections.findIndex(c => c.id === over.id);

                        if (!isValidMove(sectionCopy.subsections, oldIndex, newIndex)) {
                            message.error('Invalid move. Subsection needs to follow the course sequence order');
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

        // Asegurarse de que la fase de destino esté en la posición correcta
        if (currentIndex < targetIndex && newIndex !== targetIndex - 1) {
            return false;
        }

        if (currentIndex > targetIndex && newIndex !== targetIndex + 1) {
            return false;
        }

        // Evitar mover "self-reflection" entre "forethought" y "performance"
        if (currentFase === 'self-reflection' && (targetFase === 'forethought' || targetFase === 'performance')) {
            return false;
        }

        return true;
    };




    return (
        <div className='text-base font-normal'>
            <button onClick={() => setEditCourseSectionFlag(false)} className='flex items-center hover:-translate-x-1 duration-100'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                </svg>
                <p className='text-sm ml-1 '>Back to course setup</p>
            </button>
            <div className='flex'>
                <div className='w-1/2 pr-10 pl-5'>
                    <h1 className='font-bold text-2xl mt-5'>Edit Section</h1>
                    <h2 className='font-medium text-xl mt-5'>{sectionToEdit.name}</h2>
                    <div className='bg-white rounded-md shadow-md p-5 font-medium text-base mb-5 mt-5'>
                        <div className='flex items-center'>
                            <h3 className=''>Course sequence</h3>
                        </div>
                        {
                            subsectionsToEdit.subsections.length > 0 ?
                                <div className='mt-6 space-y-3'>
                                    <DndContext
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleDragEnd}>
                                        <SortableContext
                                            items={subsectionsToEdit.subsections}
                                            strategy={verticalListSortingStrategy}>
                                            <ol className="relative border-l border-dashed border-gray-300 ml-10">
                                                {subsectionsToEdit.subsections.map((subsection) => (
                                                    <motion.li
                                                        key={subsection.id}
                                                        initial={{ opacity: 0, x: -50 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 50 }}
                                                    >
                                                        <CreateCourseSubsectionsList subsection={subsection} setCreateCourseSectionsList={setCreateCourseSectionsList} sectionId={sectionToEdit.id} setEditSubsectionFlag={setEditSubsectionFlag} setSubsectionEditing={setSubsectionEditing} key={subsection.id} />
                                                    </motion.li>
                                                ))}
                                            </ol>
                                        </SortableContext>
                                    </DndContext>
                                </div>
                                :
                                <div>
                                    <p className='text-sm font-normal italic text-gray-500 mt-6'>Start defining the sequence!</p>
                                </div>
                        }
                        <p className='text-xs font-normal  text-gray-400 mt-8'>Drag and drop to reorder the sequence</p>
                    </div>
                    <CreateCourseTimelineSubsection createCourseSectionsList={createCourseSectionsList} sectionId={sectionToEdit.id} />
                </div>
                <div className='w-1/2'>
                    {
                        editSubsectionFlag ?
                            <CreateCourseEditSubsection subsection={subsectionEditing} setEditSubsectionFlag={setEditSubsectionFlag} setCreateCourseSectionsList={setCreateCourseSectionsList} createCourseSectionsList={createCourseSectionsList} setSubsectionEditing={setSubsectionEditing} task={task} setTask={setTask} sectionId={sectionToEdit.id} />
                            :
                            <SubsectionItems setCreateCourseSectionsList={setCreateCourseSectionsList} sectionToEdit={sectionToEdit} />
                    }
                </div>
            </div>
        </div>
    )
}
