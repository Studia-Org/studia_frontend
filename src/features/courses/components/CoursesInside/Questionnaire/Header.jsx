import React, { useState, useEffect } from 'react'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { SwitchEdit } from '../SwitchEdit'
import Chip from '@mui/material/Chip';
import { Button, Popconfirm, Badge } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { message } from 'antd';
import { useAuthContext } from '../../../../../context/AuthContext';
import { API } from '../../../../../constant';
import dayjs from 'dayjs';
import { getToken } from '../../../../../helpers';


export const Header = ({ enableEdit, questionnaire, questionnaireAnswerData, completed, setEnableEdit, courseSubsection, editedQuestions }) => {
    const { user } = useAuthContext()
    const [titleEdit, setTitleEdit] = useState(questionnaire.attributes.Title)
    const [descriptionEdit, setDescriptionEdit] = useState(questionnaire.attributes.description)
    const [deadline, setDeadline] = useState(new Date(questionnaire.attributes.deadline))
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setTitleEdit(questionnaire.attributes.Title);
        setDescriptionEdit(questionnaire.attributes.description);
        setDeadline(dayjs(courseSubsection.attributes.end_date))
    }, [questionnaire])


    async function saveChanges() {
        setLoading(true);
        const newQuestions = editedQuestions;
        const newObject = {
            questionnaire: {
                ...questionnaire.attributes.Options.questionnaire,
                questions: questionnaire.attributes.Options.questionnaire.questions.map((question, index) => {
                    if (newQuestions[index] !== undefined) {
                        return { ...question, question: newQuestions[index].question, options: newQuestions[index].options }
                    } else {
                        return question
                    }
                })
            }
        }

        await fetch(`${API}/questionnaires/${questionnaire.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({
                data: {
                    Title: titleEdit,
                    description: descriptionEdit,
                    Options: newObject
                }
            })
        });

        const response2 = await fetch(`${API}/subsections/${courseSubsection.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({
                data: {
                    end_date: deadline
                }
            })
        });

        if (response2.ok) {
            setLoading(false);
            message.success('Changes saved, Refresh the page to see the changes');
        } else {
            setLoading(false);
            message.error('Error saving changes');
        }
    }

    function format(ms) {
        const date = new Date('1970-01-01 ' + ms);
        let formattedTime = undefined;

        if (date.getHours() > 0) {
            formattedTime = date.toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit", second: "2-digit" });
            formattedTime = formattedTime + "hr"
        } else {
            formattedTime = date.toLocaleTimeString('en-US', { minute: "2-digit", second: "2-digit" });
            formattedTime = formattedTime + "min"
        }

        return formattedTime;
    }

    return (
        <div className="bg-white rounded-md shadow-md border-t-[14px] border-[#6366f1]">
            <div className="flex flex-col w-full my-7 mx-7">
                <div className='flex items-center w-full '>
                    {enableEdit ? (
                        <input type="text" value={titleEdit} className='w-full text-3xl font-semibold' onChange={(e) => setTitleEdit(e.target.value)} />
                    ) : (
                        <div className='flex items-center w-full gap-3'>
                            <p className="text-3xl font-semibold text-black">{questionnaire.attributes.Title}</p>
                            <Badge color="#6366f1" className='ml-auto mr-10' count={new Date(courseSubsection.attributes.end_date).toDateString()} />
                        </div>
                    )}
                    {(questionnaireAnswerData.length > 0 && user?.role_str === 'student') && (
                        <div className='flex items-center justify-end'>
                            <Chip className='mr-10 ' label="Completed" color="success" />
                        </div>
                    )}
                </div>
                <div className='flex justify-between mt-7'>
                    {enableEdit ? (
                        <input type="text" value={descriptionEdit} className='w-full' onChange={(e) => setDescriptionEdit(e.target.value)} />
                    ) : (
                        <p>{questionnaire.attributes.description}</p>
                    )}
                    {completed === true ? (
                        <span className='pl-2 mr-10 text-gray-500'>{"Completed in: " + format(questionnaireAnswerData[0]?.timeToComplete)}</span>
                    ) : null}
                </div>

                {
                    enableEdit && (
                        <>
                            <p className='mt-3 text-sm text-gray-500'>Deadline</p>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DateTimePicker']}>
                                    <DateTimePicker className='w-1/2'
                                        value={deadline} onChange={(newDate) => setDeadline(newDate)}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </>
                    )
                }

            </div>
            <div className='mr-3'>
                {
                    user.role_str !== 'student' && (
                        <div className='flex flex-col items-end justify-end mb-10 space-y-5'>
                            <SwitchEdit enableEdit={enableEdit} setEnableEdit={setEnableEdit} />
                            <AnimatePresence>
                                {enableEdit && (
                                    <motion.div
                                        initial={{ opacity: -10, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: -10, y: 0 }}
                                        transition={{ duration: 0.1 }}
                                        className="">
                                        <div>
                                            <Popconfirm
                                                title="Edit the questionnaire"
                                                description="Are you sure you want to save changes?"
                                                okText="Yes"
                                                onConfirm={() => saveChanges()}
                                                okButtonProps={{ className: 'bg-blue-500', type: 'primary' }}
                                                cancelText="No">
                                                <Button
                                                    type="primary"
                                                    loading={loading}
                                                    className="justify-center px-4 mb-5 text-sm font-medium text-white duration-150 bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                                    Save Changes
                                                </Button>

                                            </Popconfirm>
                                        </div>

                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )
                }
            </div>
        </div>

    )
}