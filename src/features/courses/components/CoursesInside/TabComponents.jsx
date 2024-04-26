import React, { useEffect, useState } from "react";
import { TaskComponentCard } from "../CreateCourses/CourseConfirmation/TaskComponentCard";
import ReactMarkdown from "react-markdown";
import { Empty, Button, message, Divider, Tooltip } from "antd";
import { AvatarGroup, Avatar } from 'rsuite';
import { useNavigate } from "react-router-dom";
import MDEditor, { image } from "@uiw/react-md-editor";
import '@mdxeditor/editor/style.css'
import { API } from "../../../../constant";
import { getToken } from "../../../../helpers";
import { FiChevronRight, FiCornerDownLeft } from "react-icons/fi";
import { MoonLoader } from "react-spinners";
import { sub } from "date-fns";



export const CourseContent = ({ setForumFlag, courseContentInformation, courseSection, courseSubsection, courseId, enableEdit, setEnableEdit, setCourseContentInformation, titleSubsection, backgroundPhotoSubsection }) => {
    const [loading, setLoading] = useState(false);
    const section_ = courseContentInformation.find(
        (seccion) => seccion.attributes.title === courseSection
    );
    const subsection_ = section_?.attributes.subsections.data.find(
        (subseccion) =>
            subseccion?.attributes.title === courseSubsection?.attributes.title
    );
    const [subsectionContent, setSubsectionContent] = useState(subsection_?.attributes?.content);

    useEffect(() => {
        setSubsectionContent(subsection_?.attributes?.content)
    }, [subsection_?.attributes?.content])
    const saveChanges = async () => {
        setLoading(true)
        let background_photo_id = null;
        if (backgroundPhotoSubsection) {
            const dataForm = new FormData();
            dataForm.append('files', backgroundPhotoSubsection);
            const response = await fetch(`${API}/upload/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${getToken()}`
                },
                body: dataForm
            })
            if (response.ok) {
                const data = await response.json();
                background_photo_id = data[0].id
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData);
                message.error('Something went wrong');
                setLoading(false);
            }
        }

        const response = await fetch(`${API}/subsections/${subsection_.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`
            },
            body: JSON.stringify({
                data: {
                    content: subsectionContent,
                    landscape_photo: background_photo_id,
                    title: titleSubsection,
                }
            })
        })
        if (response.ok) {
            setCourseContentInformation([...courseContentInformation.map((section) => {
                if (section.id === section_.id) {
                    return {
                        ...section,
                        attributes: {
                            ...section.attributes,
                            subsections: {
                                ...section.attributes.subsections,
                                data: [...section.attributes.subsections.data.map((subsection) => {
                                    if (subsection.id === subsection_.id) {
                                        return {
                                            ...subsection,
                                            attributes: {
                                                ...subsection.attributes,
                                                landscape_photo: backgroundPhotoSubsection,
                                                content: subsectionContent,
                                                title: titleSubsection,
                                            }
                                        }
                                    } else {
                                        return subsection
                                    }
                                })]
                            }
                        }
                    }
                } else {
                    return section
                }
            })])
            message.success('Course updated successfully');
            setEnableEdit(false)
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData);
            message.error('Something went wrong');
            setLoading(false);
        }
        setLoading(false);
    }

    return (
        <>
            <p className='mb-1 text-xs font-normal text-gray-400'>Activity</p>
            <hr className='mb-5' />
            <TaskComponentCard task={subsection_?.attributes.activity?.data} context={'coursesInside'} courseId={courseId} setForumFlag={setForumFlag} />
            <p className='mb-1 text-xs font-normal text-gray-400'>Course content</p>
            <hr className='mb-5' />
            <div className='mb-12 prose max-w-none'>
                {
                    !enableEdit
                        ?
                        subsection_?.attributes?.content ?
                            <ReactMarkdown>{subsection_?.attributes?.content}</ReactMarkdown>
                            :
                            <div className="p-5 bg-white rounded-md shadow-md">
                                <Empty className="mt-10" image={Empty.PRESENTED_IMAGE_SIMPLE} description={'There is no content'} />
                            </div>
                        :
                        <div className="flex flex-col">
                            <MDEditor height="30rem" className='mt-2 mb-8' data-color-mode='light' onChange={setSubsectionContent} value={subsectionContent} />
                            <Button onClick={() => saveChanges()} type="primary" loading={loading} className="inline-flex justify-center px-4 ml-auto text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Save Changes
                            </Button>
                        </div>
                }
            </div>
        </>

    )
}

