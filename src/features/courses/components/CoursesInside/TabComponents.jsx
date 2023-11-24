import { TaskComponentCard } from "../CreateCourses/CourseConfirmation/TaskComponentCard";
import ReactMarkdown from "react-markdown";
import { Empty } from "antd";
import { useNavigate } from "react-router-dom";

export const CourseContent = ({ courseContentInformation, courseSection, courseSubsection, courseId }) => {
    const section_ = courseContentInformation.find(
        (seccion) => seccion.attributes.title === courseSection
    );
    const subsection_ = section_.attributes.subsections.data.find(
        (subseccion) =>
            subseccion.attributes.title === courseSubsection.attributes.title
    );
    return (
        <>
            <p className='text-xs font-normal text-gray-400 mb-1'>Activity</p>
            <hr className='mb-5' />
            <TaskComponentCard task={subsection_.attributes.activities.data[0]} context={'coursesInside'} courseId={courseId} />
            <p className='text-xs font-normal text-gray-400 mb-1'>Course content</p>
            <hr className='mb-5' />
            <div className='prose max-w-none mb-12'>
                <ReactMarkdown>{subsection_.attributes.content}</ReactMarkdown>
            </div>
        </>

    )
}

export const CourseFiles = ({ courseContentInformation, courseSection, courseSubsection }) => {

    const downloadFile = async (file) => {
        try {
            const response = await fetch(file.url);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                console.error('Error al descargar el archivo');
            }
        } catch (error) {
            console.error('Error en la descarga: ', error);
        }
    };

    const section_ = courseContentInformation.find(
        (seccion) => seccion.attributes.title === courseSection
    );
    const subsection_ = section_.attributes.subsections.data.find(
        (subseccion) =>
            subseccion.attributes.title === courseSubsection.attributes.title
    );

    return (
        <div className='w-full flex flex-row items-center space-x-8'>
            <div className='w-full mr-5'>
                <ul className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                    {subsection_.attributes.files.data.map((file) => (
                        <li key={file.id} className="col-span-1 flex rounded-md shadow-sm" >
                            <div
                                className='bg-indigo-500 flex-shrink-0 flex items-center justify-center w-16  text-white text-sm font-medium rounded-l-md'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
                                    <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                                </svg>
                            </div>
                            <div className="flex flex-1 items-center justify-between  rounded-r-md border-t border-r border-b border-gray-200 bg-white">
                                <div className="flex-1 truncate px-4 py-2 text-sm">
                                    <p className="font-medium text-gray-900 hover:text-gray-600">
                                        {file.attributes.name}
                                    </p>
                                    <p className="text-gray-500">{file.attributes.size} b</p>
                                </div>
                                <div className="flex-shrink-0 pr-2">
                                    <button
                                        type="button"
                                        onClick={() => downloadFile(file.attributes)}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        <span className="sr-only">Open options</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div >
    )
}

export const CourseParticipants = ({ students }) => {
    const navigate = useNavigate()

    if (students.data.length === 0) {
        return <Empty />;
    } else {
        return (
            <div className="flex space-x-8">
                {students.data.map((student) => (
                    <button
                        key={student.id}
                        className="bg-white rounded flex p-3 items-center space-x-3 shadow w-[14rem]"
                        onClick={() => navigate(`/app/profile/${student.id}/`)}
                    >
                        <img
                            src={student.attributes.profile_photo.data.attributes.url}
                            alt=""
                            className="rounded w-14 h-14"
                        />
                        <p className="font-medium">{student.attributes.name}</p>
                    </button>
                ))}
            </div>
        );
    }
}