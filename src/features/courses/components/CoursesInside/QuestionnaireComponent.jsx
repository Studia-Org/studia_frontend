import React, { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles';
import RadioGroup, { useRadioGroup } from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import { motion } from "framer-motion";
import { useAuthContext } from "../../../../context/AuthContext";
import { message, Popconfirm } from "antd";
import { API } from "../../../../constant";
import { getToken } from "../../../../helpers";
import Swal from 'sweetalert2'
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { useTimer } from "../../../../shared/elements/useTimer";
import { AddQuestionButton } from './EditSection/AddQuestionButton';
import { Header } from './Questionnaire/Header';
import { NavigationButtons } from './Questionnaire/NavigationsButons';


export const QuestionnaireComponent = ({ questionnaire, answers, subsectionID, enableEdit, setEnableEdit, courseSubsection, setCourseSubsectionQuestionnaire }) => {
  const { user } = useAuthContext();
  const [groupValues, setGroupValues] = useState({});
  const questionnaireAnswerData = answers.filter((answer) => answer.questionnaire.id === questionnaire.id);
  const [completed, setCompleted] = useState(questionnaireAnswerData.length > 0);
  const questionsPerPage = 5;
  const totalQuestions = questionnaire.attributes.Options.questionnaire.questions.length;
  const totalPages = Math.ceil(totalQuestions / questionsPerPage);
  const { minutes, seconds, stopTimer } = useTimer({ testCompleted: questionnaireAnswerData.length > 0 });
  const [editedQuestions, setEditedQuestions] = useState({});

  console.log(questionnaire)


  const handleInputChange = (question, absoluteIndex) => {
    setEditedQuestions((prev) => ({ ...prev, [absoluteIndex]: { question: question.question, options: question.options } }));
  };

  useEffect(() => {
    if (questionnaireAnswerData.length > 0) {
      setCompleted(true);
      stopTimer()
    } else {
      setCompleted(false);
    }
  }, [questionnaireAnswerData.length]);



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


  const handleSubmission = async () => {
    if (Object.keys(groupValues).length === totalQuestions) {
      const confirmed = await confirmSubmission();
      if (confirmed) {
        const formattedObject = {
          responses: Object.keys(groupValues).map(questionIndex => ({
            answer: groupValues[questionIndex],
            question: questionnaire.attributes.Options.questionnaire.questions[questionIndex].question
          }))
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
          const temp = await response2.json();
          if (response2.ok) {
            Swal.fire(
              'Completed!',
              'The questionnaire has been completed, refresh the page to see your results',
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
      console.log(error);
      message.error(`Error deleting question, ${error}`);
    }
  }


  const renderQuestionsForPage = () => {
    const startIdx = (currentPage - 1) * questionsPerPage;
    const endIdx = Math.min(startIdx + questionsPerPage, totalQuestions);
    const questionsForPage = questionnaire.attributes.Options.questionnaire.questions.slice(startIdx, endIdx);
    console.log(questionsForPage);
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
                  <input
                    type="text"
                    className='w-full'
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
              user.role_str === "student" ?
                <div key={absoluteIndex}>
                  {
                    questionnaireAnswerData.length > 0 ?
                      <RadioGroup className="mt-4" name={`use-radio-group-${absoluteIndex}`} defaultValue={questionnaireAnswerData[0].responses.responses[absoluteIndex].answer}>
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
                          <div className='rounded-full w-5 h-5 border-2 border-gray-400 '> </div>
                          <input type="text" value={option} onChange={(e) => {
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
              user.role_str === "student" ?
                <div key={absoluteIndex} className='mt-5 flex w-full'>
                  {
                    questionnaireAnswerData.length > 0 ?
                      <TextField
                        id="outlined-basic"
                        label=""
                        disabled
                        defaultValue={questionnaireAnswerData[0].responses.responses[absoluteIndex].answer}
                        variant="filled"
                        className='w-full'
                        rows={3}
                        multiline
                      /> :
                      <TextField
                        id="outlined-basic"
                        label=""
                        variant="filled"
                        className='w-full'
                        value={groupValues[absoluteIndex] || ""}
                        onChange={(event) => handleRadioChange(absoluteIndex, event.target.value)}
                        rows={3}
                        multiline
                      />
                  }
                </div>
                :
                <div key={absoluteIndex} className='mt-5 flex w-full'>
                  <TextField
                    id="outlined-basic"
                    label=""
                    disabled
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
  };


  const isLastPage = currentPage === totalPages;

  return (
    <div className="flex flex-col mt-5">
      <Header enableEdit={enableEdit} questionnaire={questionnaire} questionnaireAnswerData={questionnaireAnswerData}
        completed={completed} setEnableEdit={setEnableEdit} courseSubsection={courseSubsection} editedQuestions={editedQuestions} />
      <motion.ul
        initial="hidden"
        animate="visible"
        variants={list}
      >
        <div className="space-y-5 mt-5 ">{renderQuestionsForPage()}</div>
        {
          (enableEdit === true && user.role_str !== 'student' && (totalPages === 0 || currentPage === totalPages)) && (
            <AddQuestionButton setCourseSubsectionQuestionnaire={setCourseSubsectionQuestionnaire} />
          )
        }
      </motion.ul>
      {isLastPage && (
        <div className="mt-5 flex justify-end">
          {
            completed === false &&
            <>
              {
                user.role_str === 'student' && (
                  <>
                    <span className='inline-flex w-[60px] text-gray-500'>{minutes}:{seconds < 10 ? "0" + seconds : seconds}</span>
                    <button onClick={handleSubmission}
                      className="bg-blue-500 text-white font-semibold py-2 px-4 
                              rounded ml-auto hover:bg-blue-800 duration-150">
                      Submit
                    </button>
                  </>
                )
              }
            </>
          }
        </div>
      )}
      <div className="flex items-center justify-between mt-5 mb-8 bg-white rounded-md shadow-md p-5 border-b-8 border-[#6366f1]">
        <NavigationButtons setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
};
