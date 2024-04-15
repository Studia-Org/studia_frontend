import React from 'react'
import { Radio, RadioGroup, TextField } from '@mui/material'
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useRadioGroup } from '@mui/material/RadioGroup';
import { motion } from 'framer-motion'

export const Questions = ({ questionnaire, user, questionnaireAnswerData, setUserResponses, userResponses }) => {
    const item = {
        visible: { opacity: 1, x: 0 },
        hidden: { opacity: 0, x: -100 },
    }

    const MyFormControlLabel = (props) => {
        const radioGroup = useRadioGroup();

        let checked = false;

        if (radioGroup) {
            checked = radioGroup.value === props.value;
        }

        return <StyledFormControlLabel checked={checked} {...props} />;
    };

    const StyledFormControlLabel = styled((props) => <FormControlLabel {...props} />)(
        ({ theme, checked }) => ({
            '.MuiFormControlLabel-label': checked && {
                color: theme.palette.primary.main,
            },
        })
    );

    function handleOnChange(e, index, question) {
        setUserResponses(prev => {
            console.log(prev, index)
            const updatedResponses = [...prev];
            updatedResponses[index] = { question: question, answer: e.target.value };
            return updatedResponses;
        });

    }


    const renderQuestionsForPage = () => {
        return questionnaire.attributes.Options.questionnaire.questions.map((question, index) => (
            <motion.li
                className='bg-white shadow-md rounded-md p-5 border-l-8 border-[#377ddf75] mb-5'
                variants={item}
                key={index}
            >
                <p className="font-medium">{question.question}</p>
                {Array.isArray(question.options) ? (
                    user.role_str !== "student" && questionnaireAnswerData.length > 0 ?
                        <RadioGroup className="mt-4" name={`use-radio-group-${index}`} defaultValue={questionnaireAnswerData[0]?.responses?.responses[index]?.answer}>
                            {question.options.map((option, optionIndex) => (
                                <MyFormControlLabel key={optionIndex} value={option} label={option} control={<Radio disabled readOnly />} />
                            ))}
                        </RadioGroup>
                        :
                        <RadioGroup className="mt-4" onChange={(e) => handleOnChange(e, index, question.question)} name={`use-radio-group-${index}`} defaultValue={questionnaireAnswerData[0]?.responses?.responses[index]?.answer}>
                            {question.options.map((option, optionIndex) => (
                                <MyFormControlLabel key={optionIndex} value={option} label={option} control={<Radio />} />
                            ))}
                        </RadioGroup>
                ) : (
                    user.role_str !== "student" && questionnaireAnswerData.length > 0 ?
                        <TextField
                            id="outlined-basic"
                            label=""
                            disabled
                            defaultValue={questionnaireAnswerData[0].responses.responses[index].answer}
                            variant="filled"
                            className='w-full mt-5'
                            rows={3}
                            multiline
                        />
                        :
                        <TextField
                            id="outlined-basic"
                            label=""
                            onChange={(e) => handleOnChange(e, index, question.question)}
                            variant="filled"
                            className='w-full mt-5'
                            rows={4}
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
