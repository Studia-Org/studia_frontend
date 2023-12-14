import React, { useState, useEffect } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';
import MDEditor from '@uiw/react-md-editor';
import { motion } from 'framer-motion';
import { Switch } from 'antd';
import dayjs from 'dayjs';
import { message, Select, Tag } from 'antd';
import { ACTIVITY_CATEGORIES } from '../../../../../constant';
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import '../../../styles/filePondNoBoxshadow.css'
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileEncode)

export const CreateTask = ({ task, setTask, section, setCreateCourseSectionsList, setEditTaskFlag }) => {
    const [content, setContent] = useState();
    const [title, setTitle] = useState('');
    const [switchState, setSwitchState] = useState(true);
    const [deadline, setDeadline] = useState();
    const [categories, setCategories] = useState([]);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        if (task[section.id]) {
            setContent(task[section.id].description);
            setTitle(task[section.id].title);
            setSwitchState(task[section.id].evaluable);
            setDeadline(task[section.id].deadline);
            setCategories(task[section.id].categories);
            setFiles(task[section.id].files.map(file => ({ file: file, source: file })));
        }
    }, [])

    function saveChangesButton() {
        setCreateCourseSectionsList((prevSections) => {
            const newSections = prevSections.map((section) => {
                if (section.id === section.id && section?.task) {
                    const updatedTask = {
                        id: section.task.id,
                        title: title,
                        description: content,
                        deadline: deadline,
                        evaluable: switchState,
                        categories: categories,
                        files: files.map(file => file.file),
                        ponderation: section.task.ponderation,
                        type: section.task.type,
                        order: section.task.order,
                    };
                    setTask(prevTask => ({
                        ...prevTask,
                        [section.id]: updatedTask,
                    }));
                    return {
                        ...section,
                        task: updatedTask,
                    };
                }
                return section;
            });
            return newSections;
        });
        setEditTaskFlag(false);
        message.success('Task updated successfully');
    }

    function createTaskButton() {
        try {
            if (!title || !content || !deadline || !categories) {
                throw new Error('Please complete all required fields.');
            }
            const activity = {
                id: Math.random().toString(16).slice(2),
                title: title,
                description: content,
                deadline: deadline,
                ponderation: 0,
                categories: categories,
                type: 'Delivery',
                files: files.map(file => file.file),
                order: 5,
                evaluable: switchState,
            }
            const newTask = {
                [section.id]: activity,
            }
            setTask(prevTask => ({
                ...prevTask,
                ...newTask,
            }));
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
                <h2 className='font-medium text-xl '>{section.name}</h2>
                <Tag color="#108ee9">Section</Tag>
                <div className='flex ml-auto'>
                    {

                        task[section.id] === undefined ?
                            <button onClick={() => createTaskButton()} className=' duration-150 text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2.5 text-center  items-center  '>
                                Create task
                            </button>
                            :
                            <button onClick={() => saveChangesButton()} className=' duration-150 text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2.5 text-center  items-center  '>
                                Save Changes
                            </button>
                    }
                </div>

            </div>
            <p className='mt-5 text-sm text-gray-500'>
                Before we proceed to create our first sequence, let's first establish the task that will encompass the entire section!
            </p>
            <div className='mt-5'>
                <div className='flex'>

                    <div className='w-1/2 pr-2 space-y-2 mb-3 flex flex-col'>
                        <label className='text-sm mb-2' htmlFor="" >Task title</label>
                        <TextField className='bg-white inline-block' id="outlined-basic" value={title} onChange={(e) => setTitle(e.target.value)} variant="outlined" />
                    </div>

                    <div className='pl-10 space-y-2 mb-3 flex flex-col justify-center'>
                        <label className='text-sm ' htmlFor="" >Deadline</label>
                        <div className='flex'>
                            <div className='w-full mr-5'>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker']}>
                                        <DatePicker value={deadline ? dayjs(deadline) : null} onChange={(date) => {
                                            setDeadline(dayjs(date).format('YYYY-MM-DD'));
                                        }} className='w-full bg-white font-thin' />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=''>
                    <label className='text-sm ' htmlFor="" >Task description</label>
                    <MDEditor
                        className='mt-2'
                        style={{ minHeight: '25rem' }}
                        data-color-mode="light"
                        onChange={setContent}
                        visibleDragbar={false}
                        value={content}
                    />
                </div>
                <div className='flex mt-5'>
                    <div className='w-1/2 pr-2 space-y-2'>
                        <label className='text-sm' htmlFor="">Task files</label>
                        <FilePond
                            allowMultiple={true}
                            onupdatefiles={(fileItems) => {
                                setFiles(fileItems);
                            }}
                            maxFiles={10}
                        />
                    </div>
                </div>

                <div className='flex mb-16'>
                    <div className='w-1/2 pr-2 space-y-2'>
                        <label className='text-sm' htmlFor="">Task Categories</label>
                        <Select
                            mode="tags"
                            className=''
                            style={{ width: '100%' }}
                            placeholder=""
                            value={categories}
                            onChange={(value) => setCategories(value)}
                            options={Object.keys(ACTIVITY_CATEGORIES).map(key => ({ label: key, value: key }))}
                        />
                    </div>

                    <div className='pl-10 space-y-2 flex flex-col justify-center'>
                        <label className='text-sm mb-2' htmlFor="">Evaluable</label>
                        <Switch className='shadow-md' checked={switchState} onChange={setSwitchState} />
                    </div>
                </div>


            </div>
        </motion.div>
    )
}
