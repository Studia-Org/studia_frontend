import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Table, Select, Checkbox, Form, Input, message } from 'antd';
import { ACTIVITY_CATEGORIES } from '../../../../../constant';
import './TableAntd.css'
import { useTranslation } from 'react-i18next';

const dataSourceMap = (category, createCourseSectionsList, subsection, t) => {
    let resultArray = [];

    if (ACTIVITY_CATEGORIES[category]?.criteria) {
        resultArray = ACTIVITY_CATEGORIES[category].criteria.map((item, index) => {
            return {
                key: Math.floor(Date.now() * Math.random()),
                Criteria: item,
                label: t(`OBJECTIVES_CONSTANT.CRITERIA.${category}.criteria.${index}`),
            };
        });
    }

    try {
        createCourseSectionsList.forEach((course) => {
            course.subsections.forEach((sub) => {
                if (sub.id === subsection.id && sub.activity?.categories && sub.activity?.categories[category]) {
                    sub.activity?.categories[category].forEach((item) => {
                        if (!resultArray.some((result) => result.Criteria === item)) {
                            resultArray.push({
                                key: Math.floor(Date.now() * Math.random()),
                                Criteria: item,
                                label: t("OBJECTIVES_CONSTANT.CRITERIA[category][index]"),
                            })
                        }
                    })
                }
            })
        })
    } catch (error) {
        console.error(error)
    }

    return resultArray;
};
const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);
    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };
    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({
                ...record,
                ...values,
            });
        } catch (errInfo) {
            console.error('Save failed:', errInfo);
        }
    };
    let childNode = children;
    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input className='' ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            isFromActivityCategories(record?.Criteria) ? (
                <div
                    className="p-3"
                    style={{
                        paddingRight: 24,
                    }}
                >
                    {children}
                </div>
            ) :
                (
                    <div
                        className="border border-[#d9d9d9] p-3 cursor-pointer rounded hover:border-blue-400 duration-100"
                        style={{
                            paddingRight: 24,
                        }}
                        onClick={toggleEdit}
                    >
                        {children}
                    </div>
                )
        );
    }
    return <td {...restProps}>{childNode}</td>;
};

const isFromActivityCategories = (criteria) => {
    return Object.values(ACTIVITY_CATEGORIES).some((category) => category.criteria.includes(criteria))
}

