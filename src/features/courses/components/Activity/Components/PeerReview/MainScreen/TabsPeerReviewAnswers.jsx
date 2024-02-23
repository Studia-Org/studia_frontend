import PeerReviewAnswers from "./PeerReviewAnswers"
import { Tabs } from 'antd';
export default function TabsPeerReviewAnswers({ answers, data }) {
    return (
        <section className={`flex flex-1 min-w-[100vw] lg:min-w-[75vw] max-w-[90vw] pb-10 !m-0`}>
            {
                answers.length === 0 ?
                    <div className="flex flex-col items-center flex-1">
                        <h3 className="text-2xl ">Your partner didn't give you a review :(</h3>
                    </div>
                    :
                    <div className={`w-full h-full max-h-[600px] px-5 md:px-10`}>
                        <h3 className="-mb-1 text-2xl font-semibold">Peer Review feedback</h3>
                        <Tabs defaultActiveKey="1" centered >
                            {
                                answers.map((answer, index) => {
                                    return (
                                        <Tabs.TabPane tab={"Review " + (index + 1)} key={index}>
                                            <PeerReviewAnswers answers={answer.attributes.Answers} data={data.Criteria} />
                                        </Tabs.TabPane>
                                    )
                                }
                                )
                            }
                        </Tabs>

                    </div>
            }

        </section>
    )
}