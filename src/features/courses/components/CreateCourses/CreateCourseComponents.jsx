import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../../styles/filepondStyles.css'
import { message, Select } from "antd";
import 'react-tagsinput/react-tagsinput.css'
import { DndContext, closestCenter } from '@dnd-kit/core';
import { CreateCourseSectionsList } from './CourseSections/CreateCourseSectionsList';
import { AccordionCourse } from './CourseConfirmation/AccordionCourse';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CourseContent } from './CourseConfirmation/CourseContent';
import { TaskContent } from './CourseConfirmation/TaskContent';
import { Empty, Popconfirm, Button } from 'antd';
import { ButtonCreateCourse } from './CourseConfirmation/ButtonCreateCourse';
import SelectProfessor from './CourseInfo/SelectProfessor';

import TagsInput from 'react-tagsinput'

import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond/dist/filepond.min.css';
registerPlugin(FilePondPluginImagePreview);

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
const transition = { duration: 0.2 };

const CreateCourseButtons = (createCourseOption, setCreateCourseOption, visibilityTask, courseBasicInfo) => {
  const navigate = useNavigate();

  function handleContinue() {
    if (createCourseOption === 0) {
      if (courseBasicInfo.courseName === '' || courseBasicInfo.description === '' || courseBasicInfo.tags.length === 0 || !courseBasicInfo.cover || courseBasicInfo.cover.length === 0) {
        message.error("Please complete all the fields")
      } else {
        setCreateCourseOption(createCourseOption + 1)
      }
    } else {
      setCreateCourseOption(createCourseOption + 1)
    }
  }

  if (!visibilityTask) {
    return (
      <div className='flex w-full mt-8 mb-10'>
        {
          createCourseOption === 0 ?
            <Popconfirm
              className=''
              title="Cancel course creation?"
              description="You will lose all your changes!"
              onConfirm={() => navigate('/app/courses')}
              okText={<span className="text-white">Yes</span>}
              cancelText={<span className="">No</span>}
              okButtonProps={{ className: 'bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2.5' }}
            >
              <Button type="button" className="inline-flex items-center px-4 py-5 mr-2 text-sm font-medium text-center text-white duration-150 bg-gray-800 rounded-lg hover:bg-gray-900 focus:ring-4 focus:outline-none ">
                Cancel
              </Button>
            </Popconfirm> :
            <button onClick={() => setCreateCourseOption(createCourseOption - 1)} type="button" className="duration-150 text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center mr-2 ">
              Back
            </button>
        }

        {
          createCourseOption === 2 ?
            <button type="button" class="duration-150 group/continue text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center ">
              Confirm
            </button> :

            <button type="button" onClick={() => handleContinue()} class=" duration-150 group/continue text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center ">
              Continue
              <svg class="w-3.5 h-3.5 ml-2 group-hover/continue:translate-x-1 duration-150" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
            </button>
        }
      </div>
    )
  }
}


