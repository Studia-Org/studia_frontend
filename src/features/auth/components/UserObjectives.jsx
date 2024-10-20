import React from 'react'
import { ACTIVITY_CATEGORIES } from '../../../constant';
import { BsFillArrowLeftSquareFill } from 'react-icons/bs'
import { Button } from 'antd';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
export const UserObjectives = ({ setPageSelector, description, onChange, registerAccount, profilePhoto, setProfilePhoto, loading, goals, setGoals, user_objectives, setUserObjectives }) => {
    const { t } = useTranslation();
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
            className="w-full overflow-hidden text-gray-500 bg-gray-100 shadow-xl rounded-3xl " style={{ maxWidth: '1000px' }} >
            <div className="w-full md:flex ">
                <div className="relative hidden w-full px-10 py-10 md:block ">
                    <button onClick={(e) => setPageSelector(1)}>
                        <BsFillArrowLeftSquareFill size={30} style={{ cursor: "pointer", color: "rgba(0, 0, 0, 1)" }} />
                    </button>
                    <h1 className='justify-center text-3xl font-bold text-center text-gray-900'>{t("REGISTER.objectives_register.title")}</h1>
                    <p className='mt-2 mb-5 text-center'>{t("REGISTER.objectives_register.subtitle")}</p>
                    <div className="flex -mx-3">
                        <div className="w-full px-3 mb-5">
                            <label for="" className="px-1 text-xs font-semibold ">{t("REGISTER.objectives_register.add_brief_description")}</label>
                            <div className="flex">
                                <div className="z-10 flex items-center justify-center w-10 pl-1 text-center pointer-events-none"><i class="mdi mdi-comment-text text-gray-400 text-lg"></i></div>
                                <textarea
                                    type="email"
                                    className="w-full py-2 pl-10 pr-3 -ml-10 border-2 border-gray-200 rounded-lg outline-none resize-none focus:border-indigo-500"
                                    placeholder=""
                                    rows={3}
                                    name='description'
                                    value={description}
                                    onChange={e => onChange(e)}
                                    required />
                            </div>
                        </div>
                    </div>
                    <label for="" className="px-1 text-xs font-semibold ">{t("REGISTER.objectives_register.set_your_goals")}</label>

                    <div className='p-5 text-sm bg-white border-2 border-gray-200 rounded-lg outline-none'>
                        <header className=''>
                            <p>{t("REGISTER.objectives_register.text_goals_1")}</p>
                        </header>
                        <section className='pt-2'>
                            <h2 className='py-2 text-base font-semibold'>{t("REGISTER.objectives_register.text_goals_title")}</h2>
                            <p className=''>
                                {t("REGISTER.objectives_register.text_goals_2")}
                            </p>
                        </section>
                        <main className='flex min-h-[150px]'>
                            <form onSubmit={addObjectives} className='pt-2 pl-1 pr-2 min-w-[60%]'>
                                <label for="search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
                                    {t("REGISTER.objectives_register.text_goals_title")}
                                </label>
                                <div className="relative">
                                    <input type="search" id="search"
                                        className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 "
                                        placeholder={t("REGISTER.objectives_register.placeholder")} required />
                                    <button type='submit'
                                        className="text-white absolute end-2.5 bottom-2.5 bg-green-400 hover:scale-95 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-4 py-2 ">
                                        {t("REGISTER.objectives_register.add")}
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
                            <h2 className='py-2 text-lg font-semibold'>{t("REGISTER.objectives_register.text_goals_title_2")}</h2>
                            <p>
                                {t("REGISTER.objectives_register.text_goals_3")}
                            </p>
                            <div className='flex flex-wrap gap-2 pt-4 pl-1'>
                                {Object.keys(ACTIVITY_CATEGORIES).map((objective, index) => {
                                    if (ACTIVITY_CATEGORIES[objective].ESO) return null
                                    return <div className='relative ms-1' key={index}>
                                        <motion.button
                                            onClick={() => { handleClickObjective(objective) }}
                                            className={`relative z-10 bg-${ACTIVITY_CATEGORIES[objective].color}-100 text-${ACTIVITY_CATEGORIES[objective].color}-500 hover:bg-${ACTIVITY_CATEGORIES[objective].color}-200` +
                                                ` hover:text-${ACTIVITY_CATEGORIES[objective].color}-600 text-sm border-[1px] border-${ACTIVITY_CATEGORIES[objective].color}-500 rounded-lg p-2 m-1`}
                                            animate={{ opacity: [0, 1], y: [-10, 0] }}
                                            transition={{ delay: index * 0.025 }}>
                                            {t(`OBJECTIVES_CONSTANT.${objective}`)}
                                        </motion.button>
                                        <div className={`absolute ${user_objectives.includes(objective) ? "blur" : ""} 
                                inset-0 top-1 left-1 bg-${ACTIVITY_CATEGORIES[objective].color}-500 rounded-lg w-[calc(100%-8px)] h-[calc(100%-8px)]`} ></div>

                                    </div>
                                }
                                )}
                            </div>
                            <div className='flex flex-wrap gap-2 pt-4 pl-1'>
                                {Object.keys(ACTIVITY_CATEGORIES).map((objective, index) => {
                                    if (!ACTIVITY_CATEGORIES[objective].ESO) return null
                                    return <div className='relative ms-1' key={index}>
                                        <motion.button
                                            onClick={() => { handleClickObjective(objective) }}
                                            className={`relative z-10 bg-${ACTIVITY_CATEGORIES[objective].color}-100 text-${ACTIVITY_CATEGORIES[objective].color}-500 hover:bg-${ACTIVITY_CATEGORIES[objective].color}-200` +
                                                ` hover:text-${ACTIVITY_CATEGORIES[objective].color}-600 text-sm border-[1px] border-${ACTIVITY_CATEGORIES[objective].color}-500 rounded-lg p-2 m-1`}
                                            animate={{ opacity: [0, 1], y: [-10, 0] }}
                                            transition={{ delay: index * 0.025 }}>
                                            ESO - {t(`OBJECTIVES_CONSTANT.${objective}`)}
                                        </motion.button>
                                        <div className={`absolute ${user_objectives.includes(objective) ? "blur" : ""} 
                                inset-0 top-1 left-1 bg-${ACTIVITY_CATEGORIES[objective].color}-500 rounded-lg w-[calc(100%-8px)] h-[calc(100%-8px)]`} ></div>

                                    </div>
                                }
                                )}
                            </div>
                        </section>
                    </div>
                    <Button loading={loading} type="button" onClick={registerAccount}
                        className="mt-6 flex items-center gap-2 ml-auto justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2  focus:outline-none">
                        {t("REGISTER.objectives_register.create_user")}
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}
