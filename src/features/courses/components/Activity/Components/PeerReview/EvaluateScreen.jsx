import Rubrica from './Rubrica';
import { Button } from "antd"
import { useTranslation } from 'react-i18next';
function EvaluateScreen({ data, setShowEvaluate, sendEvalution, answersDelivered, sendDataLoader }) {
    const { t } = useTranslation();
    let buttonText = answersDelivered === null || answersDelivered === undefined ? t("COMMON.send") : t("PEERREVIEW.update_feedback")
    return (
        <>
            <div className="pt-4 pl-8">
                <Button type='primary'
                    className="flex flex-wrap items-center gap-1 font-bold text-white duration-200 bg-blue-500 w-fit hover:-translate-x-2 hover:bg-blue-700 "
                    onClick={() => setShowEvaluate(prev => !prev)}>
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    {t("PEERREVIEW.go_to_rubric")}
                </Button>
            </div>
            <div className="flex flex-col-reverse flex-wrap max-w-full pl-8 md2:flex-row">
                <div id="container-rubrica" className="md2:max-w-[calc(50%)] md2:min-w-[calc(50%)] px-5 ">
                    <Rubrica petite={true} data={data} index={"-1"} />
                </div>
                <div className=" md2:max-w-[calc(50%)] w-full  flex flex-col pb-2 ">
                    <h3 className='w-full mb-3 text-xl text-center' >{t("PEERREVIEW.evaluate")}</h3>
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
                                    {!isNaN(parseFloat(data["Criteria"][0].split("-")[0])) && isFinite(data["Criteria"][0].split("-")[0])

                                        ? <input
                                            defaultValue={defaultDataKey}
                                            id={key + "about"}
                                            name={key + "about"}
                                            type="number"
                                            min={0}
                                            max={parseInt(data["Criteria"][data["Criteria"].length - 1].split("-")[1]) || parseInt(data["Criteria"][data["Criteria"].length - 1].split("-")[0])}
                                            className="block w-full mt-1 text-sm border border-gray-300 rounded-lg resize-none"
                                        />
                                        :
                                        <select
                                            id={"large-input" + key}
                                            name="large-input"
                                            autoComplete="large-input"
                                            className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {data["Criteria"].map((item, index) => (
                                                <option
                                                    defaultValue={item}
                                                    selected={defaultDataKey === item}
                                                    key={index}>
                                                    {item}
                                                </option>
                                            ))}
                                        </select>

                                    }
                                    <textarea
                                        defaultValue={answersDelivered[key]?.[defaultDataKey] || ""}
                                        id={key + "about"}
                                        name={key + "about"}
                                        rows={8}
                                        className="block w-full mt-1 text-sm border border-gray-300 rounded-lg resize-none"
                                    />
                                </div>
                            );
                        })}

                    </div>
                    <div className="pt-5 pr-5 place-self-end">
                        <Button type='primary' onClick={() => sendEvalution()} disabled={sendDataLoader} loading={sendDataLoader}
                            className="flex flex-wrap items-center gap-1 px-4 py-2 font-bold text-white duration-200 bg-blue-700 rounded h-fit w-fit hover:scale-95 ">
                            {buttonText}
                        </Button>
                    </div>

                </div>
            </div>
        </>
    )
}

export default EvaluateScreen