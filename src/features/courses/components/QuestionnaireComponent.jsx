import React, { useState } from 'react'
import { styled } from '@mui/material/styles';
import RadioGroup, { useRadioGroup } from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import FormControlLabel, {
  FormControlLabelProps,
} from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

export const QuestionnaireComponent = ({ questionnaire, answers }) => {

  console.log(questionnaire)

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

  const questionsPerPage = 5;
  const totalQuestions = questionnaire.attributes.Options.questionnaire.questions.length;
  const totalPages = Math.ceil(totalQuestions / questionsPerPage);

  const [currentPage, setCurrentPage] = useState(1);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const renderQuestionsForPage = () => {
    const startIdx = (currentPage - 1) * questionsPerPage;
    const endIdx = Math.min(startIdx + questionsPerPage, totalQuestions);
    const questionsForPage = questionnaire.attributes.Options.questionnaire.questions.slice(startIdx, endIdx);

    return questionsForPage.map((question, index) => (
      <div className="bg-white shadow-md rounded-md p-5 border-l-8 border-[#377ddf75]" key={index}>
        <p className="font-medium">{question.question}</p>

        {Array.isArray(question.options) ? (
          <RadioGroup className="mt-4" name={`use-radio-group-${index}`} defaultValue="first">
            {question.options.map((option, optionIndex) => (
              <MyFormControlLabel key={optionIndex} value={option} label={option} control={<Radio />} />
            ))}
          </RadioGroup>
        ) : (
          <div className='mt-5 flex w-full'>
            <TextField id="outlined-basic" label="" variant="filled" className='w-full'rows={3} multiline  />
          </div>

        )}
      </div>
    ));
  };

  return (
    <div className="flex flex-col mt-5">
      <div className="bg-white rounded-md shadow-md border-t-[14px] border-[#6366f1]">
        <div className="my-7 mx-7">
          <p className="text-black font-semibold text-3xl">{questionnaire.attributes.Title}</p>
          <p className="mt-7">{questionnaire.attributes.description}</p>
        </div>
      </div>
      <div className="space-y-5 mt-5 ">{renderQuestionsForPage()}</div>
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
