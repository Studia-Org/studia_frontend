import React, { useState, useEffect } from 'react'
import { TableCategories } from './TableCategories';
import MDEditor from '@uiw/react-md-editor';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { UploadFiles } from './UploadFiles';
import { message, Select, Tag, Input, DatePicker } from 'antd';
import { ACTIVITY_CATEGORIES } from '../../../../../constant';
import { ca } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { set } from 'date-fns';

export const CreateTask = ({ task, setTask, section, setCreateCourseSectionsList, setEditTaskFlag, setCreateCourseSectionsListCopy, categories, setCategories }) => {
    const [content, setContent] = useState();
    const [title, setTitle] = useState('');
    const [deadline, setDeadline] = useState();
    const [categoriesInside, setCategoriesInside] = useState();
    const [files, setFiles] = useState([]);
    const [isGroup, setIsGroup] = useState(false);
    const [numberOfStudentsperGroup, setNumberOfStudentsperGroup] = useState(1);

    const { t } = useTranslation();

    const handleChangeGroup = (value) => {
        if (value) {
            setIsGroup(true);
        } else {
            setIsGroup(false);
            setNumberOfStudentsperGroup(1);
        }
    }

    useEffect(() => {
        if (task[section.id]) {
            setContent(task[section.id].description);
            setTitle(task[section.id].title);
            setDeadline(task[section.id].deadline);
            setFiles(task[section.id].files.map(file => (file)));
            setCategoriesInside(categories[section.id]);
            setIsGroup(task[section.id].groupActivity);
            setNumberOfStudentsperGroup(task[section.id].numberOfStudentsperGroup);
        }
    }, [])

    function saveChangesButton() {
        const newCategories = {
            [section.id]: categoriesInside,
        }

        setCategories(prevCategories => {
            const updatedCategories = { ...prevCategories, ...newCategories };
            localStorage.setItem('categories', JSON.stringify(updatedCategories));
            return updatedCategories;
        });


        setCreateCourseSectionsList((prevSections) => {
            let updatedTask;
            const newSections = prevSections.map((section) => {
                updatedTask = {
                    id: section.task?.id || task[section.id].id,
                    title: title,
                    description: content,
                    deadline: deadline,
                    evaluable: true,
                    categories: [],
                    files: files.map((file) => file),
                    ponderation: section.task?.ponderation || task[section.id].ponderation,
                    type: section.task?.type || task[section.id]?.type,
                    order: section.task?.order || task[section.id]?.order,
                    numberOfStudentsperGroup: numberOfStudentsperGroup,
                    groupActivity: isGroup,
                };

                setTask((prevTask) => {
                    const newTask = { ...prevTask, [section.id]: updatedTask };
                    localStorage.setItem('task', JSON.stringify(newTask));
                    return newTask;
                });

                return {
                    ...section,
                    task: updatedTask,
                };
            });


            newSections.forEach((section) => {
                if (section.subsections && section.subsections.length > 0) {
                    section.subsections.forEach((subsection) => {
                        if (subsection.type === 'task') {
                            const index = subsection.title.indexOf(':');
                            if (index !== -1) {
                                subsection.title = subsection.title.substring(0, index + 1) + ' ' + title;
                            }
                            subsection.activity.description = updatedTask.description;
                            subsection.activity.title = `${subsection.title}: ${updatedTask.title}`;
                            subsection.activity.deadline = updatedTask.deadline;;
                            subsection.activity.files = updatedTask.files;
                            subsection.activity.numberOfStudentsperGroup = updatedTask.numberOfStudentsperGroup;
                            subsection.activity.groupActivity = updatedTask.groupActivity;
                        }
                    });
                }
            });
            return newSections;
        });


        setCreateCourseSectionsListCopy((prevSections) => {
            let updatedTask;

            const newSections = prevSections.map((section) => {
                updatedTask = {
                    id: section.task?.id || task[section.id].id,
                    title: title,
                    description: content,
                    deadline: deadline,
                    evaluable: true,
                    categories: categories,
                    files: files.map((file) => file),
                    ponderation: section.task?.ponderation || task[section.id].ponderation,
                    type: section.task?.type || task[section.id]?.type,
                    order: section.task?.order || task[section.id]?.order,
                    numberOfStudentsperGroup: numberOfStudentsperGroup,
                    groupActivity: isGroup,
                };


                setTask((prevTask) => {
                    const newTask = { ...prevTask, [section.id]: updatedTask };
                    localStorage.setItem('task', JSON.stringify(newTask));
                    return newTask;
                });

                return {
                    ...section,
                    task: updatedTask,
                };
            });

            newSections.forEach((section) => {
                if (section.subsections && section.subsections.length > 0) {
                    section.subsections.forEach((subsection) => {
                        if (subsection.type === 'task') {
                            const index = subsection.title.indexOf(':');
                            if (index !== -1) {
                                subsection.title = subsection.title.substring(0, index + 1) + ' ' + title;
                            }
                            subsection.activity.description = updatedTask.description;
                            subsection.activity.title = `${subsection.title}`;
                            subsection.activity.deadline = updatedTask.deadline;
                            subsection.activity.files = updatedTask.files;
                            subsection.activity.numberOfStudentsperGroup = updatedTask.numberOfStudentsperGroup;
                            subsection.activity.groupActivity = updatedTask.groupActivity;
                        }
                    });
                }
            });
            return newSections;
        });
        setEditTaskFlag(false);
        message.success('Task updated successfully');
    }

    const handleTitleChange = (e) => {
        const newValue = e.target.value;
        if (newValue.includes(':')) {
            message.error("Symbol ':' is not allowed");
        } else {
            setTitle(newValue);
        }
    };


    function createTaskButton() {
        try {
            if (!title || !content || !deadline || categoriesInside?.length === 0 || categoriesInside?.length === undefined) {
                throw new Error('Please complete all required fields.');
            }
            const activity = {
                id: Math.random().toString(16).slice(2),
                title: title,
                description: content,
                deadline: new Date(deadline).toISOString(),
                ponderation: 0,
                categories: [],
                type: 'task',
                files: files.map(file => file),
                order: 5,
                evaluable: true,
                numberOfStudentsperGroup: numberOfStudentsperGroup,
                groupActivity: isGroup,
            }
            const newTask = {
                [section.id]: {
                    id: Math.random().toString(16).slice(2),
                    title: title,
                    description: content,
                    deadline: new Date(deadline).toISOString(),
                    ponderation: 0,
                    categories: categories,
                    type: 'task',
                    files: files.map(file => file),
                    order: 5,
                    evaluable: true,
                    numberOfStudentsperGroup: numberOfStudentsperGroup,
                    groupActivity: isGroup,
                },
            }
            setTask(prevTask => {
                const updatedTask = { ...prevTask, ...newTask };
                localStorage.setItem('task', JSON.stringify(updatedTask));
                return updatedTask;
            });

            const newCategories = {
                [section.id]: categoriesInside,
            }
            setCategories(prevCategories => {
                const updatedCategories = { ...prevCategories, ...newCategories };
                localStorage.setItem('categories', JSON.stringify(updatedCategories));
                return updatedCategories;
            });

            setCreateCourseSectionsList((prevSections) => {
                const newSections = prevSections.map((section) => {
                    if (section.id === section.id) {
                        return {
                            ...section,
                            task: activity
                        };
                    }
                    return section;
                });
                return newSections;
            });
            setCreateCourseSectionsListCopy((prevSections) => {
                const newSections = prevSections.map((section) => {
                    if (section.id === section.id) {
                        return {
                            ...section,
                            task: activity
                        };
                    }
                    return section;
                });
                localStorage.setItem('createCourseSectionsList', JSON.stringify(newSections));
                return newSections;
            });

            message.success('Task created successfully');

        } catch (error) {
            message.error(error.message);
        }

    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className='mr-10'>
            <div className='flex items-center gap-2 mt-5'>
                <h2 className='text-xl font-medium '>{section.name}</h2>
                <Tag color="#108ee9">{t("CREATE_COURSES.COURSE_SECTIONS.CREATE_TASK.section")}</Tag>
                <div className='flex ml-auto'>
                    {

                        task[section.id] === undefined ?
                            <button onClick={() => createTaskButton()} className=' duration-150 text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2.5 text-center  items-center  '>
                                {t("CREATE_COURSES.COURSE_SECTIONS.CREATE_TASK.save_changes")}
                            </button>
                            :
                            <button onClick={() => saveChangesButton()} className=' duration-150 text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2.5 text-center  items-center  '>
                                {t("CREATE_COURSES.COURSE_SECTIONS.CREATE_TASK.save_changes")}
                            </button>
                    }
                </div>

            </div>
            <p className='mt-5 text-sm text-gray-500'>
                {t("CREATE_COURSES.COURSE_SECTIONS.CREATE_TASK.principal_text")}
            </p>
            <div className='mt-5'>
                <div className='flex'>

                    <div className='flex flex-col w-1/2 pr-2 mb-3'>
                        <label className='mb-3 text-sm' htmlFor="" >{t("CREATE_COURSES.COURSE_SECTIONS.CREATE_TASK.task_title")} *</label>
                        <Input
                            className='px-1 py-3 border border-[#d9d9d9] rounded-md text-sm pl-3'
                            placeholder={t("CREATE_COURSES.COURSE_SECTIONS.CREATE_TASK.task_title_placeholder")}
                            value={title}
                            onChange={(e) => handleTitleChange(e)}
                        />
                    </div>

                    <div className='flex flex-col justify-center mb-3 ml-10'>
                        <label className='mb-3 text-sm' htmlFor="" >{t("CREATE_COURSES.COURSE_SECTIONS.CREATE_TASK.task_end_date")} *</label>
                        <DatePicker className='py-3' placeholder={t("CREATE_COURSES.COURSE_SECTIONS.CREATE_TASK.task_end_date_placeholder")}
                            showTime format={'YYYY-MM-DD HH:mm'}
                            onOk={(date) => { setDeadline(dayjs(date).format('YYYY-MM-DD HH:mm:ss')) }} value={deadline ? dayjs(deadline) : null} />
                    </div>
                </div>
                <div>
                    <label className='text-sm ' htmlFor="" >{t("CREATE_COURSES.COURSE_SECTIONS.CREATE_TASK.task_description")} *</label>
                    <MDEditor
                        className='mt-2'
                        placeholder={t("CREATE_COURSES.COURSE_SECTIONS.CREATE_TASK.task_description_placeholder")}
                        style={{ minHeight: '25rem' }}
                        data-color-mode="light"
                        onChange={setContent}
                        visibleDragbar={false}
                        value={content}
                    />
                </div>
                <div className='flex mt-5 mb-32'>
                    <div className='w-1/2 pr-2 mr-8 space-y-4'>
                        <label className='text-sm' htmlFor="">{t("CREATE_COURSES.COURSE_SECTIONS.CREATE_TASK.task_categories")} *</label>
                        <p className='text-xs text-gray-500'>{t("CREATE_COURSES.COURSE_SECTIONS.CREATE_TASK.task_categories_text")}</p>
                        <Select
                            className=''
                            mode="tags"
                            placement='topRight'
                            style={{ width: '100%' }}
                            placeholder={t("CREATE_COURSES.COURSE_SECTIONS.CREATE_TASK.task_categories_placeholder")}
                            defaultValue={categories[section.id]}
                            value={categoriesInside}
                            onChange={(value) => setCategoriesInside(value)}
                            options={Object.keys(ACTIVITY_CATEGORIES).map(key => ({ label: t(`OBJECTIVES_CONSTANT.${key}`), value: key }))}
                        />
                        <hr className='' />
                        <div className=''>
                            <label className='text-sm ' htmlFor=''>
                                {t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.pairs_or_individual")} *
                            </label>
                            <Select
                                value={isGroup}
                                style={{ width: '100%', marginTop: '5px' }}
                                onChange={(number) => { handleChangeGroup(number) }}
                                options={
                                    [
                                        { label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.individual"), value: false },
                                        { label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.groups"), value: true }
                                    ]
                                }
                            />
                            {
                                isGroup && (
                                    <div className='mt-4'>
                                        <label className='text-sm ' htmlFor=''>
                                            {t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.students_per_group")} *
                                        </label>
                                        <Select
                                            defaultValue={numberOfStudentsperGroup}
                                            style={{ width: '100%', marginTop: '5px' }}
                                            onChange={(number) => { setNumberOfStudentsperGroup(number) }}
                                            options={[{ label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }, { label: '5', value: 5 }]}
                                        />
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className='flex-auto w-1/2 pr-2 space-y-2'>
                        <label className='text-sm' htmlFor="">{t("CREATE_COURSES.COURSE_SECTIONS.CREATE_TASK.task_files")}</label>
                        <div style={{ flex: 'none' }} className='p-3 bg-white border rounded-md border-stone-300'>
                            <UploadFiles fileList={files} setFileList={setFiles} listType={'text'} maxCount={5} />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
