import React, { useState } from 'react'
import { Table, Input, InputNumber, Button, message } from 'antd'
import { getToken } from '../../../../../../helpers';
import { API } from '../../../../../../constant';
import { useAuthContext } from '../../../../../../context/AuthContext';
const { TextArea } = Input;

export const RubricAutoAssesment = ({ activityData, setState, qualificationId, setSelfAssesmentData, selfAssesmentData, subsectionID }) => {
    const [comments, setComments] = useState('')
    const [loading, setLoading] = useState(false)
    const [grade, setGrade] = useState(1)
    const { user } = useAuthContext()

    const columns = [
        {
            title: '',
            dataIndex: 'criteria',
            rowScope: 'row',
        },
        {
            title: '1',
            dataIndex: 'evaluation1',

        },
        {
            title: '2',
            dataIndex: 'evaluation2',

        },
        {
            title: '3',
            dataIndex: 'evaluation3',

        },
        {
            title: '4',
            dataIndex: 'evaluation4',

        },
    ];

    async function handleSubmit() {
        setLoading(true)
        if (!comments || !grade) {
            setLoading(false)
            message.error('Please fill in all fields')
            return
        }
        try {
            await fetch(`${API}/qualifications/${qualificationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                    data: {
                        comments: comments,
                        qualification: grade
                    }
                })
            })
            const selfAssesmentDataAwait = await fetch(`${API}/self-assesment-answers/${selfAssesmentData[0].id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                    data: {
                        RubricAnswers: comments
                    }
                }),
            })
            const responseAssesmentData = await selfAssesmentDataAwait.json()
            const newObject = {
                subsections_completed: [
                    ...user.subsections_completed.map(subsection => ({ id: subsection.id })),
                    { id: subsectionID }
                ]
            };
            console.log(newObject, subsectionID)
            const temp = await fetch(`${API}/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(newObject)
            });
            const response = await temp.json();
            console.log(response)
            setSelfAssesmentData([responseAssesmentData.data]);
            message.success('Your evaluation has been submitted')
            setState(2)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error(error)
            message.error('Something went wrong')
        }
    }

    return (
        <>
            <h2 className='mt-5 text-lg font-medium'>Rubric and Autoevaluation</h2>
            <p className='mt-1 text-sm font-normal text-gray-500'>Based on the criteria outlined by the teacher in the rubric, please evaluate your work with a qualitative comment, and then select a provisional grade for your task from the provided options.</p>
            <div className='p-6 mt-5 bg-white border rounded-md'>
                <Table columns={columns} dataSource={activityData.activity.data.attributes.SelfAssesmentRubrica} bordered pagination={false} />
                <p className='mt-5 mb-1 text-xs'>Evaluate your task and add a grade</p>
                <TextArea rows={5} value={comments} onChange={(e) => setComments(e.target.value)} />
                <div className='mt-3'>
                    <InputNumber min={1} max={10} value={grade} onChange={setGrade} />
                </div>
            </div>
            <Button loading={loading} className='my-4' type='primary' onClick={handleSubmit} >Submit</Button>
        </>

    )
}
