import React from 'react'
import { Radio, RadioGroup, TextField } from '@mui/material'
import { motion } from 'framer-motion'

export const Questions = ({ currentPage, questionsPerPage, totalQuestions, questionnaire, user, questionnaireAnswerData }) => {
    const item = {
        visible: { opacity: 1, x: 0 },
        hidden: { opacity: 0, x: -100 },
    }

    const renderQuestionsForPage = () => {
        const questionsForPage = questionnaire.attributes.Options.questionnaire.questions.slice((currentPage - 1) * questionsPerPage, Math.min(currentPage * questionsPerPage, totalQuestions));
        return questionsForPage.map((question, index) => (
            <motion.li
                className='bg-white shadow-md rounded-md p-5 border-l-8 border-[#377ddf75]'
                variants={item}
                key={index}
            >
                <p className="font-medium">{question.question}</p>
                {Array.isArray(question.options) ? (
                    user.role_str === "student" || (user.role_str !== "student" && questionnaireAnswerData.length > 0) ?
                        <RadioGroup className="mt-4" name={`use-radio-group-${index}`} defaultValue={questionnaireAnswerData[0]?.responses?.responses[index]?.answer}>
                            {question.options.map((option, optionIndex) => (
                                <MyFormControlLabel key={optionIndex} value={option} label={option} control={<Radio disabled readOnly />} />
                            ))}
                        </RadioGroup>
                        :
                        <TextField
                            id="outlined-basic"
                            label=""
                            disabled
                            defaultValue={questionnaireAnswerData[0]?.responses?.responses[index]?.answer}
                            variant="filled"
                            className='w-full mt-5'
                            rows={3}
                            multiline
                        />
                ) : (
                    user.role_str === "student" || (user.role_str !== "student" && questionnaireAnswerData.length > 0) ?
                        <TextField
                            id="outlined-basic"
                            label=""
                            disabled
                            variant="filled"
                            className='w-full mt-5'
                            rows={3}
                            multiline
                        />
                        :
                        <TextField
                            id="outlined-basic"
                            label=""
                            disabled
                            variant="filled"
                            className='w-full mt-5'
                            rows={1}
                            multiline
                        />
                )}
            </motion.li>
        ));
    };

    return (
        <div>
            {renderQuestionsForPage()}
        </div>
    )
}
