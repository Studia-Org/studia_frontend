import React, { useState, useEffect } from 'react'
import { motion } from "framer-motion";
import FormControlLabel from '@mui/material/FormControlLabel';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import RadioGroup, { useRadioGroup } from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import { TableCategories } from './TableCategories';
import { message, DatePicker, Input, Switch, InputNumber, Button, Tooltip, Select, Modal } from 'antd';
import FormControl from '@mui/material/FormControl';
import { PonderationWarning } from './PonderationWarning';
import { QuestionnaireInfo } from './EditSubsection/QuestionnaireInfo';
import { useTranslation } from 'react-i18next';
import { ImportQuestionnaireInfo } from './EditSubsection/ImportQuestionnaireInfo';
;

const { RangePicker } = DatePicker;
const { TextArea } = Input;



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



export const QuestionnaireComponentEditable = ({ subsection, setCreateCourseSectionsList, createCourseSectionsList, sectionId, categories }) => {

    const { t } = useTranslation();
    console.log('QuestionnaireComponentEditable')

    const questionsPerPage = 3;
    const [currentPage, setCurrentPage] = useState(1);
    const [selectorValue, setSelectorValue] = useState({ value: 'open-ended', label: 'Text' })
    const [newOption, setNewOption] = useState('')
    const [addQuestionText, setAddQuestionText] = useState({ question: '', options: [] })
    const totalQuestions = subsection?.questionnaire?.attributes?.Options?.questionnaire?.questions.length;
    const totalPages = Math.ceil(totalQuestions / questionsPerPage);
    const [title, setTitle] = useState(subsection.title)
    const [description, setDescription] = useState(subsection.questionnaire.attributes.description);
    const [editQuestionFlags, setEditQuestionFlags] = useState(Array(totalQuestions).fill(false));
    const [autocorrectTest, setAutocorrectTest] = useState(subsection.questionnaire.attributes.autocorrect);
    const [embedCode, setEmbedCode] = useState(subsection.questionnaire.attributes?.Options?.embedCode)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const isQuestionnaireEditable = subsection.questionnaire.attributes?.editable;
    const [loading, setLoading] = useState(false);

    const simulateLoading = () => {
        setLoading(true);

        setTimeout(() => {
            setIsModalVisible(true)
        }, 500);

        setTimeout(() => {
            setLoading(false);
        }, 1000);

    }

    useEffect(() => {
        setTitle(subsection.title)
        setDescription(subsection.questionnaire.attributes.description)
        setAutocorrectTest(subsection.questionnaire.attributes.autocorrect)
        setEmbedCode(subsection.questionnaire.attributes?.Options?.embedCode)
    }, [subsection]);

    const handleEditQuestionClick = (index) => {
        const newFlags = [...editQuestionFlags];
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

    const MyFormControlLabel = ({ value, label, question, ...rest }) => {
        // Comprueba si el valor del radio actual coincide con la respuesta correcta almacenada en correctAnswers
        const isChecked = subsection.questionnaire.attributes.Options.questionnaire.correctAnswers[question] === value;

        return <StyledFormControlLabel checked={isChecked} value={value} label={label} {...rest} />;
    };

    const handleCorrectAnswersChange = (event, question) => {
        const selectedOption = event.target.value; // Valor del radio seleccionado
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
                                        Options: {
                                            ...sub.questionnaire.attributes.Options,
                                            questionnaire: {
                                                ...sub.questionnaire.attributes.Options.questionnaire,
                                                correctAnswers: {
                                                    ...sub.questionnaire.attributes.Options.questionnaire.correctAnswers,
                                                    [question]: selectedOption
                                                }
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
    useEffect(() => {
        const modal = document.getElementsByClassName('ant-modal-body')[0];
        if (modal) modal.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage])

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
            setAddQuestionText({ question: '', options: [] })
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
        if (newOption === '') {
            message.error('Please fill in the option field')
            return
        }
        try {
            setAddQuestionText(prev => {
                return {
                    ...prev,
                    options: [...prev?.options, newOption]
                }
            })
            setNewOption('')
        } catch (error) {
            console.error(error)
        }

    }

    const handleChangeAutocorrect = (value) => {
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
                                            autocorrect: value,
                                            ...(value === false && {
                                                Options: {
                                                    ...sub.questionnaire.attributes.Options,
                                                    questionnaire: {
                                                        ...sub.questionnaire.attributes.Options.questionnaire,
                                                        correctAnswers: {}
                                                    }
                                                }
                                            })
                                        }
                                    }
                                };
                            }
                            return sub;
                        }),
                    };
                }
                return course;
            });
        });
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

    const validateEmbedCode = (value) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = value.trim();

        const iframe = tempDiv.querySelector('iframe');


        if (!iframe) {
            return { isValid: false, messageError: "No se encontró un iframe en el embed code." };
        }


        const src = iframe?.getAttribute('src');
        if (!src || (!src.startsWith('https://forms.office.com') && !src.startsWith('https://docs.google.com/forms/'))) {
            return { isValid: false, messageError: "El iframe no tiene un src válido." };
        }


        iframe?.removeAttribute('style');
        iframe?.removeAttribute('width');
        iframe?.removeAttribute('height');
        if (src.startsWith('https://forms.office.com/Pages/ResponsePage.aspx')) {
            iframe?.setAttribute('width', '400');
            iframe?.setAttribute('height', '400');
        }
        iframe?.setAttribute('class', 'mt-6 w-full rounded-md h-screen');
        iframe?.removeAttribute('classname');

        const sanitizedEmbedCode = iframe.outerHTML;
        console.log(sanitizedEmbedCode)


        // Si todo es válido
        return { isValid: true, messageError: "El embed code es válido.", sanitizedEmbedCode: sanitizedEmbedCode };
    };

    const handleChangeEmbedCode = (value) => {
        const { isValid, messageError, sanitizedEmbedCode } = validateEmbedCode(value);

        if (!isValid) {
            setEmbedCode(undefined);
            message.error(messageError);
            return;
        }

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
                                            Options: {
                                                ...sub.questionnaire.attributes.Options,
                                                embedCode: sanitizedEmbedCode
                                            }
                                        },
                                    },
                                    embedCode: sanitizedEmbedCode,
                                };
                            }
                            return sub;
                        }),
                    };
                }
                return course;
            });
        });
    }

    const handleChangeTitle = (value) => {
        setCreateCourseSectionsList((courses) => {
            return courses.map((course) => {
                if (course.subsections) {
                    return {
                        ...course,
                        subsections: course.subsections.map((sub) => {
                            if (sub.id === subsection.id) {
                                // Cambiar el título del cuestionario
                                return {
                                    ...sub,
                                    title: value,
                                    questionnaire: {
                                        ...sub.questionnaire,
                                        attributes: {
                                            ...sub.questionnaire.attributes,
                                            Title: value,
                                            Options: {
                                                ...sub.questionnaire.attributes.Options,
                                                questionnaire: {
                                                    ...sub.questionnaire.attributes.Options.questionnaire,
                                                    title: value,
                                                },
                                            },
                                        },
                                    },
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

                        {
                            isQuestionnaireEditable && (
                                <div className='flex ml-auto space-x-2'>
                                    <svg onClick={() => handleEditQuestionClick(absoluteIndex)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-5 cursor-pointer">
                                        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                                    </svg>
                                    <svg onClick={() => deleteQuestion(absoluteIndex)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 cursor-pointer">
                                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )
                        }

                    </div>
                    {Array.isArray(question.options) ? (
                        <div key={absoluteIndex}>
                            <RadioGroup className="mt-4" name={`use-radio-group-${absoluteIndex}`} >
                                {question.options.map((option, optionIndex) => (
                                    <MyFormControlLabel
                                        key={optionIndex}
                                        value={option}
                                        label={option}
                                        question={question.question}
                                        onChange={(e) => handleCorrectAnswersChange(e, question.question)}
                                        control={<Radio disabled={!autocorrectTest} />}
                                    />
                                ))}
                            </RadioGroup>
                        </div>
                    ) : (
                        question.options === 'open-ended-short' ?
                            <div key={absoluteIndex} className='flex w-full mt-5'>
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
                            <div key={absoluteIndex} className='flex w-full mt-5'>
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

    const handleSwitchChange = (checked) => {
        setCreateCourseSectionsList(prevSections => {
            const updatedSections = prevSections.map(section => {
                if (section.subsections) {
                    const updatedSubsections = section.subsections.map(sub => {
                        if (sub.id === subsection.id) {
                            return {
                                ...sub,
                                activity: {
                                    ...sub.activity,
                                    evaluable: checked
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

    const handlePonderationChange = (value) => {
        setCreateCourseSectionsList(prevSections => {
            const updatedSections = prevSections.map(section => {
                if (section.subsections) {
                    const updatedSubsections = section.subsections.map(sub => {
                        if (sub.id === subsection.id) {
                            return {
                                ...sub,
                                activity: {
                                    ...sub.activity,
                                    ponderation: value
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

    const handleDateChange = (date) => {
        setCreateCourseSectionsList(prevSections => {
            const updatedSections = prevSections.map(section => {
                if (section.subsections) {
                    const updatedSubsections = section.subsections.map(sub => {
                        if (sub.id === subsection.id) {
                            if (date[0] === null && date[1] === null) {
                                return {
                                    ...sub,
                                    start_date: null,
                                    end_date: null
                                };
                            }
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
        <>
            <Modal id="modal_questionnaire" centered bodyStyle={{ height: '80vh', display: 'flex', flexDirection: 'column', overflow: "scroll" }}
                width={"50vw"} open={isModalVisible} onOk={() => setIsModalVisible(false)} closable={false} okText={isQuestionnaireEditable ? t("COMMON.save_changes") : t("COMMON.close")}
                cancelButtonProps={{ style: { display: 'none' } }}>
                <motion.ul
                    initial="hidden"
                    animate="visible"
                    variants={list}
                >
                    <div className="mt-5 space-y-5 ">{renderQuestionsForPage()}</div>
                </motion.ul>
                {
                    ((currentPage === totalPages || totalPages === 0) && isQuestionnaireEditable) &&
                    <div
                        className='bg-white shadow-md rounded-md p-5 border-l-8 mt-5 flex flex-col justify-center border-[#6366f1]'
                        variants={item}>
                        <div className='flex items-center justify-between mb-5'>
                            <p className="mb-4 font-medium">{t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.add_question")}</p>
                            <FormControl >
                                <Select
                                    className='w-40'
                                    value={selectorValue}
                                    options={[
                                        { value: 'open-ended', label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.text") },
                                        { value: 'options', label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.Options") }
                                    ]}
                                    onChange={(e) => {
                                        setSelectorValue(e)
                                        if (e === 'options') {
                                            setAddQuestionText(prevQuestionText => ({ ...prevQuestionText, options: [] }));
                                        } else {
                                            setAddQuestionText(prevQuestionText => ({ ...prevQuestionText, options: e }));
                                        }
                                    }}
                                >
                                </Select>
                            </FormControl>
                        </div>
                        <label className='mb-3 text-sm text-gray-500' htmlFor="" >{t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.question")}</label>
                        <TextArea
                            value={addQuestionText.question}
                            placeholder={t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.question_placeholder")}
                            className='w-full'
                            allowClear
                            onChange={(e) => setAddQuestionText(prevQuestionText => ({ ...prevQuestionText, question: e.target.value }))}
                            rows={3}

                        />

                        {
                            selectorValue === 'options' &&
                            <>
                                <label className='mt-5 mb-3 text-sm text-gray-500' htmlFor="" >{t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.Options")}</label>
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
                                    <div className='flex items-center mt-5'>
                                        <Button onClick={() => addOptionToList()} className='flex items-center px-2 mr-3 font-medium h-9'>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                                            </svg>
                                        </Button>
                                        <TextArea
                                            value={newOption}
                                            onChange={(e) => { setNewOption(e.target.value) }}
                                            className='w-full'
                                            rows={2}

                                        />
                                    </div>

                                </div>
                            </>

                        }

                        <button onClick={() => addQuestion()} className='ml-auto  mt-5 rounded-md bg-[#6366f1]  p-2 text-white'>
                            {t("CREATE_COURSES.COURSE_SECTIONS.create")}
                        </button>
                    </div>
                }
                <footer style={{ marginTop: 'auto' }} >
                    <div className="flex h-fit items-center justify-between mt-5 mb-8 bg-white rounded-md shadow-md p-5 border-b-8 border-[#6366f1]">
                        <button className='flex items-center mx-4 duration-200 hover:-translate-x-2 disabled:text-gray-300 disabled:translate-x-0' onClick={handlePrevPage} disabled={currentPage === 1}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                            </svg>
                            {t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.previous")}
                        </button>
                        <button className='flex items-center mx-4 duration-200 hover:translate-x-2 disabled:text-gray-300 disabled:translate-x-0' onClick={handleNextPage} disabled={currentPage === totalPages}>
                            {t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.next")}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                            </svg>
                        </button>
                    </div>
                </footer>
            </Modal>
            <div className="flex flex-col ">
                <div className="bg-white rounded-md shadow-md border-t-[14px] border-[#6366f1] p-8 mb-5">
                    <div className="">
                        <div className='flex items-center'>
                            <Input className='px-1 mb-5 border border-[#d9d9d9] rounded-md text-3xl font-semibold text-black pl-3' placeholder="Title" value={title}
                                onChange={(e) => setTitle(e.target.value)} onBlur={(e) => handleChangeTitle(e.target.value)} />
                        </div>
                    </div>
                    <div className='space-y-4 bg-white rounded-md '>
                        <label className='text-sm text-gray-500' htmlFor="" > {t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.date")} *</label>
                        <RangePicker
                            placeholder={
                                [
                                    t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.date_placeholder_start"),
                                    t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.date_placeholder_end")
                                ]
                            }
                            className='w-full py-4'
                            showTime={{
                                format: 'HH:mm',
                            }}
                            format="YYYY-MM-DD HH:mm"
                            value={subsection.start_date ? [dayjs(subsection.start_date), dayjs(subsection.end_date)] : null}
                            onChange={onChangeDate}
                        />
                        <div className='mt-7'>
                            <label className='block mr-3 text-sm text-gray-500' htmlFor=''>{t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.categories")} * </label>
                            <TableCategories categories={categories[sectionId]} setCreateCourseSectionsList={setCreateCourseSectionsList}
                                subsection={subsection} sectionID={sectionId} createCourseSectionsList={createCourseSectionsList} />
                        </div>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                                <label className='block mr-3 text-sm text-gray-500' htmlFor=''>{t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.evaluable")} * </label>
                                <Switch checked={subsection.activity?.evaluable} onChange={(e) => handleSwitchChange(e)} className='bg-gray-300' />
                            </div>
                            {
                                subsection.activity?.evaluable && (
                                    <div className='flex items-center'>
                                        <Tooltip title={t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.autocorrect_text")}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
                                            </svg>
                                        </Tooltip>

                                        <label className='block mr-3 text-sm text-gray-500' htmlFor=''>{t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.autocorrect")} * </label>
                                        <Switch checked={autocorrectTest} onChange={(e) => handleChangeAutocorrect(e)} className='bg-gray-300' />
                                    </div>
                                )
                            }

                            <div className='flex items-center gap-4'>
                                {
                                    subsection.activity?.evaluable && (
                                        <PonderationWarning createCourseSectionsList={createCourseSectionsList} sectionID={sectionId} />
                                    )
                                }
                                <label className='text-sm text-gray-500' htmlFor=''>{t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ponderation")} *</label>
                                <InputNumber
                                    disabled={!subsection.activity?.evaluable}
                                    defaultValue={0}
                                    onChange={(e) => handlePonderationChange(e)}
                                    value={subsection.activity?.evaluable ? subsection.activity?.ponderation : 0}
                                    min={0}
                                    max={100}
                                    formatter={(value) => `${value}%`}
                                    parser={(value) => value.replace('%', '')}
                                />
                            </div>

                        </div>
                        {!embedCode &&
                            <div className='mt-7'>
                                <div className='flex items-center gap-3'>
                                    <label className='text-sm text-gray-500' htmlFor=''>{t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.questionnaire_type")} *</label>
                                    <QuestionnaireInfo />
                                </div>

                                <Select
                                    className='w-full mt-3'
                                    defaultValue="Stantard"
                                    onChange={(e) => {
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
                                                                        type: e
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
                                    }}
                                    value={subsection.questionnaire.attributes.type}
                                    options={[
                                        { value: 'standard', label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.standard") },
                                        { value: 'scaling', label: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.scaling") },
                                    ]}

                                />
                            </div>}
                        <div className='mt-7'>
                            <label className='text-sm text-gray-500 mt-7 ' htmlFor="" >{t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.description")}</label>
                            <div className='flex w-full mt-2'>
                                <Input className='px-1 py-3 border border-[#d9d9d9] rounded-md text-sm pl-3' placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} onBlur={(e) => handleChangeDescription(e.target.value)} />
                            </div>
                        </div>
                        <div className='mt-7'>
                            <div className='flex items-center gap-2'>
                                <label className='text-sm text-gray-500 ' htmlFor="" >Import questionnaire</label>
                                <ImportQuestionnaireInfo />
                            </div>
                            <div className='flex w-full mt-2'>
                                <Input className='px-1 py-3 border border-[#d9d9d9] rounded-md text-sm pl-3' placeholder='<iframe ...' value={embedCode} onChange={(e) => setEmbedCode(e.target.value)} onBlur={(e) => handleChangeEmbedCode(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>
                {!embedCode &&
                    <Button loading={loading} onClick={() => { simulateLoading(); }} type="primary" className='flex items-center justify-center w-full p-2 mb-5 rounded-md'>

                        {isQuestionnaireEditable ? t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.edit_questions") :
                            t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.view_questions")
                        }
                    </Button>
                }
            </div>
        </>
    );
}
