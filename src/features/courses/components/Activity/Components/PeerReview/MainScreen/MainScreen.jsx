import BackToCourse from "../../BackToCourse"
import ActivityTitle from "../../ActivityTitle"
import ObjectivesTags from "../../../ObjectivesTag"
import Rubrica from "../Rubrica"
import renderFiles from "../../../utils/renderFIles"
import { useParams, useNavigate } from "react-router-dom"
import { useAuthContext } from "../../../../../../../context/AuthContext"
import TabsPeerReviewAnswers from "./TabsPeerReviewAnswers.jsx"
import UsersToReview from "./UsersToReview.jsx"
import { Button } from "antd"


function MainScreen({ qualificationIds, activityData, setShowEvaluate, data, userIndexSelected, setUserIndexSelected, usersToPair, resetUser }) {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const evaluated = activityData.qualification ? true : false;
    const { courseId } = useParams();
    const USER_OBJECTIVES = [...new Set(user?.user_objectives?.map((objective) => objective.categories.map((category) => category)).flat() || [])];

    /////////// coger user index selected////////////////   
    const PeerReview = activityData?.peer_review_qualifications.data[userIndexSelected]

    const usersToCorrect = activityData?.peer_review_qualifications.data
        .map((peerReview) => peerReview.attributes.user.data)

    const usersWithAnswers = activityData?.user.data.attributes.PeerReviewAnswers.data
        .filter((answer) =>
            qualificationIds.find((qualification) => qualification.id === answer.attributes.qualification.data.id) &&
            usersToCorrect.find((userToCorrect) => userToCorrect.id === answer.attributes.qualification.data.attributes.user.data.id))
        .map((answer) => answer.attributes.qualification.data.attributes.user.data)


    ///////////coger user index selected////////////////
    const answers = activityData?.PeerReviewAnswers.data // answers que nos han hecho los otros usuarios
    const deadLine = new Date(activityData?.activity?.data?.attributes?.deadline)
    const overpassDeadLine = deadLine < new Date() && user?.role_str === 'student'


    return (
        <div className={`flex ${overpassDeadLine || userIndexSelected === null ? `flex-col h-full` : ""} content-start items-start 1.5xl:justify-between flex-wrap space-y-6 `}>
            <div className={`flex flex-col 1.5xl:w-3/5 ${overpassDeadLine ? "sm:p-10 p-5" : "p-5"}`}>
                <BackToCourse courseId={courseId} navigate={navigate} />
                <ActivityTitle type='Peer Review'
                    title={activityData.activity.data.attributes.title}
                    evaluated={evaluated}
                    qualification={activityData?.qualification}
                />
                <ObjectivesTags USER_OBJECTIVES={USER_OBJECTIVES} categories={activityData?.activity.data.attributes.categories} />

            </div>

            {userIndexSelected !== null && PeerReview !== undefined && PeerReview !== null && deadLine > new Date() ?
                <section className="flex-1 flex md3:justify-center min-w-[250px] md3:ms-3 px-5">
                    <div className="max-w-[70%] flex-1">
                        <h3 className='text-2xl font-semibold'>Peer Review</h3>
                        <p className='mt-5 mb-3 text-lg'>Correct {PeerReview.attributes.user.data.attributes.username}'s task!</p>
                        {PeerReview?.attributes?.file?.data?.map(renderFiles)}
                    </div>
                </section> : null
            }
            {
                overpassDeadLine ?
                    <TabsPeerReviewAnswers data={data} answers={answers} />

                    :
                    userIndexSelected === null ?
                        <UsersToReview
                            usersToCorrect={usersToCorrect}
                            usersWithAnswers={usersWithAnswers}
                            setUserIndexSelected={setUserIndexSelected}
                            data={data}
                            usersToPair={usersToPair}
                        />

                        :
                        <>
                            <div className="max-w-full min-w-full px-5 mt-2 overflow-x-hidden">
                                <Rubrica data={data} />
                            </div>
                            <div className="flex px-5 pb-5 gap-x-3">
                                {
                                    userIndexSelected !== null && usersToPair > 1 &&
                                    <Button danger onClick={() => resetUser()}
                                        className="gap-1 font-bold duration-200 hover:scale-95">
                                        Change user
                                    </Button>
                                }
                                <Button type="primary" onClick={() => setShowEvaluate(prev => !prev)}
                                    className="flex flex-wrap items-center gap-1 font-bold duration-200 hover:translate-x-2">
                                    Evaluate
                                    <svg viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </Button>
                            </div>
                        </>
            }
        </div>
    )
}

export default MainScreen