import { useEffect, useState } from 'react'
import { ProfessorData } from '../CoursesInside/ProfessorData';
import { getToken } from '../../../../helpers';
import ReactMarkdown from 'react-markdown';
import { API } from '../../../../constant';
import { useAuthContext } from '../../../../context/AuthContext';
import { useParams } from "react-router-dom";
import 'filepond/dist/filepond.min.css';
import '../..//styles/filepondStyles.css'
import { registerPlugin } from 'react-filepond';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import Swal from 'sweetalert2';
import ObjectivesTags from './ObjectivesTag';
import ActivityTitle from './Components/ActivityTitle';
import { BackButton } from './Components/BackToCourse';
import { Empty, Button, message, Popconfirm } from 'antd';
import MDEditor from '@uiw/react-md-editor';
import { SwitchEdit } from '../CoursesInside/SwitchEdit';
import GroupMembers from './Components/GroupMembers.jsx';
import useGetGroup from './hooks/useGetGroup.jsx';
import CreateGroups from './Components/CreateGroups.jsx';
import { RecordAudio } from './Components/ThinkAloud/RecordAudio';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import { TaskFiles } from './Components/TaskFiles.jsx';
import { UploadFiles } from '../CreateCourses/CourseSections/UploadFiles.jsx';
import { BreadcrumbCourse } from '../CoursesInside/BreadcrumbCourse.jsx';
import { useCourseContext } from '../../../../context/CourseContext.js';
import { useTranslation } from 'react-i18next';
import { ProfessorThinkAloud } from './Components/ActivityTask/ProfessorThinkAloud.jsx';
import { create } from 'filepond';
registerPlugin(FilePondPluginFileValidateSize);
registerPlugin(FilePondPluginImagePreview);

