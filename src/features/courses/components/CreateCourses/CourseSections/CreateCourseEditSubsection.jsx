import React, { useState, useEffect, useRef } from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { QuestionnaireComponentEditable } from './QuestionnaireComponentEditable';
import TextField from '@mui/material/TextField';
import { CreateTask } from './CreateTask';
import { Collapse, message } from 'antd';
import MDEditor from '@uiw/react-md-editor';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import '../../../styles/filePondNoBoxshadow.css';


registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const { Panel } = Collapse;


export const CreateCourseEditSubsection = ({
  subsection,
  setEditSubsectionFlag,
  setCreateCourseSectionsList,
  createCourseSectionsList,
  setSubsectionEditing,
  task,
  setTask,
  sectionId,
}) => {
  const [landscape_photo, setLandscape_photo] = useState((createCourseSectionsList.flatMap((section) => section.subsections).find((sub) => sub.id === subsection.id))?.landscape_photo);
  const [files, setFiles] = useState((createCourseSectionsList.flatMap((section) => section.subsections).find((sub) => sub.id === subsection.id))?.files);

  useEffect(() => {
    const matchingSubsection = createCourseSectionsList
      .flatMap((section) => section.subsections)
      .find((sub) => sub.id === subsection.id);

    if (matchingSubsection) {
      setSubsectionEditing(matchingSubsection);
    }
  }, [createCourseSectionsList]);


  const handleSubsectionChange = (type, newValue) => {
    setCreateCourseSectionsList((courses) => {
      const updatedCourses = courses.map((course) => {
        if (course.id === sectionId) {
          const sectionCopy = { ...course };
          const subsectionCopy = { ...subsection };
          switch (type) {
            case 'title':
            case 'start_date':
            case 'end_date':
            case 'description':
            case 'landscape_photo':
            case 'files':
            case 'content':
              subsectionCopy[type] = newValue;
              break;
            default:
              break;
          }
          sectionCopy.subsections = sectionCopy.subsections.map((sub) => (sub.id === subsection.id ? subsectionCopy : sub));
          return sectionCopy;
        }

        return course;
      });

      return updatedCourses;
    });
  };

  const handleTitleChange = (newTitle) => {
    if (newTitle === '') {
      message.error('Title cannot be empty');
    } else {
      handleSubsectionChange('title', newTitle);
    }
  };

  const renderDatePicker = (label, date, onChange) => (
    <div>
      <label className='text-sm text-gray-500'>{label}</label>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DateTimePicker']}>
          <DateTimePicker
            value={dayjs(date)} onChange={onChange}
          />
        </DemoContainer>
      </LocalizationProvider>
    </div>
  );

  return (
    <div className='w-[45rem]'>
      <button className='text-sm flex items-center -translate-y-5 ' onClick={() => setEditSubsectionFlag(false)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
        </svg>
        <p className='ml-1'>Add items to the sequence</p>
      </button>
      {subsection?.questionnaire ? (
        <QuestionnaireComponentEditable
          subsection={subsection}
          setCreateCourseSectionsList={setCreateCourseSectionsList}
          createCourseSectionsList={createCourseSectionsList}
        />
      ) : (
        <>
          <input className='text-lg bg-transparent border p-3 rounded-xl border-gray-400 ' type="text" onChange={(e) => handleTitleChange(e.target.value)} value={subsection.title} />
          <div className='bg-white rounded-md shadow-md p-5 mt-4 mb-10 '>
            <div className='flex items-center justify-between w-full '>
              <div>{renderDatePicker('Start Date', subsection?.start_date, handleSubsectionChange.bind(null, 'start_date'))}</div>
              <div>{renderDatePicker('End Date', subsection?.end_date, handleSubsectionChange.bind(null, 'end_date'))}</div>
            </div>
            <div className='mt-7 space-y-2'>
              <label className='text-sm text-gray-500 mt-7 ' htmlFor=''>
                Subsection description
              </label>
              <div className='flex w-full'>
                <TextField className=' flex w-full' id='outlined-basic' value={subsection.description} onChange={(e) => handleSubsectionChange('description', e.target.value)} variant='outlined' />
              </div>
            </div>
            <div className='mt-3 space-y-2'>
              <label className='text-sm text-gray-500 ' htmlFor=''>
                Background Photo
              </label>
              <FilePond
                files={landscape_photo}
                allowMultiple={false}
                onupdatefiles={(e) => {
                  setLandscape_photo(e);
                  handleSubsectionChange('landscape_photo', e);
                }} maxFiles={1}
              />
            </div>
            <div className='mt-3 space-y-2'>
              <label className='text-sm text-gray-500 ' htmlFor=''>
                Subsection Files
              </label>
              <FilePond
                files={files}
                allowMultiple={true}
                allowReorder={true}
                onupdatefiles={(e) => {
                  setFiles(e);
                  handleSubsectionChange('files', e);
                }}
              />
            </div>
            <label className='text-sm text-gray-500' htmlFor=''>
              Subsection content
            </label>
            <MDEditor className='mt-2 mb-2' data-color-mode='light' onChange={(e) => handleSubsectionChange('content', e)} value={subsection.content} />
          </div>
        </>
      )}
    </div>
  );
};

