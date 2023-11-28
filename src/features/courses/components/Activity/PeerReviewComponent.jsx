import { useState} from "react";
import MainScreen from "./Components/PeerReview/MainScreen";
import EvaluateScreen from "./Components/PeerReview/EvaluateScreen";

export default function PeerReviewComponent({ activityData, idQualification }) {
    const [showEvaluate, setShowEvaluate] = useState(false);
    const data = activityData?.activity?.data?.attributes?.PeerReviewRubrica

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
        <div className={`flex transition-transform duration-700 ${showEvaluate ? 'xl:-translate-x-[calc(100vw-21rem)] -translate-x-[calc(100vw-1rem)]' : ''}`}>
            <div className="max-w-[calc(100vw-2rem)] min-w-[calc(100vw-2rem)] xl:min-w-[calc(100vw-21rem)]">
                <MainScreen 
                    activityData={activityData}
                    setShowEvaluate={setShowEvaluate}
                    data={data}
                />
            </div>
            <div className={`${!showEvaluate ? 'w-0 h-0 overflow-hidden absolute' : 'min-w-[calc(100vw)] xl:min-w-[calc(100vw-21rem)] overflow-x-hidden  '}`}>
                <EvaluateScreen data={data} setShowEvaluate={setShowEvaluate} sendEvalution={sendEvalution} />
            </div>
        </div>

    )
}
