import React from 'react'
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
const transition = { duration: 0.3 };

const CreateCourseButtons = (createCourseOption, setCreateCourseOption) => {
  const navigate = useNavigate();

  return (
    <div className='flex'>
      {
        createCourseOption === 0 ?
          <button onClick={() => navigate('/app/courses')} type="button" class="text-white duration-150 bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center mr-2 ">
            Cancel
          </button> :
          <button onClick={() => setCreateCourseOption(createCourseOption - 1)} type="button" class="text-white duration-150 bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center mr-2 ">
            Back
          </button>
      }

      {
        createCourseOption === 2 ?
          <button type="button" class="text-white duration-150 group/continue bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center ">
            Confirm
          </button> :

          <button type="button" onClick={() => setCreateCourseOption(createCourseOption + 1)} class="text-white duration-150 group/continue bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center ">
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
        <div className='font-medium'>
          <label class="block mb-2 text-sm font-medium text-gray-900 " for="user_avatar">Background image</label>
          <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-2" aria-describedby="user_avatar_help" id="user_avatar" type="file" />
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
          </fieldset>
        </div>
      </div>
      {CreateCourseButtons(createCourseOption, setCreateCourseOption)}
    </motion.div>
  )
}

export const CreateCourseSections = ({ createCourseOption, setCreateCourseOption }) => {
  return (
    <motion.div className='w-2/4 flex flex-col' initial="hidden" animate="visible" exit="hidden" variants={variants} transition={transition}>

      div 2
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