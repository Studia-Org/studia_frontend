import React from 'react'
import { Radio, RadioGroup, TextField } from '@mui/material'
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useRadioGroup } from '@mui/material/RadioGroup';
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next';

export const Questions = ({ questionnaire, user, setUserResponses, questionnaireAnswers = [] }) => {
    const { t } = useTranslation()
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

    function handleOnChange(e, index, question, optionindex) {
        setUserResponses(prev => {
            const updatedResponses = [...prev];
            updatedResponses[index] = { question: question, answer: e.target.value, answerId: optionindex };
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
                    user.role_str !== "student" || questionnaireAnswers.length > 0 ?
                        <RadioGroup className="mt-4" name={`use-radio-group-${index}`} value={Object.values(t(`CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.SEQUENCES.ELEMENTS.QUESTIONNAIRE_DATA.SELF_ASSESSMENT.OPTIONS`, { returnObjects: true }))[questionnaireAnswers[index]?.answerId]}>
                            {question.options.map((option, optionIndex) => (
                                <MyFormControlLabel key={optionIndex} value={option.label} label={option.label} control={<Radio disabled readOnly />} />
                            ))}
                        </RadioGroup>
                        :
                        <RadioGroup className="mt-4" name={`use-radio-group-${index}`}>
                            {question.options.map((option, optionIndex) => (
                                <MyFormControlLabel key={optionIndex} onChange={(e) => handleOnChange(e, index, question.question, optionIndex)} value={option.label} label={option.label} control={<Radio />} />
                            ))}
                        </RadioGroup>
                ) : (
                    user.role_str !== "student" || questionnaireAnswers.length > 0 ?
                        <TextField
                            id="outlined-basic"
                            label=""
                            disabled
                            defaultValue={questionnaireAnswers[index].answer}
                            variant="filled"
                            className='w-full mt-5'
                            rows={3}
                            multiline
                        />
                        :
                        <TextField
                            id="outlined-basic"
                            label=""
                            onBlur={(e) => handleOnChange(e, index, question.question)}
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
