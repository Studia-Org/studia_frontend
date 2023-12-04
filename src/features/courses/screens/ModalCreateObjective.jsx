import React, { useState } from 'react';
import { Modal, Button } from 'rsuite';
import { motion } from 'framer-motion';
import { ACTIVITY_CATEGORIES, API } from '../../../constant';
import './styles/modalObjective.css'
import { useAuthContext } from '../../../context/AuthContext';
import Swal from 'sweetalert2';
export default function ModalCreateObjective({ openModal, setObjectives }) {

    const [open, setOpen] = useState(openModal);
    const [goals, setGoals] = useState([]);
    const [user_objectives, setUserObjectives] = useState([]);
    const { user } = useAuthContext()

    function handleClose() {
        setOpen(false);
    }

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

    function sendData() {
        goals.forEach((goal) => {
            const data = {
                data: {
                    objective: goal,
                    categories: user_objectives,
                    user: user.id
                }
            }
            fetch(API + '/user-objectives', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(data),

            }).then(response => response.json())
                .then(data => {
                    console.log(data.data.id);
                    setOpen(false);
                    setObjectives(prevState => [...prevState, data.data.attributes]);
                })
                .catch((error) => {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Something went wrong!',
                        icon: 'error',
                        confirmButtonText: 'Try again'
                    })
                })

        })
    }


    return (
        <Modal size='lg' backdrop="static" className='font-Poppins p-3 h-3/4' open={open} onClose={handleClose}>
            <Modal.Header>
                <h1 className='font-semibold text-2xl w-full text-center' >Welcome! Select your own objectives</h1>
            </Modal.Header>
            <Modal.Body>
                <header className='pt-4'>
                    <p>Learning with a MOOC can be challenging. This tool supports you to achieve your goals. Here you can (1) actively
                        set your goal for this course and (2) select indicators to monitor your progress towards your goal.</p>
                </header>
                <section className='pt-2'>
                    <h2 className='font-semibold text-lg py-2'>What do you want to achieve by the end of this course?</h2>
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
                        {goals.map((goal, index) =>
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


            </Modal.Body>
            <Modal.Footer className='mt-4'>
                <button onClick={sendData}
                    disabled={user_objectives.length === 0 || goals.length === 0}
                    className=' text-white absolute end-2.5 bottom-2.5 bg-emerald-600 hover:scale-95 disabled:bg-gray-500 disabled:cursor-not-allowed
                     hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-4 py-2 '>
                    Add my own objectives!
                </button>
            </Modal.Footer>
        </Modal>

    )
}