export const CreateCourseInfo = ({ createCourseOption, setCreateCourseOption, setCourseBasicInfo, courseBasicInfo }) => {
  const [formData, setFormData] = useState({
    courseName: '',
    description: '',
    courseType: '',
    tags: [],
  });

  const handleChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
    setCourseBasicInfo((prevInfo) => ({ ...prevInfo, [field]: value }));
  };

  return (
    <motion.div className='flex flex-col w-2/4' initial="hidden" animate="visible" exit="hidden" variants={variants} transition={transition}>
      <p className='mt-5 mb-5 text-sm font-normal text-gray-400'>First, give us some information about the new course</p>
      <label htmlFor="base-input" className="block mb-2 text-sm font-medium text-gray-900">
        Course name *
      </label>
      <input
        type="text"
        id="base-input"
        className="bg-gray-50  text-gray-900 font-normal text-sm rounded-lg border-0 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 block w-full p-2.5"
        value={courseBasicInfo.courseName}
        onChange={(e) => handleChange('courseName', e.target.value)}
      />

      <label htmlFor="message" className="block mt-8 mb-2 text-sm font-medium text-gray-900">
        Description *
      </label>
      <textarea
        id="message"
        rows="4"
        className="block p-2.5 w-full text-sm text-gray-900 font-normal bg-gray-50 rounded-lg border-0 border-gray-300 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={courseBasicInfo.description}
        onChange={(e) => handleChange('description', e.target.value)}
      />
      <SelectProfessor setCourseBasicInfo={setCourseBasicInfo} />
      <div className='text-sm font-normal'>
        <label htmlFor="message" className="block mt-8 mb-4 text-sm font-medium text-gray-900">
          Tags *
        </label>
        <Select
          size='large'
          mode="tags"
          style={{
            width: '100%',
          }}
          placeholder="Enter course tags"
          value={courseBasicInfo.tags}
          onChange={(e) => handleChange('tags', e)}
        />
      </div>

      <div className='flex justify-between mt-8'>
        <div className='w-full font-medium'>
          <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 ">
            Cover image *
          </label>
          <FilePond
            allowMultiple={true}
            files={courseBasicInfo.cover}
            maxFiles={1}
            onupdatefiles={(e) => {
              setCourseBasicInfo((prevInfo) => ({ ...prevInfo, 'cover': e }));
            }}
          />
        </div>
      </div>
      {CreateCourseButtons(createCourseOption, setCreateCourseOption, null, courseBasicInfo)}
    </motion.div>
  )
}

export const CreateCourseSections = ({ createCourseOption, setCreateCourseOption, createCourseSectionsList, setCreateCourseSectionsList, setEditCourseSectionFlag,
  setSectionToEdit, setCreateCourseSectionsListCopy, createCourseSectionsListCopy }) => {
  const [sectionName, setSectionName] = useState('');
  const [addSectionFlag, setAddSectionFlag] = useState(true);

  const handleDragEnd = (event) => {
    const { active, over } = event

    setCreateCourseSectionsList((courses) => {
      const oldIndex = courses.findIndex(course => course.id === active.id)
      const newIndex = courses.findIndex(course => course.id === over.id)
      return arrayMove(courses, oldIndex, newIndex)
    })
  }

  function createSection() {
    const newSection = {
      id: Math.random().toString(16).slice(2),
      name: sectionName,
      subsections: []
    }
    setCreateCourseSectionsList([...createCourseSectionsList, newSection])
    setCreateCourseSectionsListCopy([...createCourseSectionsList, newSection])
    setAddSectionFlag(true)
    setSectionName('')
    setEditCourseSectionFlag(true)
    setSectionToEdit(newSection)
    message.success("Section created successfully")
  }

  function deleteSection(section) {
    const newSections = createCourseSectionsList.filter(item => item.id !== section.id)
    setCreateCourseSectionsList(newSections)
    setCreateCourseSectionsListCopy(newSections)
  }

  return (
    <motion.div className='flex flex-col w-2/4' initial="hidden" animate="visible" exit="hidden" variants={variants} transition={transition}>
      <p className='mt-5 mb-5 text-sm font-normal text-gray-400'>It's time to build your course, construct the sections and define the sequence! 🚀</p>
      <div className='p-5 mb-5 text-base font-medium bg-white rounded-md shadow-md'>
        <div className='flex items-center'>
          <h3 className=''>Course sections</h3>
          {
            addSectionFlag ?
              <button onClick={() => setAddSectionFlag(false)} className='flex ml-auto '>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-1">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" />
                </svg>
                <p className='ml-auto text-sm'>Add a section</p>
              </button> :
              <button onClick={() => setAddSectionFlag(true)} className='flex ml-auto'>
                <p className='ml-auto text-sm'>Cancel</p>
              </button>
          }

        </div>
        {
          !addSectionFlag &&
          <div>
            <label for="base-input" class="block mb-2 text-sm font-medium text-gray-900 mt-5">Section name</label>
            <input type="text" value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              id="base-input"
              className="bg-gray-50 border border-gray-300 text-gray-900 font-normal text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " />
            <button
              onClick={() => createSection()}
              className='p-2 mt-4 text-sm text-white bg-gray-800 rounded-md '>
              Create
            </button>
          </div>
        }
        {
          createCourseSectionsList.length > 0 ?
            <div className='mt-6 space-y-3'>
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                  items={createCourseSectionsList}
                  strategy={verticalListSortingStrategy}>
                  {createCourseSectionsList.map((section) => (
                    <CreateCourseSectionsList section={section} deleteSection={deleteSection} setEditCourseSectionFlag={setEditCourseSectionFlag} setSectionToEdit={setSectionToEdit} key={section.id} />
                  ))}
                </SortableContext>
              </DndContext>
            </div> :
            <div>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
                <span>
                  There are no sections yet
                </span>
              } />
            </div>
        }
        <p className='mt-8 text-xs font-normal text-gray-400'>Drag and drop to reorder your sections</p>
      </div>
      {CreateCourseButtons(createCourseOption, setCreateCourseOption)}
    </motion.div>
  )
}