export const CourseFiles = ({ courseContentInformation, courseSection, courseSubsection, enableEdit, setCourseContentInformation }) => {
    const [fileUploadLoading, setFileUploadLoading] = useState(false);
    const section_ = courseContentInformation.find(
        (seccion) => seccion.attributes.title === courseSection
    );
    const subsection_ = section_.attributes.subsections.data.find(
        (subseccion) =>
            subseccion.attributes.title === courseSubsection.attributes.title
    );
    const [files, setFiles] = useState(subsection_.attributes.files?.data);


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

    async function handleFileChange(e) {
        setFileUploadLoading(true)
        let fileId = null;
        let allFiles = []
        let fileAttributes = null;
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('files', file);

        await fetch(`${API}/upload/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${getToken()}`
            },
            body: formData
        })
            .then((response) => response.json())
            .then((data) => {
                fileId = data[0].id
                fileAttributes = data[0]
                const fileObject = {
                    id: fileId,
                    attributes: fileAttributes
                }
                if (files) {
                    setFiles([...files, fileObject])
                }
                else {
                    setFiles([fileObject])
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        if (subsection_?.attributes?.files?.data !== null) {
            allFiles = subsection_?.attributes?.files?.data?.map((file) => file.id)
        }

        allFiles.push(fileId)
        await fetch(`${API}/subsections/${subsection_.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`
            },
            body: JSON.stringify({ data: { files: allFiles } })
        })

        setCourseContentInformation([...courseContentInformation.map((section) => {
            if (section.id === section_.id) {
                return {
                    ...section,
                    attributes: {
                        ...section.attributes,
                        subsections: {
                            ...section.attributes.subsections,
                            data: (section.attributes.subsections && section.attributes.subsections.data)
                                ? [...section.attributes.subsections.data.map((subsection) => {
                                    if (subsection.id === subsection_.id) {
                                        return {
                                            ...subsection,
                                            attributes: {
                                                ...subsection.attributes,
                                                files: {
                                                    ...subsection.attributes.files,
                                                    data: [...(subsection.attributes.files && subsection.attributes.files.data)
                                                        ? subsection.attributes.files.data.concat({ id: fileId, attributes: fileAttributes })
                                                        : [{ id: fileId, attributes: fileAttributes }]
                                                    ]
                                                }
                                            }
                                        };
                                    } else {
                                        return subsection;
                                    }
                                })]
                                : []
                        }
                    }
                };
            } else {
                return section;
            }
        })]);

        message.success('File uploaded successfully');
        setFileUploadLoading(false)

    }

    return (
        <div className='flex flex-row items-center w-full space-x-8'>

            <div className='w-full mr-5'>
                <p className="mb-4 text-xs text-gray-400">These files are uploaded by the professor if it's necessary for this subsection.</p>
                {
                    files?.length > 0 ?
                        (
                            <ul className="flex flex-wrap items-center gap-5 mt-3">
                                {files?.map((file) => (
                                    <li key={file.id} className="flex rounded-md shadow-sm " >
                                        <div
                                            className='flex items-center justify-center px-4 text-sm font-medium text-white bg-indigo-500 rounded-l-md'>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                                <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
                                                <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                                            </svg>
                                        </div>
                                        <div className="flex items-center justify-between flex-1 bg-white border-t border-b border-r border-gray-200 rounded-r-md">
                                            <div className="flex-1 px-4 py-2 text-sm truncate">
                                                <p className="font-medium text-gray-900 hover:text-gray-600">
                                                    {file.attributes.name.length > 30
                                                        ? `${file.attributes.name.slice(0, 30)}...`
                                                        : file.attributes.name}
                                                </p>
                                                <p className="text-gray-500">{file.attributes.size} b</p>
                                            </div>
                                            <div className="pr-2">
                                                <button
                                                    type="button"
                                                    onClick={() => downloadFile(file.attributes)}
                                                    className="inline-flex items-center justify-center w-8 h-8 text-gray-400 bg-transparent bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
                                {
                                    enableEdit && (
                                        <li className="flex rounded-md items-center justify-center bg-indigo-500 text-white text-sm w-[3rem] h-[3rem] font-medium duration-100 hover:scale-105 cursor-pointer">
                                            <label htmlFor="avatar" className="relative flex items-center gap-3 file-input-label">
                                                <div className="absolute flex items-center justify-center cursor-pointer" style={{ width: '100%', height: '100%' }}>
                                                    {
                                                        fileUploadLoading && (
                                                            <MoonLoader size={25} color={"#ffffff"} className="cursos-pointer" />
                                                        )
                                                    }
                                                </div>
                                                <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" style={{ display: 'none' }} onChange={handleFileChange} />
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 cursor-pointer">
                                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                                                </svg>
                                            </label>
                                        </li>
                                    )
                                }
                            </ul>
                        )
                        :
                        (
                            enableEdit ? (
                                <div className="flex rounded-md items-center justify-center bg-indigo-500 text-white text-sm w-[3rem] h-[3rem] font-medium duration-100 hover:scale-105 cursor-pointer">

                                    <label htmlFor="avatar" className="relative flex items-center gap-3 file-input-label">
                                        <div className="absolute flex items-center justify-center cursor-pointer" style={{ width: '100%', height: '100%' }}>
                                            {
                                                fileUploadLoading && (
                                                    <MoonLoader size={25} color={"#ffffff"} className="cursos-pointer" />
                                                )
                                            }
                                        </div>
                                        <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" style={{ display: 'none' }} onChange={handleFileChange} />
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 cursor-pointer">
                                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                                        </svg>
                                    </label>
                                </div>
                            ) :
                                (
                                    <div className="p-5 bg-white rounded-md shadow-md">
                                        <Empty
                                            className="mt-5"
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                            description={
                                                <span>
                                                    There are no files
                                                </span>
                                            }
                                        />
                                    </div>
                                )

                        )
                }

            </div >
        </div >
    )
}


export const CourseParticipantsClickable = ({ students, enableEdit, setSettingsFlag, setParticipantsFlag, setVisible, setForumFlag }) => {
    console.log(students)

    if (students.data.length === 0) {
        return <div className="p-5 bg-white rounded-md shadow-md">
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='There are no other participants' />
        </div>;
    } else {
        return (
            <div className="p-5 bg-white border-2 border-gray-500 border-solid rounded-lg shadow-lg xl:border-none">
                <div className="flex items-center">
                    <h3 className="text-lg font-medium ">Participants</h3>
                    <div className="flex items-center ml-auto duration-150 hover:translate-x-1">
                        <button
                            onClick={() => { setParticipantsFlag(true); setForumFlag(false); if (setVisible) setVisible(false) }}
                            className="ml-auto text-base font-medium text-indigo-700 "
                        >
                            View all participants
                        </button>
                        <FiChevronRight className="text-indigo-700" />
                    </div>
                </div>


                <div className="flex flex-col items-center mt-3  max-h-[700px] overflow-y-auto overflow-x-hidden">
                    <AvatarGroup stack>
                        {students.data
                            .filter((user, i) => i < 10)
                            .map(user => {
                                return (
                                    <Avatar
                                        circle
                                        key={user.id}
                                        src={user.attributes ?
                                            user.attributes.profile_photo?.data?.attributes?.url :
                                            user?.profile_photo?.url}
                                        alt={user.attributes ? user.attributes.username : user.username}
                                        className="w-full h-full"
                                        style={{ width: '3rem', height: '3rem' }} />
                                )
                            })}
                        {students.data.length > 10 && (
                            <Avatar circle style={{ background: '#3730a3', width: '3rem', height: '3rem', fontSize: '1rem', fontWeight: '400' }}>
                                +{students.data.length - 10}
                            </Avatar>
                        )}
                    </AvatarGroup>

                    {
                        enableEdit && (
                            <button onClick={() => setSettingsFlag(true)}
                                className="bg-indigo-500 rounded flex items-center shadow w-auto duration-150 px-2 h-[2.5rem] gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" />
                                </svg>
                                <p className="font-medium text-white">Add student</p>
                            </button>
                        )
                    }
                </div>
            </div>
        );
    }
}