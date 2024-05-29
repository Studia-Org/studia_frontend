import PeerReviewAnswers from "./PeerReviewAnswers"
import { Tabs } from 'antd';
export default function TabsPeerReviewAnswers({ answers, data }) {
    return (
        <section className={`flex flex-col min-h-full max-w-[100%] pb-10 !m-0 !mx-10 `}>
            {
                answers.length === 0 ?
                    <div className="flex flex-col items-center flex-1">
                        <h3 className="text-2xl ">Your partner didn't give you a review :(</h3>
                    </div>
                    :
                    <>
                        <h3 className="-mb-1 text-xl font-semibold">Peer Review feedback</h3>
                        <Tabs defaultActiveKey="0" >
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
                    </>
            }

        </section>
    )
}