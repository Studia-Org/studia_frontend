import React, { useEffect, useRef, useState } from "react";
import { TaskComponentCard } from "../CreateCourses/CourseConfirmation/TaskComponentCard";
import ReactMarkdown from "react-markdown";
import { Empty, Button, message, DatePicker } from "antd";
import { AvatarGroup, Avatar } from 'rsuite';
import MDEditor from "@uiw/react-md-editor";
import '@mdxeditor/editor/style.css'
import { API } from "../../../../constant";
import { getToken } from "../../../../helpers";
import { FiChevronRight } from "react-icons/fi";
import { MoonLoader } from "react-spinners";
import './participants.css'
import { useCourseContext } from "../../../../context/CourseContext";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { id } from "date-fns/locale";


export const CourseContent = ({ setForumFlag, courseId, enableEdit, setEnableEdit, titleSubsection, backgroundPhotoSubsection }) => {
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const {
        course,
        sectionSelected,
        subsectionSelected,
        idSectionSelected,
        setCourse,
    } = useCourseContext();
    let section_ = course.sections.data.find(
        (seccion) => seccion.id === idSectionSelected
    );
    if (section_ == undefined) {
        section_ = course.sections.data.find(
            (seccion) => seccion.attributes.title === sectionSelected
        );
    }
    const subsection_ = section_?.attributes.subsections.data.find(
        (subseccion) =>
            subseccion?.id === subsectionSelected?.id
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
            setCourse([...course.sections.data.map((section) => {
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
        window.location.reload();
        setLoading(false);
    }

    return (
        <>
            <p className='mb-1 text-xs font-normal text-gray-400'>{t("COURSEINSIDE.activity")}</p>
            <hr className='mb-5' />
            <TaskComponentCard task={subsection_?.attributes.activity?.data} context={'coursesInside'} courseId={courseId} setForumFlag={setForumFlag} />
            <p className='mb-1 text-xs font-normal text-gray-400'>{t("COURSEINSIDE.course_content")}</p>
            <hr className='mb-5' />
            <div className='mb-12 prose break-words max-w-none '>
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
                                {t("COMMON.save_changes")}
                            </Button>
                        </div>
                }
            </div>
        </>

    )
}

export const CourseFiles = ({ enableEdit }) => {
    const { t } = useTranslation();
    const {
        course,
        sectionSelected,
        subsectionSelected,
        setCourse,
    } = useCourseContext();

    const [fileUploadLoading, setFileUploadLoading] = useState(false);

    const section_ = course.sections.data.find(
        (seccion) => seccion.attributes.title === sectionSelected
    );
    const subsection_ = section_.attributes.subsections.data.find(
        (subseccion) =>
            subseccion.attributes.title === subsectionSelected.attributes.title
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

        setCourse([...course.sections.data.map((section) => {
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
                <p className="mb-4 text-xs text-gray-400">{t("COURSEINSIDE.files_professor")}</p>
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
                                    <div className="p-5 bg-white rounded-md border border-[#DADADA]">
                                        <Empty
                                            className="mt-5"
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                            description={
                                                <span>
                                                    {t("COURSEINSIDE.no_files")}
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

export const SubsectionsSettings = ({ course, courseSection, courseSubsection, students, dateSubsection, setDateSubsection, setCourse }) => {

    const [settingSelected, setSettingSelected] = useState(null);
    const { t } = useTranslation();
    const { RangePicker } = DatePicker;

    const settings = {
        "complete_uncomplete": <CompleteUncompleteSubsection courseSubsection={courseSubsection} students={students} setSettingSelected={setSettingSelected} />,
    }
    if (settingSelected) {
        return settings[settingSelected]
    }
    const CardSettings = ({ title, svg, onClick }) => {
        return (
            <article onClick={onClick}
                className="mt-4 overflow-hidden border border-[#DADADA] col-span-1 transform hover:scale-[1.01] duration-150 bg-white rounded-md gap-x-2 p-5 h-[5rem]  flex items-center cursor-pointer">
                {svg}
                <p className="break-words text-ellipsis">{title}</p>
            </article>
        )
    }

    const SVGCompleteUncomplete = () => (
        <svg fill="currentColor" viewBox="0 0 16 16" height="1.5rem" width="1.5rem">
            <path d="M2 10h3a1 1 0 011 1v3a1 1 0 01-1 1H2a1 1 0 01-1-1v-3a1 1 0 011-1zm9-9h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V2a1 1 0 011-1zm0 9a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1v-3a1 1 0 00-1-1h-3zm0-10a2 2 0 00-2 2v3a2 2 0 002 2h3a2 2 0 002-2V2a2 2 0 00-2-2h-3zM2 9a2 2 0 00-2 2v3a2 2 0 002 2h3a2 2 0 002-2v-3a2 2 0 00-2-2H2zm7 2a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2h-3a2 2 0 01-2-2v-3zM0 2a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2H2a2 2 0 01-2-2V2zm5.354.854a.5.5 0 10-.708-.708L3 3.793l-.646-.647a.5.5 0 10-.708.708l1 1a.5.5 0 00.708 0l2-2z" />
        </svg>
    )
    async function handleDateChange(date, dateString) {
        dateString = dateString.map(date => dayjs(date).format('YYYY-MM-DDTHH:mm:ssZ'))

        const response = await fetch(`${API}/subsections/${courseSubsection.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`
            },
            body: JSON.stringify({
                data: {
                    start_date: dateString[0],
                    end_date: dateString[1],
                }
            })
        })

        const response2 = await fetch(`${API}/activities/${courseSubsection?.attributes?.activity?.data.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`
            },
            body: JSON.stringify({
                data: {
                    start_date: dateString[0],
                    deadline: dateString[1],

                }
            })
        })


        if (response.ok && response2.ok) {
            const copyCourse = { ...course }

            const section_ = course.sections.data.find((seccion) => seccion.attributes.title === courseSection);
            const sectionIndex = copyCourse.sections.data.findIndex((seccion) => seccion.id === section_.id)
            const subsectionIndex = copyCourse.sections.data[sectionIndex].attributes.subsections.data.findIndex((subseccion) => subseccion.id === courseSubsection.id)
            copyCourse.sections.data[sectionIndex].attributes.subsections.data[subsectionIndex].attributes.start_date = dateString[0]
            copyCourse.sections.data[sectionIndex].attributes.subsections.data[subsectionIndex].attributes.end_date = dateString[1]

            setCourse(copyCourse)

            message.success(t("ACTIVITY.changed_saved_success"))
        }
    }

    return (
        <div className="grid grid-cols-2 gap-x-24">
            <CardSettings
                title={t("COURSEINSIDE.SUB_SETTINGS.complete_uncomplete_subsection")}
                svg={<SVGCompleteUncomplete />}
                onClick={() => setSettingSelected("complete_uncomplete")}
            />

            <article className="flex flex-col items-center bg-white border border-[#DADADA] gap-y-5 rounded-md p-5 mt-4 ">
                <h3 className="text-lg font-medium ">{t("COURSEINSIDE.SUB_SETTINGS.date")}</h3>
                <RangePicker
                    value={!dayjs(dateSubsection[0]).isValid() || !dayjs(dateSubsection[1]).isValid() ? undefined :
                        [dayjs(dateSubsection[0]), dayjs(dateSubsection[1])]}
                    showTime
                    className="w-full"
                    clearIcon={null}
                    onChange={(value, dateString) => { setDateSubsection(dateString) }}
                />
                <Button onClick={() => handleDateChange(null, dateSubsection)} type="primary">
                    {t("COMMON.save_changes")}
                </Button>
            </article>
        </div>
    )
}


export const CompleteUncompleteSubsection = ({ courseSubsection, students, setSettingSelected }) => {
    const [loading, setLoading] = useState(true);
    const [fetchLoading, setFetchLoading] = useState(false);
    const { t } = useTranslation();

    const studentsCompletedRef = useRef();
    const studentsNotCompletedRef = useRef();
    const [studentsCompleted, setStudentsCompleted] = useState([])
    const [studentsNotCompleted, setStudentsNotCompleted] = useState([])


    useEffect(() => {
        fetch(`${API}/subsections/${courseSubsection.id}?populate[users_who_completed][populate][profile_photo]=url`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }).then((response) => response.json())
            .then((data) => {
                setStudentsCompleted(data?.data?.attributes?.users_who_completed?.data)
                setStudentsNotCompleted(students?.data.filter(student => !data?.data?.attributes?.users_who_completed?.data?.some(user => user.id === student.id)))
                studentsCompletedRef.current = data?.data?.attributes?.users_who_completed?.data
                studentsNotCompletedRef.current = students?.data.filter(student => !data?.data?.attributes?.users_who_completed?.data?.some(user => user.id === student.id))
                setLoading(false)
            })
    }, [])

    async function saveChanges() {
        try {
            setFetchLoading(true)
            const result = await fetch(`${API}/subsections/${courseSubsection.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({
                    data: { users_who_completed: studentsCompletedRef.current.map(student => student.id) }
                })
            })
            if (result.ok) {
                message.success(t("ACTIVITY.changed_saved_success"))
            }
            else {
                message.success(t("ACTIVITY.changed_saved_error"))
            }
        } catch (error) {

        } finally {
            setFetchLoading(false)
        }
    }

    return (
        <>
            <Button type='primary'
                className="flex flex-wrap items-center gap-1 font-bold text-white duration-200 bg-blue-500 w-fit hover:-translate-x-2 hover:bg-blue-700 "
                onClick={() => setSettingSelected(null)}>
                <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                {t("COURSEINSIDE.SUB_SETTINGS.back_to_settings")}
            </Button>
            <div className="p-4 pb-0 mt-2 bg-white border border-[#DADADA] rounded-lg min-h-[calc(100vh-25rem)] relative  ">
                {loading && <div className="flex items-center justify-center w-full min-h-[calc(100vh-25rem)]"><MoonLoader size={72} color={"#3730a3"} /></div>}
                {!loading &&
                    <>
                        <main className="flex max-h-[calc(100vh-25rem)] min-h-[calc(100vh-25rem)] overflow-y-scroll">

                            <section className="w-[calc(50%-0.5rem)]">
                                <div className="flex items-center">
                                    <h3 className="text-lg font-medium ">{t("COURSEINSIDE.SUB_SETTINGS.participants_completed") + " (" + studentsCompletedRef.current.length + ")"}</h3>
                                </div>
                                <input id="search_completed" type="text" placeholder={t("COMMON.search_students")} className=" px-2 border border-[#DADADA] rounded-md w-5/6 mt-3"
                                    onChange={(e) => {
                                        if (e.target.value === '') {
                                            setStudentsCompleted(studentsCompletedRef.current)
                                            return
                                        }
                                        setStudentsCompleted(studentsCompletedRef.current.filter(user => user.attributes.name.toLowerCase().includes(e.target.value.toLowerCase())))
                                    }}
                                />
                                <p className="mt-2">{t("COURSEINSIDE.SUB_SETTINGS.select_students_to_not_complete")}</p>
                                <ul id="completed-list" className="relative flex flex-col justify-start mt-5 ">
                                    {studentsCompleted?.length !== 0 &&
                                        <Button className="absolute right-[2%] top-0" disabled={studentsCompleted.length !== studentsCompletedRef.current.length}
                                            onClick={() => {
                                                setStudentsNotCompleted([...studentsNotCompleted, ...studentsCompleted])
                                                setStudentsCompleted([])
                                                studentsNotCompletedRef.current = [...studentsNotCompleted, ...studentsCompleted]
                                                studentsCompletedRef.current = []
                                                document.getElementById('search_completed').value = ''
                                                document.getElementById('search_not_completed').value = ''


                                            }}
                                        >{t("COURSEINSIDE.SUB_SETTINGS.select_all")}
                                        </Button>
                                    }
                                    {studentsCompleted?.map(user => {
                                        return (
                                            <li onClick={() => {
                                                const newStudentsCompleted = studentsCompletedRef.current.filter(student => student.id !== user.id)
                                                const newStudentsNotCompleted = [user, ...studentsNotCompleted]
                                                setStudentsCompleted(newStudentsCompleted)
                                                setStudentsNotCompleted(newStudentsNotCompleted)
                                                studentsCompletedRef.current = newStudentsCompleted
                                                studentsNotCompletedRef.current = newStudentsNotCompleted
                                                document.getElementById('search_not_completed').value = ''
                                                document.getElementById('search_completed').value = ''
                                            }}
                                                className="flex items-center gap-x-2 cursor-pointer mb-1 p-[2px] border border-transparent hover:border-gray-500 w-3/5 overflow-y-hidden rounded-md" id={user.id} key={user.id}>
                                                <Avatar
                                                    circle
                                                    size="md"
                                                    src={user.attributes.profile_photo?.data?.attributes?.url}
                                                    alt={user.attributes.username}
                                                    className="w-8 h-8 min-h-[2rem] min-w-[2.5rem] object-cover"
                                                />
                                                <span className="pr-2 line-clamp-1 text-ellipsis ">{user.attributes.name}</span>
                                            </li>
                                        )
                                    })}
                                    {studentsCompleted?.length === 0 &&
                                        <div className="rounded-md  mx-12 mt-5 border border-[#DADADA]">
                                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("COURSEINSIDE.SUB_SETTINGS.all_not_completed")} />
                                        </div>
                                    }
                                </ul>
                            </section>
                            <div className="sticky border-r border-[#DADADA] inset-y-0 w-px left-1/2 transform -translate-x-1/2"></div>
                            <section className="w-[calc(50%+0.5rem)] pl-6 ">
                                <div className="flex items-center ">
                                    <h3 className="text-lg font-medium ">{t("COURSEINSIDE.SUB_SETTINGS.participants_not_completed") + " (" + studentsNotCompletedRef.current.length + ")"}</h3>
                                </div>
                                <input id="search_not_completed" type="text" placeholder={t("COMMON.search_students")} className="mt-3 px-2 border border-[#DADADA] rounded-md w-5/6"
                                    onChange={(e) => {
                                        if (e.target.value === '') {
                                            setStudentsNotCompleted(studentsNotCompletedRef.current)
                                            return
                                        }
                                        setStudentsNotCompleted(studentsNotCompletedRef.current.filter(user => user.attributes.name.toLowerCase().includes(e.target.value.toLowerCase())))
                                    }}
                                />
                                <p className="mt-2">{t("COURSEINSIDE.SUB_SETTINGS.select_students_to_complete")}</p>
                                <ul id="uncompleted-list" className="relative flex flex-col justify-start mt-5">
                                    {studentsNotCompleted?.length !== 0 &&
                                        <Button className="absolute right-[2%] top-0" disabled={studentsNotCompleted.length !== studentsNotCompletedRef.current.length}
                                            onClick={() => {
                                                setStudentsCompleted([...studentsCompleted, ...studentsNotCompleted])
                                                setStudentsNotCompleted([])
                                                studentsCompletedRef.current = [...studentsCompleted, ...studentsNotCompleted]
                                                studentsNotCompletedRef.current = []
                                                document.getElementById('search_completed').value = ''
                                                document.getElementById('search_not_completed').value = ''
                                            }}
                                        >{t("COURSEINSIDE.SUB_SETTINGS.select_all")}
                                        </Button>}
                                    {studentsNotCompleted?.map(user => {
                                        return (
                                            <li
                                                onClick={() => {
                                                    const newStudentsCompleted = [user, ...studentsCompleted]
                                                    const newStudentsNotCompleted = studentsNotCompletedRef.current.filter(student => student.id !== user.id)
                                                    setStudentsCompleted(newStudentsCompleted)
                                                    setStudentsNotCompleted(newStudentsNotCompleted)
                                                    studentsCompletedRef.current = newStudentsCompleted
                                                    studentsNotCompletedRef.current = newStudentsNotCompleted
                                                    document.getElementById('search_not_completed').value = ''
                                                    document.getElementById('search_completed').value = ''
                                                }}
                                                className="flex items-center gap-x-2 cursor-pointer mb-1 p-[2px] border border-transparent hover:border-gray-500 rounded-md w-3/5 overflow-y-hidden" id={user.id} key={user.id}>
                                                <Avatar
                                                    circle
                                                    size="md"
                                                    src={user.attributes.profile_photo?.data?.attributes?.url}
                                                    alt={user.attributes.username}
                                                    className="w-8 h-8 min-h-[2rem] min-w-[2rem] object-cover"
                                                />
                                                <span className="pr-2 line-clamp-1 text-ellipsis ">{user.attributes.name}</span>
                                            </li>
                                        )
                                    })}
                                    {studentsNotCompleted?.length === 0 &&
                                        <div className="rounded-md  mx-12 mt-5 border border-[#DADADA]">
                                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("COURSEINSIDE.SUB_SETTINGS.all_completed")} />
                                        </div>
                                    }
                                </ul>
                            </section>
                        </main>
                        <Button onClick={saveChanges} loading={fetchLoading} type="primary" className="absolute bottom-5 right-5">
                            {t("COMMON.save_changes")}
                        </Button>
                    </>
                }
            </div>
        </>
    )
}



export const CourseParticipantsClickable = ({ students, enableEdit, setSettingsFlag, setParticipantsFlag, setVisible, setForumFlag }) => {
    const { t } = useTranslation();
    if (students?.data?.length === 0) {
        return <div className="p-5 bg-white rounded-md shadow-md">
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='There are no other participants' />
        </div>;
    } else {
        return (
            <div className="p-5 mb-20 bg-white border border-[#DADADA] rounded-lg shadow-none xl:shadow-md xl:border-none">
                <div className="flex items-center">
                    <h3 className="text-lg font-medium ">{t("COURSEINSIDE.PARTICIPANTS.participants")}</h3>
                    <div className="flex items-center ml-auto duration-150 hover:translate-x-1">
                        <button
                            onClick={() => { setParticipantsFlag(true); setForumFlag(false); setSettingsFlag(false); if (setVisible) setVisible(false) }}
                            className="ml-auto text-base font-medium text-indigo-700 "
                        >
                            {t("COURSEINSIDE.PARTICIPANTS.view_participants")}
                        </button>
                        <FiChevronRight className="text-indigo-700" />
                    </div>
                </div>


                <div className="flex flex-col justify-start mt-3">
                    <AvatarGroup className="mt-4" stack>
                        {students?.data
                            ?.filter((user, i) => i < 10)
                            ?.map(user => {
                                return (
                                    <Avatar
                                        circle
                                        size="lg"
                                        key={user.id}
                                        src={user.attributes ?
                                            user.attributes.profile_photo?.data?.attributes?.url :
                                            user?.profile_photo?.url}
                                        alt={user.attributes ? user.attributes.username : user.username}

                                        style={{ width: '3rem', height: '3rem', fontSize: '1rem', fontWeight: '400', objectFit: 'cover' }}
                                        className="w-full h-full"
                                    />
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
                            <Button onClick={() => { setSettingsFlag(true); setParticipantsFlag(false); setSettingsFlag(false); if (setVisible) setVisible(false) }}
                                className="bg-indigo-500 rounded flex items-center shadow w-auto duration-150 px-2 h-[2.5rem] gap-2 mt-5 hover:bg-blue-500">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" />
                                </svg>
                                <p className="text-base font-medium text-white"> {t("COURSEINSIDE.PARTICIPANTS.add_student")}</p>
                            </Button>
                        )
                    }
                </div>
            </div>
        );
    }
}