import { useEffect, useState } from "react";
import MainScreen from "./Components/PeerReview/MainScreen/MainScreen";
import EvaluateScreen from "./Components/PeerReview/EvaluateScreen";
import { API } from "../../../../constant";
import { getToken } from "../../../../helpers";
import { MoonLoader } from 'react-spinners';
import Swal from "sweetalert2";
import { useAuthContext } from "../../../../context/AuthContext";
import { ProfessorPeerReview } from "./ProfessorPeerReview";

export default function PeerReviewComponent({ activityData }) {
    const [showEvaluate, setShowEvaluate] = useState(false);
    const [sendDataLoader, setSendDataLoader] = useState(false);
    const data = activityData?.activity?.data?.attributes?.PeerReviewRubrica
    const usersToPair = activityData.activity.data.attributes.usersToPair
    const correctActivityGroup = activityData.activity.data.attributes.task_to_review.data.attributes.groupActivity
    const peerReviewInGroups = activityData.activity.data.attributes.groupActivity

    ////////////////////eleccion de la data del user////////////////////////
    const [userIndexSelected, setUserIndexSelected] = useState(null)
    const [QualificationIdPartnerReview, setQualificationIdPartnerReview] = useState(null);
    const [qualificationIds, setQualificationIds] = useState(null);
    const [answersDelivered, setAnswersDelivered] = useState(null);
    ////////////////////eleccion de la data del user////////////////////////
    const [loading, setLoading] = useState(true);
    const { user } = useAuthContext();

    useEffect(() => {
        try {
            if (user === null || user === undefined || user.role_str !== 'student') { setLoading(false); return }
            if (activityData.peer_review_qualifications.data[0] === undefined || activityData.peer_review_qualifications?.data === null) {
                setLoading(false);
                setQualificationIdPartnerReview("Error")
                return
            }
            if (userIndexSelected === null) return
        }
        catch (err) {
            setLoading(false);
            setQualificationIdPartnerReview("Error")
        }

    }, [user, userIndexSelected]);
    useEffect(() => {
        if (user.role_str !== 'student') return
        if (qualificationIds === null) {
            fetch(`${API}/qualifications?qualification` +
                `&populate[activity][fields][0]=groupActivity` +
                `&populate[user][fields][0]=username` +
                `&populate[group][populate][users][fields][0]=*` +
                `&populate[peer_review_qualifications][fields][0]=*` +
                `&populate[peer_review_qualifications][populate][group][fields][0]=*` +

                `&filters[activity][id]=${activityData.activity.data.id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                }
            }).then(res => {
                if (res.ok) {
                    return res.json()

                } else {
                    throw new Error(res.status)
                }
            }).then(data => {
                const usersToCorrect = correctActivityGroup ?
                    activityData?.peer_review_qualifications.data
                        .map((peerReview) => peerReview.attributes.group.data)
                    :
                    activityData?.peer_review_qualifications.data
                        .map((peerReview) => peerReview.attributes.user.data)

                const idQualifications =
                    peerReviewInGroups ?
                        data.data.filter((qualification) =>
                            usersToCorrect.find((userToCorrect) => {
                                return userToCorrect.id === qualification.attributes.group.data.id
                            }))
                        : correctActivityGroup ?
                            data.data
                                .filter((qualification) =>
                                    usersToCorrect.find((userToCorrect) => {
                                        return userToCorrect.attributes.users.data.some(
                                            (user) => user.id === qualification.attributes.user.data.id)
                                    }))
                            :
                            data.data
                                .filter((qualification) =>
                                    usersToCorrect.find((userToCorrect) => userToCorrect.id === qualification.attributes.user.data.id))

                setQualificationIds(idQualifications)

            }).catch(err => {
                console.log(err.message)
            }).finally(() => {
                setLoading(false)
            })
        }
        if (usersToPair === 1 && userIndexSelected === null) setUserIndexSelected(0)
        if (userIndexSelected === null) return
        if (qualificationIds === null) return

        const idQualification =
            peerReviewInGroups ?
                qualificationIds.find((qual) => {
                    return activityData.peer_review_qualifications.data[userIndexSelected].attributes.group.data.id === qual.attributes.group.data.id
                }).id
                :
                correctActivityGroup ?
                    qualificationIds.filter((qual) => {
                        return activityData.peer_review_qualifications.data[userIndexSelected].attributes.group.data.attributes.users.data.some(
                            (user) => user.id === qual.attributes.user.data.id
                        );
                    }).map(qual => qual.id)

                    :
                    qualificationIds.find((qual) => {
                        return activityData.peer_review_qualifications.data[userIndexSelected].attributes.user.data.id ===
                            qual.attributes.user.data.id
                    }).id


        setQualificationIdPartnerReview(idQualification)

        const answersdel = idQualification

        const answersList =
            peerReviewInGroups ?
                activityData.group.data.attributes.PeerReviewAnswers.data
                :
                activityData.user.data.attributes.PeerReviewAnswers.data

        const answers = answersList
            ?.find((answer) => answer.attributes.qualifications.data
                ?.find((qualification) => Array.isArray(answersdel) ? answersdel.includes(qualification.id) : qualification.id === answersdel))

        if (answers !== undefined) {
            setAnswersDelivered(answers.attributes.Answers)
            const deadLine = new Date(activityData?.activity?.data?.attributes?.deadline)
            const overpassDeadLine = deadLine < new Date()
            if (!overpassDeadLine) setShowEvaluate(true)
        }

    }, [userIndexSelected, qualificationIds])

    function sendEvalution() {
        try {
            setSendDataLoader(true)

            const answers = {}
            let emptyFields = false;

            Object.keys(data).forEach((key, index) => {
                if (key === 'Criteria') return
                const grid = document.getElementById(key)
                const select = grid.querySelector("select")?.value || grid.querySelector("input")?.value
                const textarea = grid.querySelector("textarea").value
                const dict = {}
                dict[select] = textarea
                if ((!isNaN(parseFloat(select)) && isFinite(select) && (select < 0 || select > 10))) {
                    emptyFields = true;
                    Swal.fire({
                        icon: 'error',
                        title: 'Values must be between 0 and 10',
                    })
                    return
                }
                if (textarea === "" ||
                    select === "") {
                    emptyFields = true;
                    Swal.fire({
                        icon: 'error',
                        title: 'You must fill all the fields',
                    })
                    return
                }

                answers[key] = dict
            })

            if (emptyFields) return
            const payload = {
                data: {
                    Answers: answers,
                    user: user.id,
                    qualifications: Array.isArray(QualificationIdPartnerReview) ?
                        QualificationIdPartnerReview :
                        [QualificationIdPartnerReview],
                }
            }
            if (peerReviewInGroups) {
                payload.data.group = activityData.group.data.id
                delete payload.data.user
            }

            const filter = (correctActivityGroup && !peerReviewInGroups) ?
                `&filters[qualifications][user][groups][id]=${activityData.peer_review_qualifications.data[userIndexSelected].attributes.group.data.id}` +
                `&filters[user][id]=${user.id}`
                : !peerReviewInGroups ?
                    `&filters[qualifications][user][id]=${activityData.peer_review_qualifications.data[userIndexSelected].attributes.user.data.id}` +
                    `&filters[user][id]=${user.id}`
                    :
                    `&filters[qualifications][group][id]=${activityData.peer_review_qualifications.data[userIndexSelected].attributes.group.data.id}` +
                    `&filters[group][id]=${activityData.group.data.id}`



            fetch(`${API}/peer-review-answers?populate[user]=*` +
                `&populate[qualifications][fields][0]=*` +
                `&populate[qualifications][populate][activity][fields][0]=id` +
                `&filters[qualifications][activity][id]=${activityData.activity.data.id}` +
                `&populate[qualifications][populate][user][populate][groups][fields][0]=*` +
                `&populate[qualifications][populate][group][fields][0]=*` +
                filter
                , {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`,
                    }
                }).then(res => {
                    if (res.ok) {
                        return res.json()
                    } else {
                        throw new Error(res.json())
                    }
                }).then((data) => {
                    if (data.data.length === 0) {
                        fetch(`${API}/peer-review-answers?populate[qualifications][populate][user][fields][0]=*` +
                            `&populate[qualifications][populate][group][fields][0]=*`, {
                            method: 'POST',
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${getToken()}`,
                            },
                            body: JSON.stringify(payload),

                        }).then(res => {
                            if (res.ok) {
                                return res.json()
                            } else {
                                throw new Error(res.json())
                            }
                        }).then((data) => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Your feedback has been sent',
                                showConfirmButton: true,
                            }).then(() => {
                                if (usersToPair > 1) {
                                    console.log('entra', data.data)
                                    setShowEvaluate(false)
                                    resetUser()
                                    if (peerReviewInGroups) {
                                        activityData.group.data.attributes.PeerReviewAnswers.data.push(data.data)
                                    }
                                    else {
                                        activityData.user.data.attributes.PeerReviewAnswers.data.push(data.data)
                                    }
                                }
                            })
                        })
                            .catch(err => {
                                console.log(err)
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Your feedback has not been sent, try again later',
                                    showConfirmButton: false,
                                    timer: 2000
                                })
                            }).finally(() => { })
                    } else {
                        fetch(`${API}/peer-review-answers/${data.data[0].id}`, {
                            method: 'PUT',
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${getToken()}`,
                            },
                            body: JSON.stringify(payload),
                        }).then(res => {
                            if (res.ok) {
                                return res.json()
                            } else {
                                throw new Error(res.json())
                            }
                        }).then(data => {

                            Swal.fire({
                                icon: 'success',
                                title: 'Your feedback has been sent',
                                showConfirmButton: true,
                            }).then(() => {
                                if (usersToPair > 1) {
                                    setShowEvaluate(false)
                                    resetUser()
                                    console.log(data)
                                    console.log(activityData)
                                    console.log(QualificationIdPartnerReview)
                                    const answer = peerReviewInGroups ?
                                        activityData.group.data.attributes.PeerReviewAnswers.data
                                            .find((answer) => answer.attributes.qualifications.data.find((qualification) => qualification.id === QualificationIdPartnerReview))
                                        :
                                        correctActivityGroup ?
                                            (activityData.user.data.attributes.PeerReviewAnswers.data
                                                .find((answer) => answer.attributes.qualifications.data
                                                    .every((qualification) => QualificationIdPartnerReview.includes(qualification.id))))
                                            :
                                            (activityData.user.data.attributes.PeerReviewAnswers.data
                                                .find((answer) => answer.attributes.qualifications.data.find((qualification) => qualification.id === QualificationIdPartnerReview)))
                                    console.log(answer)
                                    answer.attributes.Answers = answers
                                }
                            })
                        }).catch(err => {
                            console.log(err)
                            Swal.fire({
                                icon: 'error',
                                title: 'Your feedback has not been sent, try again later',
                                showConfirmButton: false,
                                timer: 2000
                            })
                        }).finally(() => { })
                    }
                }).catch(err => {
                    console.log(err)
                    throw new Error(err)
                })
        }
        catch (err) {
            console.log(err)
            Swal.fire({
                icon: 'error',
                title: 'Your feedback has not been sent, try again later',
                showConfirmButton: false,
                timer: 2000
            })
        } finally {
            setSendDataLoader(false)
        }



    }
    function resetUser() {
        setQualificationIdPartnerReview(null)
        setAnswersDelivered(null)
        setUserIndexSelected(null)

    }
    if (user.role_str !== 'student') {
        return (
            <ProfessorPeerReview activityData={activityData} />
        )
    } else {
        return (
            <div className={`flex transition-transform duration-700 ${showEvaluate ? 'xl:-translate-x-[calc(100vw-21rem)] -translate-x-[calc(100vw-1rem)]' : ''}`}>
                {
                    loading ?
                        <div className="flex items-center justify-center w-full h-full">
                            <MoonLoader color="#363cd6" size={80} />
                        </div>
                        :
                        QualificationIdPartnerReview === "Error" ?
                            <div className="flex flex-col items-center justify-center w-full h-full gap-10">
                                <h1 className="text-2xl text-center">You have not been assigned a partner to evaluate</h1>
                                <h3 className="text-xl text-center">Maybe you should not be here yet ;)</h3>
                                <h3 className="text-xl text-center">If it's not the case, please contact your teacher</h3>
                            </div>
                            : qualificationIds !== null &&
                            <>
                                <div className="max-w-[calc(100vw-2rem)] min-w-[calc(100vw-2rem)] xl:min-w-[calc(100vw-22rem)]">
                                    <MainScreen
                                        activityData={activityData}
                                        setShowEvaluate={setShowEvaluate}
                                        data={data}
                                        userIndexSelected={userIndexSelected}
                                        setUserIndexSelected={setUserIndexSelected}
                                        usersToPair={usersToPair}
                                        resetUser={resetUser}
                                        qualificationIds={qualificationIds}
                                        correctActivityGroup={correctActivityGroup}
                                        peerReviewInGroups={peerReviewInGroups}
                                    />
                                </div>
                                <div key={userIndexSelected} className={`${!showEvaluate ? 'w-0 h-0 overflow-hidden absolute' : 'min-w-[calc(100vw)] xl:min-w-[calc(100vw-22rem)] overflow-x-hidden  '}`}>
                                    <EvaluateScreen
                                        key={userIndexSelected}
                                        data={data}
                                        setShowEvaluate={setShowEvaluate}
                                        sendEvalution={sendEvalution}
                                        answersDelivered={answersDelivered}
                                        sendDataLoader={sendDataLoader}
                                    />
                                </div>
                            </>
                }
            </div>
        )
    }
}
