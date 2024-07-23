import React from 'react';
import { Questionnaire } from './Questionnaire'
import { useTranslation } from 'react-i18next';
export const FinalResultsAutoAssesment = ({ selfAssesmentData }) => {
    const { t } = useTranslation()
    return (
        <div className='flex flex-wrap'>
            <div className='w-full sm:w-3/4'>
                <Questionnaire questionnaireAnswers={selfAssesmentData[0].attributes.QuestionnaireAnswers} />
            </div>
            <div className='flex flex-col w-full pl-5 mt-5 sm:w-1/4'>
                <h2 className='mb-2 font-medium'>{t("SELFASSESTMENT.self_assessment")}</h2>
                <hr className='mb-5' />
                <p className='p-4 mb-2 text-gray-600 border-2 border-gray-400 border-solid rounded-lg'>{selfAssesmentData[0].attributes.RubricAnswers}</p>
            </div>
        </div>
    )
}