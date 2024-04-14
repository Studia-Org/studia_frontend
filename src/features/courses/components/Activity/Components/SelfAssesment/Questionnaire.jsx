import React, { useState } from 'react'
import { Button, Empty } from 'antd'
import { motion } from 'framer-motion'
import { MoonLoader } from 'react-spinners'
import { useAuthContext } from '../../../../../../context/AuthContext'
import { Header } from './Header'
import { SelfAssesmentData } from '../../../CreateCourses/CourseSections/QuestionnaireData'
import { NavigationButtons } from '../../../CoursesInside/Questionnaire/NavigationsButons'
import { UserQuestionnaireAnswerTable } from '../../../CoursesInside/Questionnaire/UserQuestionnaireAnswerTable'
import { Questions } from './Questions'


export const Questionnaire = () => {
    const { user } = useAuthContext();
    const [loadingData, setLoadingData] = useState(true);
    const [userResponses, setUserResponses] = useState([]);
    const [questionnaireAnswerData, setQuestionnaireAnswerData] = useState([]);
    const [recommendationList, setRecommendationList] = useState([]);
    const [completed, setCompleted] = useState(questionnaireAnswerData.length > 0);
    const [sendingData, setSendingData] = useState(false);
    const questionsPerPage = 5;
    const totalQuestions = SelfAssesmentData.attributes.Options.questionnaire.questions.length;
    const totalPages = Math.ceil(totalQuestions / questionsPerPage);
    const [currentPage, setCurrentPage] = useState(1);
    const [enableEdit, setEnableEdit] = useState(false);
    const [editedQuestions, setEditedQuestions] = useState({});
    const isLastPage = currentPage === totalPages;

    const list = {
        visible: { opacity: 1 },
        transition: {
            type: "spring",
            bounce: 0,
            duration: 0.7,
            delayChildren: 0.3,
            staggerChildren: 0.05
        },
        hidden: { opacity: 0 },
    }

    function handleSubmission() {

    }

    return (
        <div className="flex flex-col mt-5">
            <Header questionnaire={SelfAssesmentData} />
            {
                user?.role_str === 'student' || ((questionnaireAnswerData.length > 0 && user?.role_str !== 'student') || enableEdit === true) ?
                    <>
                        {
                            (enableEdit === false && user.role_str !== 'student') && (
                                <Button onClick={() => setQuestionnaireAnswerData([])} className='mb-5 bg-white shadow-md'>
                                    Go back to users
                                </Button>
                            )
                        }

                        <motion.ul
                            initial="hidden"
                            animate="visible"
                            variants={list}
                        >
                            <div className="space-y-5 ">{
                                <Questions
                                    currentPage={currentPage}
                                    questionsPerPage={questionsPerPage}
                                    totalQuestions={totalQuestions}
                                    questionnaire={SelfAssesmentData}
                                    user={user}
                                    questionnaireAnswerData={questionnaireAnswerData}
                                />
                            }</div>
                        </motion.ul>
                        {isLastPage && (
                            <div className="flex justify-end mt-5">
                                {
                                    completed === false &&
                                    <>
                                        {
                                            user.role_str === 'student' && (
                                                <>
                                                    <Button type='primary' loading={sendingData} onClick={handleSubmission}
                                                        className="ml-auto ">
                                                        Submit
                                                    </Button>
                                                </>
                                            )
                                        }
                                    </>
                                }
                            </div>
                        )}
                        <div className="flex items-center justify-between mt-5 mb-8 bg-white rounded-md shadow-md p-5 border-b-8 border-[#6366f1]">
                            <NavigationButtons setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages} />
                        </div>
                    </>
                    :
                    <>
                        {
                            loadingData ?
                                <div className='flex items-center justify-center p-5 bg-white rounded-md shadow-md'>
                                    <MoonLoader color="#363cd6" />
                                </div>
                                :
                                userResponses.length > 0 ?
                                    <UserQuestionnaireAnswerTable userResponses={userResponses} setQuestionnaireAnswerData={setQuestionnaireAnswerData} />
                                    :
                                    <div className='py-5 mt-5 bg-white rounded-md shadow-md'>
                                        <Empty description='There are no user responses to this questionnaire.' />
                                    </div>
                        }
                    </>
            }
        </div>
    )
}
