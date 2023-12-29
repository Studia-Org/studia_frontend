import React, { useState, useEffect } from 'react';
import { QuestionnaireComponentEditable } from './QuestionnaireComponentEditable';
import { PeerReviewRubricModal } from './PeerReviewRubricModal';
import dayjs from 'dayjs';
import { message, Button, DatePicker, Input, Switch, InputNumber, Divider } from 'antd';

import MDEditor from '@uiw/react-md-editor';
import { UploadFiles } from './UploadFiles';

import '../../../styles/antdButtonStyles.css'
import { PonderationWarning } from './PonderationWarning';
const { RangePicker } = DatePicker;


export const CreateCourseEditSubsection = ({
  subsection,
  setEditSubsectionFlag,
  setCreateCourseSectionsList,
  createCourseSectionsList,
  setSubsectionEditing,
  sectionId,
}) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [landscape_photo, setLandscape_photo] = useState([]);
  const [markdownContent, setMarkdownContent] = useState(subsection.content);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const matchingSubsection = createCourseSectionsList
      .flatMap((section) => section.subsections)
      .find((sub) => sub.id === subsection.id);

    if (matchingSubsection) {
      setSubsectionEditing(matchingSubsection);
    }
  }, [createCourseSectionsList]);

  useEffect(() => {
    setLandscape_photo((createCourseSectionsList.flatMap((section) => section.subsections).find((sub) => sub.id === subsection.id))?.landscape_photo);
    setFiles((createCourseSectionsList.flatMap((section) => section.subsections).find((sub) => sub.id === subsection.id))?.files);
  }, [subsection])

  useEffect(() => {
    handleSubsectionChange('landscape_photo', landscape_photo);
  }, [landscape_photo])

  useEffect(() => {
    handleSubsectionChange('files', files);
  }, [files])

  const handleSubsectionChange = (type, newValue) => {
    setCreateCourseSectionsList((courses) => {
      const updatedCourses = courses.map((course) => {
        if (course.id === sectionId) {
          const sectionCopy = { ...course };
          const subsectionCopy = { ...subsection };
          switch (type) {
            case 'title':
            case 'description':
            case 'landscape_photo':
            case 'files':
            case 'content':
              subsectionCopy[type] = newValue;
              break;
            case 'date':
              subsectionCopy.start_date = newValue[0];
              subsectionCopy.end_date = newValue[1];
              break;
            default:
              break;
          }
          if (type === 'evaluable') {
            subsectionCopy.activity.evaluable = newValue;
          }
          if (type === 'ponderation') {
            subsectionCopy.activity.ponderation = newValue;

          }
          if ((subsection?.type === 'peerReview' || subsection?.type === 'forum') && type === 'end_date') {
            subsectionCopy.activity.deadline = newValue;
          }
          sectionCopy.subsections = sectionCopy.subsections.map((sub) => (sub.id === subsection.id ? subsectionCopy : sub));

          return sectionCopy;
        }
        return course;
      });
      return updatedCourses;
    });
  };

  const onChangeDate = (value) => {
    if (value === null) {
      handleSubsectionChange('date', [null, null]);
    } else {
      handleSubsectionChange('date', value);
    }
  };

  const handleTitleChange = (newTitle) => {
    if (newTitle === '') {
      message.error('Title cannot be empty');
    } else {
      handleSubsectionChange('title', newTitle);
    }
  };

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
          sectionId={sectionId}
        />
      ) : (
        <>
          <Input className='px-1 py-3 border border-[#d9d9d9] rounded-md text-lg pl-3' placeholder="Description" onChange={(e) => handleTitleChange(e.target.value)} value={subsection.title} />
          <div className='bg-white rounded-md shadow-md p-5 mt-4 mb-10 '>
            {
              subsection?.type === 'peerReview' && (
                <div className='flex flex-col justify-center space-y-2 mb-5'>
                  <PeerReviewRubricModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} rubricData={subsection.activity.PeerReviewRubrica} setSubsectionEditing={setSubsectionEditing} />
                  <label className='text-sm text-gray-500 '>
                    Peer review rubric *
                  </label>
                  <Button onClick={() => {
                    setIsModalOpen(true);
                    document.body.style.overflow = 'hidden';
                  }}>
                    Edit Rubric
                  </Button>
                </div>
              )
            }
            {
              subsection?.type === 'task' && (
                <div className='space-y-2 mb-5'>
                  <label className='text-sm text-gray-500' htmlFor=''>
                    Cover
                  </label>
                  <UploadFiles fileList={landscape_photo} setFileList={setLandscape_photo} listType={'picture'} maxCount={1} />
                </div>
              )
            }
            <div className='flex items-center justify-between w-full '>
              <div className='w-full space-y-2'>
                <label className='text-sm text-gray-500 mb-4'>Subsection Date *</label>
                <RangePicker
                  className='w-full py-4'
                  showTime={{
                    format: 'HH:mm',
                  }}
                  value={subsection.start_date ? [dayjs(subsection.start_date), dayjs(subsection.end_date)] : null}
                  format="YYYY-MM-DD HH:mm"
                  onChange={onChangeDate}
                />
              </div>

            </div>
            <div className='mt-7 flex items-center justify-between'>
              <div className='flex items-center'>
                <label className='text-sm text-gray-500 mr-3 block' htmlFor=''>Evaluable * </label>
                <Switch onChange={(e) => handleSubsectionChange('evaluable', e)} checked={subsection.activity?.evaluable} className='bg-gray-300' />
              </div>

              <Divider type="vertical" />
              <div className='flex items-center gap-4'>
                {
                  subsection.activity?.evaluable && (
                    <PonderationWarning createCourseSectionsList={createCourseSectionsList} sectionID={sectionId} />
                  )
                }
                <label className='text-sm text-gray-500' htmlFor=''>Ponderation *</label>
                <InputNumber
                  disabled={!subsection.activity?.evaluable}
                  defaultValue={0}
                  value={subsection.activity?.evaluable ? subsection.activity?.ponderation : 0}
                  onChange={(e) => handleSubsectionChange('ponderation', e)}
                  min={0}
                  max={100}
                  formatter={(value) => `${value}%`}
                  parser={(value) => value.replace('%', '')}
                />
              </div>

            </div>
            <div className='mt-7 space-y-2'>
              <label className='text-sm text-gray-500 mt-7 ' htmlFor=''>Subsection description</label>
              <div className='flex w-full prose prose-lg'>
                <Input className='px-1 py-3 border border-[#d9d9d9] rounded-md text-sm pl-3' placeholder="Description" value={subsection.description}
                  onChange={(e) => handleSubsectionChange('description', e.target.value)} />
              </div>
            </div>
            <div className='mt-3 space-y-2 mb-5'>
              <label className='text-sm text-gray-500 ' htmlFor=''>
                Subsection Files (max 5)
              </label>
              <UploadFiles fileList={files} setFileList={setFiles} listType={'text'} maxCount={5} />
            </div>
            <label className='text-sm text-gray-500' htmlFor=''>
              Subsection content *
            </label>
            <MDEditor className='mt-2 mb-2' data-color-mode='light' onChange={setMarkdownContent} onBlur={() => handleSubsectionChange('content', markdownContent)}
              value={markdownContent} visibleDragbar={false} />
          </div>
        </>
      )}
    </div>
  );
};

