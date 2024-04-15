import React, { useState } from 'react'
import { Questionnaire } from './Components/SelfAssesment/Questionnaire'
import { Breadcrumb } from './Components/SelfAssesment/Breadcrumb'

export const SelfAssesmentComponent = ({ activityData }) => {
    const [state, setState] = useState(0)
    return (
        <div className='p-10'>
            Back to course
            <Breadcrumb state={state} />
            <Questionnaire setState={setState} />
        </div>
    )
}
