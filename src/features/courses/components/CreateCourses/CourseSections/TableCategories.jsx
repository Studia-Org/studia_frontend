import React, { useEffect, useState } from 'react';
import { Button, Table, Select } from 'antd';
import { ACTIVITY_CATEGORIES } from '../../../../../constant';
import { ca } from 'date-fns/locale';

const dataSourceMap = (categories) => {
    if (ACTIVITY_CATEGORIES[categories]?.criteria) {
        return ACTIVITY_CATEGORIES[categories].criteria.map((item, index) => {
            return {
                key: index,
                Criteria: item,
            }
        })
    }
}

export const TableCategories = ({ categories, setCategories, activities, activitiesCategories, setActivitiesCategories }) => {
    const activitesOptions = activities.map((activity) => {
        return {
            label: activity?.title,
            value: activity.id,
        }
    })
    const [dataSource, setDataSource] = useState(dataSourceMap(categories));
    const handleDelete = (key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setCategories(newData.map((item) => item.Criteria))
        setDataSource(newData);
    };

    useEffect(() => {
        setDataSource(dataSourceMap(categories))
    }, [categories])

    const handleValues = (value) => {
        if (activitiesCategories[categories]?.[value]) {
            return activitiesCategories[categories][value].map((item) => obtainTitleFromID(item))
        }
    }

    function obtainTitleFromID(id) {
        const activity = activities.find((activity) => activity.id === id)
        if (activity !== undefined) {
            return activity.title
        } else {
            return id
        }
    }

    const defaultColumns = [
        {
            title: 'Criteria',
            dataIndex: 'Criteria',
            width: '30%',
            editable: true,
        },
        {
            title: 'Associated Activities',
            dataIndex: 'activities',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Select
                        mode="multiple"
                        allowClear
                        style={{
                            width: '100%',
                        }}
                        placeholder="Select an activity"
                        options={activitesOptions}
                        value={handleValues(record.Criteria)}
                        onChange={(value) => {
                            console.log(value)
                            setActivitiesCategories({
                                ...activitiesCategories,
                                [categories]: {
                                    ...activitiesCategories[categories],
                                    [record.Criteria]: value
                                }
                            })
                        }}
                    />
                ) : null,
        },
        {
            title: '',
            dataIndex: 'operation',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Button className='text-gray-500' onClick={() => handleDelete(record.key)}>
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
            <p className='mb-5 text-xs text-gray-500'>Associate all the categories you selected with the activities you defined in the sections (if you have not defined the sequence already, you can come back later).</p>
            <Table
                rowClassName={() => 'editable-row'}
                bordered
                pagination={false}
                dataSource={dataSource}
                columns={columns}
            />
        </>
    )
}
