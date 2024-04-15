import React from 'react'
import { Steps } from 'antd'

export const Breadcrumb = ({ state }) => {
    return (
        <Steps
            progressDot
            size='small'
            current={state}
            items={[
                {
                    title: 'Questionnaire',
                },
                {
                    title: 'Rubric and Autoevaluation',
                },
                {
                    title: 'Results',
                },
            ]}
        />
    )
}
