import React, { useState } from 'react'
import { ACTIVITY_CATEGORIES } from '../../../constant';
import { BsFillArrowLeftSquareFill } from 'react-icons/bs'
import { Button, message } from 'antd';
import { API } from "../../../constant";
import { motion } from 'framer-motion';
import { useAuthContext } from '../../../context/AuthContext';

export const UserObjectives = ({ setPageSelector, description, onChange, registerAccount, profilePhoto, setProfilePhoto, loading, goals, setGoals, user_objectives, setUserObjectives }) => {
    const { user } = useAuthContext()

    function addObjectives(e) {
        e.preventDefault();
        const goal = e.target.search.value;
        setGoals([...goals, goal]);
        e.target.search.value = "";
    }
    function handleClickObjective(objective) {
        if (user_objectives.includes(objective)) {
            setUserObjectives(user_objectives.filter((item) => item !== objective));
        } else {
            setUserObjectives([...user_objectives, objective]);
        }
    }

    return (
        <motion.div initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden " style={{ maxWidth: '1000px' }} >
            <div className="md:flex w-full ">
                <div className="hidden md:block w-full py-10 px-10 relative ">
                    <button onClick={(e) => setPageSelector(1)}>
                        <BsFillArrowLeftSquareFill size={30} style={{ cursor: "pointer", color: "rgba(0, 0, 0, 1)" }} />
                    </button>
                    <h1 className='justify-center text-center  font-bold text-3xl text-gray-900'>One last steps...</h1>
                    <p className='text-center mb-5 mt-2'>Add some personalization to your profile and set your goals!</p>
                    <div className="flex -mx-3">
                        <div className="w-full px-3 mb-5">
                            <label for="" className="text-xs font-semibold px-1 ">Add a brief description about yourself</label>
                            <div className="flex">
                                <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i class="mdi mdi-comment-text text-gray-400 text-lg"></i></div>
                                <textarea
                                    type="email"

                                    className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500 resize-none"
                                    placeholder=""
                                    rows={3}
                                    name='description'
                                    value={description}
                                    onChange={e => onChange(e)}
                                    required />
                            </div>
                        </div>
                    </div>
                    <label for="" className="text-xs font-semibold px-1 ">Set your goals</label>

                    <div className='border-2 border-gray-200 outline-none rounded-lg bg-white p-5 text-sm'>
                        <header className=''>
                            <p>Learning with a MOOC can be challenging. This tool supports you to achieve your goals. Here you can (1) actively
                                set your goal for this course and (2) select indicators to monitor your progress towards your goal.</p>
                        </header>
                        <section className='pt-2'>
                            <h2 className='font-semibold text-base py-2'>What do you want to achieve by the end of this course?</h2>
                            <p className=''>
                                Some examples for a goal are learning specific topics covered by the course, completing the course and getting a
                                certificate, completing all activities in the course in a certain timeframe, dedicating 3 hours weekly to this course, etc.
                            </p>
                        </section>
                        <main className='flex min-h-[150px]'>
                            <form onSubmit={addObjectives} className='pt-2 pl-1 pr-2 min-w-[60%]'>
                                <label for="search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
                                    Enter your goals here...
                                </label>
                                <div className="relative">
                                    <input type="search" id="search"
                                        className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 " placeholder="Enter your goal here..." required />
                                    <button type='submit'
                                        className="text-white absolute end-2.5 bottom-2.5 bg-green-400 hover:scale-95 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-4 py-2 ">
                                        Add
                                    </button>
                                </div>
                            </form>
                            <lu className="w-full">
                                {goals?.map((goal, index) =>
                                    <motion.li
                                        className='list-none bg-emerald-100 border-[1px] bg- border-emerald-500 text-emerald-500  rounded-lg p-2 my-2 '
                                        animate={{ opacity: [0, 1], y: [-10, 0] }}
                                        transition={{ delay: index * 0.025 }}
                                        key={index}>
                                        {goal}
                                        <button onClick={() => { setGoals(goals.filter((item) => item !== goal)) }}
                                            className='float-right text-red-500 hover:text-red-600 hover:scale-110'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="#ffe5e5" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>

                                        </button>
                                    </motion.li>)}
                            </lu>
                        </main>
                        <section>
                            <h2 className='font-semibold text-lg py-2'>How would you categorize your objectives ?</h2>
                            <p>
                                You can select one or more categories that best describe your objectives.
                                This will help you to monitor your progress and help you to achieve your goals.
                            </p>
                            <div className='flex flex-wrap pt-4 pl-1 gap-2'>
                                {Object.keys(ACTIVITY_CATEGORIES).map((objective, index) =>
                                    <div className='relative ms-1' key={index}>
                                        <motion.button
                                            onClick={() => { handleClickObjective(objective) }}
                                            className={`relative z-10 bg-${ACTIVITY_CATEGORIES[objective]}-100 text-${ACTIVITY_CATEGORIES[objective]}-500 hover:bg-${ACTIVITY_CATEGORIES[objective]}-200` +
                                                ` hover:text-${ACTIVITY_CATEGORIES[objective]}-600 text-sm border-[1px] border-${ACTIVITY_CATEGORIES[objective]}-500 rounded-lg p-2 m-1`}
                                            animate={{ opacity: [0, 1], y: [-10, 0] }}
                                            transition={{ delay: index * 0.025 }}>
                                            {objective}
                                        </motion.button>
                                        <div className={`absolute ${user_objectives.includes(objective) ? "blur" : ""} 
                                inset-0 top-1 left-1 bg-${ACTIVITY_CATEGORIES[objective]}-500 rounded-lg w-[calc(100%-8px)] h-[calc(100%-8px)]`} ></div>

                                    </div>

                                )}
                            </div>
                        </section>
                    </div>
                    <Button loading={loading} type="button" onClick={registerAccount}
                        className="mt-6 flex items-center gap-2 ml-auto justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2  focus:outline-none">
                        Create user
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}
