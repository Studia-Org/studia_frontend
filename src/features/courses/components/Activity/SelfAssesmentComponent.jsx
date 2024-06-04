import React, { useState } from 'react'
import { Questionnaire } from './Components/SelfAssesment/Questionnaire'
import { Breadcrumb } from './Components/SelfAssesment/Breadcrumb'
import { BackButton } from './Components/BackToCourse'
import { useNavigate, useParams } from 'react-router-dom'
import { RubricAutoAssesment } from './Components/SelfAssesment/RubricAutoAssesment'
import { FinalResultsAutoAssesment } from './Components/SelfAssesment/FinalResultsAutoAssesment'
import { useAuthContext } from '../../../../context/AuthContext'
import { ProfessorAutoAssesment } from './Components/SelfAssesment/ProfessorAutoAssesment'
import { BreadcrumbCourse } from '../CoursesInside/BreadcrumbCourse'


export const SelfAssesmentComponent = ({ activityData, idQualification, idSubsection }) => {
    const navigate = useNavigate()
    const [selfAssesmentData, setSelfAssesmentData] = useState(activityData.SelfAssesmentAnswers?.data || [])
    const [qualificationId, setQualificationId] = useState(idQualification)
    let { courseId } = useParams()
    const { user } = useAuthContext()
    const [state, setState] = useState(checkState(activityData))

    function checkState(activityData) {
        let RubricAnswers = null, QuestionnaireAnswers = null
        if (activityData?.qualification === undefined) {
            return setStateNumber(RubricAnswers, [])
        } else {
            RubricAnswers = activityData?.SelfAssesmentAnswers?.data[0]?.attributes?.RubricAnswers
            QuestionnaireAnswers = activityData?.SelfAssesmentAnswers?.data[0]?.attributes?.QuestionnaireAnswers
            return setStateNumber(RubricAnswers, QuestionnaireAnswers)
        }
    }

    function setStateNumber(RubricAnswers, QuestionnaireAnswers) {
        if (RubricAnswers && QuestionnaireAnswers?.length > 0) { return 2 }
        else if (QuestionnaireAnswers?.length > 0) { return 1 }
        else { return 0 }
    }

    const SelfAssesmentItem = () => {
        switch (state) {
            case 0:
                return <Questionnaire setState={setState} setSelfAssesmentData={setSelfAssesmentData} setQualificationId={setQualificationId} />
            case 1:
                return <RubricAutoAssesment activityData={activityData} setState={setState} qualificationId={qualificationId}
                    setSelfAssesmentData={setSelfAssesmentData} selfAssesmentData={selfAssesmentData} subsectionID={idSubsection} />
            case 2:
                return <FinalResultsAutoAssesment selfAssesmentData={selfAssesmentData} />
            default:
                return <Questionnaire setState={setState} setSelfAssesmentData={setSelfAssesmentData} setQualificationId={setQualificationId} />
        }
    }

    return (
        <div className='p-10'>
            <BreadcrumbCourse
                coursePositionInfo={
                    {
                        course: activityData.activity.data.attributes.subsection.data.attributes.section.data.attributes.course.data.attributes.title,
                        courseSection: activityData.activity.data.attributes.subsection.data.attributes.section.data.attributes.title,
                        courseSubsection: activityData.activity.data.attributes.subsection.data.attributes.title,
                        activity: `Activity: ${activityData.activity.data.attributes.title}`
                    }
                }
                courseId={courseId}
            />
            <div className='mt-10'>
                {
                    user.role_str === 'student' ?
                        <>
                            <Breadcrumb state={state} />
                            <SelfAssesmentItem />
                        </>
                        :
                        <>
                            <ProfessorAutoAssesment />
                        </>
                }
            </div>
        </div>
    )
}
