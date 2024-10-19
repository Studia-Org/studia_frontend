import React, { useState } from 'react'
import { BreadcrumbCourse } from '../CoursesInside/BreadcrumbCourse'
import ActivityTitle from './Components/ActivityTitle'
import ObjectivesTags from './ObjectivesTag'
import { useAuthContext } from '../../../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import QuestionnaireData from '../CreateCourses/CourseSections/QuestionnaireData';
import { Button, Divider, message } from 'antd';
import { API, BEARER } from '../../../../constant';
import { getToken } from '../../../../helpers';


function ReflectionRubricComponent({ activityData }) {
    const { user } = useAuthContext();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [enableEdit, setEnableEdit] = useState(false);
    const [title, setTitle] = useState(activityData.activity.data.attributes.title)
    const passedDeadline = activityData.activity.data.attributes.deadline ? new Date(activityData.activity.data.attributes.deadline) < new Date() : false;
    const USER_OBJECTIVES = [...new Set(user?.user_objectives?.map((objective) => objective.categories.map((category) => category)).flat() || [])];
    const { SELF_REFLECTIONDATA } = QuestionnaireData()
    const data = SELF_REFLECTIONDATA.data
    const criteria = SELF_REFLECTIONDATA.criteria
    const [selected, setSelected] = useState({})
    const [qual_comments, setQual_comments] = useState(activityData?.comments?.split("\n") || [])
    const handleSelect = (index, optIndex) => {
        setSelected({ ...selected, [index]: optIndex })
    }

    const handleSend = async () => {
        if (Object.keys(selected).length !== data.length) return message.error(t("COMMON.please_complete"))
        setLoading(true)
        const plani = 8 - (selected[0] + selected[1] + 2) + 2
        const exectute = 8 - (selected[2] + selected[3] + 2) + 2
        const reflection = 8 - (selected[4] + selected[5] + 2) + 2
        let comments = ""
        plani >= 5 ? comments += t("SELFREFLECTION.planning.greater_than_5") + "\n" : comments += t("SELFREFLECTION.planning.less_than_5") + "\n"
        exectute >= 5 ? comments += t("SELFREFLECTION.execution.greater_than_5") + "\n" : comments += t("SELFREFLECTION.execution.less_than_5") + "\n"
        reflection >= 5 ? comments += t("SELFREFLECTION.self_reflection.greater_than_5") + "\n" : comments += t("SELFREFLECTION.self_reflection.less_than_5") + "\n"
        const quali = (plani + exectute + reflection) / 24 * 10
        try {
            const response = await fetch(`${API}/qualifications`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                    data: {
                        activity: activityData.activity.data.id,
                        user: user.id,
                        qualification: quali,
                        comments: comments,
                        delivered: true,
                        delivered_data: new Date(),
                        reflection_answers: selected
                    }
                })
            })
            if (response.ok) {
                message.success(t("COMMON.completed"))
                setQual_comments(comments.split("\n"))
                window.scrollTo(0, 0, 'smooth')

            } else {
                message.error(t("COMMON.error_try_again"))
            }
        }
        catch (error) {
            console.error(error)
            message.error(t("COMMON.error_try_again"))
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex max-w-[calc(100vw)] flex-col items-start 1.5xl:items-start 1.5xl:space-x-5 p-5 sm:p-10'>
            <div className={'w-full'}>
                <BreadcrumbCourse />

                <ActivityTitle
                    type={"Lecture"}
                    title={activityData.activity.data.attributes.title}
                    evaluated={false}
                    qualification={activityData.qualification}
                    setTitle={setTitle}
                    titleState={title}
                    enableEdit={enableEdit}
                    passedDeadline={false}
                    userRole={user?.role_str}
                />
                <div className='flex items-center my-2'>
                    {<ObjectivesTags USER_OBJECTIVES={USER_OBJECTIVES} categories={activityData?.activity.data.attributes.categories} />}
                </div>
            </div>
            {qual_comments.length > 0 &&
                <>
                    <Divider className='!ml-0' />
                    <section className='max-w-full'>
                        <p className='mb-1 text-xs text-gray-400'>{t("ACTIVITY.comments")}</p>
                        <ul className='pl-5 list-disc'>
                            {
                                qual_comments.map((comment, index) => {
                                    if (comment === "") return null
                                    return (
                                        <li key={index}>
                                            <p className='max-w-6xl mt-3'>{comment}</p>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </section>
                </>
            }
            <Divider className='!ml-0' />
            <main className='!ml-0'>
                <p className='mb-5'>{t("SELFREFLECTION.explanation_text")}</p>
                <Divider className='!ml-0 !mb-1' />
                <div className='flex justify-end w-full py-5'>
                    <Button disabled={qual_comments.length > 0 || user.role_str === 'professor'} loading={loading} type='primary' onClick={handleSend}>{t("COMMON.submit")}</Button>
                </div>
                <div className="grid grid-cols-1 border md:grid-cols-5 ">
                    <div className=' p-2  font-medium  hidden md:block bg-[#e5e7eb]'>
                        {t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.criteria")}
                    </div>
                    {criteria.map((criterion, i) => (
                        <div key={i} className='col-span-1 border-[#e5e7eb] border p-2 font-medium hidden md:block bg-[#e5e7eb]'>
                            {criterion}
                        </div>
                    ))}
                    {data.map((item, index) => (
                        <React.Fragment key={index}>
                            <div className='block p-2 font-semibold bg-[#e5e7eb] border border-[#e5e7eb] md:hidden'>
                                {t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.criteria")}
                            </div>
                            <div className='p-2 font-semibold border border-[#fafafa] border-collapse '>{item.question}</div>
                            {item.options.map((option, optIndex) => {
                                const reflection_answers = activityData?.reflection_answers
                                const isSelcted = selected[index] === optIndex || reflection_answers?.[index] === optIndex

                                return (
                                    <React.Fragment key={option} >
                                        <div className='col-span-1 border-[#fafafa]  border p-2 border-collapse font-medium block md:hidden bg-[#e5e7eb]'>
                                            {criteria[optIndex]}
                                        </div>
                                        <button key={optIndex} disabled={qual_comments.length > 0} onClick={() => handleSelect(index, optIndex)}
                                            style={{ backgroundColor: isSelcted ? '#cddbfe' : '', cursor: qual_comments.length > 0 ? 'not-allowed' : 'pointer' }}
                                            className='col-span-1 p-2 transition-all duration-100 border border-collapse border-gray-300 hover:bg-indigo-200' >
                                            {option}
                                        </button>
                                    </React.Fragment>
                                )
                            })}
                        </React.Fragment>
                    ))}
                </div>
                <div className='flex w-full py-5'>
                    <Button disabled={qual_comments.length > 0 || user.role_str === 'professor'} loading={loading} type='primary' onClick={handleSend}>
                        {t("COMMON.submit")}
                    </Button>
                </div>
            </main >
        </div >
    )
}

export default ReflectionRubricComponent