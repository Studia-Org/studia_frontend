import React, { useState } from 'react'
import { Button, message } from 'antd'
import { motion } from 'framer-motion'
import { useAuthContext } from '../../../../../../context/AuthContext'
import { Header } from './Header'
import QuestionnaireData from '../../../CreateCourses/CourseSections/QuestionnaireData'
import { Questions } from './Questions'
import { API } from '../../../../../../constant'
import { getToken } from '../../../../../../helpers'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'




export const Questionnaire = ({ setState, setSelfAssesmentData, setQualificationId, questionnaireAnswers }) => {
    const { user } = useAuthContext();
    const { SelfAssesmentData } = QuestionnaireData()
    const [userResponses, setUserResponses] = useState([]);
    const [completed, setCompleted] = useState(questionnaireAnswers?.length > 0);
    const [sendingData, setSendingData] = useState(false);
    const { t } = useTranslation()
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
                            activity: activityId,
                            qualifications: qualificationsResponse.data.id
                        }
                    }),
                })
                const response = await selfAssesmentData.json()
                setQualificationId(qualificationsResponse.data.id)
                setSendingData(false)
                setState(1)
                setSelfAssesmentData([response.data])
                message.success(t('QUESTIONNAIRE.questionnaire_submitted'))
            } else {
                setSendingData(false)
                message.error(t('QUESTIONNAIRE.please_answer_all'))
            }
        } catch (error) {
            setSendingData(false)
            console.log(error)
            message.error(t("COMMON.error_try_again"))
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
            <>
                <motion.ul
                    initial="hidden"
                    animate="visible"
                    variants={list}
                >
                    <div className="">{
                        <Questions
                            questionnaire={SelfAssesmentData}
                            setUserResponses={setUserResponses}
                            questionnaireAnswers={questionnaireAnswers}
                            user={user}
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
                                            {t('COMMON.submit')}
                                        </Button>
                                    </>
                                )
                            }
                        </>
                    }
                </div>

            </>

        </div>
    )
}
