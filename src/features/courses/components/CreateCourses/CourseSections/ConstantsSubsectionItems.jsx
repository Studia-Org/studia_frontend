import { EmptyQuestionnaireData, PlannificationQuestionnaireData, SRLOQuestionnaireData } from './QuestionnaireData'
import { PeerReviewData, ForumData, ThinkAloudData, SelfAssessmentData } from './ActivityData';
import React from 'react'


function createSubsection(subsectionName, fase, questionnaireData, setCreateCourseSectionsList, sectionToEdit, type, context, activityData) {
    const id = crypto.randomUUID();

    if (context === 'coursesInside') {
        if (activityData?.id) {
            delete activityData.id
        }

        const newSubsection = {
            id: id,
            attributes: {
                title: subsectionName,
                fase: fase,
                finished: false,
                start_date: null,
                end_date: null,
                activity: {
                    ...activityData,
                    title: subsectionName,
                    categories: [],
                    description: 'Activity',
                    type: type,
                    deadline: new Date().toISOString(),
                },
                content: '',
                paragraphs: [],
                description: 'Subsection description',
                landscape_photo: [],
                files: [],
                type: type,
                questionnaire: questionnaireData,
                users: null
            }
        };

        setCreateCourseSectionsList(prev => {
            const updatedSectionToEdit = JSON.parse(JSON.stringify(prev));
            updatedSectionToEdit.attributes.subsections.data.push(newSubsection);
            const customSort = (a, b) => {
                const faseOrder = { 'forethought': 1, 'performance': 2, 'self-reflection': 3 };
                return faseOrder[a.attributes.fase] - faseOrder[b.attributes.fase];
            };
            updatedSectionToEdit.attributes.subsections.data = updatedSectionToEdit.attributes.subsections.data.sort(customSort);
            return updatedSectionToEdit;
        })
    } else {
        const newSubsection = {
            id: id,
            title: subsectionName,
            fase: fase,
            finished: false,
            start_date: null,
            end_date: null,
            activity: { ...activityData, id: crypto.randomUUID(), title: subsectionName, categories: [] },
            content: '',
            paragraphs: [],
            description: null,
            landscape_photo: [],
            files: [],
            type: type,
            questionnaire: questionnaireData,
            users: null
        };
        setCreateCourseSectionsList(prevSections => {
            return prevSections.map(section => {
                if (section.id === sectionToEdit.id) {
                    const currentFaseSubsections = section.subsections.filter(sub => sub.fase === fase);
                    const updatedSubsections = [...section.subsections.filter(sub => sub.fase !== fase), ...currentFaseSubsections, newSubsection];
                    const customSort = (a, b) => {
                        const faseOrder = { 'forethought': 1, 'performance': 2, 'self-reflection': 3 };
                        return faseOrder[a.fase] - faseOrder[b.fase];
                    };
                    const sortedSubsections = updatedSubsections.sort(customSort);
                    return {
                        ...section,
                        subsections: sortedSubsections,
                    };
                }
                return section;
            });
        });
    }
}

function svgSwitcher(pathDescription) {
    switch (pathDescription) {
        case 'questionnaireNormal':
            return (
                <path d="M5.625 3.75a2.625 2.625 0 100 5.25h12.75a2.625 2.625 0 000-5.25H5.625zM3.75 11.25a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75zM3 15.75a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zM3.75 18.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75z" />
            )
        case 'taskStatement':
            return (
                <>
                    <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
                    <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                </>
            )
        case 'taskImplementation':
            return (
                <path fillRule="evenodd" d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13zm10.857 5.691a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            )
        case 'peerReview':
            return (
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
            )
        case 'taskFinalDelivery':
            return (
                <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm4.75 11.25a.75.75 0 001.5 0v-2.546l.943 1.048a.75.75 0 101.114-1.004l-2.25-2.5a.75.75 0 00-1.114 0l-2.25 2.5a.75.75 0 101.114 1.004l.943-1.048v2.546z" clipRule="evenodd" />
            )
        case 'thinkAloud':
            return (
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
            )
        case 'forum':
            return (
                <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" />
            )
        default:
            return (
                <path d="M5.625 3.75a2.625 2.625 0 100 5.25h12.75a2.625 2.625 0 000-5.25H5.625zM3.75 11.25a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75zM3 15.75a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zM3.75 18.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75z" />
            )
    }
}

const sectionTaskCoursesInside = {
    title: '',
    description: '',
    type: 'task',
    categories: [],
    deadline: new Date().toISOString(),
    id: crypto.randomUUID(),
}

