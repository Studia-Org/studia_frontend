import React from 'react'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Popconfirm, Button, message } from 'antd';

export const CreateCourseSectionsList = ({ section, deleteSection, setEditCourseSectionFlag, setSectionToEdit }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div style={style} onClick={() => {
            setEditCourseSectionFlag(true)
            setSectionToEdit(section)
        }}
            className='cursor-pointer relative rounded-md bg-[#d3d7f2] text-gray-800 p-3 h-[4rem] flex items-center  border-[#6458aa] border-t-[0.5rem]'>
            <div
                {...attributes}
                {...listeners}
                ref={setNodeRef} className='absolute left-0 w-[5rem] h-[3rem] flex items-center justify-center border-gray-800'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                </svg>
            </div>
            <p className='ml-20 w-full'>{section.name}</p>

            <Popconfirm
                title="Delete the section"
                description="Are you sure to delete this section?"
                okText="Yes"
                okType="danger"
                onConfirm={(e) => {
                    e.stopPropagation();
                    deleteSection(section)
                    message.success('Section deleted successfully');
                }}
                onCancel={(e) => {
                    e.stopPropagation();
                }}
                cancelText="No"
            >
                <Button type="text" onClick={(event) => {
                    event.stopPropagation();
                }} icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>} >
                </Button>

            </Popconfirm>
        </div>
    )
}
