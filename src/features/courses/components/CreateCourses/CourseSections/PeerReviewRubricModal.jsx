import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Modal, Button, Empty, message } from 'antd';
import './Rubric.css'
import { useTranslation } from 'react-i18next';
import QuestionnaireData from './QuestionnaireData';



const rubricDataConverter = (rubricData) => {
    if (Object.keys(rubricData).length === 0) {
        return []
    } else {
        const data = []
        for (let category in rubricData) {
            if (category === 'Criteria') {
                continue
            }
            const newDataTemp = {
                key: guidGenerator(),
                criteria: category,
                evaluation1: rubricData[category][0],
                evaluation2: rubricData[category][1],
                evaluation3: rubricData[category][2],
                evaluation4: rubricData[category][3],
            };
            data.push(newDataTemp)
        }
        return data
    }
}
function guidGenerator() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

export const PeerReviewRubricModal = ({ isModalOpen, setIsModalOpen, rubricData, setSubsectionEditing,
    setCreateCourseSectionsList, subsectionEditing, context, noEditability = false }) => {

    const [form] = Form.useForm();
    const [data, setData] = useState(rubricData != null && Object.keys(rubricData).length > 0 ? rubricDataConverter(rubricData) : [
        {
            key: guidGenerator(),
            criteria: '',
            evaluation1: '',
            evaluation2: '',
            evaluation3: '',
            evaluation4: '',
        },
        {
            key: guidGenerator(),
            criteria: '',
            evaluation1: '',
            evaluation2: '',
            evaluation3: '',
            evaluation4: '',
        },
        {
            key: guidGenerator(),
            criteria: '',
            evaluation1: '',
            evaluation2: '',
            evaluation3: '',
            evaluation4: '',
        },
    ]);
    const [evaluationMethod, setEvaluationMethod] = useState('numeric')

    const { t } = useTranslation();

    useEffect(() => {
        if (rubricData != null && Object.keys(rubricData).length > 0) {
            setData(rubricDataConverter(rubricData))
        }
    }, [rubricData])


    const handleOk = () => {
        const finalJson = {}
        if (evaluationMethod === 'numeric') {
            finalJson['Criteria'] = [
                "10-8",
                "8-5",
                "5-3",
                "2-0"
            ]
        } else {
            finalJson['Criteria'] = [
                t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.excellent"),
                t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.great"),
                t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.needs_improvement"),
                t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.unsatisfactory")
            ]
        }
        const isEmpty = data.some((item) => item.criteria === '' || item.evaluation1 === '' || item.evaluation2 === '' || item.evaluation3 === '' || item.evaluation4 === '')
        const duplicatedCriteria = data.some((item, index) => data.findIndex((item2) => item2.criteria === item.criteria) !== index)
        if (isEmpty) {
            message.error(t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.some_fields_rubric_empty"))
            return
        }

        if (duplicatedCriteria) {
            message.error(t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.duplicate_criteria"))
            return
        }

        data.forEach((item) => {
            if (item.criteria === '' || item.evaluation1 === '' || item.evaluation2 === '' || item.evaluation3 === '' || item.evaluation4 === '') {
                return
            } else {
                finalJson[item.criteria] = [item.evaluation1, item.evaluation2, item.evaluation3, item.evaluation4]
            }
        })
        document.body.style.overflow = 'auto'
        if (context === 'edit') {

            setSubsectionEditing((subsection) => {
                console.log(subsection)
                const sectionCopy = { ...subsection };
                sectionCopy.attributes.activity.PeerReviewRubrica = finalJson;
                return sectionCopy;
            })
        }
        else {
            setSubsectionEditing((subsection) => {
                const sectionCopy = { ...subsection };
                sectionCopy.activity.PeerReviewRubrica = finalJson;
                return sectionCopy;
            })
            setCreateCourseSectionsList((prevSections) => {
                return prevSections.map((section) => {
                    return {
                        ...section,
                        subsections: section.subsections.map((sub) => {
                            if (sub.id === subsectionEditing.id) {
                                return {
                                    ...sub,
                                    activity: {
                                        ...sub.activity,
                                        PeerReviewRubrica: finalJson
                                    }
                                }
                            }
                            return sub
                        })
                    }
                })
            })
        }
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        document.body.style.overflow = 'auto'
        setData(
            rubricData != null && Object.keys(rubricData).length > 0 ? rubricDataConverter(rubricData) : [
                {
                    key: guidGenerator(),
                    criteria: '',
                    evaluation1: '',
                    evaluation2: '',
                    evaluation3: '',
                    evaluation4: '',
                },
                {
                    key: guidGenerator(),
                    criteria: '',
                    evaluation1: '',
                    evaluation2: '',
                    evaluation3: '',
                    evaluation4: '',
                },
                {
                    key: guidGenerator(),
                    criteria: '',
                    evaluation1: '',
                    evaluation2: '',
                    evaluation3: '',
                    evaluation4: '',
                },
            ]
        )
        setIsModalOpen(false);
    };
    const addRow = () => {
        const newData = {
            key: guidGenerator(),
            criteria: '',
            evaluation1: '',
            evaluation2: '',
            evaluation3: '',
            evaluation4: '',
        };
        if (data) {
            setData([...data, newData])
        } else {
            setData([newData])
        }
    }
    const deleteRow = (item) => {
        if (data.length === 1) {
            message.error(t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.at_least_1_row"))
            return
        }
        setData(data.filter((data) => data.key !== item))
    }
    function saveValues(key, id, value) {
        const newData = data.map((item) => {
            if (item.key === id) {
                return { ...item, [key]: value }
            }
            return item
        })
        setData(newData)
    }
    function handlePaste(event) {
        event.preventDefault();
        const clipboardData = event.clipboardData || window.clipboardData;
        const pastedData = clipboardData.getData('Text');
        processPastedData(pastedData);
    };

    function processPastedData(data) {
        const rows = data.trim().split('\n');
        const newTableData = rows.map((row) => {
            const cells = row.split('\t');
            return {
                key: guidGenerator(),
                criteria: cells[0] || '',
                evaluation1: cells[1] || '',
                evaluation2: cells[2] || '',
                evaluation3: cells[3] || '',
                evaluation4: cells[4] || '',
            };
        });
        setData(newTableData);
    };
    return (
        <Modal
            title={t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.peer_review_rubric")} maskClosable={false} destroyOnClose={true}
            open={isModalOpen} onOk={handleOk} width={1500} onCancel={handleCancel} cancelText={t("COMMON.cancel")} okText={t("COMMON.save_changes")} okButtonProps={{ className: 'bg-blue-500' }}>
            <Form form={form} component={false}>
                <div className='flex gap-3 my-3'>
                    <Button className='ml-auto' onClick={() => setEvaluationMethod(evaluationMethod === 'numeric' ? 'text' : 'numeric')}>
                        {evaluationMethod === 'numeric' ?
                            t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.switch_text")
                            :
                            t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.switch_numeric")}
                    </Button>
                    <Button onClick={() => addRow()}>
                        {t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.add_row")}
                    </Button>

                </div>
                <table className='overflow-y-scroll max-h-[30rem] w-full border-separate border-spacing-0'>
                    <thead >
                        <tr className='h-16 text-left bg-[#e5e7eb] '>
                            <th className='w-[18%] border-[#fafafa] border px-2 font-medium rounded-tl-md '>{t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.criteria")}</th>
                            <th className='w-[18%] border-[#fafafa] border px-2 font-medium '>{evaluationMethod === 'numeric' ? '10-8' : t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.excellent")}</th>
                            <th className='w-[18%] border-[#fafafa] border px-2 font-medium '>{evaluationMethod === 'numeric' ? '8-5' : t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.great")}</th>
                            <th className='w-[18%] border-[#fafafa] border px-2 font-medium '>{evaluationMethod === 'numeric' ? '5-3' : t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.needs_improvement")}</th>
                            <th className='w-[18%] border-[#fafafa] border px-2 font-medium rounded-tr-md '>{evaluationMethod === 'numeric' ? '2-0' : t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.unsatisfactory")}</th>
                            <th className='w-[10%] bg-white'></th>

                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((item, index) => {
                            let isLast = index === data.length - 1
                            const placeholderEval = t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.write_evaluation")
                            const placeholderCriteria = t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.write_criteria")
                            return (
                                <tr className={`h-16 `} key={item.key}>
                                    <td onChange={(e) => saveValues("criteria", item.key, e.target.value)} className={`${isLast ? "rounded-bl-md" : ""} w-[18%] border border-[#fafafa]`}>
                                        <input placeholder={placeholderCriteria} className='w-full h-16 border-none' type='text' defaultValue={item.criteria} />
                                    </td>
                                    <td onChange={(e) => saveValues("evaluation1", item.key, e.target.value)} className='w-[18%] border border-[#fafafa]'>
                                        <input placeholder={placeholderEval} className='w-full h-16 border-none' type='text' defaultValue={item.evaluation1} />
                                    </td>
                                    <td onChange={(e) => saveValues("evaluation2", item.key, e.target.value)} className='w-[18%] border border-[#fafafa]'>
                                        <input placeholder={placeholderEval} className='w-full h-16 border-none' type='text' defaultValue={item.evaluation2} />
                                    </td>
                                    <td onChange={(e) => saveValues("evaluation3", item.key, e.target.value)} className='w-[18%] border border-[#fafafa]'>
                                        <input placeholder={placeholderEval} className='w-full h-16 border-none' type='text' defaultValue={item.evaluation3} />
                                    </td>
                                    <td onChange={(e) => saveValues("evaluation4", item.key, e.target.value)} className={`${isLast ? "rounded-br-md" : ""} w-1/5 border border-[#fafafa]`}><input placeholder={placeholderEval} className='w-full h-16 border-none' type='text' defaultValue={item.evaluation4} /></td>
                                    <td className='w-[10%] text-center'>
                                        <Button danger onClick={() => deleteRow(item.key)} >
                                            <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="red" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0">
                                                </path>
                                            </svg>
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <section>
                    <div
                        contentEditable="true"
                        onBeforeInput={(e) => { if (e.inputType !== 'insertFromPaste') e.preventDefault(); }}
                        onPaste={handlePaste}
                        className='my-3 min-h-[100px] p-4 border border-gray-300 rounded-md'
                    >
                        {t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.you_can_copy_and_paste_rubric_from_word_excel")}
                    </div>
                </section>
            </Form>
        </Modal>
    )
}

export const ViewRubricModal = ({ isModalOpen, setIsModalOpen, rubricData }) => {
    const { t } = useTranslation();
    const data = rubricData.data
    const criteria = rubricData.criteria

    return (
        <div className='flex flex-col justify-center mb-5 space-y-2'>
            <label className='text-sm text-gray-500 '>
                {t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.view_rubric_reflection")} *
            </label>
            <Button onClick={() => {
                setIsModalOpen(true);
            }}>
                {t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.view_rubric")}
            </Button>
            <Modal
                maskClosable={false} destroyOnClose={true} bodyStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
                open={isModalOpen} onOk={() => setIsModalOpen(false)} centered width={"90vw"} okText={t("COMMON.close")}
                okButtonProps={{ className: 'bg-blue-500' }} cancelButtonProps={{ style: { display: "none" } }}>
                <div className='overflow-x-auto'>
                    <table className='w-full border-separate border-spacing-0'>
                        <thead>
                            <tr className='h-16 text-left bg-[#e5e7eb]'>
                                <th className='w-[18%] border-[#fafafa] border px-2 font-medium rounded-tl-md'>
                                    {t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.criteria")}
                                </th>
                                {criteria.map((criterion, i) => (
                                    <th key={i} className='w-[18%] border-[#fafafa] border px-2 font-medium'>
                                        {criterion}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr className='h-16 transition-all duration-75 hover:bg-slate-200' key={index} >
                                    <td className='w-[18%] border border-[#fafafa] px-2'>{item.question}</td>
                                    {item.options.map((option, optIndex) => (
                                        <td key={optIndex} className='w-[18%] border border-[#fafafa] p-2'>
                                            {option}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Modal>
        </div>
    )
}