import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Popconfirm, message } from 'antd';
import { CheckSubsectionErrors } from './CheckSubsectionErrors';
import { set } from 'date-fns';

export const CreateCourseSubsectionsList = ({
    subsection,
    setCreateCourseSectionsList,
    sectionId,
    setEditSubsectionFlag,
    setSubsectionEditing,
    setSubsectionErrors,
}) => {
    const deleteSubsection = () => {
        setSubsectionErrors((prevErrors) =>  prevErrors.filter((error) => error.subsectionId !== subsection.id));
        setCreateCourseSectionsList((prevSections) =>
            prevSections.map((section) =>
                section.id === sectionId
                    ? {
                        ...section,
                        subsections: section.subsections.filter(
                            (sub) => sub.id !== subsection.id
                        ),
                    }
                    : section
            )
        );
    };

    const switchFaseColor = (fase) => {
        switch (fase) {
            case 'forethought':
                return 'bg-[#15803d]';
            case 'performance':
                return 'bg-[#fbbf24]';
            case 'self-reflection':
                return 'bg-[#dc2626]';
            default:
                return 'bg-[#15803d]';
        }
    };

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: subsection.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    return (
        <li
            onClick={() => {
                setEditSubsectionFlag(true);
                setSubsectionEditing(subsection);
            }}
            style={style}
            className="cursor-pointer mb-10 ml-8 mt-8 flex items-center min-h-[2rem] relative mr-5"
        >
            {/* Phase indicator */}
            <span
                {...attributes}
                {...listeners}
                ref={setNodeRef}
                className={`${switchFaseColor(subsection.fase)} absolute flex items-center justify-center w-8 h-8 rounded-full -left-12  ring-white`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 text-white"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.59L7.3 9.24a.75.75 0 00-1.1 1.02l3.25 3.5a.75.75 0 001.1 0l3.25-3.5a.75.75 0 10-1.1-1.02l-1.95 2.1V6.75z"
                        clipRule="evenodd"
                    />
                </svg>
            </span>
            {/* Background bar */}
            <div className="flex items-center gap-x-3 justify-between w-[calc(100%+4rem)] bg-gray-50 min-h-[3rem] -left-14 rounded-md border">

                <div className="flex items-center gap-2 ">
                    <div className="flex flex-col justify-center ml-5">
                        <p className="">{subsection.title}</p>
                    </div>
                    <CheckSubsectionErrors subsection={subsection} setSubsectionErrors={setSubsectionErrors} />
                </div>

                <Popconfirm
                    title="Delete the subsection"
                    description="Are you sure to delete this subsection?"
                    okText="Yes"
                    okType="danger"
                    onConfirm={(e) => {
                        e.stopPropagation();
                        deleteSubsection();
                        setEditSubsectionFlag(false);
                        message.success('Subection deleted successfully');
                    }}
                    onCancel={(e) => {
                        e.stopPropagation();
                    }}
                    cancelText="No"
                >
                    <Button
                        className=" !mr-2"
                        onClick={(event) => event.stopPropagation()}
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-5  h-5 mt-[1px]"
                            >
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                            </svg>
                        }
                    ></Button>
                </Popconfirm>
            </div>
        </li>
    );
};
