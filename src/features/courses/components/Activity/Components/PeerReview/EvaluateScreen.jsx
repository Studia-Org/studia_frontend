import Rubrica from './Rubrica';

function EvaluateScreen({ data, setShowEvaluate, sendEvalution, answersDelivered }) {
    let buttonText = answersDelivered === null ? "Send" : "Update FeedBack"
    return (
        <>
            <div className="pl-8 pt-4">
                <button
                    className="flex items-center w-fit flex-wrap gap-1 hover:-translate-x-2 duration-200 
                             bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => setShowEvaluate(prev => !prev)}>
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Go back
                </button>
            </div>
            <div className="flex max-w-full flex-wrap md2:flex-row pl-8 flex-col-reverse">
                <div id="container-rubrica" className="md2:max-w-[calc(50%)] md2:min-w-[calc(50%)] overflow-x-scroll px-5 ">
                    <Rubrica petite={true} data={data} index={"-1"} />
                </div>
                <div className=" md2:max-w-[calc(50%)] w-full  flex flex-col pb-2 ">
                    <h3 className='text-xl mb-3 w-full text-center' >Evaluate</h3>
                    <div className="px-4 w-full grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[5px]">
                        {Object.keys(data).map((key, index) => {
                            if (key === 'Criteria') return;
                            if (!answersDelivered) answersDelivered = {};
                            let defaultDataKey = Object.keys(answersDelivered[key] || {})[0];
                            return (
                                <div id={key} key={key}>
                                    <label htmlFor={"large-input" + key} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        {key}
                                    </label>
                                    <select
                                        id={"large-input" + key}
                                        name="large-input"
                                        autoComplete="large-input"
                                        className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {data["Criteria"].map((item, index) => (
                                            <option value={item} selected={defaultDataKey === item} key={index}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                    <textarea
                                        defaultValue={answersDelivered[key]?.[defaultDataKey] || ""}
                                        id={key + "about"}
                                        name={key + "about"}
                                        rows={8}
                                        className="resize-none block w-full mt-1 text-sm border border-gray-300 rounded-lg"
                                    />
                                </div>
                            );
                        })}

                    </div>
                    <div className="place-self-end pt-5 pr-5">
                        <button onClick={sendEvalution}
                            className="flex h-fit items-center w-fit flex-wrap gap-1  duration-200 
                             bg-blue-700 hover:scale-95 text-white font-bold py-2 px-4 rounded ">
                            {buttonText}
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}

export default EvaluateScreen