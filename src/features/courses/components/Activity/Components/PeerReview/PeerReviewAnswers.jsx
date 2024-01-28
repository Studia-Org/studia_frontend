import React from 'react'
import { Popover, Whisper } from 'rsuite';


function PeerReviewAnswers({ answers, data }) {



    const number = !isNaN(parseFloat(data[0].split("-")[0])) && isFinite(data[0].split("-")[0])
    const speaker = (
        <Popover>
            <div>
                <p className='font-semibold'>Possible qualifications:</p >
                <div className={`grid ${!number ? "grid-cols-2" : null} ml-1`}>
                    {
                        number ?
                            <>
                                <p className='font-normal -ml-1'>Range: {data[0].split("-")[0] + " - " + data[data.length - 1].split("-")[1]}</p>
                            </>
                            :
                            data.map((range, index) => {
                                return (
                                    <p key={index} className='font-normal'>{range}</p>
                                )
                            })
                    }
                </div>
            </div>
        </Popover>
    );
    return (
        answers !== undefined && answers !== null ?
            <section className="px-10 h-full max-h-[600px]">
                <div className=" h-full max-h-[600px]">
                    <div className='flex '>
                        <h3 className="w-max font-semibold text-2xl mb-5">Submission feedback!</h3>
                        <Whisper
                            placement="autoHorizontalEnd"
                            className='text-sm shadow-md'
                            trigger="click"
                            controlId="control-id-hover"
                            speaker={speaker}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-500 ml-2">
                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                            </svg>
                        </Whisper>
                    </div>
                    <div className="grid font-semibold h-[calc(100%-4rem)] max-h-[600px] grid-cols-2 sm:grid-cols-4 md:grid-cols-5  shadow-lg rounded-[14px] sm:border-2 sm:border-gray-700">

                        {Object.keys(answers).map((criterion, index) => {
                            const range = Object.keys(answers[criterion])[0];
                            const feedback = answers[criterion][range];
                            const isFirstRow = index === 0;
                            const isLastRow = index === Object.keys(answers).length - 1;
                            const cornerClasses = isFirstRow ? "rounded-tl-xl " : (isLastRow ? "sm:rounded-bl-xl " : "");


                            return (
                                <>
                                    <div className={`flex sm:min-h-[70px] items-center p-4 break-all	 bg-purple-300 text-gray-900 ${isLastRow ? "" : "sm:border-b-2 sm:border-gray-700"}  ${cornerClasses}`}>{criterion}</div>
                                    <div className={`${isFirstRow ? "rounded-tr-xl" : ""} break-all	  bg-purple-300  ${isLastRow ? "" : "sm:border-b-2 sm:border-gray-700"}
                                                sm:bg-white sm:rounded-none flex sm:min-h-[70px] items-center p-4  text-gray-900`}>{range}</div>
                                    <div className={`col-span-2 md:col-span-3 sm:min-h-[70px]  break-all	
                                                flex items-center p-4 h-full  bg-white sm:bg-purple-300 ${isFirstRow ? "sm:rounded-tr-xl" : ""}
                                                ${isLastRow ? "rounded-bl-xl sm:rounded-bl-none rounded-br-xl" : "border-b-2 border-gray-700"}`}>{feedback}</div>
                                </>
                            );
                        })}
                    </div>
                </div>
            </section>
            :
            <section className="p-10 pt-0 ">
                <div className=" flex-1">
                    <h3 className="font-semibold text-2xl mb-5">Submission feedback!</h3>
                    <p>Your partner could not give you feedback 😔</p>
                </div>
            </section>
    )
}

export default PeerReviewAnswers