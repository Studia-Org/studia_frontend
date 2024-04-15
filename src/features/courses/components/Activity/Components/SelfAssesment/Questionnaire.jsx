import React, { useState } from 'react'
import { Button, Empty, message } from 'antd'
import { motion } from 'framer-motion'
import { MoonLoader } from 'react-spinners'
import { useAuthContext } from '../../../../../../context/AuthContext'
import { Header } from './Header'
import { SelfAssesmentData } from '../../../CreateCourses/CourseSections/QuestionnaireData'
import { NavigationButtons } from '../../../CoursesInside/Questionnaire/NavigationsButons'
import { UserQuestionnaireAnswerTable } from '../../../CoursesInside/Questionnaire/UserQuestionnaireAnswerTable'
import { Questions } from './Questions'
import { API } from '../../../../../../constant'
import { getToken } from '../../../../../../helpers'
import { useParams } from 'react-router-dom'
import Activity from '../../../../screens/Activity'


export const Questionnaire = ({ setState, setSelfAssesmentData }) => {
    const { user } = useAuthContext();
    const [loadingData, setLoadingData] = useState(true);
    const [userResponses, setUserResponses] = useState([]);
    const [questionnaireAnswerData, setQuestionnaireAnswerData] = useState([]);
    const [completed, setCompleted] = useState(questionnaireAnswerData.length > 0);
    const [sendingData, setSendingData] = useState(false);
    const [enableEdit, setEnableEdit] = useState(false);

    let { activityId } = useParams()


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

    async function handleSubmission() {
        setSendingData(true)
        try {
            if (handleAllQuestionsAnswered()) {
                const qualificationsData = await fetch(`${API}/qualifications`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body:
                        JSON.stringify(
                            {
                                data: {
                                    user: user.id,
                                    activity: activityId,
                                    evaluator: user.id,
                                }
                            }),
                })
                const qualificationsResponse = await qualificationsData.json()
                const selfAssesmentData = await fetch(`${API}/self-assesment-answers`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify({
                        data:
                        {
                            QuestionnaireAnswers: userResponses,
                            user: user.id,
                            Activity: activityId,
                            qualifications: qualificationsResponse.data.id
                        }
                    }),
                })
                const response = await selfAssesmentData.json()
                await fetch(`${API}/qualifications`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify({
                        data: {
                            SelfAssesmentAnswers: response.data.id
                        }
                    })
                })
                setSendingData(false)
                setSelfAssesmentData(response)
                message.success('Questionnaire submitted successfully')
                setState(1)
            } else {
                setSendingData(false)
                message.error('Please answer all questions before submitting')
            }
        } catch (error) {
            setSendingData(false)
            message.error('An error occurred. Please try again')
        }
    }

    function handleAllQuestionsAnswered() {
        if (userResponses.length === SelfAssesmentData.attributes.Options.questionnaire.questions.length) {
            return true
        } else {
            return false
        }
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
                            <div className="">{
                                <Questions
                                    questionnaire={SelfAssesmentData}
                                    userResponses={userResponses}
                                    setUserResponses={setUserResponses}
                                    user={user}
                                    questionnaireAnswerData={questionnaireAnswerData}
                                />
                            }</div>
                        </motion.ul>

                        <div className="flex mt-5">
                            {
                                completed === false &&
                                <>
                                    {
                                        user.role_str === 'student' && (
                                            <>
                                                <Button type='primary' loading={sendingData} onClick={handleSubmission}
                                                    className="flex">
                                                    Submit
                                                </Button>
                                            </>
                                        )
                                    }
                                </>
                            }
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
