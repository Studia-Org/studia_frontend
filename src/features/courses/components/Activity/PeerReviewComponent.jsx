import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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

    const data = {
        Criteria: ['0-3', '3-5', '5-7', '7-10'],
        Completeness: ['The task lacks necessary components or is significantly unfinished.', 'Some elements are complete, but important parts are missing or incomplete.', 'The task is almost finished, with a few minor elements remaining.', 'Every aspect of the task is thoroughly and completely finished.'],
        Accuracy: ['The task contains significant errors, making it unreliable or incorrect.', 'Some aspects are correct, but there are notable inaccuracies.', 'The majority of the task is accurate, with minor errors.', 'Every detail is precise and error-free.'],
        Efficiency: ['The task is time-consuming and resource-intensive.', 'The task uses resources reasonably, but there\'s room for improvement.', 'The task is completed in a timely and resource-effective manner.', 'The task is accomplished with maximum efficiency and minimal resource usage.'],
        Clarity: ['The task is confusing and hard to understand.', 'Some parts are clear, but overall understanding is hindered.', 'The task is generally clear, with a few unclear elements.', 'Every aspect of the task is presented in a clear and easily understandable manner.']
    }




    function sendEvalution() {
        Object.keys(data).forEach((key, index) => {
            if (key === 'Criteria') return
            const grid = document.getElementById(key)
            const select = grid.querySelector("select").value
            const textarea = grid.querySelector("textarea").value

            console.table(select, textarea)
        })
    }

    return (
        <div className={`flex transition-transform duration-700 ${showEvaluate ? 'xl:-translate-x-[calc(100vw-20rem)] -translate-x-[calc(100vw)]' : ''}`}>
            <div className="max-w-[calc(100vw)] min-w-[calc(100vw)] xl:min-w-[calc(100vw-20rem)]">
                <div className={`flex content-start items-start 1.5xl:justify-between flex-wrap space-y-6 `}>
                    <div className="flex flex-col 1.5xl:w-3/5 p-5">
                        <BackToCourse courseId={courseId} navigate={navigate} />
                        <ActivityTitle type='Peer Review'
                            title={activityData.activity.data.attributes.title}
                            evaluated={evaluated}
                            qualification={activityData?.qualification}
                        />
                        <ObjectivesTags USER_OBJECTIVES={USER_OBJECTIVES} categories={activityData?.activity.data.attributes.categories} />

                    </div>
                    {PeerReview !== undefined && PeerReview.data !== null ?
                        <section className="flex-1 flex md3:justify-center min-w-[250px] md3:ms-3 px-5">
                            <div className="max-w-[70%] flex-1">
                                <h3 className='font-semibold text-2xl'>Peer Review</h3>
                                <p className='text-lg mb-3 mt-5'>Correct {PeerReview.data.attributes.user.data.attributes.username}'s task!</p>
                                {PeerReview?.data?.attributes?.file?.data?.map(renderFiles)}
                            </div>
                        </section> : null
                    }
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
                </div>
            </div>
            <div className={`${!showEvaluate ? 'w-0 h-0 overflow-hidden absolute' : 'min-w-[calc(100vw)] xl:min-w-[calc(100vw-21rem)] overflow-x-hidden  '}`}>
                <div className="pl-4 pt-4">
                    <button
                        className="flex items-center w-fit flex-wrap gap-1 hover:-translate-x-2 duration-200 
                             bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => setShowEvaluate(prev => !prev)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Go back
                    </button>
                </div>
                <div className="flex max-w-full flex-wrap md2:flex-row flex-col-reverse">
                    <div id="container-rubrica" className="md2:max-w-[calc(50%)] md2:min-w-[calc(50%)] overflow-x-scroll px-5 ">
                        <Rubrica petite={true} data={data} index={"-1"} />
                    </div>
                    <div className=" md2:max-w-[calc(50%)] w-full  flex flex-col ">
                        <h3 className='text-xl mb-3 w-full text-center' >Evaluate</h3>
                        <div className="px-4 w-full grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-[2%]">
                            {Object.keys(data).map((key, index) => {
                                if (key === 'Criteria') return;
                                return (
                                    <div key={index} >
                                        <label htmlFor={"large-input" + key} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{key}</label>
                                        <select
                                            id={"large-input" + key}
                                            name="large-input"
                                            autoComplete="large-input"
                                            className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {data["Criteria"].map((item, index) => (
                                                <option value={item} key={index}>{item}</option>
                                            ))}
                                        </select>
                                        <textarea
                                            id={key + "about"}
                                            name={key + "about"}
                                            rows={8}
                                            className="resize-none block w-full mt-1 text-sm border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                );
                            })}
                            <div>

                            </div>
                            <div className="place-self-end">
                                <button onClick={sendEvalution}
                                    className="flex h-fit items-center w-fit flex-wrap gap-1  duration-200 
                             bg-blue-700 hover:scale-95 text-white font-bold py-2 px-4 rounded mb-10 md2:mb-0">
                                    Submit
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    )
}
