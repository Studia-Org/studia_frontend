import BackToCourse from "../BackToCourse"
import ActivityTitle from "../ActivityTitle"
import ObjectivesTags from "../../ObjectivesTag"
import Rubrica from "./Rubrica"
import renderFiles from "../../utils/renderFIles"
import { useParams, useNavigate } from "react-router-dom"
import { useAuthContext } from "../../../../../../context/AuthContext"

function MainScreen({ activityData, setShowEvaluate, data }) {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const evaluated = activityData.qualification ? true : false;
    const { courseId } = useParams();
    const USER_OBJECTIVES = [...new Set(user?.user_objectives?.map((objective) => objective.categories.map((category) => category)).flat() || [])];
    const PeerReview = activityData?.PeerReviewQualification
    const answers = activityData?.PeerReviewAnswers
    const deadLine = new Date(activityData?.activity?.data?.attributes?.deadline)
    const overpassDeadLine = deadLine < new Date() && user?.role_str === 'student'
    return (
        <div className={`flex ${overpassDeadLine ? `flex-col` : ""} content-start items-start 1.5xl:justify-between flex-wrap space-y-6 `}>
            <div className={`flex flex-col 1.5xl:w-3/5 ${overpassDeadLine ? "sm:p-10 p-5" : "p-5"}`}>
                <BackToCourse courseId={courseId} navigate={navigate} />
                <ActivityTitle type='Peer Review'
                    title={activityData.activity.data.attributes.title}
                    evaluated={evaluated}
                    qualification={activityData?.qualification}
                />
                <ObjectivesTags USER_OBJECTIVES={USER_OBJECTIVES} categories={activityData?.activity.data.attributes.categories} />

            </div>
            {PeerReview !== undefined && PeerReview.data !== null && deadLine > new Date() ?
                <section className="flex-1 flex md3:justify-center min-w-[250px] md3:ms-3 px-5">
                    <div className="max-w-[70%] flex-1">
                        <h3 className='font-semibold text-2xl'>Peer Review</h3>
                        <p className='text-lg mb-3 mt-5'>Correct {PeerReview.data.attributes.user.data.attributes.username}'s task!</p>
                        {PeerReview?.data?.attributes?.file?.data?.map(renderFiles)}
                    </div>
                </section> : null
            }
            {
                overpassDeadLine ?
                    answers !== undefined && answers !== null ?
                        <section className="p-10 ">
                            <div className=" flex-1">
                                <h3 className="font-semibold text-2xl mb-5">Submission feedback!</h3>
                                <div className="grid font-semibold  grid-cols-2 sm:grid-cols-4 md:grid-cols-5  shadow-lg rounded-[14px] sm:border-2 sm:border-gray-700">
                                    {Object.keys(answers).map((criterion, index) => {
                                        const range = Object.keys(answers[criterion])[0];
                                        const feedback = answers[criterion][range];
                                        const isFirstRow = index === 0;
                                        const isLastRow = index === Object.keys(answers).length - 1;
                                        const cornerClasses = isFirstRow ? "rounded-tl-xl " : (isLastRow ? "sm:rounded-bl-xl " : "");

                                        return (
                                            <>
                                                <div className={`flex sm:min-h-[70px] items-center p-4  bg-purple-300 text-gray-900 ${isLastRow ? "" : "sm:border-b-2 sm:border-gray-700"}  ${cornerClasses}`}>{criterion}</div>
                                                <div className={`${isFirstRow ? "rounded-tr-xl" : ""}  bg-purple-300  ${isLastRow ? "" : "sm:border-b-2 sm:border-gray-700"}
                                                    sm:bg-white sm:rounded-none flex sm:min-h-[70px] items-center p-4  text-gray-900`}>{range}</div>
                                                <div className={`col-span-2 md:col-span-3 sm:min-h-[70px]
                                                    flex items-center p-4 h-full  bg-white sm:bg-purple-300 ${isFirstRow ? "sm:rounded-tr-xl" : ""}
                                                    ${isLastRow ? "rounded-bl-xl sm:rounded-bl-none rounded-br-xl" : "border-b-2 border-gray-700"}`}>{feedback}</div>
                                            </>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                        :
                        <section className="p-10 ">
                            <div className=" flex-1">
                                <h3 className="font-semibold text-2xl mb-5">Submission feedback!</h3>
                                <p>Your partner could not give you feedback 😔</p>
                            </div>
                        </section>
                    :
                    <>
                        <div className="mt-2 max-w-full overflow-x-hidden px-5">
                            <Rubrica data={data} />
                        </div>
                        <div className="px-5 pb-5">
                            <button onClick={() => setShowEvaluate(prev => !prev)}
                                className="flex items-center flex-wrap gap-1 hover:translate-x-2 duration-200 
                            bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Evaluate
                                <svg viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </button>
                        </div>
                    </>
            }
        </div>
    )
}

export default MainScreen