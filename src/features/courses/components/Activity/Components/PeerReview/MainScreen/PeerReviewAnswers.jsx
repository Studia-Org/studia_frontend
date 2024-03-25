
function PeerReviewAnswers({ answers, data }) {

    const number = !isNaN(parseFloat(data[0].split("-")[0])) && isFinite(data[0].split("-")[0])
    return (
        answers !== undefined && answers !== null ?
            <section className=" h-full max-h-[600px]">
                <div className="grid font-semibold h-[calc(100%-4rem)] max-h-[600px]
                     grid-cols-2 shadow-md rounded-md  ">

                    {Object.keys(answers).map((criterion, index) => {
                        const range = Object.keys(answers[criterion])[0];
                        const feedback = answers[criterion][range];
                        const isFirstRow = index === 0;
                        const isLastRow = index === Object.keys(answers).length - 1;
                        const cornerClasses = isFirstRow ? "rounded-tl-md " : (isLastRow ? " " : "");


                        return (
                            <>
                                <div className={`flex items-center p-4 break-allbg-purple-300 text-gray-900 bg-[#ced6ef]  ${cornerClasses}`}>{criterion}</div>
                                <div className={`${isFirstRow ? "rounded-tr-md" : ""} break-all bg-[#ced6ef] 
                                                flex items-center p-4  text-gray-900`}>{range + (number ? "/" + data[data.length - 1].split("-")[1] : "")}</div>
                                <div className={`col-span-2 break-all flex items-center p-4 h-full bg-white 
                                                ${isLastRow ? "rounded-bl-md  rounded-br-md" : ""}`}>{feedback}</div>
                            </>
                        );
                    })}
                </div>
            </section>
            :
            <section className="p-10 pt-0 ">
                <div className="flex-1 ">
                    <h3 className="mb-5 text-2xl font-semibold">Submission feedback!</h3>
                    <p>Your partner could not give you feedback 😔</p>
                </div>
            </section>
    )
}

export default PeerReviewAnswers