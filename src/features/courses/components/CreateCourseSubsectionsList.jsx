import React from 'react'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const CreateCourseSubsectionsList = ({ subsection }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: subsection.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <li style={style} class="mb-10 ml-8 mt-8 flex items-center">
            <span
                {...attributes}
                {...listeners}
                ref={setNodeRef} class="absolute flex items-center justify-center w-8 h-8 bg-indigo-500 rounded-full -left-4  ring-white ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
            </span>
            <div className='flex flex-col justify-center'>
                <p className='ml-5'>{subsection.title}</p>
                <p className='text-xs'>{subsection.description}</p>
            </div>

        </li>
    )
}
