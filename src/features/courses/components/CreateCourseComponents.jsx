import React, { useState } from 'react'
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import 'filepond/dist/filepond.min.css';
import '../styles/filepondStyles.css'
import { message } from "antd";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { CreateCourseSectionsList } from './CreateCourseSectionsList';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';

registerPlugin(FilePondPluginImagePreview);

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
const transition = { duration: 0.3 };

const CreateCourseButtons = (createCourseOption, setCreateCourseOption) => {
  const navigate = useNavigate();

  return (
    <div className='flex w-full mt-8 justify-between mb-10'>
      {
        createCourseOption === 0 ?
          <button onClick={() => navigate('/app/courses')} type="button" class="text-white duration-150  bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center mr-2 ">
            Cancel
          </button> :
          <button onClick={() => setCreateCourseOption(createCourseOption - 1)} type="button" class="duration-150 text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center mr-2 ">
            Back
          </button>
      }

      {
        createCourseOption === 2 ?
          <button type="button" class="duration-150 group/continue text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center ">
            Confirm
          </button> :

          <button type="button" onClick={() => setCreateCourseOption(createCourseOption + 1)} class=" duration-150 group/continue text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center ">
            Continue
            <svg class="w-3.5 h-3.5 ml-2 group-hover/continue:translate-x-1 duration-150" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
            </svg>
          </button>
      }
    </div>
  )

}

export const CreateCourseInfo = ({ createCourseOption, setCreateCourseOption }) => {

  return (
    <motion.div className='w-2/4 flex flex-col' initial="hidden" animate="visible" exit="hidden" variants={variants} transition={transition}>
      <p className='font-normal text-sm text-gray-400 mt-5 mb-5'>First, give us some information about the new course</p>
      <label for="base-input" class="block mb-2 text-sm font-medium text-gray-900 ">Course name</label>
      <input type="text" id="base-input" class="bg-gray-50 border border-gray-300 text-gray-900 font-normal text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " />
      <label for="message" class="block mb-2 text-sm font-medium text-gray-900 mt-8">Description</label>
      <textarea id="message" rows="4" class="block p-2.5 w-full text-sm text-gray-900 font-normal bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "></textarea>
      <div className='flex mt-8 justify-between'>
        <div className='font-medium w-full mr-8'>
          <FilePond
            allowMultiple={true}
            maxFiles={5}
          />
        </div>
        <div>
          <label class="block  text-sm font-medium text-gray-900 mb-4">Course type</label>
          <fieldset className='ml-4'>
            <legend class="sr-only">Course type</legend>
            <div class="flex items-center mb-4">
              <input id="country-option-1" type="radio" name="countries" value="USA" class="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 " />
              <label for="country-option-1" class="block ml-2 text-sm font-normal text-gray-900 ">
                Required
              </label>
            </div>

            <div class="flex items-center mb-4">
              <input id="country-option-2" type="radio" name="countries" value="Germany" class="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 " />
              <label for="country-option-2" class="block ml-2 text-sm font-normal text-gray-900 ">
                Optional
              </label>
            </div>

            <div class="flex items-center mb-4">
              <input id="country-option-3" type="radio" name="countries" value="Spain" class="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 " />
              <label for="country-option-3" class="block ml-2 text-sm font-normal text-gray-900 ">
                Basic formation
              </label>

            </div>
            <p className='text-xs font-normal text-gray-400'>This option will not affect the course creation</p>
          </fieldset>
        </div>
      </div>
      {CreateCourseButtons(createCourseOption, setCreateCourseOption)}
    </motion.div>
  )
}

export const CreateCourseSections = ({ createCourseOption, setCreateCourseOption, createCourseSectionsList, setCreateCourseSectionsList, setEditCourseSectionFlag, setSectionToEdit}) => {
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
    setAddSectionFlag(true)
    setSectionName('')
    message.success("Section created successfully")
  }

  function deleteSection(section){
    const newSections = createCourseSectionsList.filter(item => item.id !== section.id)
    setCreateCourseSectionsList(newSections)
  }

  return (
    <motion.div className='w-2/4 flex flex-col' initial="hidden" animate="visible" exit="hidden" variants={variants} transition={transition}>
      <p className='font-normal text-sm text-gray-400 mt-5 mb-5'>It's time to build your course, construct the sections and define the sequence! 🚀</p>
      <div className='bg-white rounded-md shadow-md p-5 font-medium text-base mb-5'>
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
              className='text-sm rounded-md text-white bg-gray-800 p-2 mt-4 '>
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
              <p className='text-sm font-normal italic text-gray-500 mt-6'>Create your first section!</p>
            </div>
        }
        <p className='text-xs font-normal  text-gray-400 mt-8'>Drag and drop to reorder your sections</p>
      </div>
      {CreateCourseButtons(createCourseOption, setCreateCourseOption)}
    </motion.div>
  )
}

export const CreateConfirmation = ({ createCourseOption, setCreateCourseOption }) => {
  return (
    <motion.div className='w-2/4 flex flex-col' initial="hidden" animate="visible" exit="hidden" variants={variants} transition={transition}>
      div 34
      {CreateCourseButtons(createCourseOption, setCreateCourseOption)}
    </motion.div>
  )
}