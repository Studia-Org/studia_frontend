import React from 'react'
import { Questionnaire } from './Questionnaire'
import { Input } from 'antd';
const { TextArea } = Input;


export const FinalResultsAutoAssesment = ({ selfAssesmentData }) => {
    console.log('123', selfAssesmentData)
    return (
        <div className='flex flex-wrap'>
            <div className='w-full sm:w-3/4'>
                <Questionnaire questionnaireAnswers={selfAssesmentData[0].attributes.QuestionnaireAnswers} />

            </div>
            <div className='flex flex-col w-full pl-5 mt-5 sm:w-1/4'>
                <h2 className='mb-2 font-medium'>Autoevaluation</h2>
                <hr className='mb-5' />
                <TextArea className='flex w-full' value={selfAssesmentData[0].attributes.RubricAnswers} disabled style={{
                    resize: 'none',
                }} />

            </div>
        </div>
    )
}
