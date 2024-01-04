import React, { useState } from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Modal, Button } from 'antd';
import './Rubric.css'


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

export const PeerReviewRubricModal = ({ isModalOpen, setIsModalOpen, rubricData, setSubsectionEditing }) => {

    const [form] = Form.useForm();
    const [data, setData] = useState(rubricDataConverter(rubricData));
    const [editingKey, setEditingKey] = useState('');
    const [evaluationMethod, setEvaluationMethod] = useState('numeric')
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
            console.log('Validate Failed:', errInfo);
        }
    };
    const columns = [
        {
            title: 'Criteria',
            dataIndex: 'criteria',
            editable: true,
        },
        {
            title: evaluationMethod === 'numeric' ? '1-3' : 'Unsatisfactory',
            dataIndex: 'evalution1',
            editable: true,
        },
        {
            title: evaluationMethod === 'numeric' ? '3-5' : 'Needs Improvement',
            dataIndex: 'evalution2',
            editable: true,
        },
        {
            title: evaluationMethod === 'numeric' ? '5-8' : 'Great',
            dataIndex: 'evalution3',
            editable: true,
        },
        {
            title: evaluationMethod === 'numeric' ? '8-10' : 'Excellent',
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
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel} okButtonProps={{ className: 'bg-blue-500' }}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <div className='justify-between flex'>
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                            Edit
                        </Typography.Link>
                        <Popconfirm title="Sure to delete?" onConfirm={() => deleteRow(record)} okButtonProps={{ className: 'bg-blue-500' }}>
                            <Typography.Link type='danger' disabled={editingKey !== ''} >
                                Delete
                            </Typography.Link>
                        </Popconfirm>
                    </div>

                );
            },
        },
    ];
    const addRow = () => {
        const newData = {
            key: data.length + 1,
            criteria: '',
            evalution1: '',
            evalution2: '',
            evalution3: '',
            evalution4: '',
        };
        setData([...data, newData])
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
        <Modal title="Peer Review Rubric" open={isModalOpen} onOk={handleOk} width={1500} onCancel={handleCancel} okText={'Save Changes'} okButtonProps={{ className: 'bg-blue-500' }}>
            <Form form={form} component={false}>
                <div className='flex gap-3 my-3'>
                    <Button className='ml-auto' onClick={() => handleEvaluation()}>
                        Switch to {evaluationMethod === 'numeric' ? 'text' : 'numeric'}
                    </Button>
                    <Button onClick={() => addRow()}>
                        Add Row
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
