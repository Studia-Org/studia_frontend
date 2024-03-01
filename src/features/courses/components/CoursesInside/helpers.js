import { Popover } from "antd";
import { differenceInDays, parseISO } from "date-fns";

export const getIcon = (subsection, subsectionsCompleted, isFirstSubsection, prevSubsectionFinished) => {
    const dateToday = new Date();
    const dateTemp = new Date(subsection.attributes.start_date);
    const isSubsectionCompleted = subsectionsCompleted.some((subsectionTemp) => subsectionTemp.id === subsection.id);
    const dateToStart = differenceInDays(parseISO(subsection.attributes.start_date), dateToday);


    const contentOpenSubsection =
        dateToStart > 0 ? (
            <div>
                <p>This subsection will open in  <strong> {dateToStart} days </strong> </p>
            </div>
        ) : (
            <div>
                <p>This subsection will open <strong> soon </strong> </p>
            </div>
        )

    if (subsection.id === 226) {
        console.log('dateToday', isSubsectionCompleted);
    }

    if (isSubsectionCompleted) {
        return (
            <span className="absolute flex items-center justify-center w-8 h-8 bg-indigo-500 rounded-full -left-4 ring-white">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 text-white"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
            </span>
        );
    }

    if (isFirstSubsection) {
        return (
            <span className="absolute flex items-center justify-center w-8 h-8 bg-indigo-200 rounded-full -left-4 ring-white">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-indigo-500"
                >
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
            </span>
        );
    }

    if (prevSubsectionFinished === false) {
        return (
            <Popover content={contentOpenSubsection} title='Subsection is locked'>
                <span className="absolute flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded-full -left-4 ring-black ">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4 text-gray-600"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                </span>
            </Popover>
        );
    }

    if (dateTemp < dateToday) {
        return (
            <span className="absolute flex items-center justify-center w-8 h-8 bg-indigo-200 rounded-full -left-4 ring-white ">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-indigo-500"
                >
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
            </span>
        );
    }
    return (
        <span className="absolute flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded-full -left-4 ring-black ">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 text-gray-600"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
        </span>
    );
};
