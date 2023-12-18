import React, { useEffect, useState } from 'react'
import { Button, Popconfirm, message } from 'antd';
import { SubsectionList } from './EditSection/SubsectionList';
import { getToken } from '../../../../helpers';
import { API } from '../../../../constant';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { SubsectionItems } from '../CreateCourses/CourseSections/SubsectionItems';



export const EditSection = ({ setEditSectionFlag, sectionToEdit, setCourseContentInformation, setSectionToEdit }) => {
    const confirm = (e) => {
        try {
            setCourseContentInformation((prev) => {
                const updatedSections = prev.filter((section) => section.id !== sectionToEdit.id);
                return updatedSections;
            });
            setEditSectionFlag(false);
            deleteSection();
            message.success('Section deleted');
        } catch (error) {
            message.error(error.message);
        }
    };

    const handleDragEnd = (event) => {

    }

    const saveChanges = async () => {
        setCourseContentInformation((prev) => {
            const updatedSections = prev.map((section) =>
                section.id === sectionToEdit.id ? sectionToEdit : section
            );

            console.log(updatedSections);
            return updatedSections;
        })
        setEditSectionFlag(false);
        message.success('Changes saved');
    }


    const deleteSection = async () => {
        await fetch(`${API}/sections/${sectionToEdit.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            }
        })
    }

    return (
        <>
            <button className='text-sm flex items-center mt-5 duration-150 hover:-translate-x-1 ' onClick={() => setEditSectionFlag(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                </svg>
                <p className='ml-1'>Go back to course</p>
            </button>
            <div className='mt-5 flex gap-3 mr-9'>
                <Popconfirm
                    title="Delete the section"
                    description="Are you sure you want to save changes?"
                    onConfirm={confirm}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{ className: 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2.5' }}
                >
                    <Button onClick={() => saveChanges()} type="primary" className='ml-auto bg-blue-600'>
                        Save changes
                    </Button>
                </Popconfirm>
                <Popconfirm
                    title="Delete the section"
                    description="Are you sure to delete this section?"
                    onConfirm={confirm}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{ className: 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2.5' }}
                >

                    <Button type="primary" danger className=''>
                        Delete Section
                    </Button>
                </Popconfirm>
            </div>
            <div className='mt-5 flex gap-10'>
                <div className='ml-8 bg-white rounded-md shadow-md p-5 font-medium text-base mb-5 mt-5 h-full pr-24'>
                    <h3 className=''>Course sequence</h3>
                    {
                        sectionToEdit.attributes.subsections.data.length > 0 ?
                            <div className='mt-6 space-y-3  duration-700 '>
                                <DndContext
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}>
                                    <SortableContext
                                        items={sectionToEdit.attributes.subsections.data}
                                        strategy={verticalListSortingStrategy}>
                                        <ol className="relative border-l border-dashed border-gray-300 ml-10">
                                            {
                                                sectionToEdit.attributes?.subsections?.data.map((subsection) => (
                                                    <motion.li
                                                        key={subsection.id}
                                                        initial={{ opacity: 0, x: -50 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 50 }}>
                                                        <SubsectionList key={subsection.id}
                                                            subsection={subsection} sectionToEdit={sectionToEdit}
                                                            setCourseContentInformation={setCourseContentInformation}
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
                                <p className='text-sm font-normal italic text-gray-500 mt-6'>Start defining the sequence!</p>
                            </div>
                    }
                    <p className='text-xs font-normal  text-gray-400 mt-8'>Drag and drop to reorder the sequence</p>
                </div>
                <div className='-mr-7'>
                    <SubsectionItems setCreateCourseSectionsList={setSectionToEdit} sectionToEdit={sectionToEdit} context={'coursesInside'} />
                </div>
            </div>
        </>
    )
}
