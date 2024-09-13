import { Table, Input, InputNumber, Button } from 'antd'
import { useTranslation } from 'react-i18next';
const { TextArea } = Input;

function SelfAssesmentVisualization({ activity }) {
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
    return (
        <>
            <h2 className='mt-5 text-lg font-medium'>{t("SELFASSESTMENT.rubric_autoevalution")}</h2>
            <p className='mt-3 mb-3 text-sm font-normal text-gray-500'>{t("SELFASSESTMENT.rubric_text")}</p>
            <Table columns={columns} dataSource={activity.SelfAssesmentRubrica} style={{ fontWeight: "normal" }}
                pagination={false} className='border rounded-md' />
            <p className='my-3 text-sm font-normal text-gray-500'>{t("SELFASSESTMENT.rubric_text2")}</p>
            <div className='p-6 mt-5 font-normal bg-white border rounded-md'>
                <p className='mb-1 text-xs'>{t("SELFASSESTMENT.add_your_comments")}</p>
                <TextArea rows={5} />
                <section className='flex items-center justify-between'>
                    <div className='mt-5'>
                        <p className='mb-1 text-xs'>{t("SELFASSESTMENT.evaluate_1_10")}</p>
                        <InputNumber min={1} max={10} />
                    </div>
                    <Button type='primary' className='self-end' >{t("COMMON.submit")}</Button>
                </section>
            </div>
        </>
    )
}

export default SelfAssesmentVisualization