const QuestionItem = ({ iconColor, iconPath, title }) => (
    <li className="flex items-center mt-8 mb-10 ml-8">
        <span className={`absolute flex items-center justify-center w-8 h-8 bg-[${iconColor}] rounded-full -left-4 ring-white`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-white">
                {iconPath}
            </svg>
        </span>
        <p className="flex items-center font-medium text-left text-gray-900 line-clamp-2">{title}</p>
    </li>
);

function modifySequence(sequence, sectionTask) {
    if (!sectionTask) {
        sectionTask = sectionTaskCoursesInside;
    }
    const modifiedSequence = sequence.map((item, index) => {
        const id = crypto.randomUUID();

        if (item.activityData === sectionTask) {
            return {
                ...item,
                title: `${item.title}: ${sectionTask.title}`,
                activityData: item.activityData === sectionTask ? {
                    ...sectionTask,
                    id: id,
                    title: `${item.title}: ${sectionTask.title}`
                } : item.activityData,

            };
        }
        else if (item.activityData === PeerReviewData) {
            return {
                ...item,
                activityData: item.activityData === PeerReviewData ? {
                    ...PeerReviewData,
                    id: id,
                } : item.activityData,
            };
        }
        else {
            return item;
        }
    });
    return modifiedSequence;

}


function addSequence(modifiedSequence, setCreateCourseSectionsList, sectionToEdit, context) {
    for (const item of modifiedSequence) {
        createSubsection(item.title, item.fase, item.questionnaireData, setCreateCourseSectionsList, sectionToEdit, item.type, context, item.activityData);
    }
}

export const SequenceDevelop = ({ setCreateCourseSectionsList, sectionToEdit, sectionTask, context }) => {
    const sequence = [
        { title: 'Autoregulation Questionnaire', iconColor: '#15803d', iconPath: svgSwitcher('questionnaireNormal'), fase: 'forethought', questionnaireData: SRLOQuestionnaireData, type: 'questionnaire', activityData: null },
        { title: 'Task Statement', iconColor: '#15803d', iconPath: svgSwitcher('taskStatement'), fase: 'forethought', questionnaireData: null, type: 'task', activityData: sectionTask },
        { title: 'Plannification questionnaire', iconColor: '#15803d', iconPath: svgSwitcher('questionnaireNormal'), fase: 'forethought', questionnaireData: PlannificationQuestionnaireData, type: 'questionnaire', activityData: null },
        { title: 'Task implementation', iconColor: '#f59e0b', iconPath: svgSwitcher('taskImplementation'), fase: 'performance', questionnaireData: null, type: 'task', activityData: sectionTask },
        { title: 'Peer review', iconColor: '#dc2626', iconPath: svgSwitcher('peerReview'), fase: 'self-reflection', questionnaireData: null, type: 'peerReview', activityData: PeerReviewData },
        { title: 'Final delivery', iconColor: '#dc2626', iconPath: svgSwitcher('taskFinalDelivery'), fase: 'self-reflection', questionnaireData: null, type: 'task', activityData: sectionTask },
        { title: 'Autoregulation Questionnaire', iconColor: '#dc2626', iconPath: svgSwitcher('questionnaireNormal'), fase: 'self-reflection', questionnaireData: SRLOQuestionnaireData, type: 'questionnaire', activityData: null },

    ];

    const modifiedSequence = modifySequence(sequence, sectionTask);

    return (
        <div className="relative flex items-center p-5 border rounded-xl bg-gray-50">
            <div>
                <ol className="relative ml-8 mr-4 border-l border-gray-300 border-dashed">
                    {sequence.map((item, index) => (
                        <QuestionItem key={index} {...item} />
                    ))}
                </ol>
            </div>
            <div className='w-1/2 h-full p-5 text-right bg-white border rounded-md '>
                <button onClick={() => { addSequence(modifiedSequence, setCreateCourseSectionsList, sectionToEdit, context) }} className="bg-[#45406f] text-white font-normal text-sm p-2 rounded-md flex gap-2 hover:scale-105 duration-150 mb-5 ml-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" />
                    </svg>
                    Add Sequence
                </button>
                <div className="">
                    <p className="text-base font-normal">Continuous feedback</p>
                    <p className="text-sm font-normal text-gray-500 ">The sequence is designed to revolve around the delivery of a task, allowing students to plan the task and progressively improve it with feedback from other students</p>
                </div>
            </div>
        </div>
    );
}

export const SequenceDevelopEducation1 = ({ setCreateCourseSectionsList, sectionToEdit, sectionTask, context }) => {
    const sequence = [
        { title: 'Task Statement', iconColor: '#15803d', iconPath: svgSwitcher('taskStatement'), fase: 'forethought', questionnaireData: null, type: 'task', activityData: sectionTask },
        { title: 'Forum debate', iconColor: '#15803d', iconPath: svgSwitcher('forum'), fase: 'forethought', questionnaireData: null, type: 'forum', activityData: ForumData },
        { title: 'Plannification questionnaire', iconColor: '#15803d', iconPath: svgSwitcher('questionnaireNormal'), fase: 'forethought', questionnaireData: PlannificationQuestionnaireData, type: 'questionnaire', activityData: null },
        { title: 'First task implementation', iconColor: '#f59e0b', iconPath: svgSwitcher('taskImplementation'), fase: 'performance', questionnaireData: null, type: 'task', activityData: sectionTask },
        { title: 'First delivery', iconColor: '#f59e0b', iconPath: svgSwitcher('taskFinalDelivery'), fase: 'performance', questionnaireData: null, type: 'task', activityData: sectionTask },
        { title: 'Peer Review', iconColor: '#f59e0b', iconPath: svgSwitcher('peerReview'), fase: 'performance', questionnaireData: null, type: 'peerReview', activityData: PeerReviewData },
        { title: 'Feedback reflection questionnaire', iconColor: '#f59e0b', iconPath: svgSwitcher('questionnaireNormal'), fase: 'performance', questionnaireData: EmptyQuestionnaireData, type: 'questionnaire', activityData: null },
        { title: 'Second task implementation', iconColor: '#f59e0b', iconPath: svgSwitcher('taskImplementation'), fase: 'performance', questionnaireData: null, type: 'task', activityData: sectionTask },
        { title: 'Second delivery', iconColor: '#f59e0b', iconPath: svgSwitcher('taskFinalDelivery'), fase: 'performance', questionnaireData: null, type: 'task', activityData: sectionTask },
        { title: 'Peer Review', iconColor: '#f59e0b', iconPath: svgSwitcher('peerReview'), fase: 'performance', questionnaireData: null, type: 'peerReview', activityData: PeerReviewData },
        { title: 'Feedback reflection questionnaire', iconColor: '#f59e0b', iconPath: svgSwitcher('questionnaireNormal'), fase: 'performance', questionnaireData: EmptyQuestionnaireData, type: 'questionnaire', activityData: null },
        { title: 'Final delivery', iconColor: '#dc2626', iconPath: svgSwitcher('taskFinalDelivery'), fase: 'self-reflection', questionnaireData: null, type: 'task', activityData: sectionTask },
    ];

    const modifiedSequence = modifySequence(sequence, sectionTask);

    return (
        <div className="relative flex items-center p-5 border rounded-xl bg-gray-50">
            <div>
                <ol className="relative ml-8 mr-4 border-l border-gray-300 border-dashed">
                    {sequence.map((item, index) => (
                        <QuestionItem key={index} {...item} />
                    ))}
                </ol>
            </div>
            <div className='w-1/2 h-full p-5 text-right bg-white border rounded-md '>
                <button onClick={() => { addSequence(modifiedSequence, setCreateCourseSectionsList, sectionToEdit, context) }} className="bg-[#45406f] text-white font-normal text-sm p-2 rounded-md flex gap-2 hover:scale-105 duration-150 mb-5 ml-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" />
                    </svg>
                    Add Sequence
                </button>
                <div className="">
                    <p className="text-base font-normal">Continuous feedback</p>
                    <p className="text-sm font-normal text-gray-500">The sequence is designed to revolve around the delivery of a task, allowing students to plan the task and progressively improve it with feedback from other students</p>
                </div>
            </div>
        </div>
    );
}

export const SequenceDevelopEducation2 = ({ setCreateCourseSectionsList, sectionToEdit, sectionTask, context }) => {
    const sequence = [
        { title: 'Task Statement', iconColor: '#15803d', iconPath: svgSwitcher('taskStatement'), fase: 'forethought', questionnaireData: null, type: 'task', activityData: sectionTask },
        { title: 'Plannification questionnaire', iconColor: '#15803d', iconPath: svgSwitcher('questionnaireNormal'), fase: 'forethought', questionnaireData: PlannificationQuestionnaireData, type: 'questionnaire', activityData: null },
        { title: 'First task implementation', iconColor: '#f59e0b', iconPath: svgSwitcher('taskImplementation'), fase: 'performance', questionnaireData: null, type: 'task', activityData: sectionTask },
        { title: 'First delivery', iconColor: '#f59e0b', iconPath: svgSwitcher('taskFinalDelivery'), fase: 'performance', questionnaireData: null, type: 'task', activityData: sectionTask },
        { title: 'Professor feedback and reflection', iconColor: '#dc2626', iconPath: svgSwitcher('peerReview'), fase: 'self-reflection', questionnaireData: null, type: 'peerReview', activityData: PeerReviewData },
        { title: 'Autoevaluation questionnaire', iconColor: '#dc2626', iconPath: svgSwitcher('questionnaireNormal'), fase: 'self-reflection', questionnaireData: EmptyQuestionnaireData, type: 'questionnaire', activityData: null },
        { title: 'Final delivery', iconColor: '#dc2626', iconPath: svgSwitcher('taskFinalDelivery'), fase: 'self-reflection', questionnaireData: null, type: 'task', activityData: sectionTask },
    ];

    const modifiedSequence = modifySequence(sequence, sectionTask);

    return (
        <div className="flex items-center p-5 border rounded-xl bg-gray-50">
            <div>
                <ol className="relative ml-8 mr-4 border-l border-gray-300 border-dashed">
                    {sequence.map((item, index) => (
                        <QuestionItem key={index} {...item} />
                    ))}
                </ol>
            </div>
            <div className='w-1/2 h-full p-5 text-right bg-white border rounded-md '>
                <button onClick={() => { addSequence(modifiedSequence, setCreateCourseSectionsList, sectionToEdit, context) }} className="bg-[#45406f] text-white font-normal text-sm p-2 rounded-md flex gap-2 hover:scale-105 duration-150 mb-5 ml-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" />
                    </svg>
                    Add Sequence
                </button>
                <div className="">
                    <p className="text-base font-normal">Early Professor feedback and reflection</p>
                    <p className="text-sm font-normal text-gray-500">The sequence is designed to revolve around the delivery of a task, allowing students to plan the task and progressively improve it with feedback from other students</p>
                </div>
            </div>
        </div>
    );
}


export const SequenceFeedUP = ({ setCreateCourseSectionsList, sectionToEdit, sectionTask, context }) => {
    const sequence = [
        { title: 'Task Statement', iconColor: '#15803d', iconPath: svgSwitcher('taskStatement'), fase: 'forethought', questionnaireData: null, type: 'task', activityData: sectionTask },
        { title: 'Plannification questionnaire', iconColor: '#15803d', iconPath: svgSwitcher('questionnaireNormal'), fase: 'forethought', questionnaireData: PlannificationQuestionnaireData, type: 'questionnaire', activityData: null },
        { title: 'Feed Up', iconColor: '#15803d', iconPath: svgSwitcher('peerReview'), fase: 'forethought', questionnaireData: null, type: 'task', activityData: null },
        { title: 'First task implementation', iconColor: '#f59e0b', iconPath: svgSwitcher('taskImplementation'), fase: 'performance', questionnaireData: null, type: 'task', activityData: sectionTask },
        { title: 'Questionnaire feedback and reflection', iconColor: '#dc2626', iconPath: svgSwitcher('peerReview'), fase: 'self-reflection', questionnaireData: null, type: 'peerReview', activityData: PeerReviewData },
        { title: 'Plannification questionnaire for Final Delivery', iconColor: '#dc2626', iconPath: svgSwitcher('questionnaireNormal'), fase: 'self-reflection', questionnaireData: PlannificationQuestionnaireData, type: 'questionnaire', activityData: null },
        { title: 'Final delivery', iconColor: '#dc2626', iconPath: svgSwitcher('taskFinalDelivery'), fase: 'self-reflection', questionnaireData: null, type: 'task', activityData: sectionTask },
    ];

    const modifiedSequence = modifySequence(sequence, sectionTask);

    return (
        <div className="flex items-center p-5 border rounded-xl bg-gray-50">
            <div>
                <ol className="relative ml-8 mr-4 border-l border-gray-300 border-dashed">
                    {sequence.map((item, index) => (
                        <QuestionItem key={index} {...item} />
                    ))}
                </ol>
            </div>
            <div className='w-1/2 h-full p-5 text-right bg-white border rounded-md '>
                <button onClick={() => { addSequence(modifiedSequence, setCreateCourseSectionsList, sectionToEdit, context) }} className="bg-[#45406f] text-white font-normal text-sm p-2 rounded-md flex gap-2 hover:scale-105 duration-150 mb-5 ml-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" />
                    </svg>
                    Add Sequence
                </button>
                <div className="">
                    <p className="text-base font-normal">WIP</p>
                    <p className="text-sm font-normal text-gray-500">Work in Progress</p>
                </div>
            </div>
        </div>
    );
}

export const SequenceThinkAloud = ({ setCreateCourseSectionsList, sectionToEdit, sectionTask, context }) => {
    const sequence = [
        { title: 'Task Statement', iconColor: '#15803d', iconPath: svgSwitcher('taskStatement'), fase: 'forethought', questionnaireData: null, type: 'task', activityData: sectionTask },
        { title: 'Rubric analysis ', iconColor: '#15803d', iconPath: svgSwitcher('taskStatement'), fase: 'forethought', questionnaireData: null, type: 'task', activityData: null },
        { title: 'Think Aloud ', iconColor: '#15803d', iconPath: svgSwitcher('thinkAloud'), fase: 'forethought', questionnaireData: null, type: 'task', activityData: ThinkAloudData },
        { title: 'Task Implementation and Delivery', iconColor: '#f59e0b', iconPath: svgSwitcher('taskImplementation'), fase: 'performance', questionnaireData: null, type: 'task', activityData: sectionTask },
        { title: 'Think Aloud and Feed-Forward', iconColor: '#dc2626', iconPath: svgSwitcher('thinkAloud'), fase: 'self-reflection', questionnaireData: null, type: 'task', activityData: ThinkAloudData },
    ];

    const modifiedSequence = modifySequence(sequence, sectionTask);

    return (
        <div className="flex items-center p-5 border rounded-xl bg-gray-50">
            <div>
                <ol className="relative ml-8 mr-4 border-l border-gray-300 border-dashed">
                    {sequence.map((item, index) => (
                        <QuestionItem key={index} {...item} />
                    ))}
                </ol>
            </div>
            <div className='w-1/2 h-full p-5 text-right bg-white border rounded-md '>
                <button onClick={() => { addSequence(modifiedSequence, setCreateCourseSectionsList, sectionToEdit, context) }} className="bg-[#45406f] text-white font-normal text-sm p-2 rounded-md flex gap-2 hover:scale-105 duration-150 mb-5 ml-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" />
                    </svg>
                    Add Sequence
                </button>
                <div className="">
                    <p className="text-base font-normal">WIP</p>
                    <p className="text-sm font-normal text-gray-500">Work in Progress</p>
                </div>
            </div>
        </div>
    );
}


export const SequenceDevelopNoMSLQForum = ({ setCreateCourseSectionsList, sectionToEdit, sectionTask, context }) => {
    const sequence = [
        { title: 'Task Statement', iconColor: '#15803d', iconPath: svgSwitcher('taskStatement'), fase: 'forethought', questionnaireData: null, type: 'task', activityData: sectionTask },
        { title: 'Plannification questionnaire', iconColor: '#15803d', iconPath: svgSwitcher('questionnaireNormal'), fase: 'forethought', questionnaireData: PlannificationQuestionnaireData, type: 'questionnaire', activityData: null },
        { title: 'Task implementation', iconColor: '#f59e0b', iconPath: svgSwitcher('taskImplementation'), fase: 'performance', questionnaireData: null, type: 'task', activityData: sectionTask },
        { title: 'Forum Doubts', iconColor: '#f59e0b', iconPath: svgSwitcher('forum'), fase: 'performance', questionnaireData: null, type: 'forum', activityData: ForumData },
        { title: 'Peer review', iconColor: '#dc2626', iconPath: svgSwitcher('peerReview'), fase: 'self-reflection', questionnaireData: null, type: 'peerReview', activityData: PeerReviewData },
        { title: 'Feedback refactor', iconColor: '#dc2626', iconPath: svgSwitcher('taskImplementation'), fase: 'self-reflection', questionnaireData: null, type: 'task', activityData: sectionTask },
        { title: 'Final delivery', iconColor: '#dc2626', iconPath: svgSwitcher('taskFinalDelivery'), fase: 'self-reflection', questionnaireData: null, type: 'task', activityData: sectionTask },
        { title: 'Autoregulation Questionnaire', iconColor: '#dc2626', iconPath: svgSwitcher('questionnaireNormal'), fase: 'self-reflection', questionnaireData: SRLOQuestionnaireData, type: 'questionnaire', activityData: null },
    ];

    const modifiedSequence = modifySequence(sequence, sectionTask);

    return (
        <div className="relative flex items-center p-5 border rounded-xl bg-gray-50">
            <div>
                <ol className="relative ml-8 mr-4 border-l border-gray-300 border-dashed">
                    {sequence.map((item, index) => (
                        <QuestionItem key={index} {...item} />
                    ))}
                </ol>
            </div>
            <div className='w-1/2 h-full p-5 text-right bg-white border rounded-md '>
                <button onClick={() => { addSequence(modifiedSequence, setCreateCourseSectionsList, sectionToEdit, context) }} className="bg-[#45406f] text-white font-normal text-sm p-2 rounded-md flex gap-2 hover:scale-105 duration-150 mb-5 ml-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" />
                    </svg>
                    Add Sequence
                </button>
                <div className="">
                    <p className="text-base font-normal">Develop a task with forum feedback</p>
                    <p className="text-sm font-normal text-gray-500">The sequence is designed to revolve around the delivery of a task, allowing students to plan the task and progressively improve it with feedback from other students</p>
                </div>
            </div>
        </div>
    );
}

export const PerformancePage = ({ setCreateCourseSectionsList, sectionToEdit, context, sectionTask }) => {

    return (
        <>
            <div className='flex items-center p-5 border rounded-xl bg-gray-50'>
                <div className='px-3 py-3 bg-[#f59e0b] rounded-md flex items-center justify-center '>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 text-white">
                        <path fillRule="evenodd" d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13zm10.857 5.691a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>

                </div>
                <div className='ml-5'>
                    <p className='text-base font-normal'>Task implementation</p>
                    <p className='text-sm font-normal text-gray-500'>Implementation of the task, during this phase, the planned tasks and activities are put into action. It involves carrying out the necessary actions to achieve the project or task objectives defined in the planning phase.</p>
                </div>
                <button onClick={() => createSubsection('Task implementation', 'performance', null, setCreateCourseSectionsList, sectionToEdit, 'task', context, sectionTask)} className='pl-3 mx-3 ml-auto'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#45406f]">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            <div className='flex items-center p-5 mt-5 border rounded-xl bg-gray-50 '>
                <div className='px-3 py-3 bg-[#f59e0b] rounded-md flex items-center justify-center '>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 text-white">
                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
                    </svg>
                </div>
                <div className='ml-5'>
                    <p className='text-base font-normal'>Peer review</p>
                    <p className='text-sm font-normal text-gray-500'>This review method aims to provide constructive feedback, validate the quality and accuracy of the work, and ensure it meets established standards or criteria.</p>
                </div>
                <button onClick={() => createSubsection('Peer review', 'performance', null, setCreateCourseSectionsList, sectionToEdit, 'peerReview', context, PeerReviewData)} className='pl-3 mx-3 ml-auto'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#45406f]">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            <div className='flex items-center p-5 mt-5 border rounded-xl bg-gray-50'>
                <div className='px-3 py-3 bg-[#f59e0b] rounded-md flex items-center justify-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 text-white">
                        <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm4.75 11.25a.75.75 0 001.5 0v-2.546l.943 1.048a.75.75 0 101.114-1.004l-2.25-2.5a.75.75 0 00-1.114 0l-2.25 2.5a.75.75 0 101.114 1.004l.943-1.048v2.546z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className='ml-5'>
                    <p className='text-base font-normal'>Task delivery</p>
                    <p className='text-sm font-normal text-gray-500'>Delivery of the task.</p>
                </div>
                <button onClick={() => createSubsection('Task delivery', 'performance', null, setCreateCourseSectionsList, sectionToEdit, 'task', context, sectionTask)} className='pl-3 mx-3 ml-auto'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#45406f] ">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            <div className='flex items-center p-5 mt-5 border rounded-xl bg-gray-50'>
                <div className='px-3 py-3 bg-[#f59e0b] rounded-md flex items-center justify-center '>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                        <path d="M5.625 3.75a2.625 2.625 0 100 5.25h12.75a2.625 2.625 0 000-5.25H5.625zM3.75 11.25a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75zM3 15.75a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zM3.75 18.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75z" />
                    </svg>
                </div>
                <div className='ml-5'>
                    <p className='text-base font-normal'>Empty Questionnaire</p>
                    <p className='text-sm font-normal text-gray-500'>Create a new questionnaire from scratch.</p>
                </div>
                <button onClick={() => createSubsection('Questionnaire', 'performance', EmptyQuestionnaireData, setCreateCourseSectionsList, sectionToEdit, 'questionnaire', context, null)} className='pl-3 mx-3 ml-auto'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#45406f]">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            <div className='flex items-center p-5 mt-5 border rounded-xl bg-gray-50'>
                <div className='px-3 py-3 bg-[#f59e0b] rounded-md flex items-center justify-center '>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </div>
                <div className='ml-5'>
                    <p className='text-base font-normal'>Self-assessment</p>
                    <p className='text-sm font-normal text-gray-500'>
                        Self-assessment is a process that allows students to reflect on their learning, identify areas of strength and weakness, and set goals for improvement. It is an essential skill for lifelong learning and personal development.</p>
                </div>
                <button onClick={() => createSubsection('Self-assesment', 'performance', null, setCreateCourseSectionsList, sectionToEdit, 'selfAssessment', context, SelfAssessmentData)} className='pl-3 mx-3 ml-auto'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#45406f]">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            <div className='flex items-center p-5 mt-5 border rounded-xl bg-gray-50'>
                <div className='px-3 py-3 bg-[#f59e0b] rounded-md flex items-center justify-center '>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                        <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                    </svg>
                </div>
                <div className='ml-5'>
                    <p className='text-base font-normal'>Custom Field</p>
                    <p className='text-sm font-normal text-gray-500'>Add a custom field if you need to introduce any theorical subsection between phases.</p>
                </div>
                <button onClick={() => createSubsection('Custom field', 'performance', null, setCreateCourseSectionsList, sectionToEdit, 'task', context, sectionTask)} className='pl-3 mx-3 ml-auto'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#45406f]">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </>
    )

}

export const buttonGroup = ({ handleBack, handleContinue }) => {
    return (
        <div className='ml-auto space-x-3'>
            <button onClick={() => handleBack()} className='bg-[#45406f] p-1 text-white rounded-md hover:bg-indigo-900 duration-150'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                </svg>

            </button>
            <button onClick={() => handleContinue()} className='bg-[#45406f] p-1 text-white rounded-md hover:bg-indigo-900 duration-150'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    )
}

export const ForethoughtPage = ({ setCreateCourseSectionsList, sectionToEdit, context, sectionTask }) => {

    return (
        <>
            <div className='flex items-center p-5 border rounded-xl bg-gray-50'>
                <div className='px-3 py-3 bg-[#15803d] rounded-md flex items-center justify-center '>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                        <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                        <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className='ml-5'>
                    <p className='text-base font-normal'>Plannification questionnaire</p>
                    <p className='text-sm font-normal text-gray-500'>A planning questionnaire is a valuable tool for gathering essential information to create effective plans. This questionnaire helps individuals or teams define goals, identify resources, and establish a roadmap for successful execution. </p>
                </div>
                <button onClick={() => createSubsection('Plannification questionnaire', 'forethought', PlannificationQuestionnaireData, setCreateCourseSectionsList, sectionToEdit, 'questionnaire', context, null)} className='pl-3 mx-3 ml-3'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6  text-[#45406f]">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            <div className='flex items-center p-5 mt-5 border rounded-xl bg-gray-50'>
                <div className='px-3 py-3 bg-[#15803d] rounded-md flex items-center justify-center '>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                        <path d="M5.625 3.75a2.625 2.625 0 100 5.25h12.75a2.625 2.625 0 000-5.25H5.625zM3.75 11.25a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75zM3 15.75a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zM3.75 18.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75z" />
                    </svg>
                </div>
                <div className='ml-5'>
                    <p className='text-base font-normal'>SRL-O Autoregulation Questionnaire</p>
                    <p className='text-sm font-normal text-gray-500'>The Self-regulation for learning online (SRL-O) questionnaire measures the frequency and quality of learning strategies when applied to online or blended or hybrid environments.</p>
                </div>
                <button onClick={() => createSubsection('SRL-O Questionnaire', 'forethought', SRLOQuestionnaireData, setCreateCourseSectionsList, sectionToEdit, 'questionnaire', context, null)} className='pl-3 mx-3 ml-auto'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#45406f]">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            <div className='flex items-center p-5 mt-5 border rounded-xl bg-gray-50'>
                <div className='px-3 py-3 bg-[#15803d] rounded-md flex items-center justify-center '>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                        <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
                        <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                    </svg>
                </div>
                <div className='ml-5'>
                    <p className='text-base font-normal'>Task statement</p>
                    <p className='text-sm font-normal text-gray-500'>Define the essential details of the task, including its objectives, scope, and expected outcomes. Task statements are designed to provide clear guidance to individuals or teams, ensuring that they understand their responsibilities and can execute the task effectively. </p>
                </div>
                <button onClick={() => createSubsection('Task statement', 'forethought', null, setCreateCourseSectionsList, sectionToEdit, 'task', context, sectionTask)} className='pl-3 mx-3 ml-auto '>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#45406f]">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            <div className='flex items-center p-5 mt-5 border rounded-xl bg-gray-50'>
                <div className='px-3 py-3 bg-[#15803d] rounded-md flex items-center justify-center '>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                        <path d="M5.625 3.75a2.625 2.625 0 100 5.25h12.75a2.625 2.625 0 000-5.25H5.625zM3.75 11.25a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75zM3 15.75a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zM3.75 18.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75z" />
                    </svg>
                </div>
                <div className='ml-5'>
                    <p className='text-base font-normal'>Empty Questionnaire</p>
                    <p className='text-sm font-normal text-gray-500'>Create a new questionnaire from scratch.</p>
                </div>
                <button onClick={() => createSubsection('Questionnaire', 'forethought', EmptyQuestionnaireData, setCreateCourseSectionsList, sectionToEdit, 'questionnaire', context, null)} className='pl-3 mx-3 ml-auto'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#45406f]">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            <div className='flex items-center p-5 mt-5 border rounded-xl bg-gray-50'>
                <div className='px-3 py-3 bg-[#15803d] rounded-md flex items-center justify-center '>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                    </svg>

                </div>
                <div className='ml-5'>
                    <p className='text-base font-normal'>Think Aloud</p>
                    <p className='text-sm font-normal text-gray-500'>
                        A Think Aloud is a strategy where you verbalize your thoughts as you work through a problem or task. It helps students understand your reasoning process and learn effective problem-solving strategies.</p>
                </div>
                <button onClick={() => createSubsection('Think Aloud', 'forethought', null, setCreateCourseSectionsList, sectionToEdit, 'thinkAloud', context, ThinkAloudData)} className='pl-3 mx-3 ml-auto'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#45406f]">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            <div className='flex items-center p-5 mt-5 border rounded-xl bg-gray-50'>
                <div className='px-3 py-3 bg-[#15803d] rounded-md flex items-center justify-center '>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </div>
                <div className='ml-5'>
                    <p className='text-base font-normal'>Self-assessment</p>
                    <p className='text-sm font-normal text-gray-500'>
                        Self-assessment is a process that allows students to reflect on their learning, identify areas of strength and weakness, and set goals for improvement. It is an essential skill for lifelong learning and personal development.</p>
                </div>
                <button onClick={() => createSubsection('Self-assesment', 'forethought', null, setCreateCourseSectionsList, sectionToEdit, 'selfAssessment', context, SelfAssessmentData)} className='pl-3 mx-3 ml-auto'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#45406f]">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            <div className='flex items-center p-5 mt-5 border rounded-xl bg-gray-50'>
                <div className='px-3 py-3 bg-[#15803d] rounded-md flex items-center justify-center '>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                        <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                    </svg>
                </div>
                <div className='ml-5'>
                    <p className='text-base font-normal'>Custom field</p>
                    <p className='text-sm font-normal text-gray-500'>Add a custom field if you need to introduce any theorical subsection between phases.</p>
                </div>
                <button onClick={() => createSubsection('Custom field', 'forethought', null, setCreateCourseSectionsList, sectionToEdit, 'task', context, sectionTask)} className='pl-3 mx-3 ml-auto'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#45406f]">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </>
    )
}

export const SelfReflectionPage = ({ setCreateCourseSectionsList, sectionToEdit, context, sectionTask }) => {

    return (
        <>
            <div className='flex items-center p-5 border rounded-xl bg-gray-50 '>
                <div className='px-3 py-3 bg-[#dc2626] rounded-md flex items-center justify-center '>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 text-white">
                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
                    </svg>
                </div>
                <div className='ml-5'>
                    <p className='text-base font-normal'>Peer review</p>
                    <p className='text-sm font-normal text-gray-500'>This review method aims to provide constructive feedback, validate the quality and accuracy of the work, and ensure it meets established standards or criteria.</p>
                </div>
                <button onClick={() => createSubsection('Peer review', 'self-reflection', null, setCreateCourseSectionsList, sectionToEdit, 'peerReview', context, PeerReviewData)} className='pl-3 mx-3 ml-auto'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#45406f]">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            <div className='flex items-center p-5 mt-5 border rounded-xl bg-gray-50'>
                <div className='px-3 py-3 bg-[#dc2626] rounded-md flex items-center justify-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 text-white">
                        <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm4.75 11.25a.75.75 0 001.5 0v-2.546l.943 1.048a.75.75 0 101.114-1.004l-2.25-2.5a.75.75 0 00-1.114 0l-2.25 2.5a.75.75 0 101.114 1.004l.943-1.048v2.546z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className='ml-5'>
                    <p className='text-base font-normal'>Final delivery</p>
                    <p className='text-sm font-normal text-gray-500'>Final delivery of the task.</p>
                </div>
                <button onClick={() => createSubsection('Final delivery', 'self-reflection', null, setCreateCourseSectionsList, sectionToEdit, 'task', context, sectionTask)} className='pl-3 mx-3 ml-auto'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#45406f] ">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            <div className='flex items-center p-5 mt-5 border rounded-xl bg-gray-50'>
                <div className='px-3 py-3 bg-[#dc2626] rounded-md flex items-center justify-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </div>
                <div className='ml-5'>
                    <p className='text-base font-normal'>Self-assessment</p>
                    <p className='text-sm font-normal text-gray-500'>
                        Self-assessment is a process that allows students to reflect on their learning, identify areas of strength and weakness, and set goals for improvement. It is an essential skill for lifelong learning and personal development.</p>
                </div>
                <button onClick={() => createSubsection('Self-assesment', 'self-reflection', null, setCreateCourseSectionsList, sectionToEdit, 'selfAssessment', context, SelfAssessmentData)} className='pl-3 mx-3 ml-auto'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#45406f] ">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            <div className='flex items-center p-5 mt-5 border rounded-xl bg-gray-50'>
                <div className='px-3 py-3 bg-[#dc2626] rounded-md flex items-center justify-center '>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                        <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                    </svg>
                </div>
                <div className='ml-5'>
                    <p className='text-base font-normal'>Custom field</p>
                    <p className='text-sm font-normal text-gray-500'>Add a custom field if you need to introduce any theorical subsection between phases.</p>
                </div>
                <button onClick={() => createSubsection('Custom field', 'self-reflection', null, setCreateCourseSectionsList, sectionToEdit, 'task', context, sectionTask)} className='pl-3 mx-3 ml-auto'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#45406f]">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </>
    )
}
