import React, { useState } from 'react'
import { Table, Input, InputNumber, Button, message } from 'antd'
import { getToken } from '../../../../../../helpers';
import { API } from '../../../../../../constant';
import { useAuthContext } from '../../../../../../context/AuthContext';
import { useTranslation } from 'react-i18next';
const { TextArea } = Input;

export const RubricAutoAssesment = ({ activityData, setState, qualificationId, setSelfAssesmentData, selfAssesmentData, subsectionID }) => {
    const [comments, setComments] = useState('')
    const [loading, setLoading] = useState(false)
    const [grade, setGrade] = useState(1)
    const { user } = useAuthContext()
    const { t } = useTranslation()

    const columns = [
        {
            title: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.criteria"),
            dataIndex: 'criteria',
            rowScope: 'row',
        },
        {
            title: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.excellent"),
            dataIndex: 'evaluation1',

        },
        {
            title: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.great"),
            dataIndex: 'evaluation2',

        },
        {
            title: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.needs_improvement"),
            dataIndex: 'evaluation3',

        },
        {
            title: t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.unsatisfactory"),
            dataIndex: 'evaluation4',

        },
    ];

    async function handleSubmit() {
        setLoading(true)
        if (!comments || !grade) {
            setLoading(false)
            message.error(t("REGISTER.fill_all_fields"))
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
            message.success(t("SELFASSESTMENT.your_evaluation_submitted"))
            setState(2)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error(error)
            message.error(t("PASSWORD_RECOVERY.smth_wrong"))
        }
    }

    return (
        <>
            <h2 className='mt-5 text-lg font-medium'>{t("SELFASSESTMENT.rubric_autoevalution")}</h2>
            <p className='mt-3 mb-3 text-sm font-normal text-gray-500'>{t("SELFASSESTMENT.rubric_text")}</p>
            <Table columns={columns} dataSource={activityData.activity.data.attributes.SelfAssesmentRubrica} pagination={false} className='border rounded-md' />
            <p className='my-3 text-sm font-normal text-gray-500'>{t("SELFASSESTMENT.rubric_text2")}</p>
            <div className='p-6 mt-5 bg-white border rounded-md'>
                <p className='mb-1 text-xs'>{t("SELFASSESTMENT.add_your_comments")}</p>
                <TextArea rows={5} value={comments} onChange={(e) => setComments(e.target.value)} />
                <section className='flex items-center justify-between'>
                    <div className='mt-5'>
                        <p className='mb-1 text-xs'>{t("SELFASSESTMENT.evaluate_1_10")}</p>
                        <InputNumber min={1} max={10} value={grade} onChange={setGrade} />
                    </div>
                    <Button loading={loading} className='self-end' type='primary' onClick={handleSubmit} >{t("COMMON.submit")}</Button>
                </section>
            </div>
        </>

    )
}
