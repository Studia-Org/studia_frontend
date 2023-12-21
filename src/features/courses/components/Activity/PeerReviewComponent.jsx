import { useEffect, useState } from "react";
import MainScreen from "./Components/PeerReview/MainScreen";
import EvaluateScreen from "./Components/PeerReview/EvaluateScreen";
import { API } from "../../../../constant";
import { getToken } from "../../../../helpers";
import { MoonLoader } from 'react-spinners';
import Swal from "sweetalert2";
import { useAuthContext } from "../../../../context/AuthContext";

export default function PeerReviewComponent({ activityData, idQualification }) {
    const [showEvaluate, setShowEvaluate] = useState(false);
    const data = activityData?.activity?.data?.attributes?.PeerReviewRubrica
    const [idPartnerReview, setIdPartnerReview] = useState(null);
    const [answersDelivered, setAnswersDelivered] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthContext();

    useEffect(() => {
        if (user === null || user === undefined || user.role_str !== 'student') { setLoading(false); return }

        fetch(`${API}/qualifications?qualification` +
            `&fields[0]=PeerReviewAnswers` +
            `&populate[activity][fields][0]=id` +
            `&filters[user][id]=${activityData.PeerReviewQualification.data.attributes.user.data.id}` +
            `&filters[activity][id]=${activityData.activity.data.id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            }
        }).then(res => {
            if (res.ok) {
                return res.json()

            } else {
                throw new Error(res)
            }
        }).then(data => {
            setAnswersDelivered(data.data[0].attributes.PeerReviewAnswers)
            setIdPartnerReview(data.data[0].id)
            const deadLine = new Date(activityData?.activity?.data?.attributes?.deadline)
            const overpassDeadLine = deadLine < new Date()
            if (data.data[0].attributes.PeerReviewAnswers !== null && !overpassDeadLine) setShowEvaluate(true)
        }).catch(err => {
            console.log(err)
        }).finally(() => {
            setLoading(false)
        })

    }, [user]);


    function sendEvalution() {
        const answers = {}
        Object.keys(data).forEach((key, index) => {
            if (key === 'Criteria') return
            console.log(key)

            const grid = document.getElementById(key)
            const select = grid.querySelector("select")?.value || grid.querySelector("input")?.value
            const textarea = grid.querySelector("textarea").value
            const dict = {}
            dict[select] = textarea
            answers[key] = dict
        })

        const id = idPartnerReview
        const payload = {
            data: {
                delivered_data: new Date().toISOString(),
                PeerReviewAnswers: answers
            }
        }
        fetch(`${API}/qualifications/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(payload),
        }).then(res => {
            if (res.ok) {
                fetch(`${API}/qualifications/${idQualification}`, {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify({
                        data:
                        {
                            delivered: true,
                            delivered_data: new Date().toISOString(),
                        }
                    }),
                }).then(res => {
                    if (res.ok) {
                        setAnswersDelivered(answers)
                        Swal.fire({
                            icon: 'success',
                            title: 'Your feedback has been sent',
                            showConfirmButton: false,
                            timer: 2000
                        })
                        return res.json()
                    } else {
                        throw new Error(res)
                    }
                })
                return res.json()
            } else {
                throw new Error(res)
            }
        }).catch(err => {
            throw new Error(err)
        }).finally(() => { })


    }

    return (
        <div className={`flex transition-transform duration-700 ${showEvaluate ? 'xl:-translate-x-[calc(100vw-21rem)] -translate-x-[calc(100vw-1rem)]' : ''}`}>
            {
                loading ?
                    <div className="w-full h-full flex justify-center items-center">
                        <MoonLoader color="#363cd6" size={80} />
                    </div>
                    :
                    <>
                        <div className="max-w-[calc(100vw-2rem)] min-w-[calc(100vw-2rem)] xl:min-w-[calc(100vw-21rem)]">
                            <MainScreen
                                activityData={activityData}
                                setShowEvaluate={setShowEvaluate}
                                data={data}
                            />
                        </div>
                        <div className={`${!showEvaluate ? 'w-0 h-0 overflow-hidden absolute' : 'min-w-[calc(100vw)] xl:min-w-[calc(100vw-22rem)] overflow-x-hidden  '}`}>
                            <EvaluateScreen data={data} setShowEvaluate={setShowEvaluate} sendEvalution={sendEvalution} answersDelivered={answersDelivered} />
                        </div>
                    </>
            }

        </div>

    )
}