export const ActivityComponent = ({ activityData, idQualification, setUserQualification, userQualification, subsectionsCompleted }) => {
  const [uploadMode, setUploadMode] = useState('record')
  const [filesUploaded, setFilesUploaded] = useState(activityData?.file?.data || []);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [title, setTitle] = useState(activityData.activity.data.attributes.title)
  const [subsectionContent, setSubsectionContent] = useState(activityData.activity.data.attributes.description);
  const [loading, setLoading] = useState(false);
  const [enableEdit, setEnableEdit] = useState(false);
  const evaluated = activityData.qualification ? true : false;
  const type = activityData?.activity?.data?.attributes?.type;
  const audioUser = activityData?.file?.data ? activityData?.file?.data[0]?.attributes : null;
  const [audioFile, setAudioFile] = useState(audioUser);
  const { user } = useAuthContext();
  const { t } = useTranslation();

  const { course } = useCourseContext();

  const [fileList, setFileList] = useState(
    activityData?.file?.data?.map((file) => ({
      ...file.attributes,
      IdFromBackend: file.id
    })) || []
  );

  //las files que se muestran en la actividad subidas por el professor
  const [activityFiles, setActivityFiles] = useState(
    activityData?.activity?.data?.attributes?.file?.data?.map((file) => ({
      ...file.attributes,
      IdFromBackend: file.id
    })) || []
  );

  //las files que hay en el edit mode subidas por el professor
  const [filesTask, setFilesTask] = useState(
    activityData?.activity?.data?.attributes?.file?.data?.map((file) => ({
      ...file.attributes,
      IdFromBackend: file.id
    })) || []
  );

  let { activityId, courseId } = useParams();
  const isActivityEvaluable = activityData?.activity?.data?.attributes.evaluable
  const USER_OBJECTIVES = [...new Set(user?.user_objectives?.map((objective) => objective.categories.map((category) => category)).flat() || [])];
  const passedDeadline = activityData?.activity?.data?.attributes?.deadline ? new Date(activityData?.activity?.data?.attributes?.deadline) < new Date() : false;
  const [createGroups, setCreateGroups] = useState(false);
  const [IDQualification, setIDQualification] = useState(idQualification);
  const { activityGroup, loadingGroup } = useGetGroup({ user, activityData, activityId, IDQualification });
  const isActivityGroup = activityData?.activity?.data?.attributes?.groupActivity;
  const isThinkAloud = activityData.activity.data.attributes.type === 'thinkAloud'

  useEffect(() => {
    setSubsectionContent(activityData.activity.data.attributes.description);
    setTitle(activityData.activity.data.attributes.title);
  }, [enableEdit])

  const sameUpload = (
    filesUploaded.length === fileList.length &&
    filesUploaded.every((file, index) => file.id === fileList[index].IdFromBackend)
  );

  async function saveChanges() {
    setLoading(true);
    const formData = new FormData();
    let filesId = [];
    try {
      if (filesTask.length > 0) {
        // Verificar si algún archivo en filesTask tiene el atributo originFileObj
        const hasOriginFileObj = filesTask.some(file => file.originFileObj);

        if (hasOriginFileObj) {
          filesTask.forEach((file) => {
            if (file.originFileObj) {
              formData.append('files', file.originFileObj);
            }
          });

          const uploadFiles = await fetch(`${API}/upload`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
            body: formData,
          });

          if (uploadFiles.ok) {
            const result = await uploadFiles.json();
            filesId = result.map((file) => file.id);
          }

          if (activityFiles !== null) {
            filesId = filesId.concat(activityFiles.map((file) => file.IdFromBackend));
          }

          // Eliminar IDs duplicados usando un Set
          filesId = [...new Set(filesId)];
        } else {
          filesId = filesTask.map((file) => file.IdFromBackend);
        }
      }

      const response = await fetch(`${API}/activities/${activityId}?populate[file][fields][0]=*`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          data: {
            description: subsectionContent,
            title: title,
            file: filesId,
          }
        }),
      });
      if (response.ok) {
        const result = await response.json();
        setUserQualification({ ...activityData, activity: { activity: result } });
        setEnableEdit(false);
        setActivityFiles(
          result.data.attributes.file?.data?.map((file) => ({
            ...file.attributes,
            IdFromBackend: file.id
          })) || []
        )
        message.success(t("ACTIVITY.changed_saved_success"));
      }
      else throw new Error(t("ACTIVITY.changed_saved_error"));
    } catch (error) {
      await fetch(`${API}/upload`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: {
          files: filesId,
        },
      });
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function sendFile(result, fileListIds) {
    try {

      let files = []

      //files = filesUploaded.map((file) => file.id);
      files = files.concat(result?.map((file) => file?.id));
      files = files.concat(fileListIds);

      //eliminamos undefined si hay
      files = files.filter((file) => file !== undefined);
      const qualificationData = {
        data: {
          activity: activityId,
          file: isThinkAloud ? result[0]?.id : files,
          user: user.id, //TODO CHANGE IF ITS ITS ACTIVITY GROUP AND IT DOES NOT HAVE A GROUP
          delivered: true,
          delivered_data: new Date(),
        }
      };
      if (activityGroup !== null) {
        qualificationData.data.group = activityGroup.id;
      }
      else {
        qualificationData.data.user = user.id;
      }
      if ((activityData.delivered || IDQualification) && !evaluated) {
        const response2 =
          await fetch(`${API}/qualifications/${IDQualification}`, {
            method: 'PUT',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(qualificationData),
          });
        return { response_upload: response2 };
      }
      else if (!evaluated) {
        const response =
          await fetch(`${API}/qualifications`, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(qualificationData),
          });
        if (!response.ok) return response;
        let jsonresponse = await response.json();
        setIDQualification(jsonresponse.data.id);
        return { response_upload: response, json: jsonresponse };
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function sendData() {
    try {
      const fileListIds = []
      const formData = new FormData();

      fileList.forEach((file) => {
        if (file?.originFileObj) {
          formData.append('files', file.originFileObj);
        } else {
          fileListIds.push(file.IdFromBackend)
        }
      });
      const isThinkAloud = (activityData.activity.data.attributes.type === 'thinkAloud' && formData.getAll('files').length === 0)
      const isBlob = audioFile instanceof Blob;
      const formDataAudio = new FormData();
      if (audioFile) {
        formDataAudio.append('files', audioFile);
      }
      setUploadLoading(true);
      if (formData.getAll('files').length === 0 && !isThinkAloud && fileListIds.length === 0) {
        message.error(t("ACTIVITY.no_files"))
        setUploadLoading(false);
        return

        // Caso en el que el usuario haya eliminado un archivo de los que había subido
      } else if (formData.entries().next().done && fileListIds.length !== 0) {
        Swal.fire({
          title: t("ACTIVITY.swal_change_files.title"),
          text: t("ACTIVITY.swal_change_files.text"),
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: t("ACTIVITY.swal_change_files.confirm"),
          cancelButtonText: t("ACTIVITY.swal_change_files.cancel")
        }).then((result) => {
          if (result.isConfirmed) {
            sendFile(null, fileListIds)
          } else {
            setUploadLoading(false);
          }
        })

        return
      }


      const response = await fetch(`${API}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: (isThinkAloud && isBlob) ? formDataAudio : formData,
      });
      const result = await response.json();
      if (response.ok) {
        const { response_upload, json } = await sendFile(result, fileListIds);
        if (response_upload.ok) {
          if (isActivityGroup) {
            activityGroup.users.data.forEach((user) => {
              fetch(`${API}/users/${user.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                  subsections_completed: {
                    connect: [{ id: activityData.activity.data.attributes.subsection.data.id }]
                  }
                })
              })
            })
          }
          else {
            await fetch(`${API}/users/${user.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
              },
              body: JSON.stringify({
                subsections_completed: {
                  connect: [{ id: activityData.activity.data.attributes.subsection.data.id }]
                }
              })
            });
          }
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Files uploaded successfully',
          }).then(async (re) => {
            const parsedResults = result.map((file) => {
              return {
                id: file.id,
                attributes: {
                  ...file,
                }
              }
            })
            if (json) {
              setUserQualification({ ...userQualification, idQualification: json.data.id });
            }
            else {
              const data = await response_upload.json();
              setUserQualification({ ...userQualification, idQualification: data.data.id });
            }
            setFilesUploaded(prev => [...prev, ...parsedResults]);
          })
        }
        else throw new Error('Error uploading files');
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!, maybe your page is expired, we are going to reload it.',
        }).then((re) => {
          window.location.reload();
        });
      }

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message + ",  maybe your page is expired, we are going to reload it.",
      }).then((re) => {
        window.location.reload();
      });
    } finally {
      setUploadLoading(false);
    }
  }
  async function deleteFile(fileId) {
    setFilesTask((prev) => {
      const updatedFiles = prev.filter((file) => file.id !== fileId);
      return updatedFiles;
    });

    const reponse = await fetch(`${API}/upload/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      }
    })
    if (reponse.ok) {
      const result = await reponse.json();
      const filesFiltered =
        filesUploaded.filter((file) => file.id !== fileId);
      setFilesUploaded(filesFiltered);
      const activityFilesFiltered =
        activityFiles.filter((file) => file.IdFromBackend !== fileId);
      setActivityFiles(activityFilesFiltered);
      message.success(t("ACTIVITY.deleted_success"));
    }
    else message.error(t("ACTIVITY.smth_wrong"));
  }

  function DeleteButton({ id }) {
    return (
      <Popconfirm
        title={t("ACTIVITY.pop_confirm.title")}
        description={t("ACTIVITY.pop_confirm.description")}
        okText={t("ACTIVITY.pop_confirm.confirm")}
        cancelText={t("ACTIVITY.pop_confirm.cancel")}
        okType="danger"
        onConfirm={(e) => {
          e.stopPropagation();
          deleteFile(id);
        }}
        onCancel={(e) => {
          e.stopPropagation();
        }}
      >
        <svg
          onClick={(e) => {
            e.stopPropagation();
          }}
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" className="w-6 h-6">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
        </svg>
      </Popconfirm>
    )
  }

  function renderFiles(file, editable = false) {
    if (file.attributes) {
      return (
        <button key={file.id} onClick={() => downloadFile(file.attributes)}
          className='flex items-center w-full p-3 text-white duration-150 bg-green-700 rounded-md shadow-md gap-x-2 hover:bg-green-800 active:translate-y-1'>
          <span>{user.role_str === 'student' && editable && !evaluated && !passedDeadline ? <DeleteButton id={file.id} /> : ""}</span>
          <p className='max-w-[calc(100%-4rem)] overflow-hidden text-ellipsis'>{file.attributes.name}</p>
          <div className='ml-auto mr-2'>

            {
              enableEdit ?
                <DeleteButton id={file.id} />
                :
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
            }
          </div>
        </button>
      )
    } else {
      <button key={file.id} onClick={() => downloadFile(file)} className='flex w-full p-3 text-white duration-150 bg-green-700 rounded-md shadow-md active:translate-y-1 hover:bg-green-800'>
        <p className='max-w-[calc(100%-4rem)] overflow-hidden text-ellipsis'>{file.filenameWithoutExtension}</p>
        <div className='ml-auto mr-2'>
          {
            enableEdit ?
              <svg
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFile(file.id);
                }}
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
              </svg>
              :
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
          }
        </div>
      </button>
    }

  }

  const handleUploadMode = () => {
    if (uploadMode === 'record') {
      setUploadMode('upload')
    } else {
      setUploadMode('record')
    }
  }


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
        message.error(t("ACTIVITY.smth_wrong"));
      }
    } catch (error) {
      message.error(t("ACTIVITY.smth_wrong"));
    }
  };


  return (
    <div className='flex max-w-[calc(100vw)] flex-col 1.5xl:flex-row items-start 1.5xl:items-start 1.5xl:space-x-5 p-5 sm:p-10'>
      <>
        <div className={`${!createGroups ? "1.5xl:w-3/4 lg:w-10/12" : ""}  w-full `}>
          <BreadcrumbCourse />
          {
            createGroups &&
            <div className='mt-3'>
              <BackButton onClick={() => setCreateGroups(false)} text={t("ACTIVITY.go_back_activity")} />
            </div>
          }
          <ActivityTitle
            type={type}
            title={activityData.activity.data.attributes.title}
            evaluated={evaluated}
            qualification={activityData.qualification}
            setTitle={setTitle}
            titleState={title}
            enableEdit={enableEdit}
            passedDeadline={passedDeadline}
            userRole={user?.role_str}
          />
          {
            !createGroups &&
            <div className='flex items-center my-5'>
              {<ObjectivesTags USER_OBJECTIVES={USER_OBJECTIVES} categories={activityData?.activity.data.attributes.categories} />}
            </div>
          }
          {
            user.role_str === 'professor' && isThinkAloud ?
              <ProfessorThinkAloud activityData={activityData} />
              : createGroups ?
                <CreateGroups activityId={activityId} activityData={activityData} courseId={courseId} />
                :
                <>
                  {
                    (user.role_str === 'professor' || user.role_str === 'admin') &&
                    <div className='flex items-center ml-auto'>
                      <SwitchEdit enableEdit={enableEdit} setEnableEdit={setEnableEdit} />
                    </div>
                  }
                  {
                    evaluated &&
                    <section>
                      <p className='mt-5 mb-1 text-xs text-gray-400'>{t("ACTIVITY.comments")}</p>
                      <hr />
                      {
                        activityData.comments === null || activityData.comments === '' ?
                          <p className='mt-3'>{t("ACTIVITY.no_comments")}</p>
                          :
                          <p className='mt-3'>{activityData.comments}</p>
                      }

                    </section>
                  }
                  {
                    !enableEdit || user.role_str === 'student' ?
                      <TaskFiles files={activityFiles} />
                      :
                      <section className="!max-h-fit">
                        <p className='mt-8 mb-1 text-xs text-gray-600'>{t("ACTIVITY.task_files")}</p>
                        <hr className='mb-3' />
                        <UploadFiles fileList={filesTask} setFileList={setFilesTask} listType={'picture'} maxCount={10} />
                        <p className='mt-1 text-xs text-right text-gray-500 '>{t("ACTIVITY.remember_upload")}</p>
                      </section>
                  }
                  <p className='mt-5 mb-1 text-xs text-gray-600'>{t("ACTIVITY.task_description")}</p>
                  <hr />
                  <div className='my-3 text-gray-600 ml-5 max-w-[calc(100vw-1.25rem)] box-content mt-5 '>
                    {
                      !enableEdit ?
                        <div className='prose max-w-none'>
                          <ReactMarkdown>{activityData.activity.data.attributes.description}</ReactMarkdown>
                        </div>
                        :
                        <div className="flex flex-col">
                          <MDEditor height="30rem" className='mt-2 mb-8' data-color-mode='light' onChange={setSubsectionContent} value={subsectionContent} />
                          <Button onClick={() => saveChanges()} type="primary" loading={loading}
                            className="inline-flex justify-center px-4 ml-auto text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            {t("COMMON.save_changes")}
                          </Button>
                        </div>
                    }
                  </div>
                </>
          }

        </div>
        {
          (user.role_str === 'professor' || user.role_str === 'admin') && !createGroups ?
            isActivityGroup &&
            <Button type='primary' onClick={() => setCreateGroups(true)} >
              {t("ACTIVITY.create_groups_button")}
            </Button>
            :
            (evaluated || passedDeadline) && !(user.role_str === 'professor' || user.role_str === 'admin') ?
              <div className='flex flex-col max-w-[calc(100vw-1.25rem)]'>
                {
                  activityData.evaluator?.data && (
                    <>
                      <p className='mb-1 text-xs text-gray-400' >{t("ACTIVITY.evaluator")}</ p>
                      <div className='pl-1'>
                        <ProfessorData professor={activityData.evaluator.data} evaluatorFlag={true} />
                      </div>
                    </>

                  )
                }
                <p className='mt-5 mb-3 text-xs text-gray-600'>{t("ACTIVITY.your_submission")}</p>
                {
                  filesUploaded.length === 0 ?
                    <div className='bg-white mb-5 rounded-md shadow-md p-5 max-w-[calc(100vw-1.25rem)] w-[30rem]'>
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className='mt-6' description={
                        <span className='font-normal text-gray-400 '>
                          {t("ACTIVITY.not_files_submitted")}
                        </span>
                      } />
                    </div> :
                    <div className='flex flex-col p-5 bg-white rounded-md shadow-md mb-14 gap-y-3'>
                      {filesUploaded && filesUploaded.map(renderFiles)}
                    </div>
                }
                <GroupMembers activityGroup={activityGroup} loadingGroup={loadingGroup} />

              </div >
              :
              !createGroups &&
              <div className='flex flex-col w-[30rem] mt-1 max-w-[calc(100vw-2.5rem)]'>
                {
                  activityData.activity.data.attributes.type === 'thinkAloud' ?
                    <div className='mb-5 bg-white rounded-md shadow-md'>
                      <div className='flex items-center gap-5 mx-5 mt-5'>
                        <p className='text-xs text-gray-400 '>{t("ACTIVITY.click_microphone")}</p>

                        <Button onClick={() => handleUploadMode()} disabled={passedDeadline}>
                          {t("COMMON.switch_mode")}
                        </Button>
                      </div>
                      <hr className='mx-10 mt-5' />
                      {
                        uploadMode === 'record' ?
                          <>
                            <RecordAudio audioFile={audioFile} setAudioFile={setAudioFile} passedDeadline={passedDeadline} idQualification={idQualification}
                              setUserQualification={setUserQualification} />
                            <Button
                              loading={uploadLoading}
                              disabled={uploadLoading || (passedDeadline || evaluated)}
                              id='submit-button-activity'
                              onClick={() => { sendData() }}
                              className="flex mb-5 ml-auto mr-5" type='primary'>
                              {t("ACTIVITY.submit_files")}
                            </Button>
                          </>

                          :
                          <div className='m-5'>
                            <UploadFiles fileList={fileList} setFileList={setFileList} listType={'picture'} maxCount={1} disabled={passedDeadline || evaluated} />
                            <Button
                              loading={uploadLoading}
                              disabled={uploadLoading || (passedDeadline || evaluated)}
                              id='submit-button-activity'
                              onClick={() => { sendData() }}
                              className="flex ml-auto" type='primary'>
                              {t("ACTIVITY.submit_files")}
                            </Button>
                          </div>


                      }
                      <p className='mb-2 ml-5 text-xs text-gray-400'>{t("ACTIVITY.remember_submit")}</p>

                    </div>
                    :
                    isActivityEvaluable && (
                      <main>
                        <header className='mt-5 mb-1 text-xs text-gray-600'>{t("ACTIVITY.your_submission")}</header>
                        <div className='p-5 mb-5 space-y-5 bg-white border rounded-md'>

                          <UploadFiles
                            fileList={fileList}
                            setFileList={setFileList}
                            listType={'picture'}
                            maxCount={5}
                            disabled={passedDeadline || evaluated}
                            showRemoveIcon={!passedDeadline || !evaluated}
                          />
                          <Button
                            loading={uploadLoading}
                            disabled={uploadLoading || (passedDeadline || evaluated) || sameUpload || loadingGroup}
                            id='submit-button-activity'
                            onClick={() => { sendData() }}
                            className="flex ml-auto" type='primary'>
                            {t("ACTIVITY.submit_files")}
                          </Button>
                          <p className='text-xs text-gray-600'>{t("ACTIVITY.remember_submit")}</p>
                        </div>
                        <GroupMembers activityGroup={activityGroup} loadingGroup={loadingGroup} />
                      </main>
                    )
                }

              </div>
        }
      </>
    </div >
  )
}
