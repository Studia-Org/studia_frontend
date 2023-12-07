import React, { useState, useEffect } from 'react'
import { motion } from "framer-motion";
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import RadioGroup, { useRadioGroup } from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import { message } from 'antd';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const item = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: -100 },
}

export const AddQuestionButton = ({ setCourseSubsectionQuestionnaire }) => {
    const [selectorValue, setSelectorValue] = useState('open-ended-short')
    const [newOption, setNewOption] = useState('')
    const [addQuestionText, setAddQuestionText] = useState({ question: '', options: null })

    function addOptionToList() {
        setAddQuestionText(prev => {
            return {
                ...prev,
                options: [...prev.options, newOption]
            }
        })
    }

    const StyledFormControlLabel = styled((props) => <FormControlLabel {...props} />)(
        ({ theme, checked }) => ({
            '.MuiFormControlLabel-label': checked && {
                color: theme.palette.primary.main,
            },
        })
    );

    function submitQuestion() {
        if (addQuestionText.question.length > 0) {
            handleQuestionSubmission();
            clearForm();
        } else {
            message.error('Please enter question text');
        }
    }

    function handleQuestionSubmission() {
        if (selectorValue === 'open-ended-short') {
            handleOpenEndedShortSubmission('open-ended-short');
        } else if (selectorValue === 'open-ended-long') {
            handleOpenEndedShortSubmission('open-ended-long');
        } else if (selectorValue === 'options') {
            handleOpenEndedShortSubmission(addQuestionText.options)
        }
    }

    function handleOpenEndedShortSubmission(optionsType) {
        setCourseSubsectionQuestionnaire((prevCourseSubsectionQuestionnaire) => {
            const newQuestion = {
                options: optionsType,
                question: addQuestionText.question,
            };
            const updatedCourseSubsectionQuestionnaire = {
                ...prevCourseSubsectionQuestionnaire,
                attributes: {
                    ...prevCourseSubsectionQuestionnaire.attributes,
                    Options: {
                        ...prevCourseSubsectionQuestionnaire.attributes.Options,
                        questionnaire: {
                            ...prevCourseSubsectionQuestionnaire.attributes.Options.questionnaire,
                            questions: [
                                ...prevCourseSubsectionQuestionnaire.attributes.Options.questionnaire.questions,
                                newQuestion,
                            ],
                        },
                    },
                },
            };
            return updatedCourseSubsectionQuestionnaire;
        });
    }

    function clearForm() {
        setAddQuestionText({ question: '', options: null });
        setSelectorValue('open-ended-short');
        setNewOption('');
    }

    const MyFormControlLabel = (props) => {
        const radioGroup = useRadioGroup();
        let checked = false;
        if (radioGroup) {
            checked = radioGroup.value === props.value;
        }
        return <StyledFormControlLabel checked={checked} {...props} />;
    };

    return (
        <div
            className='bg-white shadow-md rounded-md p-5 border-l-8 mt-5 flex flex-col justify-center border-[#6366f1]'
            variants={item}>
            <div className='flex items-center justify-between mb-5'>
                <p className="font-medium mb-4">Add question</p>
                <FormControl >
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectorValue}
                        label=""
                        onChange={(e) => {
                            setSelectorValue(e.target.value)
                            if (e.target.value === 'options') {
                                setAddQuestionText(prevQuestionText => ({ ...prevQuestionText, options: [] }));
                            } else {
                                setAddQuestionText(prevQuestionText => ({ ...prevQuestionText, options: e.target.value }));
                            }
                        }}
                    >
                        <MenuItem value={'open-ended-short'}> Short answer</MenuItem>
                        <MenuItem value={'open-ended-long'}>Long answer</MenuItem>
                        <MenuItem value={'options'}>Checkboxes</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <label className='text-sm text-gray-500 mb-3' htmlFor="" >Question</label>
            <TextField
                id="outlined-basic"
                label=""
                value={addQuestionText.question}
                onChange={(e) => setAddQuestionText(prevQuestionText => ({ ...prevQuestionText, question: e.target.value }))}

                variant="outlined"
                className='w-full'
                rows={1}
                multiline
            />
            {
                selectorValue === 'options' &&
                <>
                    <label className='text-sm text-gray-500 mb-3 mt-5' htmlFor="" >Options</label>
                    <div className='flex flex-col'>

                        {
                            addQuestionText?.options?.length > 0 ?
                                addQuestionText.options.map((option, index) => (
                                    <RadioGroup className="mt-4 ml-5" name={`use-radio-group-${index}`} >
                                        <MyFormControlLabel key={index} value={option} label={option} control={<Radio disabled readOnly />} />
                                    </RadioGroup>
                                )) :
                                null

                        }
                        <div className='mt-5 flex items-center'>
                            <button onClick={() => addOptionToList()} className='flex items-center  p-4 text-sm font-medium '>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <TextField
                                id="outlined-basic"
                                label=""
                                value={newOption}
                                onChange={(e) => { setNewOption(e.target.value) }}
                                variant="outlined"
                                className='w-full'
                                rows={1}
                                multiline
                            />
                        </div>

                    </div>
                </>
            }
            <button onClick={submitQuestion} className='ml-auto  mt-5 rounded-md bg-[#6366f1]  p-2 text-white'>
                Submit
            </button>
        </div>
    )
}
