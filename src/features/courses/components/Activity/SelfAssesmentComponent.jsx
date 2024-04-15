import React, { useState } from 'react'
import { Questionnaire } from './Components/SelfAssesment/Questionnaire'
import { Breadcrumb } from './Components/SelfAssesment/Breadcrumb'
import { BackButton } from './Components/BackToCourse'
import { useNavigate, useParams } from 'react-router-dom'
import { RubricAutoAssesment } from './Components/SelfAssesment/RubricAutoAssesment'
import { FinalResultsAutoAssesment } from './Components/SelfAssesment/FinalResultsAutoAssesment'


export const SelfAssesmentComponent = ({ activityData }) => {
    const navigate = useNavigate()
    const [selfAssesmentData, setSelfAssesmentData] = useState(activityData.SelfAssesmentAnswers?.data)
    let { courseId } = useParams()
    const [state, setState] = useState(setStateNumber)

    function setStateNumber() {
        if (selfAssesmentData) {
            if (selfAssesmentData[0]?.attributes?.RubricAnswers?.length > 0 && selfAssesmentData[0]?.attributes?.QuestionnaireAnswers?.length > 0) {
                return 2
            }
            else if (selfAssesmentData[0]?.attributes?.QuestionnaireAnswers.length > 0) {
                return 1
            }
            else {
                return 0
            }
        }

    }

    const SelfAssesmentItem = () => {
        switch (state) {
            case 0:
                return <Questionnaire setState={setState} setSelfAssesmentData={setSelfAssesmentData} />
            case 1:
                return <RubricAutoAssesment />
            case 2:
                return <FinalResultsAutoAssesment selfAssesmentData={selfAssesmentData} />
            default:
                return <Questionnaire setState={setState} setSelfAssesmentData={setSelfAssesmentData} />
        }
    }
    return (
        <div className='p-10'>
            <BackButton onClick={() => navigate(`/app/courses/${courseId}`)} text='Go back to course' />
            <div className='mt-10'>
                <Breadcrumb state={state} />
                <SelfAssesmentItem />
            </div>

        </div>
    )
}
