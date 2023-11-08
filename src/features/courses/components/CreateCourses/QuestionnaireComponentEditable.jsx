import React, { useState, useEffect } from 'react'
import { motion } from "framer-motion";
import FormControlLabel from '@mui/material/FormControlLabel';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import RadioGroup, { useRadioGroup } from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Radio from '@mui/material/Radio';
import { message } from 'antd';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';


const list = {
    visible: { opacity: 1 },
    transition: {
        type: "spring",
        bounce: 0,
        duration: 0.7,
        delayChildren: 0.3,
        staggerChildren: 0.05
    },
    hidden: { opacity: 0 },
}
const item = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: -100 },
}




export const QuestionnaireComponentEditable = ({ subsection, setCreateCourseSectionsList, createCourseSectionsList }) => {
    const questionsPerPage = 3;
    const [currentPage, setCurrentPage] = useState(1);
    const [selectorValue, setSelectorValue] = useState('open-ended-short')
    const [newOption, setNewOption] = useState('')
    const [addQuestionText, setAddQuestionText] = useState({ question: '', options: null })
    const totalQuestions = subsection?.questionnaire?.attributes?.Options?.questionnaire?.questions.length;
    const totalPages = Math.ceil(totalQuestions / questionsPerPage);
    const [description, setDescription] = useState(subsection.questionnaire.attributes.description);

    useEffect(() => { 
        setDescription(subsection.questionnaire.attributes.description)
    }, [subsection]);


    const StyledFormControlLabel = styled((props) => <FormControlLabel {...props} />)(
        ({ theme, checked }) => ({
            '.MuiFormControlLabel-label': checked && {
                color: theme.palette.primary.main,
            },
        })
    );

    const MyFormControlLabel = (props) => {
        const radioGroup = useRadioGroup();

        let checked = false;

        if (radioGroup) {
            checked = radioGroup.value === props.value;
        }

        return <StyledFormControlLabel checked={checked} {...props} />;
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    function addQuestion() {
        if (addQuestionText.question === '' || addQuestionText.options?.length === 0 || Object.keys(addQuestionText).length === 0) {
            message.error('Please fill in all fields')
        } else {
            if (selectorValue === 'open-ended-short' || selectorValue === 'open-ended-long') {
                setCreateCourseSectionsList(prevSections => {
                    const updatedSections = prevSections.map(section => {
                        if (section.subsections) {
                            const updatedSubsections = section.subsections.map(sub => {
                                if (sub.id === subsection.id) {
                                    const originalQuestions = sub.questionnaire.attributes.Options.questionnaire.questions;
                                    const updatedQuestions = Array.from(originalQuestions);

                                    if (selectorValue === 'open-ended-short') {
                                        updatedQuestions.push({
                                            options: 'open-ended-short',
                                            question: addQuestionText.question
                                        });
                                    } else {
                                        updatedQuestions.push({
                                            options: 'open-ended-long',
                                            question: addQuestionText.question
                                        });
                                    }

                                    return {
                                        ...sub,
                                        questionnaire: {
                                            ...sub.questionnaire,
                                            attributes: {
                                                ...sub.questionnaire.attributes,
                                                Options: {
                                                    ...sub.questionnaire.attributes.Options,
                                                    questionnaire: {
                                                        ...sub.questionnaire.attributes.Options.questionnaire,
                                                        questions: updatedQuestions
                                                    }
                                                }
                                            }
                                        }
                                    };
                                }
                                return sub;
                            });
                            return {
                                ...section,
                                subsections: updatedSubsections
                            };
                        }
                        return section;
                    });
                    return updatedSections;
                });



            } else {
                setCreateCourseSectionsList(prevSections => {
                    const updatedSections = prevSections.map(section => {
                        if (section.subsections) {
                            const updatedSubsections = section.subsections.map(sub => {
                                if (sub.id === subsection.id) {
                                    const originalQuestions = sub.questionnaire.attributes.Options.questionnaire.questions;
                                    const updatedQuestions = Array.from(originalQuestions);
                                    updatedQuestions.push({
                                        options: addQuestionText.options,
                                        question: addQuestionText.question
                                    });

                                    return {
                                        ...sub,
                                        questionnaire: {
                                            ...sub.questionnaire,
                                            attributes: {
                                                ...sub.questionnaire.attributes,
                                                Options: {
                                                    ...sub.questionnaire.attributes.Options,
                                                    questionnaire: {
                                                        ...sub.questionnaire.attributes.Options.questionnaire,
                                                        questions: updatedQuestions
                                                    }
                                                }
                                            }
                                        }
                                    };
                                }
                                return sub;
                            });

                            return {
                                ...section,
                                subsections: updatedSubsections
                            };
                        }
                        return section;
                    });
                    return updatedSections;
                });
            }
            setNewOption('')
            setAddQuestionText({ question: '', options: null })
        }

    }

    function addOptionToList() {
        setAddQuestionText(prev => {
            return {
                ...prev,
                options: [...prev.options, newOption]
            }
        })
    }
    const handleChangeDescription = (value) => {
        setDescription(value);
        setCreateCourseSectionsList(prevSections => {
            const updatedSections = prevSections.map(section => {
                if (section.subsections) {
                    const updatedSubsections = section.subsections.map(sub => {
                        if (sub.id === subsection.id) {
                            return {
                                ...sub,
                                questionnaire: {
                                    ...sub.questionnaire,
                                    attributes: {
                                        ...sub.questionnaire.attributes,
                                        description: value
                                    }
                                }
                            };
                        }
                        return sub;
                    });
                    return {
                        ...section,
                        subsections: updatedSubsections
                    };
                }
                return section;
            });
            return updatedSections;
        })
    };

    function deleteQuestion(index) {
        setCreateCourseSectionsList(prevSections => {
            const updatedSections = prevSections.map(section => {
                if (section.subsections) {
                    const updatedSubsections = section.subsections.map(sub => {
                        if (sub.id === subsection.id) {
                            const originalQuestions = sub.questionnaire.attributes.Options.questionnaire.questions;
                            const updatedQuestions = Array.from(originalQuestions);
                            updatedQuestions.splice(index, 1);

                            return {
                                ...sub,
                                questionnaire: {
                                    ...sub.questionnaire,
                                    attributes: {
                                        ...sub.questionnaire.attributes,
                                        Options: {
                                            ...sub.questionnaire.attributes.Options,
                                            questionnaire: {
                                                ...sub.questionnaire.attributes.Options.questionnaire,
                                                questions: updatedQuestions
                                            }
                                        }
                                    }
                                }
                            };
                        }
                        return sub;
                    });

                    return {
                        ...section,
                        subsections: updatedSubsections
                    };
                }
                return section;
            });
            return updatedSections;
        });
    }

    const handleStartDateChange = (date) => {
        if (date) {
            setCreateCourseSectionsList(prevSections => {
                const updatedSections = prevSections.map(section => {
                    if (section.subsections) {
                        const updatedSubsections = section.subsections.map(sub => {
                            if (sub.id === subsection.id) {
                                return {
                                    ...sub,
                                    start_date: date.format('MM-DD-YYYY')
                                };
                            }
                            return sub;
                        });
                        return {
                            ...section,
                            subsections: updatedSubsections
                        };
                    }
                    return section;
                });
                return updatedSections;
            })
        }
    };

    const handleEndDateChange = (date) => {
        if (date) {
            setCreateCourseSectionsList(prevSections => {
                const updatedSections = prevSections.map(section => {
                    if (section.subsections) {
                        const updatedSubsections = section.subsections.map(sub => {
                            if (sub.id === subsection.id) {
                                return {
                                    ...sub,
                                    end_date: date.format('MM-DD-YYYY')
                                };
                            }
                            return sub;
                        });
                        return {
                            ...section,
                            subsections: updatedSubsections
                        };
                    }
                    return section;
                });
                return updatedSections;
            })
        }
    };

    const renderQuestionsForPage = () => {
        const startIdx = (currentPage - 1) * questionsPerPage;
        const endIdx = Math.min(startIdx + questionsPerPage, totalQuestions);
        const questionsForPage = subsection.questionnaire.attributes.Options.questionnaire.questions.slice(startIdx, endIdx);

        return questionsForPage.map((question, index) => {
            const absoluteIndex = startIdx + index;

            return (
                <motion.li
                    className='bg-white shadow-md rounded-md p-5 border-l-8 border-[#377ddf75]'
                    variants={item}>
                    <div className='flex items-center'>
                        <p className="font-medium">{question.question}</p>
                        <svg onClick={() => deleteQuestion(absoluteIndex)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-auto cursor-pointer">
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                        </svg>
                    </div>
                    {Array.isArray(question.options) ? (
                        <div key={absoluteIndex}>
                            <RadioGroup className="mt-4" name={`use-radio-group-${absoluteIndex}`} >
                                {question.options.map((option, optionIndex) => (
                                    <MyFormControlLabel key={optionIndex} value={option} label={option} control={<Radio disabled readOnly />} />
                                ))}
                            </RadioGroup>
                        </div>
                    ) : (
                        question.options === 'open-ended-short' ?
                            <div key={absoluteIndex} className='mt-5 flex w-full'>
                                <TextField
                                    id="outlined-basic"
                                    label=""
                                    disabled
                                    variant="filled"
                                    className='w-full'
                                    rows={1}
                                    multiline
                                />
                            </div> :
                            <div key={absoluteIndex} className='mt-5 flex w-full'>
                                <TextField
                                    id="outlined-basic"
                                    label=""
                                    disabled
                                    variant="filled"
                                    className='w-full'
                                    rows={3}
                                    multiline
                                />
                            </div>
                    )}
                </motion.li>
            );
        });
    };

    return (
        <div className="flex flex-col mt-5 ">
            <div className="bg-white rounded-md shadow-md border-t-[14px] border-[#6366f1] p-8">
                <div className="">
                    <div className='flex items-center'>
                        <p className="text-black font-semibold text-3xl mb-5 ">{subsection.title}</p>
                    </div>
                </div>
                <div className='bg-white rounded-md  '>
                    <div className='flex items-center justify-between w-full '>
                        <div>
                            <label className='text-sm text-gray-500' htmlFor="" >Start Date</label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker value={dayjs(subsection?.start_date)} onChange={handleStartDateChange} />
                                </DemoContainer>
                            </LocalizationProvider>
                        </div>
                        <div>
                            <label className='text-sm text-gray-500' htmlFor="" >End Date</label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker value={dayjs(subsection?.end_date)} onChange={handleEndDateChange} />
                                </DemoContainer>
                            </LocalizationProvider>
                        </div>
                    </div>
                    <div className='mt-7'>
                        <label className='text-sm text-gray-500 mt-7 ' htmlFor="" >Description</label>
                        <div className='flex w-full mt-2'>
                            <TextField
                                className='mt-5 flex w-full bg-gray-50'
                                id="outlined-basic"
                                label=''
                                value={description}
                                variant="outlined"
                                onChange={(e) => handleChangeDescription(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <motion.ul
                initial="hidden"
                animate="visible"
                variants={list}
            >
                <div className="space-y-5 mt-5 ">{renderQuestionsForPage()}</div>
            </motion.ul>

            {
                (currentPage === totalPages || totalPages === 0) &&
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

                    <button onClick={() => addQuestion()} className='ml-auto  mt-5 rounded-md bg-[#6366f1]  p-2 text-white'>
                        Submit
                    </button>
                </div>
            }


            <div className="flex items-center justify-between mt-5 mb-8 bg-white rounded-md shadow-md p-5 border-b-8 border-[#6366f1]">
                <button className='flex items-center hover:-translate-x-2 duration-200 mx-4 disabled:text-gray-300 disabled:translate-x-0' onClick={handlePrevPage} disabled={currentPage === 1}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                    </svg>
                    Previous
                </button>
                <button className='flex items-center hover:translate-x-2 duration-200 mx-4 disabled:text-gray-300 disabled:translate-x-0' onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