export const CreateConfirmation = ({ createCourseOption, setCreateCourseOption, createCourseSectionsList, evaluator, courseBasicInfo, task }) => {
  const [sectionContentSelector, setSectionContentSelector] = useState('course');
  const [visibilityTask, setVisibilityTask] = useState(false);
  const [selectedSubsection, setSelectedSubsection] = useState(createCourseSectionsList[0]?.subsections[0]);
  const [sectionId, setSectionId] = useState(createCourseSectionsList[0]?.id);

  useEffect(() => {
    createCourseSectionsList.forEach((section) => {
      const subsection = section.subsections.find((subsection) => subsection.id === sectionContentSelector);
      if (subsection) {
        setSelectedSubsection(subsection);
      }
    });
  }, [sectionContentSelector]);

  const renderContent = () => {
    if (!visibilityTask) {
      return (
        <>
          <div className='w-full mr-5'>
            <CourseContent
              createCourseSectionsList={createCourseSectionsList}
              sectionContentSelector={sectionContentSelector}
              setVisibilityTask={setVisibilityTask}
              selectedSubsection={selectedSubsection}
              sectionId={sectionId}
              task={task}
            />
          </div>
          <div style={{ width: '45rem' }} className='flex flex-col items-center ml-auto '>
            <ButtonCreateCourse createCourseSectionsList={createCourseSectionsList} courseBasicInfo={courseBasicInfo} />
            <div className='w-full'>
              <AccordionCourse
                createCourseSectionsList={createCourseSectionsList}
                setSectionContentSelector={setSectionContentSelector}
                setSectionId={setSectionId}
                selectedSubsection={selectedSubsection}
                sectionId={sectionId}
              />
            </div>
          </div>
        </>
      );
    } else {
      return (
        <div className='w-full mr-5'>
          {sectionId && <TaskContent setVisibilityTask={setVisibilityTask} task={selectedSubsection?.activity} evaluator={evaluator} />}
        </div>
      );
    }
  };

  return (
    <motion.div className='w-full' initial="hidden" animate="visible" exit="hidden" variants={variants} transition={transition}>
      {
        createCourseSectionsList.length > 0 ?
          <>
            <div className='flex flex-row'>
              {renderContent()}
            </div>
            <button onClick={() => setCreateCourseOption(createCourseOption - 1)} type="button" class="mb-10 mt-5 duration-150 text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center mr-2 ">
              Back
            </button>
          </> :
          <>
            <div className='flex items-center justify-center w-full mt-20'>
              <div class="text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No sections</h3>
                <p class="mt-1 text-sm font-medium text-gray-500">Get started defining your course sections</p>
                <div class="mt-6">
                  <button onClick={() => setCreateCourseOption(createCourseOption - 1)} type="button" class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-1">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" />
                    </svg>
                    Add a section
                  </button>
                </div>
              </div>
            </div>
          </>

      }
    </motion.div>
  );

};
