import { useEffect, useState } from 'react'
import { ProfessorData } from '../CoursesInside/ProfessorData';
import { getToken } from '../../../../helpers';
import ReactMarkdown from 'react-markdown';
import { API } from '../../../../constant';
import { useAuthContext } from '../../../../context/AuthContext';
import { useNavigate, useParams } from "react-router-dom";
import 'filepond/dist/filepond.min.css';
import '../..//styles/filepondStyles.css'
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import Swal from 'sweetalert2';
import ObjectivesTags from './ObjectivesTag';
import ActivityTitle from './Components/ActivityTitle';
import BackToCourse from './Components/BackToCourse';
import { Empty, Button, message, Popconfirm } from 'antd';
import MDEditor from '@uiw/react-md-editor';
import { SwitchEdit } from '../CoursesInside/SwitchEdit';
import { RecordAudio } from './Components/ThinkAloud/RecordAudio';


registerPlugin(FilePondPluginImagePreview);


export const ActivityComponent = ({ activityData, idQualification, setUserQualification, userQualification }) => {
  const [filesTask, setFilesTask] = useState();
  const [uploadMode, setUploadMode] = useState('record')
  const [filesUploaded, setFilesUploaded] = useState(activityData?.file?.data || []);
  const [activityFiles, setActivityFiles] = useState(activityData?.activity?.data?.attributes?.file?.data || []);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [title, setTitle] = useState(activityData.activity.data.attributes.title)
  const [subsectionContent, setSubsectionContent] = useState(activityData.activity.data.attributes.description);
  const [loading, setLoading] = useState(false);
  const [enableEdit, setEnableEdit] = useState(false);
  const evaluated = activityData.qualification ? true : false;
  const type = activityData?.activity?.data?.attributes?.type;
  const audioUser = activityData?.file?.data ? activityData?.file?.data[0]?.attributes : null;
  const [audioFile, setAudioFile] = useState(audioUser);
  const [formData, setFormData] = useState(new FormData());
  const { user } = useAuthContext();
  const { activityId } = useParams();
  const isActivityEvaluable = activityData?.activity?.data?.attributes.evaluable

  let { courseId } = useParams();
  const navigate = useNavigate();
  const USER_OBJECTIVES = [...new Set(user?.user_objectives?.map((objective) => objective.categories.map((category) => category)).flat() || [])];
  const passedDeadline = activityData?.activity?.data?.attributes?.deadline ? new Date(activityData?.activity?.data?.attributes?.deadline) < new Date() : false;
  function handleFileUpload(file) {
    const dataCopy = formData;
    dataCopy.append('files', file);
    setFormData(dataCopy);
    document.getElementById('submit-button-activity').disabled = false;
  }

  useEffect(() => {
    setFilesTask([]);
    setSubsectionContent(activityData.activity.data.attributes.description);
    setTitle(activityData.activity.data.attributes.title);
  }, [enableEdit])

  async function saveChanges() {
    setLoading(true);
    const formData = new FormData();
    let filesId = [];
    try {
      if (filesTask.length > 0) {
        filesTask.forEach((file) => {
          formData.append('files', file.file);
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
          filesId = filesId.concat(activityFiles.map((file) => file.id));
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

        setActivityFiles(result.data.attributes.file?.data || []);
        message.success('Changes saved successfully');
      }
      else throw new Error('Error saving changes');
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

  async function sendFile(result) {
    try {
      const isThinkAloud = activityData.activity.data.attributes.type === 'thinkAloud'
      let response2 = undefined;
      let files = []

      files = filesUploaded.map((file) => file.id);
      files = files.concat(result.map((file) => file.id));
      const qualificationData = {
        data: {
          activity: activityId,
          file: isThinkAloud ? result[0].id : files,
          user: user.id,
          delivered: true,
          delivered_data: new Date(),
        }
      };
      if (activityData.delivered && !evaluated) {
        response2 =
          await fetch(`${API}/qualifications/${idQualification}`, {
            method: 'PUT',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(qualificationData),
          });
      }
      else if (!evaluated) {
        response2 =
          await fetch(`${API}/qualifications`, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(qualificationData),
          });

      }
      return response2;
    } catch (error) {
      console.error(error);
    }
  }

  async function sendData() {
    try {
      console.log('activityData', activityData);
      const isThinkAloud = (activityData.activity.data.attributes.type === 'thinkAloud' && formData.getAll('files').length === 0)
      const isBlob = audioFile instanceof Blob;
      const formDataAudio = new FormData();
      if (audioFile) {
        formDataAudio.append('files', audioFile);
      }
      setUploadLoading(true);

      const response = await fetch(`${API}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: (isThinkAloud && isBlob) ? formDataAudio : formData,
      });
      const result = await response.json();
      if (response.ok) {
        const response_upload = await sendFile(result);
        if (response_upload.ok) {
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
            const data = await response_upload.json();
            setUserQualification({ ...userQualification, idQualification: data.data.id });
            setFilesUploaded(prev => [...prev, ...parsedResults]);
            setFormData(new FormData());
          })
        }
        else throw new Error('Error uploading files');
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        })
      }

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      })
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
        activityFiles.filter((file) => file.id !== fileId);
      setActivityFiles(activityFilesFiltered);
      message.success('File deleted successfully');
    }
    else message.error('Something went wrong');
  }
  function DeleteButton({ id }) {
    return (
      <Popconfirm
        title="Delete the file"
        description="Are you sure to delete this file?"
        okText="Yes"
        okType="danger"
        onConfirm={(e) => {
          e.stopPropagation();
          deleteFile(id);
        }}
        onCancel={(e) => {
          e.stopPropagation();
        }}
        cancelText="No"
      >
        <svg
          onClick={(e) => {
            e.stopPropagation();
          }}
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
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
          {user.role_str === 'student' && editable && !evaluated && <DeleteButton id={file.id} />}
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
        message.error('Something went wrong');
      }
    } catch (error) {
      message.error('Something went wrong: ', error);
    }
  };
  return (
    <div className='flex max-w-[calc(100vw)] flex-col 1.5xl:flex-row items-start 1.5xl:items-start 1.5xl:space-x-24 p-5 sm:p-10'>
      <div className='1.5xl:w-2/4 lg:w-10/12 w-full'>
        <BackToCourse navigate={navigate} courseId={courseId} />
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
        <ObjectivesTags USER_OBJECTIVES={USER_OBJECTIVES} categories={activityData?.activity.data.attributes.categories} />

        {
          user.role_str === 'professor' || user.role_str === 'admin' ?
            <div className='flex items-center ml-auto'>
              <SwitchEdit enableEdit={enableEdit} setEnableEdit={setEnableEdit} />
            </div> : null
        }

        {
          evaluated && (
            <>
              <p className='mt-5 mb-1 text-xs text-gray-400'>Comments</p>
              <hr />
              {
                activityData.comments === null || activityData.comments === '' ?
                  <p className='mt-3'>There are no comments for your submission.</p>
                  :
                  <p className='mt-3'>{activityData.comments}</p>
              }

            </>
          )
        }


        <p className='mt-5 mb-1 text-xs text-gray-400'>Task description</p>
        <hr />
        <div className=' my-3 text-gray-600 ml-5 max-w-[calc(100vw-1.25rem)] box-content mt-5 '>
          {
            !enableEdit ?
              <div className='prose max-w-none'>
                <ReactMarkdown className=''>{activityData.activity.data.attributes.description}</ReactMarkdown>
              </div>
              :
              <div className="flex flex-col">
                <MDEditor height="30rem" className='mt-2 mb-8' data-color-mode='light' onChange={setSubsectionContent} value={subsectionContent} />
                <Button onClick={() => saveChanges()} type="" loading={loading}
                  className="inline-flex justify-center px-4 ml-auto text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  Save Changes
                </Button>
              </div>
          }
        </div>

      </div >
      {
        user.role_str === 'professor' || user.role_str === 'admin' ?
          <div className='flex flex-col'>
            <p className='mb-3 text-xs text-gray-400' > Task Files</ p>
            <div className='bg-white mb-5 rounded-md shadow-md p-5 max-w-[calc(100vw-1.25rem)]  w-[30rem]'>
              {(!activityFiles.length ||
                activityFiles?.length === 0) ? (
                enableEdit ? (
                  <FilePond allowMultiple={true} maxFiles={5} onupdatefiles={setFilesTask} />
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    className='mt-6'
                    description={
                      <span className='font-normal text-gray-400'>
                        There are no files
                      </span>
                    }
                  />
                )
              ) : (
                enableEdit ? (
                  <section className='max-w-[calc(100vw-1.25rem)]'>
                    <FilePond allowMultiple={true} maxFiles={5} onupdatefiles={setFilesTask} />
                    <div className='space-y-2'>
                      {activityFiles.map((file) => renderFiles(file))}
                    </div>

                  </section>
                ) : (
                  <div className='space-y-2 max-w-[calc(100vw-1.25rem)]'>
                    {activityFiles.map((file) => renderFiles(file))}
                  </div>

                )
              )}
            </div>
          </div> :
          evaluated || passedDeadline ?
            <div className='flex flex-col max-w-[calc(100vw-1.25rem)]'>
              <p className='mb-3 text-xs text-gray-400' > Task Files</ p>
              <div className='bg-white mb-5 rounded-md shadow-md p-5 max-w-[calc(100vw-1.25rem)] w-[30rem]'>
                {
                  activityData.activity.data.attributes.file?.data === null || activityData.activity.data.attributes.file?.data?.length === 0 ?
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className='mt-6' description={
                      <span className='font-normal text-gray-400 '>
                        There are no files
                      </span>
                    } />
                    :
                    <section className='flex flex-col gap-y-3'>
                      {activityFiles.map((file, index) => renderFiles(file))}
                    </section>
                }
              </div>
              {
                activityData.evaluator.data && (
                  <>
                    <p className='mb-1 text-xs text-gray-400' > Evaluator</ p>
                    <div className='pl-1'>
                      <ProfessorData professor={{ attributes: activityData.evaluator.data.attributes }} evaluatorFlag={true} />
                    </div>
                  </>
                )
              }
              <p className='mt-5 mb-3 text-xs text-gray-400'>Your submission</p>
              {
                filesUploaded.length === 0 ?
                  <div className='bg-white mb-5 rounded-md shadow-md p-5 max-w-[calc(100vw-1.25rem)] w-[30rem]'>
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className='mt-6' description={
                      <span className='font-normal text-gray-400 '>
                        You did not submit any files
                      </span>
                    } />
                  </div> :
                  <div className='flex flex-col p-5 bg-white rounded-md mb-14 gap-y-3'>
                    {filesUploaded && filesUploaded.map(renderFiles)}
                  </div>
              }
            </div >
            :
            <div className='flex flex-col w-[30rem] mt-1 max-w-[calc(100vw-2.5rem)]'>
              <p className='mb-3 text-xs text-gray-400' > Task Files</ p>
              {
                activityData.activity.data.attributes.file?.data === null ||
                  activityData.activity.data.attributes.file?.data?.length === 0 ?
                  <div className='bg-white rounded-md shadow-md p-5 mb-3 space-y-3 md:w-[30rem]' >
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className='mt-6' description={
                      <span className='font-normal text-gray-400 '>
                        There are no files
                      </span>
                    } />
                  </div>
                  :
                  <div className='flex flex-col gap-y-3'>
                    {activityFiles.map((file, index) => renderFiles(file))}
                  </div>
              }
              {
                isActivityEvaluable && (
                  <>
                    <p className='mt-5 mb-1 text-xs text-gray-400'>Your submission</p>
                    {
                      activityData.activity.data.attributes.type !== 'thinkAloud' &&
                      <div className='bg-white rounded-md shadow-md p-5 mb-3 space-y-3 md:w-[30rem]' >
                        {
                          filesUploaded.length === 0 ?
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className='mt-6' description={
                              <span className='font-normal text-gray-400 '>
                                You did not submit any files
                              </span>
                            } />
                            :
                            filesUploaded && filesUploaded.map((file) => renderFiles(file, true))
                        }

                      </div>
                    }
                  </>
                )
              }
              {
                activityData.activity.data.attributes.type === 'thinkAloud' ?
                  <div className='mb-5 bg-white rounded-md shadow-md'>
                    <div className='flex items-center gap-5 mx-5 mt-5'>
                      <p className='text-xs text-gray-400 '>Click on the microphone and start recording your voice, or you can upload an audio file</p>

                      <Button onClick={() => handleUploadMode()} disabled={passedDeadline}>
                        Switch mode
                      </Button>
                    </div>
                    <hr className='mx-10 mt-5' />
                    {
                      uploadMode === 'record' ?
                        <RecordAudio audioFile={audioFile} setAudioFile={setAudioFile} passedDeadline={passedDeadline} idQualification={idQualification}
                          setUserQualification={setUserQualification} />
                        :
                        <div className='m-5'>
                          <FilePond
                            files={formData.getAll('files')}
                            allowMultiple={true}
                            maxFiles={5}
                            onaddfile={(err, item) => {
                              if (!err) {
                                handleFileUpload(item.file);
                              }
                            }}
                            onremovefile={(err, item) => {
                              if (!err) {
                                const dataCopy = formData;
                                dataCopy.forEach((value, key) => {
                                  if (value.name === item.file.name) {
                                    dataCopy.delete(key);
                                  }
                                });
                                document.getElementById('submit-button-activity').disabled = formData.getAll('files').length === 0;
                                setFormData(dataCopy);
                              }
                            }}
                          />
                        </div>


                    }
                    <p className='mb-2 ml-5 text-xs text-gray-400'>Remember to submit your file once you finished.</p>

                  </div>
                  :
                  isActivityEvaluable && (
                    <>
                      <FilePond
                        files={formData.getAll('files')}
                        allowMultiple={true}
                        maxFiles={5}
                        onaddfile={(err, item) => {
                          if (!err) {
                            handleFileUpload(item.file);
                          }
                        }}
                        onremovefile={(err, item) => {
                          if (!err) {
                            const dataCopy = formData;
                            dataCopy.forEach((value, key) => {
                              if (value.name === item.file.name) {
                                dataCopy.delete(key);
                              }
                            });
                            document.getElementById('submit-button-activity').disabled = formData.getAll('files').length === 0;
                            setFormData(dataCopy);
                          }
                        }}
                      />
                      <Button
                        loading={uploadLoading}
                        id='submit-button-activity'
                        disabled={formData.getAll('files').length === 0 && audioFile === null}
                        onClick={() => { sendData() }}
                        className="ml-auto " type='primary'>
                        Submit
                      </Button>
                    </>
                  )
              }
            </div>
      }
    </div >
  )
}
