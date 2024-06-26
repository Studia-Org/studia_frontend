import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { API, BEARER } from '../../../constant'
import { MoonLoader } from 'react-spinners'
import { motion } from 'framer-motion';
import { QualificationsTable } from '../components/QualificationsTable'
import { UploadQualifications } from '../components/UploadQualifications';
import { getToken } from '../../../helpers';

const QualificationsProfessor = () => {
    const [uploadQualificationsFlag, setUploadQualificationsFlag] = useState(false);
    const [activities, setActivities] = useState([])
    const [students, setStudents] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [cover, setCover] = useState()
    let { courseID } = useParams();

    const variants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };
    const transition = { duration: 0.3 };

    const fetchCourseData = async () => {
        try {
            const response = await fetch(`${API}/courses/${courseID}?populate=sections.subsections.activity.BeingReviewedBy,cover,` +
                `students.profile_photo,students.qualifications.activity,students.qualifications.file,students.qualifications.PeerReviewAnswers,` +
                `students.user_response_questionnaires.questionnaire.subsection.activity,students.qualifications.activity.BeingReviewedBy,` +
                `students.groups.qualifications.activity.BeingReviewedBy,students.groups.qualifications.file,students.groups.qualifications.PeerReviewAnswers,` +
                `students.groups.activity,students.groups.users.profile_photo`,
                {
                    headers: {
                        Authorization: `${BEARER} ${getToken()}`
                    }
                });
            const data = await response.json();
            const evaluableActivities = []
            data.data?.attributes.sections.data.forEach(
                section => {
                    section?.attributes.subsections.data.forEach(
                        subsection => {
                            if (subsection?.attributes.activity.data) {
                                if (subsection?.attributes?.activity.data.attributes.evaluable === true
                                    && subsection?.attributes?.activity.data.attributes.type !== 'peerReview'
                                ) {
                                    evaluableActivities.push(subsection.attributes.activity.data)
                                }
                            }
                        }
                    )
                }
            )
            setActivities(evaluableActivities)
            setStudents(data.data.attributes.students.data)
            setCover(data.data.attributes.cover.data.attributes.url)
            setIsLoading(false)
        } catch (error) {
            throw new Error(error)
        }
    }


    useEffect(() => {
        fetchCourseData();
    }, [])

    return (
        <div className='w-full relative rounded-tl-3xl bg-[#e7eaf886] p-10'>
            {
                isLoading === false ?
                    <>
                        <section className='absolute top-0 left-0 block w-full'>
                            {
                                cover && <img alt='' src={`${cover}`}
                                    className="absolute top-0 left-0 w-full h-[20rem] object-fill lg:rounded-tl-3xl" />
                            }
                            <span
                                id="blackOverlay"
                                className="absolute block top-0 left-0 h-[20rem] w-full opacity-40 bg-black lg:rounded-tl-3xl"
                            />
                        </section>
                        <motion.div initial="hidden" animate="visible" exit="hidden" variants={variants} transition={transition}>
                            {
                                uploadQualificationsFlag ?
                                    <UploadQualifications setUploadQualificationsFlag={setUploadQualificationsFlag} activities={activities} students={students} />
                                    :
                                    <QualificationsTable setUploadQualificationsFlag={setUploadQualificationsFlag} students={students}
                                        activities={activities} setActivities={setActivities} setStudents={setStudents} />
                            }
                        </motion.div>

                    </>
                    :
                    <div className='flex items-center justify-center w-full h-full' >
                        <MoonLoader color="#363cd6" size={80} />
                    </div>
            }
        </div>
    )
}

export default QualificationsProfessor