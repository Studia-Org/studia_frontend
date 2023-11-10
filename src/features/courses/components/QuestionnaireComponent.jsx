import React, { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles';
import RadioGroup, { useRadioGroup } from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import { motion, Variants } from "framer-motion";
import { useAuthContext } from "../../../context/AuthContext";
import { message } from "antd";
import { API } from "../../../constant";
import { getToken } from "../../../helpers";
import Swal from 'sweetalert2'
import FormControlLabel, {
  FormControlLabelProps,
} from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { useTimer } from "../../../shared/elements/useTimer";


export const QuestionnaireComponent = ({ questionnaire, answers, subsectionID }) => {
  const MotionDiv = motion.div;
  const { user } = useAuthContext();
  const [groupValues, setGroupValues] = useState({});
  const questionnaireAnswerData = answers.filter((answer) => answer.questionnaire.id === questionnaire.id);
  const [completed, setCompleted] = useState(questionnaireAnswerData.length > 0);
  const questionsPerPage = 5;
  const totalQuestions = questionnaire.attributes.Options.questionnaire.questions.length;
  const totalPages = Math.ceil(totalQuestions / questionsPerPage);
  const { minutes, seconds } = useTimer({ testCompleted: questionnaireAnswerData.length > 0 });

  useEffect(() => {
    if (questionnaireAnswerData.length > 0) {
      setCompleted(true);
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

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };


  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

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
        // format time to has expected HH:mm:ss.SSS with just having minutes and seconds
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
        console.log(userData)

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

  const renderQuestionsForPage = () => {
    const startIdx = (currentPage - 1) * questionsPerPage;
    const endIdx = Math.min(startIdx + questionsPerPage, totalQuestions);
    const questionsForPage = questionnaire.attributes.Options.questionnaire.questions.slice(startIdx, endIdx);
    return questionsForPage.map((question, index) => {
      const absoluteIndex = startIdx + index;

      return (

        <motion.li
          className='bg-white shadow-md rounded-md p-5 border-l-8 border-[#377ddf75]'
          variants={item}
        >
          <p className="font-medium">{question.question}</p>
          {Array.isArray(question.options) ? (
            <div key={absoluteIndex}>
              {
                questionnaireAnswerData.length > 0 ?
                  <RadioGroup className="mt-4" name={`use-radio-group-${absoluteIndex}`} defaultValue={questionnaireAnswerData[0].responses.responses[absoluteIndex].answer}>
                    {question.options.map((option, optionIndex) => (
                      <MyFormControlLabel key={optionIndex} value={option} label={option} control={<Radio disabled readOnly />} />
                    ))}
                  </RadioGroup> :

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
            </div>
          ) : (
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
          )}
        </motion.li>
      );
    });
  };
  function format(ms) {
    console.log({ ms });
    const date = new Date('1970-01-01 ' + ms);
    let formattedTime = undefined;
    console.log(date.getHours());

    if (date.getHours() > 0) {
      formattedTime = date.toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      formattedTime = formattedTime + " hr"
    } else {
      formattedTime = date.toLocaleTimeString('en-US', { minute: "2-digit", second: "2-digit" });
      formattedTime = formattedTime + " min"
    }

    return formattedTime;
  }

  const isLastPage = currentPage === totalPages;
  return (
    <div className="flex flex-col mt-5">
      <div className="bg-white rounded-md shadow-md border-t-[14px] border-[#6366f1]">
        <div className="my-7 mx-7">
          <div className='flex items-center'>
            <p className="text-black font-semibold text-3xl">{questionnaire.attributes.Title}</p>
            {
              questionnaireAnswerData.length > 0 &&
              <div className='flex   justify-between'>
                <Chip className='ml-auto' label="Completed" color="success" />
              </div>
            }
          </div>
          <div className='flex justify-between mt-7'>
            <p >{questionnaire.attributes.description}</p>
            <span className='text-gray-500'>{"Completed in: " + format(answers[0].timeToComplete)}</span>
          </div>

        </div>
      </div>
      <motion.ul
        initial="hidden"
        animate="visible"
        variants={list}
      >
        <div className="space-y-5 mt-5 ">{renderQuestionsForPage()}</div>
      </motion.ul>
      {isLastPage && (
        <div className="mt-5 flex justify-end">
          {
            completed === false ?
              <div>
                <span className='inline-flex w-[60px] text-gray-500'>{minutes}:{seconds < 10 ? "0" + seconds : seconds}</span>
                <button onClick={handleSubmission}
                  className="bg-blue-500 text-white font-semibold py-2 px-4 
                            rounded ml-auto hover:bg-blue-800 duration-150">
                  Submit
                </button>
              </div>
              :
              null
          }
        </div>
      )}
      <div className="flex items-center justify-between mt-5 mb-8 bg-white rounded-md shadow-md p-5 border-b-8 border-[#6366f1]">
        <button className='flex items-center hover:-translate-x-2 duration-200 mx-4 disabled:text-gray-300 disabled:translate-x-0' onClick={handlePrevPage} disabled={currentPage === 1}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
          </svg>
          Previous
        </button>
        <button className='flex items-center hover:translate-x-2 duration-200 mx-4 disabled:text-gray-300 disabled:translate-x-0' onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
          </svg>
        </button>
      </div>
    </div>
  );
};
