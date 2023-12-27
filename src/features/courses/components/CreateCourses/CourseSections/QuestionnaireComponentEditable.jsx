import React, { useState, useEffect } from 'react'
import { motion } from "framer-motion";
import FormControlLabel from '@mui/material/FormControlLabel';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import RadioGroup, { useRadioGroup } from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import { message, DatePicker, Input } from 'antd';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


const { RangePicker } = DatePicker;


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
    const [editQuestionFlags, setEditQuestionFlags] = useState(Array(totalQuestions).fill(false));

    useEffect(() => {
        setDescription(subsection.questionnaire.attributes.description)
    }, [subsection]);

    const handleEditQuestionClick = (index) => {
        const newFlags = [...editQuestionFlags];
        console.log(editQuestionFlags)
        newFlags[index] = !newFlags[index];
        setEditQuestionFlags(newFlags);
    };


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

    function handleOnChangeQuestion(newTitle, absoluteIndex) {
        setCreateCourseSectionsList(prevSections => {
            const updatedSections = prevSections.map(section => {
                if (section.subsections) {
                    const updatedSubsections = section.subsections.map(sub => {
                        if (sub.id === subsection.id) {
                            const originalQuestions = sub.questionnaire.attributes.Options.questionnaire.questions;
                            const updatedQuestions = Array.from(originalQuestions);
                            updatedQuestions[absoluteIndex].question = newTitle;
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

        })
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
        setCreateCourseSectionsList((courses) => {
            return courses.map((course) => {
                if (course.subsections) {
                    return {
                        ...course,
                        subsections: course.subsections.map((sub) => {
                            if (sub.id === subsection.id) {
                                return {
                                    ...sub,
                                    questionnaire: {
                                        ...sub.questionnaire,
                                        attributes: {
                                            ...sub.questionnaire.attributes,
                                            description: value,
                                        },
                                    },
                                    description: value,
                                };
                            }
                            return sub;
                        }),
                    };
                }
                return course;
            });
        });
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
                        {editQuestionFlags[absoluteIndex] ? (
                            <TextField
                                id="outlined-basic"
                                label=""
                                variant="outlined"
                                className='w-full'
                                rows={1}
                                onChange={(e) => handleOnChangeQuestion(e.target.value, absoluteIndex)}
                                value={question.question}
                                multiline
                            />
                        ) : (
                            <p className="font-medium">{question.question}</p>
                        )}

                        <div className='flex ml-auto space-x-2'>
                            <svg onClick={() => handleEditQuestionClick(absoluteIndex)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="ml-5 w-5 h-5 cursor-pointer">
                                <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                            </svg>
                            <svg onClick={() => deleteQuestion(absoluteIndex)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 cursor-pointer">
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                            </svg>
                        </div>

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

    const handleDateChange = (date) => {
        setCreateCourseSectionsList(prevSections => {
            const updatedSections = prevSections.map(section => {
                if (section.subsections) {
                    const updatedSubsections = section.subsections.map(sub => {
                        if (sub.id === subsection.id) {
                            return {
                                ...sub,
                                start_date: date[0].format('MM-DD-YYYY HH:mm:ss'),
                                end_date: date[1].format('MM-DD-YYYY HH:mm:ss')
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

    const onChangeDate = (value) => {
        if (value === null) {
            handleDateChange([null, null]);
        } else {
            handleDateChange(value);
        }
    }

    return (
        <div className="flex flex-col mt-5 ">
            <div className="bg-white rounded-md shadow-md border-t-[14px] border-[#6366f1] p-8">
                <div className="">
                    <div className='flex items-center'>
                        <p className="text-black font-semibold text-3xl mb-5 ">{subsection.title}</p>
                    </div>
                </div>
                <div className='bg-white rounded-md space-y-2  '>
                    <label className='text-sm text-gray-500' htmlFor="" >Questionnaire Date</label>
                    <RangePicker
                        className='w-full py-4'
                        showTime={{
                            format: 'HH:mm',
                        }}
                        format="YYYY-MM-DD HH:mm"
                        defaultValue={subsection.start_date ? [dayjs(subsection.start_date), dayjs(subsection.end_date)] : null}
                        onChange={onChangeDate}
                    />
                    <div className='mt-7'>
                        <label className='text-sm text-gray-500 mt-7 ' htmlFor="" >Description</label>
                        <div className='flex w-full mt-2'>
                            <Input className='px-1 py-3 border border-[#d9d9d9] rounded-md text-sm pl-3' placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} onBlur={(e) => handleChangeDescription(e.target.value)} />
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
