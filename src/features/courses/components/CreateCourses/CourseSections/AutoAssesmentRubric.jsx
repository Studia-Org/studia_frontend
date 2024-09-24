import React, { useState } from 'react';
import { Modal, Form, Table, Button, Input, InputNumber, Typography, Popconfirm, message } from 'antd';
import { useTranslation } from 'react-i18next';

const rubricDataConverter = (rubricData) => {
    if (Object.keys(rubricData).length === 0) {
        return []
    } else {
        const data = []
        for (let item of rubricData) {
            const newDataTemp = {
                key: guidGenerator(),
                criteria: item.criteria,
                evaluation1: item.evaluation1,
                evaluation2: item.evaluation2,
                evaluation3: item.evaluation3,
                evaluation4: item.evaluation4
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

export const AutoAssesmentRubric = ({ openSelfAssesmentRubricModal, setOpenSelfAssesmentRubricModal, setSubsectionEditing, setCreateCourseSectionsList, subsectionEditing }) => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [data, setData] = useState(subsectionEditing?.activity?.SelfAssesmentRubrica != null &&
        Object.keys(subsectionEditing?.activity?.SelfAssesmentRubrica).length > 0 ?
        rubricDataConverter(subsectionEditing?.activity?.SelfAssesmentRubrica) : [
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

    const handleCancel = () => {
        document.body.style.overflow = 'auto';
        setData(
            subsectionEditing?.activity?.SelfAssesmentRubrica != null &&
                Object.keys(subsectionEditing?.activity?.SelfAssesmentRubrica).length > 0 ?
                rubricDataConverter(subsectionEditing?.activity?.SelfAssesmentRubrica) : [
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
        setOpenSelfAssesmentRubricModal(false);
    };
    const handleOk = () => {
        const finalJson = [...data];
        const isEmpty = finalJson.some((item) => item.criteria === '' || item.evaluation1 === '' || item.evaluation2 === '' || item.evaluation3 === '' || item.evaluation4 === '')
        const duplicatedCriteria = finalJson.some((item, index) => finalJson.findIndex((item2) => item2.criteria === item.criteria) !== index)

        if (isEmpty) {
            message.error(t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.some_fields_rubric_empty"))
            return
        }

        if (duplicatedCriteria) {
            message.error(t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.duplicate_criteria"))
            return
        }

        setSubsectionEditing((subsection) => {
            const sectionCopy = { ...subsection };
            sectionCopy.activity.SelfAssesmentRubrica = finalJson;
            return sectionCopy;
        });
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
                                    SelfAssesmentRubrica: finalJson,
                                },
                            };
                        }
                        return sub;
                    }),
                };
            });
        });
        document.body.style.overflow = 'auto';
        setOpenSelfAssesmentRubricModal(false);
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
        setData((prevData) => (prevData ? [...prevData, newData] : [newData]));
    };
    function saveValues(key, id, value) {
        const newData = data.map((item) => {
            if (item.key === id) {
                return { ...item, [key]: value }
            }
            return item
        })
        setData(newData)
    }
    const deleteRow = (item) => {
        if (data.length === 1) {
            message.error(t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.ERRORS_SUBSECTION.at_least_1_row"))
            return
        }
        setData(data.filter((data) => data.key !== item))
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
        <Modal title={t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.SELF_ASSESSMENT.title")} open={openSelfAssesmentRubricModal} onOk={handleOk} width={1500} onCancel={handleCancel} okText={t("COMMON.save_changes")} okButtonProps={{ className: 'bg-blue-500' }}>
            <p>{t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.SELF_ASSESSMENT.description")} </p>

            <Form form={form} component={false}>
                <div className='flex gap-3 my-3'>
                    <Button onClick={() => addRow()}>
                        {t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.add_row")}
                    </Button>
                </div>
                <table className='overflow-y-scroll max-h-[30rem] w-full border-separate border-spacing-0'>
                    <thead >
                        <tr className='h-16 text-left bg-[#e5e7eb] '>
                            <th className='w-[18%] border-[#fafafa] border px-2 font-medium rounded-tl-md '>{t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.criteria")}</th>
                            <th className='w-[18%] border-[#fafafa] border px-2 font-medium '>{t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.excellent")}</th>
                            <th className='w-[18%] border-[#fafafa] border px-2 font-medium '>{t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.great")}</th>
                            <th className='w-[18%] border-[#fafafa] border px-2 font-medium '>{t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.needs_improvement")}</th>
                            <th className='w-[18%] border-[#fafafa] border px-2 font-medium rounded-tr-md '>{t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.unsatisfactory")}</th>
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
    );
};
