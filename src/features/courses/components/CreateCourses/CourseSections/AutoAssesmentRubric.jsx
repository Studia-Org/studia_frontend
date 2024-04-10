import React, { useState } from 'react'
import { Modal, Form, Table, Button, Input, InputNumber, Typography, Popconfirm } from 'antd';


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
                    <Input />
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

export const AutoAssesmentRubric = ({ openSelfAssesmentRubricModal, setOpenSelfAssesmentRubricModal, setSubsectionEditing, setCreateCourseSectionsList, subsectionEditing }) => {
    const [form] = Form.useForm();
    const [data, setData] = useState();
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record.key === editingKey;

    const cancel = () => {
        setEditingKey('');
    };

    const deleteRow = (record) => {
        const newData = [...data];
        const index = newData.findIndex((item) => record.key === item.key);
        newData.splice(index, 1);
        setData(newData);
    }

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
            title: '    ',
            dataIndex: 'criteria',
            editable: true,
        },
        {
            title: '1',
            dataIndex: 'evalution1',
            editable: true,
        },
        {
            title: '2',
            dataIndex: 'evalution2',
            editable: true,
        },
        {
            title: '3',
            dataIndex: 'evalution3',
            editable: true,
        },
        {
            title: '4',
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
                    <div className='flex justify-between'>
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

    const handleCancel = () => {
        document.body.style.overflow = 'auto'
        setOpenSelfAssesmentRubricModal(false);
    };

    const handleOk = () => {
        const finalJson = {}
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
        document.body.style.overflow = 'auto'
        setOpenSelfAssesmentRubricModal(false);
    }



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

    return (
        <Modal title="Peer Review Rubric" open={openSelfAssesmentRubricModal} onOk={handleOk} width={1500} onCancel={handleCancel} okText={'Save Changes'} okButtonProps={{ className: 'bg-blue-500' }}>
            <p>Define the criteria on the rubric for evaluating the process and progression of the task. </p>
            <Form form={form} component={false}>
                <div className='flex gap-3 my-3'>
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
