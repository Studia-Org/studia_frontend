import { useEffect, useState } from "react";
import MainScreen from "./Components/PeerReview/MainScreen";
import EvaluateScreen from "./Components/PeerReview/EvaluateScreen";
import { API } from "../../../../constant";
import { getToken } from "../../../../helpers";
import { MoonLoader } from 'react-spinners';
import Swal from "sweetalert2";
import { useAuthContext } from "../../../../context/AuthContext";
import { ProfessorPeerReview } from "./ProfessorPeerReview";

export default function PeerReviewComponent({ activityData }) {
    const [showEvaluate, setShowEvaluate] = useState(false);
    const data = activityData?.activity?.data?.attributes?.PeerReviewRubrica
    const usersToPair = activityData.activity.data.attributes.usersToPair
    ////////////////////eleccion de la data del user////////////////////////
    const [userIndexSelected, setUserIndexSelected] = useState(null)
    const [idQualification, setIdQualification] = useState(null)
    const [QualificationIdPartnerReview, setQualificationIdPartnerReview] = useState(null);
    const [qualificationIds, setQualificationIds] = useState(null);
    const [answersDelivered, setAnswersDelivered] = useState(null);
    ////////////////////eleccion de la data del user////////////////////////
    const [loading, setLoading] = useState(false);
    const { user } = useAuthContext();

    useEffect(() => {
        if (user === null || user === undefined || user.role_str !== 'student') { setLoading(false); return }
        if (activityData.peer_review_qualifications.data[0] === undefined || activityData.peer_review_qualifications.data === null) {
            setLoading(false);
            setQualificationIdPartnerReview("Error")
            return
        }
        if (userIndexSelected === null) return

    }, [user, userIndexSelected]);

    useEffect(() => {
        if (qualificationIds === null) {
            fetch(`${API}/qualifications?qualification` +
                `&populate[activity][fields][0]=id` +
                `&populate[user][fields][0]=username` +
                `&populate[PeerReviewQualifications][fields][0]=*` +
                `&filters[activity][id]=${activityData.activity.data.id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                }
            }).then(res => {
                if (res.ok) {
                    return res.json()

                } else {
                    console.log()
                    throw new Error(res.status)
                }
            }).then(data => {

                const usersToCorrect = activityData?.peer_review_qualifications.data
                    .map((peerReview) => peerReview.attributes.user.data)

                const idQualifications = data.data
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

        const idQualification = qualificationIds.find((qual) => {
            return activityData.peer_review_qualifications.data[userIndexSelected].attributes.user.data.id ===
                qual.attributes.user.data.id
        }).id

        setQualificationIdPartnerReview(idQualification)

        const answersdel = idQualification

        const answers = activityData.user.data.attributes.PeerReviewAnswers.data
            .find((answer) => answer.attributes.qualification.data.id === answersdel)

        if (answers !== undefined) {
            setAnswersDelivered(answers.attributes.Answers)
            const deadLine = new Date(activityData?.activity?.data?.attributes?.deadline)
            const overpassDeadLine = deadLine < new Date()
            if (!overpassDeadLine) setShowEvaluate(true)
        }
        setIdQualification(activityData.peer_review_qualifications.data[userIndexSelected].id)

    }, [userIndexSelected])

    function sendEvalution(e) {
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
                qualification: QualificationIdPartnerReview,
            }
        }
        fetch(`${API}/peer-review-answers?populate[user]=*` +
            `&filters[user][id]=${user.id}` +
            `&populate[qualification][fields][0]=*` +
            `&populate[qualification][populate][activity][fields][0]=id` +
            `&filters[qualification][activity][id]=${activityData.activity.data.id}` +
            `&populate[qualification][populate][user][fields][0]=*` +
            `&filters[qualification][user][id]=${activityData.peer_review_qualifications.data[userIndexSelected].attributes.user.data.id}`
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
                    fetch(`${API}/peer-review-answers?populate[qualification][populate][user][fields][0]=*`, {
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
                                setShowEvaluate(false)
                                resetUser()
                                activityData.user.data.attributes.PeerReviewAnswers.data.push(data.data)
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
                                const answer = (activityData.user.data.attributes.PeerReviewAnswers.data
                                    .find((answer) => answer.attributes.qualification.data.id === QualificationIdPartnerReview))
                                answer.attributes.Answers = answers
                                console.log(activityData.user.data.attributes.PeerReviewAnswers.data)
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
                Swal.fire({
                    icon: 'error',
                    title: 'Your feedback has not been sent, try again later',
                    showConfirmButton: false,
                    timer: 2000
                })
            }).finally(() => { })

    }
    function resetUser() {
        setQualificationIdPartnerReview(null)
        setAnswersDelivered(null)
        setIdQualification(null)
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
                        <div className="w-full h-full flex justify-center items-center">
                            <MoonLoader color="#363cd6" size={80} />
                        </div>
                        :
                        QualificationIdPartnerReview === "Error" ?
                            <div className="w-full h-full flex flex-col justify-center gap-10 items-center">
                                <h1 className="text-2xl text-center">You have not been assigned a partner to evaluate</h1>
                                <h3 className="text-xl text-center">Maybe you should not be here yet ;)</h3>
                                <h3 className="text-xl text-center">If it's not the case, please contact your teacher</h3>
                            </div>
                            : qualificationIds !== null &&
                            <>
                                <div className="max-w-[calc(100vw-2rem)] min-w-[calc(100vw-2rem)] xl:min-w-[calc(100vw-21rem)]">
                                    <MainScreen
                                        activityData={activityData}
                                        setShowEvaluate={setShowEvaluate}
                                        data={data}
                                        userIndexSelected={userIndexSelected}
                                        setUserIndexSelected={setUserIndexSelected}
                                        usersToPair={usersToPair}
                                        resetUser={resetUser}
                                        qualificationIds={qualificationIds}
                                    />
                                </div>
                                <div key={userIndexSelected} className={`${!showEvaluate ? 'w-0 h-0 overflow-hidden absolute' : 'min-w-[calc(100vw)] xl:min-w-[calc(100vw-22rem)] overflow-x-hidden  '}`}>
                                    <EvaluateScreen
                                        key={userIndexSelected}
                                        data={data}
                                        setShowEvaluate={setShowEvaluate}
                                        sendEvalution={sendEvalution}
                                        answersDelivered={answersDelivered} />
                                </div>
                            </>
                }
            </div>
        )
    }
}