export const TableCategories = ({ categories, setCreateCourseSectionsList, subsection, sectionID, createCourseSectionsList }) => {

    const { t } = useTranslation()

    const categoriesOptions = categories?.map((category) => {
        return {
            label: t(`OBJECTIVES_CONSTANT.${category}`),
            value: category,
        }
    })

    console.log(categoriesOptions)

    const [dataSource, setDataSource] = useState(dataSourceMap(categories[0], createCourseSectionsList, subsection, t));
    const [selectOption, setSelectOption] = useState(categoriesOptions[0]?.label);


    useEffect(() => {
        setDataSource(dataSourceMap(categories[0], createCourseSectionsList, subsection, t))
    }, [categories])

    const handleCategoryChange = (checked, record) => {
        const criteria = record.Criteria;

        setCreateCourseSectionsList((courses) => {
            const updatedCourses = courses.map((course) => {
                if (course.id === sectionID) {
                    return {
                        ...course,
                        subsections: course.subsections.map((sub) => {
                            if (sub.id === subsection.id) {
                                const updatedCategories = {
                                    ...sub.activity.categories,
                                    [selectOption]: checked
                                        ? [
                                            ...(sub.activity.categories[selectOption] || []),
                                            criteria
                                        ]
                                        : (sub.activity.categories[selectOption] || []).filter(
                                            (item) => item !== criteria
                                        )
                                };
                                if (Object.keys(updatedCategories[selectOption]).length === 0) {
                                    delete updatedCategories[selectOption];
                                }
                                return {
                                    ...sub,
                                    activity: {
                                        ...sub.activity,
                                        categories: updatedCategories
                                    }
                                };
                            }
                            return sub;
                        })
                    };
                }
                return course;
            });
            return updatedCourses;
        });
    };

    const handleValueCheckbox = (record) => {
        if (record.check === true) {
            return true;
        } else {
            const criteria = record.Criteria;
            const categories = createCourseSectionsList.find((course) => course.id === sectionID).subsections.find((sub) => sub.id === subsection.id).activity.categories;
            const checked = categories[selectOption]?.includes(criteria);
            return checked;
        }
    }

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };


    const defaultColumns = [
        {
            title: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.criteria"),
            dataIndex: 'label',
            editable: true,
        },
        {
            title: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.check"),
            dataIndex: 'check',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Checkbox
                        onChange={(e) => handleCategoryChange(e.target.checked, record)}
                        defaultChecked={handleValueCheckbox(record)}
                    ></Checkbox>
                ) : null,
        },
        {
            title: '',
            dataIndex: 'operation',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    !ACTIVITY_CATEGORIES[selectOption]?.criteria.includes(record.Criteria) ? (
                        <Button className='text-gray-500' onClick={() => deleteRow(record)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </Button>
                    ) :
                        <Button className='text-gray-500' disabled>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </Button>
                ) : null,
        },
    ];
    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataSource(newData);
        if (row.check === true) {
            handleCategoryChange(true, row)
        } else {
            if (row.Criteria !== item.Criteria) {
                setCreateCourseSectionsList((courses) => {
                    const updatedCourses = courses.map((course) => {
                        if (course.id === sectionID) {
                            const updatedSubsections = course.subsections.map((sub) => {
                                if (sub.id === subsection.id) {
                                    const updatedCategories = {
                                        ...sub.activity.categories,
                                        [selectOption]: sub.activity && sub.activity.categories && sub.activity.categories[selectOption]
                                            ? (sub.activity.categories[selectOption] || []).map((itemNew) => itemNew === item.Criteria ? row.Criteria : itemNew)
                                            : []
                                    };
                                    return {
                                        ...sub,
                                        activity: {
                                            ...sub.activity,
                                            categories: updatedCategories
                                        }
                                    };
                                }
                                return sub;
                            });
                            return {
                                ...course,
                                subsections: updatedSubsections
                            };
                        }
                        return course;
                    });
                    return updatedCourses;
                });

            }
        }

    };

    const addRow = () => {
        const newData = {
            key: Math.floor(Date.now() * Math.random()),
            Criteria: '',
            label: '',
            check: true,
        };
        setDataSource([...dataSource, newData]);
    }

    const deleteRow = (record) => {
        try {
            const key = record.key
            const newData = dataSource.filter((item) => item.key !== key);

            setCreateCourseSectionsList((courses) => {
                const updatedCourses = courses.map((course) => {
                    if (course.id === sectionID) {
                        const updatedSubsections = course.subsections.map((sub) => {
                            const updatedCategories = {
                                ...sub.activity.categories,
                                [selectOption]: sub.activity && sub.activity.categories && sub.activity.categories[selectOption]
                                    ? (sub.activity.categories[selectOption] || []).filter((item) => item !== record.Criteria)
                                    : []
                            };
                            if (Object.keys(updatedCategories[selectOption]).length === 0) {
                                delete updatedCategories[selectOption];
                            }
                            return {
                                ...sub,
                                activity: {
                                    ...sub.activity,
                                    categories: updatedCategories
                                }
                            };
                        });
                        return {
                            ...course,
                            subsections: updatedSubsections
                        };
                    }
                    return course;
                });
                return updatedCourses;
            });

            setDataSource(newData);
        } catch (error) {
            message.error('Something went wrong')
        }
    };



    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });
    return (
        <>
            <Select
                options={categoriesOptions}
                className='flex w-full mt-2 mb-3'
                onChange={(value) => {
                    setSelectOption(value)
                    setDataSource(dataSourceMap(value, createCourseSectionsList, subsection, t))
                }}
                value={selectOption}
            />
            <div className='flex items-center mb-3'>
                <p className='text-xs text-gray-500 '>{t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.categories_text")}</p>
                <Button onClick={() => addRow()} className='ml-auto'>
                    {t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.add_row")}
                </Button>
            </div>
            <Table
                rowClassName={() => 'editable-row'}
                bordered
                components={components}
                pagination={false}
                dataSource={dataSource}
                columns={columns}
            />
        </>
    )
}
