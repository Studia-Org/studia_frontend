import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import ActivityTitle from "./Components/ActivityTitle";
import BackToCourse from "./Components/BackToCourse";
import ObjectivesTags from "./ObjectivesTag";
import { useAuthContext } from "../../../../context/AuthContext";
import renderFiles from "./utils/renderFIles";
import Rubrica from "./Components/Rubrica";

export default function PeerReviewComponent({ activityData, idQualification }) {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [showEvaluate, setShowEvaluate] = useState(false);
    const evaluated = activityData.qualification ? true : false;
    const USER_OBJECTIVES = [...new Set(user?.user_objectives?.map((objective) => objective.categories.map((category) => category)).flat() || [])];
    const PeerReview = activityData?.PeerReviewQualification

    return (
        <div className={`flex transition-transform duration-500 ${showEvaluate ? 'xl:-translate-x-[calc(100vw-20rem)] -translate-x-[100vw]' : ''}`}>
            <div className={`flex content-start items-start p-5 sm:p-10 1.5xl:justify-between flex-wrap space-y-6 min-w-[100vw] xl:min-w-[calc(100vw-20rem)]`}>
                <div className="flex flex-col 1.5xl:w-3/5">
                    <BackToCourse courseId={courseId} navigate={navigate} />
                    <ActivityTitle type='Peer Review'
                        title={activityData.activity.data.attributes.title}
                        evaluated={evaluated}
                        qualification={activityData?.qualification}
                    />
                    <ObjectivesTags USER_OBJECTIVES={USER_OBJECTIVES} categories={activityData?.activity.data.attributes.categories} />

                </div>
                {PeerReview !== undefined && PeerReview.data !== null ?
                    <section className="flex-1 flex md3:justify-center min-w-[250px] md3:ms-3">
                        <div className="max-w-[70%] flex-1">
                            <h3 className='font-semibold text-2xl'>Peer Review</h3>
                            <p className='text-lg mb-3 mt-5'>Correct {PeerReview.data.attributes.user.data.attributes.username}'s task!</p>
                            {PeerReview?.data?.attributes?.file?.data?.map(renderFiles)}
                        </div>
                    </section> : null
                }
                <div className="mt-2">
                    <Rubrica />
                </div>
                <button onClick={() => setShowEvaluate(prev => !prev)}
                    className="flex items-center flex-wrap gap-1 hover:translate-x-2 duration-200 
                 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Evaluate
                    <svg viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </button>
            </div>
            <div className={`${!showEvaluate ? 'w-0 h-0 overflow-hidden' : 'p-5 min-w-[100dvw] xl:min-w-[calc(100dvw-20rem)]'}`}>
                <div className="flex gap-4 max-w-full">
                    <div className="max-w-[50%]">
                        <Rubrica />
                    </div>
                </div>
                <button
                    className="mt-5 flex items-center flex-wrap gap-1 hover:translate-x-2 duration-200 
                 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => setShowEvaluate(prev => !prev)}>
                    Go back
                </button>
            </div>
        </div>

    )
}
