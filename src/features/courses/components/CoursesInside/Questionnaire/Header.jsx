import React, { useState, useEffect } from 'react'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { SwitchEdit } from '../SwitchEdit'
import Chip from '@mui/material/Chip';
import { Button, Popconfirm, Badge, Input } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { message, Avatar } from 'antd';
import { useAuthContext } from '../../../../../context/AuthContext';
import { API } from '../../../../../constant';
import dayjs from 'dayjs';
import { getToken } from '../../../../../helpers';
import { useTranslation } from 'react-i18next';
import { ca, es, enUS } from 'date-fns/locale';
import formatDate from 'date-fns/format';
export const Header = ({ enableEdit, questionnaire, questionnaireAnswerData, completed, setEnableEdit, courseSubsection, editedQuestions, setQuestionnaireAnswerData, downloadQuestionnaires, loadingQuestionnaires }) => {
    const { user } = useAuthContext()
    const [titleEdit, setTitleEdit] = useState(questionnaire.attributes.Title)
    const [titleEditFinal, setTitleEditFinal] = useState(questionnaire.attributes.Title)
    const [descriptionEdit, setDescriptionEdit] = useState(questionnaire.attributes.description)
    const [descriptionEditFinal, setDescriptionEditFinal] = useState(questionnaire.attributes.description)
    const [deadline, setDeadline] = useState(new Date(questionnaire.attributes.deadline))
    const [deadlineFinal, setDeadlineFinal] = useState(new Date(questionnaire.attributes.deadline))
    const [loading, setLoading] = useState(false)
    const { t, i18n } = useTranslation();
    const locales = { ca, es }
    const local = locales[i18n.language] || enUS;

    useEffect(() => {
        setTitleEdit(questionnaire.attributes.Title);
        setDescriptionEdit(questionnaire.attributes.description);
        setDeadline(dayjs(courseSubsection.attributes.end_date))
        setTitleEditFinal(questionnaire.attributes.Title);
        setDescriptionEditFinal(questionnaire.attributes.description);
        setDeadlineFinal(dayjs(courseSubsection.attributes.end_date))
    }, [])


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
        setTitleEditFinal(titleEdit);
        setDescriptionEditFinal(descriptionEdit);
        setDeadlineFinal(deadline);

        if (response2.ok) {
            setLoading(false);
            setEnableEdit(false);
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
        <div className="bg-white rounded-md shadow-md border-t-[14px] border-[#6366f1] mb-2">
            <div className="flex flex-col w-full p-7">
                <div className='flex items-center w-full gap-x-2 '>
                    {enableEdit ? (
                        <Input value={titleEdit} className='w-full text-3xl font-semibold rounded-md mr-14' onChange={(e) => setTitleEdit(e.target.value)} />
                    ) : (
                        <div className='flex items-center justify-between w-full gap-3'>
                            <p className="text-3xl font-semibold text-black">{titleEditFinal}</p>
                            {new Date(deadlineFinal) instanceof Date && !isNaN(new Date(deadlineFinal)) && <Badge color="#6366f1" count={formatDate(new Date(deadlineFinal), "EEE MMM dd yyyy", { locale: local })} />}
                        </div>
                    )}
                    {(questionnaireAnswerData.length > 0 && user?.role_str === 'student') && (
                        <div className='flex items-center justify-end'>
                            <Chip label={t("COMMON.completed")} color="success" />
                        </div>
                    )}
                </div>
                <div className='flex justify-between mt-7'>
                    {enableEdit ? (
                        <Input type="text" value={descriptionEdit} className='w-full rounded-md mr-14' onChange={(e) => setDescriptionEdit(e.target.value)} />
                    ) : (
                        <p>{descriptionEditFinal}</p>
                    )}
                    {completed === true ? (
                        <span className='pl-2 text-gray-500'>{t("QUESTIONNAIRE.completed_in") + ": " + format(questionnaireAnswerData[0]?.timeToComplete)}</span>
                    ) : null}
                </div>

                {
                    enableEdit && (
                        <>
                            <p className='mt-3 text-sm text-gray-500'>{t("COMMON.deadline")}</p>
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

            {
                user.role_str !== 'student' && (
                    <section className='pb-5 p-7'>
                        <div className='flex items-center justify-between w-full mb-10 gap-y-5 '>
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
                                                    className="justify-center text-sm font-medium text-white duration-150 bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                                    {t('COMMON.save_changes')}
                                                </Button>

                                            </Popconfirm>
                                        </div>

                                    </motion.div>
                                )}
                            </AnimatePresence>
                            {
                                (user.role_str !== 'student' && questionnaireAnswerData.length > 0 && enableEdit === false) && (
                                    <div className='flex items-center gap-1 ml-7'>
                                        <Avatar shape="square" size="large" src={questionnaireAnswerData[0]?.user?.data?.attributes?.profile_photo?.data?.attributes?.url} />
                                        <p className='text-sm text-gray-800'>{questionnaireAnswerData[0]?.user?.data?.attributes?.name}</p>
                                    </div>
                                )
                            }
                            {
                                questionnaire.attributes.Options.questionnaire?.editable === true &&
                                <SwitchEdit enableEdit={enableEdit} setEnableEdit={setEnableEdit} context={'questionnaire'}
                                    setQuestionnaireAnswerData={setQuestionnaireAnswerData} />

                            }

                        </div>
                        <Button loading={loadingQuestionnaires} onClick={downloadQuestionnaires} className='w-full px-7'>{t('QUESTIONNAIRE.download_all_answers')}</Button>
                    </section>
                )
            }
        </div>

    )
}