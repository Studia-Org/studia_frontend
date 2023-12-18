export function GenerateBar({ index, color }) {
    return (
        <div
            key={index}
            className={`tremor-Tracker-trackingBlock h-[10px] w-[54px] relative rounded-tremor-small bg-${color}-500`}
            onMouseEnter={() => {
                const tooltip = document.getElementById("tremor-" + index);
                if (tooltip) {
                    tooltip.style.display = "block";
                }
            }}
            onMouseLeave={() => {
                const tooltip = document.getElementById("tremor-" + index);
                if (tooltip) {
                    tooltip.style.display = "none";
                }
            }}
        >
            <div id={"tremor-" + index}
                className="max-w-xs text-sm z-20 rounded-tremor-default  text-white bg-dark-tremor-background-subtle px-2.5 py-1"
                style={{ position: "absolute", top: "-9px", left: "60px", display: "none" }}>{10 - index}
            </div>
        </div>
    )

}
export function GenerateChartQualifitation({ averageQualification, qualification }) {

    return <div className="flex flex-col shrink-0 gap-y-1">
        {
            Array.from({ length: 11 }, (_, index) => {
                let color = index < 4 ? "emerald" : index < 6 ? "yellow" : "rose"
                const tempAvg = Math.round(averageQualification)
                const tempQualification = Math.round(qualification)

                const average_mark = 10 - index - tempAvg
                const bool_row = average_mark === 0

                const user_mark = 10 - index - tempQualification

                const user_bool_row = user_mark === 0

                return (
                    <div key={index} className="grid grid-cols-[55px_auto] grid-rows-[14px] ">
                        <GenerateBar index={index} color={color} />
                        {bool_row || user_bool_row ?
                            <div className="flex w-fit mt-[-5.5px] gap-x-1">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="black"
                                    className="w-6 h-6 transform rotate-180"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                    />
                                </svg>
                                <label>{
                                    user_bool_row && bool_row ? "In the average! " + qualification :
                                        user_bool_row ? "Your mark: " + qualification :
                                            "Average mark: " + averageQualification
                                }</label>
                            </div>
                            : ""}
                    </div>
                )
            })}
    </div>
}