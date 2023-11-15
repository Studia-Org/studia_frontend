import React, { useState, useEffect } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';
import MDEditor from '@uiw/react-md-editor';
import { Switch } from 'antd';
import dayjs from 'dayjs';
import { message } from 'antd';
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import '../../styles/filePondNoBoxshadow.css'
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileEncode)

export const CreateTask = ({ task, setTask, sectionId, subsection, setCreateCourseSectionsList, createCourseSectionsList }) => {
    const [content, setContent] = useState();
    const [title, setTitle] = useState('');
    const [switchState, setSwitchState] = useState(true);
    const [deadline, setDeadline] = useState();
    const [files, setFiles] = useState([]);

    useEffect(() => {
        console.log('noel', task);
        if (task && task[sectionId] && task[sectionId].title && task[sectionId].description && task[sectionId].deadline) {
            setTitle(task[sectionId].title);
            setContent(task[sectionId].description);
            setSwitchState(task[sectionId].evaluable);
            setDeadline(task[sectionId].deadline);
            setFiles(task[sectionId].files || []);
        }
    }, [task]);

    function saveChangesButton() {
        console.log(content)

        setCreateCourseSectionsList((prevSections) => {
            const newSections = prevSections.map((section) => {
                if (section.id === sectionId && section?.task) {
                    const updatedTask = {
                        id: section.task.id,
                        title: title,
                        description: content,
                        deadline: deadline,
                        evaluable: switchState,
                        files: files.map(file => file.file),
                        ponderation: section.task.ponderation,
                        type: section.task.type,
                        order: section.task.order,
                    };
                    setTask(prevTask => ({
                        ...prevTask,
                        [sectionId]: updatedTask,
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

        message.success('Task updated successfully');
    }

    function createTaskButton() {
        try {
            if (!title || !content || !deadline) {
                throw new Error('Please complete all required fields.');
            }
            const activity = {
                id: Math.random().toString(16).slice(2),
                title: title,
                description: content,
                deadline: deadline,
                ponderation: 0,
                type: 'Delivery',
                files: files.map(file => file.file),
                order: 5,
                evaluable: switchState,
            }
            const newTask = {
                [sectionId]: activity,
            }
            setTask(prevTask => ({
                ...prevTask,
                ...newTask,
            }));
            setCreateCourseSectionsList((prevSections) => {
                const newSections = prevSections.map((section) => {
                    if (section.id === sectionId) {
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
        <>
            <label className='text-sm text-gray-500 ' htmlFor="" >Task</label>
            <div className='mt-2 border border-[#b8bcc2] rounded p-5 '>
                <div className='space-y-2 mb-3'>
                    <label className='text-sm text-gray-500' htmlFor="" >Task title</label>
                    <TextField className=' flex w-full' id="outlined-basic" value={title} onChange={(e) => setTitle(e.target.value)} variant="outlined" />
                </div>

                <label className='text-sm text-gray-500' htmlFor="" >Task description</label>
                <MDEditor
                    className='mt-2'
                    data-color-mode="light"
                    onChange={setContent}
                    value={content} />
                <div className='mt-3 space-y-2'>
                    <label className='text-sm text-gray-500' htmlFor="" >Task files</label>
                    <FilePond
                        allowMultiple={true}
                        onupdatefiles={(fileItems) => {
                            setFiles(fileItems);
                        }}
                        maxFiles={10} />
                </div>
                <label className='text-sm text-gray-500' htmlFor="" >Deadline</label>
                <div className='flex'>
                    <div className='w-full mr-5'>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker value={dayjs(deadline)} onChange={(date) => {
                                    setDeadline(dayjs(date).format('YYYY-MM-DD'));
                                }} className='w-full' />
                            </DemoContainer>
                        </LocalizationProvider>
                    </div>
                    <div className='flex flex-col mt-2'>
                        <label className='text-sm text-gray-500 mb-2' htmlFor="" >Evaluable</label>
                        <Switch className='shadow-md' checked={switchState} onChange={setSwitchState} />
                    </div>
                </div>
                <div className='flex justify-center'>
                    {
                        task[sectionId] === undefined ?
                            <button onClick={() => createTaskButton()} className='justify-center flex duration-150 text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none font-medium mt-4 rounded-lg text-sm px-4 py-2.5 text-center  items-center mr-2 '>
                                Create task
                            </button>
                            :
                            <button onClick={() => saveChangesButton()} className='justify-center flex duration-150 text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none font-medium mt-4 rounded-lg text-sm px-4 py-2.5 text-center  items-center mr-2 '>
                                Save Changes
                            </button>
                    }
                </div>
            </div>
        </>
    )
}
