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
import GroupMembers from "../../GroupMembers.jsx"
import { BreadcrumbCourse } from "../../../../CoursesInside/BreadcrumbCourse.jsx"


function MainScreen({
    qualificationIds, peerReviewInGroups,
    activityData, setShowEvaluate, data,
    userIndexSelected, setUserIndexSelected,
    usersToPair, resetUser, correctActivityGroup }) {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const evaluated = activityData.qualification ? true : false;
    const { courseId } = useParams();
    const USER_OBJECTIVES = [...new Set(user?.user_objectives?.map((objective) => objective.categories.map((category) => category)).flat() || [])];

    /////////// coger user index selected////////////////   
    const PeerReview = activityData?.peer_review_qualifications.data[userIndexSelected]
    const usersToCorrect = correctActivityGroup ?
        activityData?.peer_review_qualifications.data
            .map((peerReview) => peerReview.attributes.group.data)
        : activityData?.peer_review_qualifications.data
            .map((peerReview) => peerReview.attributes.user.data)

    const usersWithAnswers = (correctActivityGroup && peerReviewInGroups === false) ?
        usersToCorrect.filter((userToCorrect) =>
            activityData?.user.data.attributes.PeerReviewAnswers.data
                ?.find((answer) => qualificationIds.find((qualification) =>
                    answer.attributes.qualifications.data.find((qualificationAnswer) => {
                        return qualificationAnswer.id === qualification.id
                    }
                    ))
                    &&
                    answer.attributes.qualifications.data.find(
                        (qualificationAnswer) => {
                            return userToCorrect.attributes.users.data.some((user) => user.id === qualificationAnswer.attributes.user.data.id)
                        }
                    )
                )
        )
        : peerReviewInGroups === false ?
            activityData?.user.data.attributes.PeerReviewAnswers.data
                ?.filter((answer) => {
                    return qualificationIds.find((qualification) =>
                        answer.attributes.qualifications.data.find((qualificationAnswer) => {
                            return qualificationAnswer.id === qualification.id
                        }
                        ))
                        &&
                        usersToCorrect.find((userToCorrect) => answer.attributes.qualifications.data.find(
                            (qualificationAnswer) => {
                                return userToCorrect.id === qualificationAnswer.attributes.user.data.id
                            }
                        ))
                })
                .flatMap((answer) => answer.attributes.qualifications.data.flatMap((qualification) => qualification.attributes.user.data))
            :
            usersToCorrect.filter((userToCorrect) => {
                return activityData?.group.data.attributes.PeerReviewAnswers.data
                    ?.find((answer) => qualificationIds.find((qualification) =>
                        answer.attributes.qualifications.data.find((qualificationAnswer) => {
                            return qualificationAnswer.id === qualification.id
                        }
                        ))
                        &&
                        answer.attributes.qualifications.data.find(
                            (qualificationAnswer) => {
                                return userToCorrect.id === qualificationAnswer.attributes.group.data.id
                            }
                        )
                    )
            })

    ///////////coger user index selected////////////////
    const answers = activityData?.PeerReviewAnswers.data // answers que nos han hecho los otros usuarios
    const deadLine = new Date(activityData?.activity?.data?.attributes?.deadline)
    const overpassDeadLine = deadLine < new Date() && user?.role_str === 'student'

    return (
        <div className={`flex ${overpassDeadLine || userIndexSelected === null ? `flex-col min-h-full ` : "1.5xl:justify-between"} content-start items-start  flex-wrap space-y-3 `}>
            <div className={`flex flex-col max-h-[40%]  ${userIndexSelected !== null && peerReviewInGroups ? "flex-1" : "w-full"} ${overpassDeadLine ? "sm:p-10 p-5 w-full" : "p-5 max-w-[70%]"}`}>
                <BreadcrumbCourse
                    coursePositionInfo={
                        {
                            course: activityData.activity.data.attributes.subsection.data.attributes.section.data.attributes.course.data.attributes.title,
                            courseSection: activityData.activity.data.attributes.subsection.data.attributes.section.data.attributes.title,
                            courseSubsection: activityData.activity.data.attributes.subsection.data.attributes.title,
                            activity: `Activity: ${activityData.activity.data.attributes.title}`
                        }
                    }
                    courseId={courseId}
                />
                <div className={`flex flex-wrap flex-1 mb-5 max-w-[80%]  2xl:mb-0 gap-x-10`}>
                    <div className={`flex-1 min-w-[400px] max-w-full`}>
                        <ActivityTitle type='peerReview'
                            title={activityData.activity.data.attributes.title}
                            evaluated={evaluated}
                            qualification={activityData?.qualification}
                        />
                    </div>
                    <div className="flex justify-end max-w-[500px] w-fit flex-wrap ">
                        {peerReviewInGroups && <GroupMembers
                            activityGroup={activityData.group.data.attributes}
                            small={true}
                        />}
                    </div>
                </div>
                <ObjectivesTags USER_OBJECTIVES={USER_OBJECTIVES} categories={activityData?.activity.data.attributes.categories} />

            </div>

            {userIndexSelected !== null && PeerReview !== undefined && PeerReview !== null && deadLine > new Date() ?
                <section className="flex md3:justify-end min-w-[350px] max-w-full xl:max-w-[30%] md3:ms-3 xl:pr-10 p-5 !mt-6">
                    <div className="flex flex-col w-full gap-y-1">
                        <h3 className='text-xl font-semibold'>Peer Review</h3>

                        <p className='mt-5 text-lg'>Correct {" "}
                            {!correctActivityGroup ?
                                PeerReview.attributes.user.data.attributes.username + "'s" : "Group " + (userIndexSelected + 1)} task/s!</p>
                        {PeerReview?.attributes?.file?.data?.map(renderFiles)}
                    </div>
                </section> : null
            }
            {
                overpassDeadLine ?
                    <TabsPeerReviewAnswers data={data} answers={answers} />

                    :
                    userIndexSelected === null ?
                        <>
                            <UsersToReview
                                usersToCorrect={usersToCorrect}
                                usersWithAnswers={usersWithAnswers}
                                setUserIndexSelected={setUserIndexSelected}
                                data={data}
                                usersToPair={usersToPair}
                                correctActivityGroup={correctActivityGroup}
                            />

                        </>

                        :
                        <section className="w-full pb-5">
                            <div className="flex w-full px-5 gap-x-3">
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
                            <div className="max-w-full min-w-full px-5 overflow-x-hidden">
                                <Rubrica data={data} />
                            </div>
                        </section>
            }
        </div>
    )
}

export default MainScreen