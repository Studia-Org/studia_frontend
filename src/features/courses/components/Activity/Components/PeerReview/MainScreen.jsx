import BackToCourse from "../BackToCourse"
import ActivityTitle from "../ActivityTitle"
import ObjectivesTags from "../../ObjectivesTag"
import Rubrica from "./Rubrica"
import renderFiles from "../../utils/renderFIles"
import { useParams, useNavigate } from "react-router-dom"
import { useAuthContext } from "../../../../../../context/AuthContext"
import PeerReviewAnswers from "./PeerReviewAnswers"
import { Avatar, Button } from "antd"
import { Carousel } from 'flowbite-react';

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
    if (activityData.user.data.attributes.PeerReviewAnswers.data === undefined) return null

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
                        <h3 className='font-semibold text-2xl'>Peer Review</h3>
                        <p className='text-lg mb-3 mt-5'>Correct {PeerReview.attributes.user.data.attributes.username}'s task!</p>
                        {PeerReview?.attributes?.file?.data?.map(renderFiles)}
                    </div>
                </section> : null
            }
            {
                overpassDeadLine ?
                    <section className="flex flex-1 min-w-[100vw] lg:min-w-[75vw] max-w-[90vw] pb-10">
                        <div className="w-full h-full max-h-[600px]">
                            <Carousel slide={false}
                                indicators={answers.length > 1}
                                leftControl={answers.length === 1 ? <div></div> : <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"
                                    class="w-10 h-10 p-2 mt-10 text-black bg-[#ffffff80] rounded-full" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path></svg>}
                                rightControl={answers.length === 1 ? <div></div> : <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"
                                    class="w-10 h-10 p-2 mt-10 text-black bg-[#ffffff80] rounded-full" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg>}>
                                {
                                    answers.map((answer, index) => {
                                        return (
                                            <PeerReviewAnswers answers={answer.attributes.Answers} data={data.Criteria} />
                                        )
                                    })
                                }
                            </Carousel>
                        </div>
                    </section>
                    :
                    userIndexSelected === null ?
                        <section className="flex flex-1 flex-wrap w-full gap-x-10 ">
                            <div className="my-2 px-5 flex flex-col">
                                <h3 className="mb-2"> You have to review {usersToPair} colleagues to finish the activity</h3>
                                <h3 >Left to review: {usersToPair - usersWithAnswers.length} </h3>
                                {usersToCorrect.map((user, index) => {
                                    return (
                                        <div key={index}
                                            onClick={() => setUserIndexSelected(index)}
                                            className="flex cursor-pointer hover:scale-105 duration-150  px-3 py-1 w-[250px] border-2 border-gray-700 bg-white rounded-md items-center gap-2 mt-3">
                                            <Avatar size="large" src={user.attributes.profile_photo.data?.attributes?.url} />
                                            <p className="text-lg text-black">{user.attributes.username}</p>
                                            {
                                                usersWithAnswers.find((userWithAnswer) => userWithAnswer.id === user.id) !== undefined &&
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" className="w-6 h-6 ml-auto">
                                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                </svg>


                                            }
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="mt-2 w-full overflow-x-hidden flex flex-1 px-5 basis-[450px]">
                                <div className="w-full max-w-4xl mx-auto">
                                    <Rubrica data={data} petite={true} />
                                </div>
                            </div>
                        </section>
                        :
                        <>
                            <div className="mt-2 min-w-full max-w-full overflow-x-hidden px-5">
                                <Rubrica data={data} />
                            </div>
                            <div className="px-5 pb-5 flex gap-x-3">
                                {
                                    userIndexSelected !== null && usersToPair > 1 &&
                                    <Button danger onClick={() => resetUser()}
                                        className=" gap-1 hover:scale-95 duration-200 
                                          font-bold ">
                                        Change user
                                    </Button>
                                }
                                <Button type="primary" onClick={() => setShowEvaluate(prev => !prev)}
                                    className="flex items-center flex-wrap gap-1 hover:translate-x-2 duration-200 
                                      font-bold">
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