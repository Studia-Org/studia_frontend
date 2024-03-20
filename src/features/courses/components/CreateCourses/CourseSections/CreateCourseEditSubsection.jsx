import React, { useState, useEffect, useRef } from 'react';
import { QuestionnaireComponentEditable } from './QuestionnaireComponentEditable';
import { PeerReviewRubricModal } from './PeerReviewRubricModal';
import dayjs from 'dayjs';
import { motion } from "framer-motion";
import { TableCategories } from './TableCategories';
import { message, Button, DatePicker, Input, Switch, InputNumber, Select, Divider, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { SubsectionContentModal } from './SubsectionContentModal';
import { UploadFiles } from './UploadFiles';
import '../../../styles/antdButtonStyles.css'
import { PonderationWarning } from './PonderationWarning';
import { debounce } from 'lodash';
import { set, sub } from 'date-fns';


const { RangePicker } = DatePicker;


export const CreateCourseEditSubsection = ({
  subsection,
  setEditSubsectionFlag,
  setCreateCourseSectionsList,
  createCourseSectionsList,
  setSubsectionEditing,
  sectionId,
  allSubsections,
  categories,
  setCategories
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubsectionModalOpen, setIsSubsectionModalOpen] = useState(false);
  const [landscape_photo, setLandscape_photo] = useState([]);
  const [markdownContent, setMarkdownContent] = useState(subsection.content);
  const [files, setFiles] = useState([]);
  const filteredSubsections = allSubsections.subsections.filter((sub) => sub.type.toLowerCase() === 'task')
  const [items, setItems] = useState([1, 2, 3]);
  const [name, setName] = useState('');
  const inputRef = useRef(null);
  const [isGroup, setIsGroup] = useState(subsection.activity?.groupActivity === undefined ? false : subsection.activity.groupActivity);
  const [numberOfStudentsperGroup, setNumberOfStudentsperGroup] =
    useState(subsection.activity?.numberOfStudentsperGroup === undefined ?
      1 : subsection.activity.numberOfStudentsperGroup);

  if (subsection.activity?.groupActivity === undefined) subsection.activity.groupActivity = false;
  if (subsection.activity?.numberOfStudentsperGroup === undefined) subsection.activity.numberOfStudentsperGroup = 1;

  useEffect(() => {
    const matchingSubsection = createCourseSectionsList
      .flatMap((section) => section.subsections)
      .find((sub) => sub.id === subsection.id);

    if (matchingSubsection) {
      setSubsectionEditing(matchingSubsection);
    }
  }, [createCourseSectionsList]);

  useEffect(() => {
    setMarkdownContent(subsection.content);
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
            case 'peer_review':
              subsectionCopy.activity.task_to_review = newValue;
              break;
            case 'usersToPair':
              subsectionCopy.activity.usersToPair = +newValue;
              break;
            case 'group':
              subsectionCopy.activity.groupActivity = newValue;
              console.log(subsectionCopy)
              if (!newValue) {
                subsectionCopy.activity.numberOfStudentsperGroup = 1;
                setNumberOfStudentsperGroup(1);
              } else if (numberOfStudentsperGroup === 1) {
                setNumberOfStudentsperGroup(2);
                if (subsectionCopy.activity.numberOfStudentsperGroup === 1) subsectionCopy.activity.numberOfStudentsperGroup = 2;
              }
              setIsGroup(newValue);
              break;
            case 'numberOfStudentsperGroup':
              subsectionCopy.activity.numberOfStudentsperGroup = +newValue;
              setNumberOfStudentsperGroup(+newValue);
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

          if ((subsection?.type === 'peerReview' || subsection?.type === 'forum' || subsection?.type === 'thinkAloud') && type === 'date') {
            subsectionCopy.activity.deadline = newValue[1];
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

  function selectBorderColor(type) {
    switch (type) {
      case 'peerReview':
        return 'red-500';
      case 'forum':
        return 'slate-500';
      case 'task':
        return 'blue-500';
      default:
        return 'blue-500';
    }
  }

  console.log(isGroup)
  return (
    <motion.div
      key={subsection.id}
      className='w-full pr-12'
    >
      <button className='flex items-center text-sm -translate-y-5 ' onClick={() => setEditSubsectionFlag(false)}>
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
          categories={categories}
        />
      ) : (
        <div key={subsection.id}>
          <motion.div
            key={subsection.id}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, x: -20 }}
            variants={{
              visible: { opacity: 1, x: 0 },
              hidden: { opacity: 0, x: -20 },
            }}
            transition={{
              type: "spring",
              bounce: 0.7,
              duration: 0.9,
            }}
            className={`p-5 mb-10 bg-white rounded-md shadow-md border-t-[14px] border-${selectBorderColor(subsection?.type)} `}
          >
            <label className='text-sm text-gray-500 !mt-4'>
              Title  *
            </label>
            <Input className='px-1 py-3 border border-[#d9d9d9] rounded-md text-lg pl-3 mb-4 font-medium' placeholder="Description"
              onChange={(e) => handleTitleChange(e.target.value)} value={subsection.title} />
            {

              subsection?.type === 'peerReview' && (
                <div className='flex flex-col justify-center mb-5 space-y-2'>
                  <PeerReviewRubricModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    setCreateCourseSectionsList={setCreateCourseSectionsList}
                    rubricData={subsection.activity.PeerReviewRubrica}
                    setSubsectionEditing={setSubsectionEditing}
                    subsectionEditing={subsection}
                  />
                  <label className='text-sm text-gray-500 '>
                    Peer review rubric *
                  </label>
                  <Button onClick={() => {
                    setIsModalOpen(true);
                    document.body.style.overflow = 'hidden';
                  }}>
                    Edit Rubric
                  </Button>
                  <label className='text-sm text-gray-500 !mt-4'>
                    Select the task for which the peer review will be conducted  *
                  </label>
                  <Select
                    defaultValue={() => {
                      const act = filteredSubsections.find((sub) => sub.id === subsection.activity.task_to_review)
                      if (act === undefined) {
                        subsection.activity.task_to_review = null
                        return 'Select a task'
                      }
                      return act.id
                    }
                    }
                    style={{ width: '100%' }}
                    onChange={(task) => { handleSubsectionChange('peer_review', task) }}
                    options={filteredSubsections.map((sub) => ({ label: sub.title, value: sub.id }))}
                  />
                  <label className='text-sm text-gray-500 !mt-4'>
                    How many students are going to review each other  *
                  </label>
                  <Select
                    defaultValue={subsection.activity.usersToPair || 1}
                    style={{ width: '100%' }}
                    onChange={(number) => { handleSubsectionChange('usersToPair', number) }}
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <Divider
                          style={{
                            margin: '8px 0',
                          }}
                        />
                        <Space
                          style={{
                            padding: '0 8px 4px',
                          }}
                        >
                          <Input
                            placeholder="Enter number of students"
                            className='rounded-md border border-[#d9d9d9] min-w-[230px]'
                            type='number'
                            min={1}
                            ref={inputRef}
                            value={name}
                            onChange={(event) => {
                              setName(event.target.value);
                            }}
                            onKeyDown={(e) => e.stopPropagation()}
                          />

                          <Button type="text" icon={<PlusOutlined />} onClick={(e) => {
                            e.preventDefault();
                            if (!name) {
                              message.error('Please enter a number')
                              return;
                            }
                            if (items.includes(name)) {
                              message.error('This number is already added')
                              return;
                            }
                            if (name <= 0) {
                              message.error('Negative students are not allowed')
                              return;
                            }
                            setItems([...items, name]);
                            setName('');
                            setTimeout(() => {
                              inputRef.current?.focus();
                            }, 0);
                          }}>
                            Add item
                          </Button>
                        </Space>
                      </>
                    )}
                    options={items.map((item) => ({
                      label: item,
                      value: item,
                    }))}

                  />
                  <div>
                    <label className='text-sm text-gray-500 ' htmlFor=''>
                      Will the activity be carried out in pairs or individually? *
                    </label>
                    <Select
                      key={subsection.id + "grouppeerreview"}
                      defaultValue={isGroup}
                      style={{ width: '100%', marginTop: '5px' }}
                      onChange={(number) => { handleSubsectionChange('group', number) }}
                      options={[{ label: 'Individual', value: false }, { label: 'Groups', value: true }]}
                    />
                  </div>

                </div>
              )
            }
            {
              subsection?.type === 'task' && (
                <div className='mb-5 space-y-3'>
                  <label className='text-sm text-gray-500' htmlFor=''>
                    Cover (image)
                  </label>
                  <UploadFiles fileList={landscape_photo} setFileList={setLandscape_photo} listType={'picture'} maxCount={1} />
                  <div>
                    <label className='text-sm text-gray-500 ' htmlFor=''>
                      Will the activity be carried out in pairs or individually? *
                    </label>
                    <Select
                      defaultValue={isGroup}
                      key={subsection.id + "grouptask"}
                      style={{ width: '100%', marginTop: '5px' }}
                      onChange={(number) => { handleSubsectionChange('group', number) }}
                      options={[{ label: 'Individual', value: false }, { label: 'Groups', value: true }]}
                    />
                    {
                      isGroup && (
                        <div className='mt-4'>
                          <label className='text-sm text-gray-500 ' htmlFor=''>
                            How many students per group? *
                          </label>
                          <Select
                            key={subsection.id + "numberofstudents"}
                            defaultValue={numberOfStudentsperGroup}
                            style={{ width: '100%', marginTop: '5px' }}
                            onChange={(number) => { handleSubsectionChange('numberOfStudentsperGroup', number) }}
                            options={[{ label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }, { label: '5', value: 5 }]}
                          />
                        </div>
                      )
                    }
                  </div>
                </div>

              )
            }
            <div className='flex flex-col mb-4'>
              <label className='text-sm text-gray-500' htmlFor=''>
                Subsection content *
              </label>
              <Button className='py-5 pb-10 mt-2' onClick={() => {
                setIsSubsectionModalOpen(true);
                document.body.style.overflow = 'hidden';
              }}>
                Edit subsection content
              </Button>
            </div>
            <div className='flex items-center justify-between w-full '>
              <div className='w-full space-y-2'>
                <label className='mb-4 text-sm text-gray-500'>Subsection Date *</label>
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
            <div className='mt-7'>
              <label className='block mr-3 text-sm text-gray-500' htmlFor=''>Categories * </label>
              <TableCategories categories={categories[sectionId]} setCreateCourseSectionsList={setCreateCourseSectionsList}
                subsection={subsection} sectionID={sectionId} createCourseSectionsList={createCourseSectionsList} />
            </div>
            <div className='flex items-center justify-between mt-7'>
              <div className='flex items-center'>
                <label className='block mr-3 text-sm text-gray-500' htmlFor=''>Evaluable * </label>
                <Switch onChange={(e) => handleSubsectionChange('evaluable', e)} checked={subsection.activity?.evaluable} className='bg-gray-300' />
              </div>
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
                  onChange={debounce((e) => handleSubsectionChange('ponderation', e), 100)}
                  min={0}
                  max={100}
                  formatter={(value) => `${value}%`}
                  parser={(value) => value.replace('%', '')}
                />
              </div>

            </div>
            <div className='space-y-2 mt-7'>
              <label className='text-sm text-gray-500 mt-7 ' htmlFor=''>Subsection description</label>
              <div className='flex w-full '>
                <Input className='px-1 py-3 border border-[#d9d9d9] rounded-md text-sm pl-3' placeholder="Description" value={subsection.description}
                  onChange={(e) => handleSubsectionChange('description', e.target.value)} />
              </div>
            </div>
            <div className='mt-3 mb-5 space-y-2'>
              <label className='text-sm text-gray-500 ' htmlFor=''>
                Subsection Files (max 5)
              </label>
              <UploadFiles fileList={files} setFileList={setFiles} listType={'text'} maxCount={5} />
            </div>
            <SubsectionContentModal isModalOpen={isSubsectionModalOpen} setIsModalOpen={setIsSubsectionModalOpen} setMarkdownContent={setMarkdownContent}
              handleSubsectionChange={handleSubsectionChange} markdownContent={markdownContent}
            />
          </motion.div>
        </div>
      )
      }
    </motion.div >
  );
};

