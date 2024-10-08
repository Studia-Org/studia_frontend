import React, { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles';
import RadioGroup, { useRadioGroup } from '@mui/material/RadioGroup';
import { motion } from "framer-motion";
import { useAuthContext } from "../../../../context/AuthContext";
import { Button, Input, message, Popconfirm, Empty, InputNumber } from "antd";
import { API } from "../../../../constant";
import { getToken } from "../../../../helpers";
import Swal from 'sweetalert2'
import { MoonLoader } from "react-spinners";
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { useTimer } from "../../../../shared/elements/useTimer";
import { AddQuestionButton } from './EditSection/AddQuestionButton';
import { Header } from './Questionnaire/Header';
import { NavigationButtons } from './Questionnaire/NavigationsButons';
import { UserQuestionnaireAnswerTable } from './Questionnaire/UserQuestionnaireAnswerTable';
import { getRecommendationsSRLO } from './Questionnaire/getRecommendationsSRLO';
import { RecommendationCard } from './Questionnaire/RecommendationCard';
import { ScaleQuestionnaireForm } from './Questionnaire/ScaleQuestionnaireForm';
import { fetchUserResponsesQuestionnaires } from "../../../../fetches/fetchUserResponsesQuestionnaires";
import { StepsQuestionnaire } from './Questionnaire/StepsQuestionnaire';
import { BreadcrumbCourse } from './BreadcrumbCourse';
import { useCourseContext } from '../../../../context/CourseContext';
import { useTranslation } from 'react-i18next';
import { createExcel } from './Questionnaire/downloadQuestionnaires';
const { TextArea } = Input;


export const QuestionnaireComponent = ({ questionnaire, answers, subsectionID, enableEdit, setEnableEdit, setCourseSubsectionQuestionnaire, professorID, checkImprovement }) => {
  const { user } = useAuthContext();
  const [groupValues, setGroupValues] = useState({});
  const [loadingData, setLoadingData] = useState(true);
  const [userResponses, setUserResponses] = useState([]);
  const [questionnaireAnswerData, setQuestionnaireAnswerData] = useState(answers.filter((answer) => answer.questionnaire?.id === questionnaire?.id));
  const [recommendationList, setRecommendationList] = useState([]);
  const [completed, setCompleted] = useState(questionnaireAnswerData.length > 0);
  const [sendingData, setSendingData] = useState(false);
  const questionsPerPage = questionnaire.attributes.type === 'scaling' ? 10 : 5;
  const totalQuestions = questionnaire.attributes.Options.questionnaire.questions.length;
  const totalPages = Math.ceil(totalQuestions / questionsPerPage);
  const { minutes, seconds, stopTimer } = useTimer({ testCompleted: questionnaireAnswerData.length > 0 || user.role_str !== 'student' });
  const [editedQuestions, setEditedQuestions] = useState({});
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { subsectionSelected } = useCourseContext();

  const isQuestionnaireImported = questionnaire.attributes.Options?.embedCode !== undefined;

  const handleInputChange = (question, absoluteIndex) => {
    setEditedQuestions((prev) => ({ ...prev, [absoluteIndex]: { question: question.question, options: question.options } }));
  };

  useEffect(() => {
    setCurrentPage(1);
    setUserResponses([]);
    if (user.role_str !== 'student') {
      setLoadingData(true);
      const fetchData = async () => {
        setUserResponses(await fetchUserResponsesQuestionnaires(questionnaire.id));
        setLoadingData(false);
      };
      fetchData();
    }
    const answersData = answers.filter((answer) => answer.questionnaire?.id === questionnaire?.id);
    setQuestionnaireAnswerData(answersData);
    if (questionnaire.attributes.Options.questionnaire?.type === 'SRL-O' && answersData[0]) {
      setRecommendationList(getRecommendationsSRLO(answersData[0].responses.responses, t, answersData[0].responses.language))
    }
    if (answersData.length > 0) {
      setCompleted(true);
      stopTimer()
    } else {
      setCompleted(false);
    }
  }, [questionnaire.id]);

  const list = {
    visible: { opacity: 1 },
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.7,
      delayChildren: 0.3,
      staggerChildren: 0.05
    },
    hidden: { opacity: 0 },
  }

  const item = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: -100 },
  }




  const StyledFormControlLabel = styled((props) => <FormControlLabel {...props} />)(
    ({ theme, checked }) => ({
      '.MuiFormControlLabel-label': checked && {
        color: theme.palette.primary.main,
      },
    })
  );

  const MyFormControlLabel = (props) => {
    const radioGroup = useRadioGroup();

    let checked = false;

    if (radioGroup) {
      checked = radioGroup.value === props.value;
    }

    return <StyledFormControlLabel checked={checked} {...props} />;
  };



  const [currentPage, setCurrentPage] = useState(1);



  const handleRadioChange = (questionIndex, value) => {
    setGroupValues(prevState => ({
      ...prevState,
      [questionIndex]: value
    }));
  };

  const confirmSubmission = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this questionnaire",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    });
    return result.isConfirmed;
  };

  const correctQuestionnaire = async (correctAnswers, userResponses) => {
    const calculatedScore = calcularNota(userResponses, correctAnswers);

    await fetch(`${API}/qualifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        data: {
          activity: subsectionSelected.attributes.activity.data.id,
          user: user.id,
          comments: 'Automatic evaluation of the questionnaire',
          evaluator: professorID,
          qualification: calculatedScore,
          file: null,
          delivered: true
        }
      })
    });

  }

  function calcularNota(respuestasUsuario, respuestasCorrectas) {
    const correctas = respuestasUsuario.reduce((acumulador, respuesta) => {
      return acumulador + (respuestasCorrectas[respuesta.question] === respuesta.answer ? 1 : 0);
    }, 0);

    return (correctas / Object.keys(respuestasCorrectas).length) * 10;
  }

  const completeSubsection = async () => {
    try {
      setLoading(true);
      const newObject = {
        subsections_completed: [
          ...user.subsections_completed.map(subsection => ({ id: subsection.id })),
          { id: subsectionID }
        ]
      };
      const response = await fetch(`${API}/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(newObject)
      });
      if (response.ok) {
        Swal.fire(
          'Completed!',
          'The questionnaire has been completed',
          'success'
        ).then(() => {
          window.location.reload();
        })
      } else {
        message.error('Error completing the questionnaire:', response.statusText);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error)
      message.error('Error completing the questionnaire:', error);

    }
  }



  const handleSubmission = async () => {
    try {
      setSendingData(true);

      if (Object.keys(groupValues).length === totalQuestions) {
        const confirmed = await confirmSubmission();
        if (confirmed) {
          const formattedObject = {
            responses: Object.keys(groupValues).map(questionIndex => ({
              answer: groupValues[questionIndex],
              question: questionnaire.attributes.Options.questionnaire.questions[questionIndex].question
            })),
            language: questionnaire.attributes.Options.questionnaire.language
          };
          const hour = Math.floor(minutes / 60) < 10 ? "0" + Math.floor(minutes / 60) : Math.floor(minutes / 60)
          const minutesLeft = minutes % 60;
          const minutesFormat = minutesLeft < 10 ? "0" + minutesLeft : minutesLeft
          const secondsFormat = seconds < 10 ? "0" + seconds : seconds
          const timeToComplete = `${hour}:${minutesFormat}:${secondsFormat}:000`

          const userData = {
            user: user.id,
            questionnaire: questionnaire.id,
            responses: formattedObject,
            finished: true,
            timeToComplete: timeToComplete
          };

          const response = await fetch(`${API}/user-response-questionnaires`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ data: userData })
          });
          if (response.ok) {
            const newObject = {
              subsections_completed: [
                ...user.subsections_completed.map(subsection => ({ id: subsection.id })),
                { id: subsectionID }
              ]
            };
            const response2 = await fetch(`${API}/users/${user.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
              },
              body: JSON.stringify(newObject)
            });

            if (Object.keys(questionnaire.attributes.Options.questionnaire?.correctAnswers).length > 0) {
              await correctQuestionnaire(questionnaire.attributes.Options.questionnaire.correctAnswers, formattedObject.responses)
            }

            if (response2.ok) {
              Swal.fire(
                'Completed!',
                'The questionnaire has been completed',
                'success'
              ).then(() => {
                window.location.reload();
              })
            } else {
              message.error('Error al actualizar el usuario:', response2.statusText);
            }
          }
          else {
            Swal.fire(
              'Error!',
              'Error sending the questionnaire, please try again later',
              'error'
            )
          }

        }
      } else {
        message.error('Please, answer all the questions')
      }
    }
    catch (error) {
      console.error(error)
    }
    finally {
      setSendingData(false);
    }
  }

  async function deleteQuestion(index) {
    try {
      setEditedQuestions((prev) => {
        const { [index]: deletedQuestion, ...rest } = prev;
        return rest;
      });

      const reponse = await fetch(`${API}/questionnaires/${questionnaire.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          data: {
            Options: {
              questionnaire: {
                ...questionnaire.attributes.Options.questionnaire,
                questions: questionnaire.attributes.Options.questionnaire.questions.filter((question, questionIndex) => questionIndex !== index)
              }
            }
          }
        })
      });
      const data = await reponse.json();
      setCourseSubsectionQuestionnaire(data.data);


      message.success('Question deleted');
    } catch (error) {
      console.error(error);
      message.error(`Error deleting question, ${error}`);
    }
  }

  const renderQuestionsForPage = () => {
    const startIdx = (currentPage - 1) * questionsPerPage;
    const endIdx = Math.min(startIdx + questionsPerPage, totalQuestions);
    const questionsForPage = questionnaire.attributes.Options.questionnaire.questions.slice(startIdx, endIdx);
    let answersData = answers.filter((answer) => answer.questionnaire?.id === questionnaire?.id);
    if (questionnaire.attributes.type === 'scaling') {
      return (
        <ScaleQuestionnaireForm questions={questionsForPage} groupValues={groupValues} setGroupValues={setGroupValues} currentPage={currentPage} questionnaireAnswerData={answersData} userResponses={userResponses} />
      )
    }
    else {
      return questionsForPage
        .filter((question) => question !== undefined && question !== null)
        .map((question, index) => {
          const absoluteIndex = startIdx + index;
          const initialValue = editedQuestions[absoluteIndex] !== undefined ? editedQuestions[absoluteIndex] : question;
          return (
            <motion.li
              className='bg-white shadow-md rounded-md p-5 border-l-8 border-[#377ddf75]'
              variants={item}
              key={absoluteIndex}>
              {
                enableEdit ?
                  <div className='flex items-center'>
                    <Input
                      type="text"
                      className='w-full rounded-md'
                      value={initialValue.question}
                      onChange={(e) => handleInputChange({ question: e.target.value, options: question.options }, absoluteIndex)}
                    />
                    <Popconfirm
                      title="Delete question"
                      description="Are you sure you want to delete this question?"
                      okText="Yes"
                      onConfirm={() => deleteQuestion(absoluteIndex)}
                      okButtonProps={{ className: 'bg-blue-500', type: 'primary' }}
                      cancelText="No">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-4 cursor-pointer">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                      </svg>
                    </Popconfirm>
                  </div>
                  :
                  <p className="font-medium">{question.question}</p>
              }
              {Array.isArray(question.options) ? (
                user.role_str === "student" || (user.role_str !== "student" && questionnaireAnswerData.length > 0) ?
                  <div key={absoluteIndex}>
                    {
                      (questionnaireAnswerData.length > 0) ?
                        <RadioGroup className="mt-4" name={`use-radio-group-${absoluteIndex}`} value={questionnaireAnswerData[0].responses.responses[absoluteIndex]?.answer}>
                          {question.options.map((option, optionIndex) => (
                            <MyFormControlLabel key={optionIndex} value={option} label={option} control={<Radio disabled readOnly />} />
                          ))}
                        </RadioGroup>
                        :
                        <RadioGroup className="mt-4"
                          name={`use-radio-group-${absoluteIndex}`}
                          value={groupValues[absoluteIndex] || ""}
                          onChange={(event) => handleRadioChange(absoluteIndex, event.target.value)}
                        >
                          {question.options.map((option, optionIndex) => (
                            <MyFormControlLabel key={optionIndex} value={option} label={option} control={<Radio />} />
                          ))}
                        </RadioGroup>
                    }
                  </div> :
                  enableEdit ?
                    <div key={absoluteIndex}>
                      <RadioGroup className="mt-4" name={`use-radio-group-${absoluteIndex}`} >
                        {initialValue.options.map((option, optionIndex) => (
                          <div className='flex items-center gap-2 space-y-2'>
                            <div className='w-5 h-5 border-2 border-gray-400 rounded-full '> </div>
                            <Input type="text" className='rounded-md' value={option} onChange={(e) => {
                              const updatedOptions = initialValue.options.map((o, index) =>
                                index === optionIndex ? e.target.value : o
                              );
                              handleInputChange({ question: initialValue.question, options: updatedOptions }, absoluteIndex);
                            }} />
                          </div>
                        ))}
                      </RadioGroup>
                    </div> :
                    <div key={absoluteIndex}>
                      <RadioGroup className="mt-4" name={`use-radio-group-${absoluteIndex}`} >
                        {question.options.map((option, optionIndex) => (
                          <MyFormControlLabel key={optionIndex} value={option} label={option} control={<Radio disabled readOnly />} />
                        ))}
                      </RadioGroup>
                    </div>
              ) : (
                user.role_str === "student" || (user.role_str !== "student" && questionnaireAnswerData.length > 0) ?
                  <div key={absoluteIndex} className='flex w-full mt-5'>
                    {
                      questionnaireAnswerData.length > 0 ?
                        question.options === 'numberInput' ?
                          <InputNumber
                            min={1}
                            max={10}
                            disabled
                            className='w-full'
                            value={questionnaireAnswerData[0].responses.responses[absoluteIndex].answer}
                          />
                          :
                          <TextArea
                            id="outlined-basic"
                            label=""
                            disabled={true}
                            style={{ resize: 'none' }}
                            value={questionnaireAnswerData[0].responses.responses[absoluteIndex].answer}
                            className='w-full'
                            rows={3}
                          />
                        :
                        question.options === 'numberInput' ?
                          <InputNumber
                            min={1}
                            max={10}
                            className='w-full'
                            value={groupValues[absoluteIndex] || ""}
                            onChange={(value) => handleRadioChange(absoluteIndex, value)}
                          />
                          :
                          <TextArea
                            id="outlined-basic"
                            label=""
                            className='w-full'
                            value={groupValues[absoluteIndex] || ""}
                            onChange={(event) => handleRadioChange(absoluteIndex, event.target.value)}
                            rows={3}
                          />
                    }
                  </div>
                  :
                  <div key={absoluteIndex} className='flex w-full mt-5'>
                    <TextArea
                      id="outlined-basic"
                      label=""
                      disabled={true}
                      style={{ resize: 'none' }}
                      variant="filled"
                      className='w-full'
                      rows={1}
                      multiline
                    />
                  </div>
              )}

            </motion.li>
          );
        });
    }
  };


  const downloadQuestionnaires = async () => {
    createExcel(userResponses, questionnaire.attributes.Title);
  };
  const isLastPage = currentPage === totalPages;

  return (
    <div className="flex flex-col mt-3">
      <BreadcrumbCourse
        styles={
          'mb-5'
        }
      />
      <Header enableEdit={enableEdit} questionnaire={questionnaire} questionnaireAnswerData={answers.filter((answer) => answer.questionnaire?.id === questionnaire?.id)}
        completed={completed} setEnableEdit={setEnableEdit} courseSubsection={subsectionSelected} editedQuestions={editedQuestions}
        setQuestionnaireAnswerData={setQuestionnaireAnswerData} downloadQuestionnaires={downloadQuestionnaires} loadingQuestionnaires={loadingData}
      />
      {
        !isQuestionnaireImported && (user?.role_str === 'student' || ((questionnaireAnswerData.length > 0 && user?.role_str !== 'student') || enableEdit === true)) ?
          <>
            {
              (enableEdit === false && user.role_str !== 'student') && (
                <Button onClick={() => setQuestionnaireAnswerData([])} className='mb-5 bg-white shadow-md'>
                  {t("QUESTIONNAIRE.go_back_users")}
                </Button>
              )
            }

            {
              completed === true && questionnaire.attributes.Options.questionnaire?.type === 'SRL-O' && recommendationList && (
                <RecommendationCard recommendationList={recommendationList} checkImprovement={checkImprovement} />
              )
            }

            <motion.ul
              initial="hidden"
              animate="visible"
              variants={list}
            >
              <div className='my-1'>
                <StepsQuestionnaire currentPage={currentPage} totalPages={totalPages} />
              </div>

              <div className="space-y-5 ">
                {renderQuestionsForPage()}
              </div>
              {
                (enableEdit === true && user?.role_str !== 'student' && (totalPages === 0 || currentPage === totalPages)) && (
                  <AddQuestionButton setCourseSubsectionQuestionnaire={setCourseSubsectionQuestionnaire} />
                )
              }
            </motion.ul>
            {isLastPage && (
              <div className="flex justify-end mt-5">
                {
                  completed === false &&
                  <>
                    {
                      user.role_str === 'student' && (
                        <>

                          <Button type='primary' loading={sendingData} onClick={handleSubmission}
                            className="ml-auto ">
                            {t("COMMON.submit")}
                          </Button>
                        </>
                      )
                    }
                  </>
                }
              </div>
            )}
            <div className="flex items-center justify-between mt-5 mb-8 bg-white rounded-md shadow-md p-5 border-b-8 border-[#6366f1]">
              <NavigationButtons
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                totalPages={totalPages}
                groupValues={groupValues}
                questionsPerPage={questionsPerPage}
                questionnaireAnswered={questionnaireAnswerData.length > 0}
              />
            </div>
          </>
          :
          <>
            {
              isQuestionnaireImported ?
                <>
                  {
                    user.role_str === 'student' && (
                      <>
                        <Button disabled={user.subsections_completed.some((subsection) => subsection.id === subsectionID)} loading={loading} type='primary' onClick={() => completeSubsection()} className='mt-5'>
                          Mark questionnaire as completed
                        </Button>
                        <p className='mt-2 text-xs text-gray-600'>For completing this section you will need to press the button whenever you ended answering the questionnaire. </p>
                      </>
                    )
                  }
                  <div className='mb-10' dangerouslySetInnerHTML={{ __html: questionnaire.attributes.Options.embedCode }} />

                </>
                :
                loadingData ?
                  <div className='flex items-center justify-center p-5 bg-white rounded-md shadow-md'>
                    <MoonLoader color="#363cd6" />
                  </div>
                  :
                  userResponses.length > 0 ?
                    <UserQuestionnaireAnswerTable userResponses={userResponses} setQuestionnaireAnswerData={setQuestionnaireAnswerData} />
                    :
                    <div className='py-5 mt-5 bg-white rounded-md shadow-md'>
                      <Empty description='There are no user responses to this questionnaire.' />
                    </div>
            }
          </>
      }
    </div>
  );
};
