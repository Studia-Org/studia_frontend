import React, { useEffect, useState } from 'react'
import { Button, Popconfirm, message } from 'antd';
import { SubsectionList } from './EditSection/SubsectionList';
import { getToken } from '../../../../helpers';
import { API } from '../../../../constant';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { SubsectionItems } from '../CreateCourses/CourseSections/SubsectionItems';


export const EditSection = ({ setEditSectionFlag, sectionToEdit, setCourseContentInformation, setSectionToEdit, setCourseSection, setCourseSubsection, courseContentInformation }) => {
    const [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [sectionToEditTemp, setSectionToEditTemp] = useState(sectionToEdit);


    useEffect(() => {
        if (sectionToEditTemp !== sectionToEdit) {
            setDisabled(false);
        }
    }, [sectionToEditTemp, sectionToEdit])

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
            //Cuando se mueva una subseccion, primero se tiene que comprobar si es un movimiento valido y luego se actualiza el estado(se reordena la subseccion en funcion de su nuevo indice), la variable donde se encuentran las subsecciones es sectionToEditTemp
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
            (subsection, index) => subsection.id !== sectionToEditTemp.attributes.subsections.data[index].id
        );
    }

    const saveChanges = async () => {
        setLoading(true);

        //Tambien hay que comprobar si se ha cambiado el orden de las subsecciones, si es asi, se actualiza el orden de las subsecciones en la base de datos poniendo en una lista en orden las id de las subsecciones

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

        await Promise.all([
            // Eliminar subsections
            Promise.all(
                deletedSubsections.map(async (subSection) => {
                    await fetch(`${API}/subsections/${subSection.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${getToken()}`,
                        },
                    });
                })
            ),

            (async () => {

                for (const subSection of addedSubsections) {
                    let activityResponse = null;
                    let questionnaireResponse = null;

                    if (subSection.attributes.activity) {
                        const activity = await fetch(`${API}/activities`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${getToken()}`,
                            },
                            body: JSON.stringify({ data: subSection.attributes.activity }),
                        });
                        activityResponse = await activity.json();
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

        setCourseContentInformation((prev) => {
            const updatedSections = prev.map((section) => {
                if (section.id === sectionToEdit.id) {
                    return sectionToEditTemp;
                }
                return section;
            });
            return updatedSections;
        })
        setSectionToEdit(sectionToEditTemp);

        // Finalmente comprobamos si se ha cambiado el orden de las subsecciones, si es asi, se actualiza el estado de la seccion
        if (checkIfSectionHadReorder()) {
            const subsectionListId = sectionToEditTemp.attributes.subsections.data.map((subsection) => subsection.id);
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

        setEditSectionFlag(false);
        message.success('Changes saved');
        window.location.reload();
        setLoading(false);
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

            setCourseContentInformation((prev) => {
                const updatedSections = prev.filter((section) => section.id !== sectionToEdit.id);
                return updatedSections;
            })
            setCourseSection(courseContentInformation[0].attributes.title)
            setCourseSubsection(courseContentInformation[0].attributes.subsections.data[0])
            setLoadingDelete(false);
            setEditSectionFlag(false);
            message.success('Section deleted');

        } catch (error) {
            setLoadingDelete(false);
            console.error(error);
            message.error('An error occurred while deleting the section');
        }
    }

    return (
        <>
            <button className='flex items-center mt-5 text-sm duration-150 hover:-translate-x-1 ' onClick={() => setEditSectionFlag(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                </svg>
                <p className='ml-1'>Go back to course</p>
            </button>
            <div className='flex gap-3 mt-5'>
                <div>
                    <p className='text-lg font-medium'>Edit course section</p>
                    <p className='text-sm text-gray-600'>Reorder the sequence or edit the content of your course section.</p>
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
                <div className='h-full p-5 pr-24 mt-5 mb-5 text-base font-medium bg-white rounded-md shadow-md'>
                    <h3 className=''>Course sequence</h3>
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
                <div className='-mr-7'>
                    <SubsectionItems setCreateCourseSectionsList={setSectionToEditTemp} sectionToEdit={sectionToEditTemp} context={'coursesInside'} />
                </div>
            </div>
        </>
    )
}
