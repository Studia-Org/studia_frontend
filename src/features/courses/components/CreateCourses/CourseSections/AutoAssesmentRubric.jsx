import React, { useState } from 'react';
import { Modal, Form, Table, Button, Input, InputNumber, Typography, Popconfirm } from 'antd';

const EditableCell = ({
    editing,
    dataIndex,
    title,
    editable,
    placeholderText,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    if (!editable) {
        return <td {...restProps}>{children}</td>;
    }
    const currentValue = record[dataIndex];

    return (
        <td {...restProps}>
            {
                editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{ margin: 0 }}
                        rules={[{ required: true, message: `Please Input ${title}!` }]}
                    >
                        <Input />
                    </Form.Item>
                ) : (
                    <div className={currentValue ? 'text-black' : 'text-stone-300'}>
                        {currentValue || placeholderText}
                    </div>
                )}
        </td>
    );
};

export const AutoAssesmentRubric = ({ openSelfAssesmentRubricModal, setOpenSelfAssesmentRubricModal, setSubsectionEditing, setCreateCourseSectionsList, subsectionEditing }) => {
    const [form] = Form.useForm();
    const [data, setData] = useState(subsectionEditing?.activity?.SelfAssesmentRubrica);
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record.key === editingKey;

    const cancel = () => {
        setEditingKey('');
    };

    const deleteRow = (record) => {
        const newData = data.filter((item) => record.key !== item.key);
        setData(newData);
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) { }
    };

    const columns = [
        { title: '    ', dataIndex: 'criteria', editable: true, placeholderText: 'Enter Criteria, e.g.: Listening' },
        { title: '1', dataIndex: 'evaluation1', editable: true, placeholderText: 'Enter Evaluation 1, e.g.: I was unable to listen when my teacher gave directions. ' },
        { title: '2', dataIndex: 'evaluation2', editable: true, placeholderText: 'Enter Evaluation 2, e.g.: I needed more than 2 prompts to listen whan my teacher gave directions.' },
        { title: '3', dataIndex: 'evaluation3', editable: true, placeholderText: 'Enter Evaluation 3, e.g.: I needed 1-2 prompts to listen whan my teacher gave directions.' },
        { title: '4', dataIndex: 'evaluation4', editable: true, placeholderText: 'Enter Evaluation 4, e.g.: I listened when my teacher gave directions.' },
        {
            editable: false,
            title: '',
            dataIndex: 'operation',
            width: '10%',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel} okButtonProps={{ className: 'bg-blue-500' }}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <div className="flex justify-between">
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                            Edit
                        </Typography.Link>
                        <Popconfirm title="Sure to delete?" onConfirm={() => deleteRow(record)} okButtonProps={{ className: 'bg-blue-500' }}>
                            <Typography.Link type="danger" disabled={editingKey !== ''}>
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
            evaluation1: '',
            evaluation2: '',
            evaluation3: '',
            evaluation4: '',
            ...record,
        });
        setEditingKey(record.key);
    };

    const handleCancel = () => {
        document.body.style.overflow = 'auto';
        setOpenSelfAssesmentRubricModal(false);
    };

    const handleOk = () => {
        const finalJson = data;
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
            key: data?.length ? data?.length + 1 : 1,
            criteria: '',
            evaluation1: '',
            evaluation2: '',
            evaluation3: '',
            evaluation4: '',
        };
        setData((prevData) => (prevData ? [...prevData, newData] : [newData]));
    };

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
                editable: col.editable,
                placeholderText: col.placeholderText,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <Modal title="Self-Assesment Rubric" open={openSelfAssesmentRubricModal} onOk={handleOk} width={1500} onCancel={handleCancel} okText={'Save Changes'} okButtonProps={{ className: 'bg-blue-500' }}>
            <p>Define the criteria on the rubric for evaluating the process and progression of the task. </p>
            <Form form={form} component={false}>
                <div className="flex gap-3 my-3">
                    <Button onClick={addRow}>Add Row</Button>
                </div>
                <Table
                    pagination={false}
                    className="overflow-y-scroll max-h-[30rem]"
                    components={{ body: { cell: EditableCell } }}
                    bordered
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                />
            </Form>
        </Modal>
    );
};
