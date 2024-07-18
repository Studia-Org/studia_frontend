import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Modal, Button } from 'antd';
import './Rubric.css'
import { useTranslation } from 'react-i18next';


const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

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
                key: data.length + 1,
                criteria: category,
                evalution1: rubricData[category][0],
                evalution2: rubricData[category][1],
                evalution3: rubricData[category][2],
                evalution4: rubricData[category][3],
            };
            data.push(newDataTemp)
        }
        return data
    }
}

export const PeerReviewRubricModal = ({ isModalOpen, setIsModalOpen, rubricData, setSubsectionEditing, setCreateCourseSectionsList, subsectionEditing }) => {

    const [form] = Form.useForm();
    const [data, setData] = useState(rubricData ? rubricDataConverter(rubricData) : null);
    const [editingKey, setEditingKey] = useState('');
    const [evaluationMethod, setEvaluationMethod] = useState('numeric')

    const { t } = useTranslation();

    useEffect(() => {
        if (rubricData) {
            setData(rubricDataConverter(rubricData))
        }
    }, [rubricData])

    const isEditing = (record) => record.key === editingKey;

    const deleteRow = (record) => {
        const newData = [...data];
        const index = newData.findIndex((item) => record.key === item.key);
        newData.splice(index, 1);
        setData(newData);
    }

    const handleOk = () => {
        const finalJson = {}
        if (evaluationMethod === 'numeric') {
            finalJson['Criteria'] = [
                "1-3",
                "3-5",
                "5-8",
                "8-10"
            ]
        } else {
            finalJson['Criteria'] = [
                "Unsatisfactory",
                "Needs Improvement",
                "Great",
                "Excellent"
            ]
        }
        data.forEach((item) => {
            if (item.criteria === '' || item.evalution1 === '' || item.evalution2 === '' || item.evalution3 === '' || item.evalution4 === '') {
                return
            } else {
                finalJson[item.criteria] = [item.evalution1, item.evalution2, item.evalution3, item.evalution4]
            }
        })
        document.body.style.overflow = 'auto'
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
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        document.body.style.overflow = 'auto'
        setIsModalOpen(false);
    };

    const edit = (record) => {
        form.setFieldsValue({
            criteria: '',
            evalution1: '',
            evalution2: '',
            evalution3: '',
            evalution4: '',
            ...record,
        });
        setEditingKey(record.key);
    };
    const cancel = () => {
        setEditingKey('');
    };
    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
        }
    };
    const columns = [
        {
            title: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.criteria"),
            dataIndex: 'criteria',
            editable: true,
        },
        {
            title: evaluationMethod === 'numeric' ? '1-3' : t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.unsatisfactory"),
            dataIndex: 'evalution1',
            editable: true,
        },
        {
            title: evaluationMethod === 'numeric' ? '3-5' : t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.needs_improvement"),
            dataIndex: 'evalution2',
            editable: true,
        },
        {
            title: evaluationMethod === 'numeric' ? '5-8' : t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.great"),
            dataIndex: 'evalution3',
            editable: true,
        },
        {
            title: evaluationMethod === 'numeric' ? '8-10' : t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.excellent"),
            dataIndex: 'evalution4',
            editable: true,
        },
        {
            title: '',
            dataIndex: 'operation',
            width: '10%',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            {t("COMMON.save_changes")}
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel} okButtonProps={{ className: 'bg-blue-500' }}>
                            {t("COMMON.cancel")}
                        </Popconfirm>
                    </span>
                ) : (
                    <div className='flex justify-between'>
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                            {t("COMMON.edit")}
                        </Typography.Link>
                        <Popconfirm title="Sure to delete?" onConfirm={() => deleteRow(record)} okButtonProps={{ className: 'bg-blue-500' }}>
                            <Typography.Link type='danger' disabled={editingKey !== ''} >
                                {t("COMMON.delete")}
                            </Typography.Link>
                        </Popconfirm>
                    </div>

                );
            },
        },
    ];
    const addRow = () => {
        const newData = {
            key: data?.length ? data?.length + 1 : 1,
            criteria: '',
            evalution1: '',
            evalution2: '',
            evalution3: '',
            evalution4: '',
        };
        if (data) {
            setData([...data, newData])
        } else {
            setData([newData])
        }
    }
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const handleEvaluation = () => {
        setEvaluationMethod(evaluationMethod === 'numeric' ? 'text' : 'numeric')
    }

    return (
        <Modal title={t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.peer_review_rubric")} open={isModalOpen} onOk={handleOk} width={1500} onCancel={handleCancel} cancelText={t("COMMON.cancel")} okText={t("COMMON.save_changes")} okButtonProps={{ className: 'bg-blue-500' }}>
            <Form form={form} component={false}>
                <div className='flex gap-3 my-3'>
                    <Button className='ml-auto' onClick={() => handleEvaluation()}>
                        {evaluationMethod === 'numeric' ?
                            t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.switch_text")
                            :
                            t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.switch_numeric")}
                    </Button>
                    <Button onClick={() => addRow()}>
                        {t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.add_row")}
                    </Button>
                </div>

                <Table
                    pagination={false}
                    className='overflow-y-scroll max-h-[30rem]'
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                />
            </Form>
        </Modal>
    )
}
