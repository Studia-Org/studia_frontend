import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Table, Radio, Input } from 'antd';

const { TextArea } = Input;

export const ScaleQuestionnaireForm = ({ questions, groupValues, setGroupValues, currentPage, questionnaireAnswerData, userResponses }) => {
    const startIdx = (currentPage - 1) * 10;
    let questionIndexAcc = 0

    console.log('questionnaireAnswerData', userResponses);
    const groupQuestions = (questions) => {
        const groupedQuestions = [];
        let currentGroup = { options: null, questions: [] };
        questions.forEach(question => {
            const optionsKey = JSON.stringify(question.options);
            if (currentGroup.options === null || optionsKey === JSON.stringify(currentGroup.options)) {
                if (currentGroup.options === null) {
                    currentGroup.options = question.options;
                }
                currentGroup.questions.push(question);
            } else {
                groupedQuestions.push(currentGroup);
                currentGroup = { options: question.options, questions: [question] };
            }
        });

        if (currentGroup.questions.length > 0) {
            groupedQuestions.push(currentGroup);
        }

        return groupedQuestions;
    };
    const groupedQuestions = groupQuestions(questions);

    const handleRadioChange = (questionIndex, value) => {
        setGroupValues(prevState => ({
            ...prevState,
            [questionIndex]: value
        }));
    };

    const generateQuestions = (group) => {
        const { options, questions } = group;


        if (!Array.isArray(options)) {
            return (
                <div>
                    {questions.map((question, questionIndex) => {
                        const absoluteIndex = startIdx + questionIndexAcc;
                        questionIndexAcc++;
                        const isDisabled = questionnaireAnswerData[0]?.responses?.responses?.length > 0 || userResponses[0]?.attributes?.responses?.responses.length > 0;
                        const defaultValue = isDisabled ? questionnaireAnswerData[0]?.responses?.responses[absoluteIndex].answer || userResponses[0]?.attributes?.responses?.responses[absoluteIndex].answer : '';
                        const value = isDisabled ? defaultValue : groupValues[absoluteIndex] || "";


                        return (
                            <div key={absoluteIndex} className='bg-white shadow-md rounded-md p-5 border-l-8 border-[#377ddf75]'>
                                <p className="mb-6 font-medium">{question.question}</p>
                                <TextArea
                                    id={`outlined-basic-${absoluteIndex}`}
                                    label=""
                                    disabled={isDisabled}
                                    defaultValue={defaultValue}
                                    value={value}
                                    onChange={!isDisabled ? (event) => handleRadioChange(absoluteIndex, event.target.value) : undefined}
                                    variant="filled"
                                    className='w-full'
                                    rows={3}
                                    multiline
                                />
                            </div>
                        );
                    })}
                </div>
            );
        } else {
            const data = () => {
                return questions.map((question, questionIndex) => {
                    const absoluteIndex = startIdx + questionIndexAcc;
                    questionIndexAcc++;

                    const row = {
                        key: questionIndexAcc,
                        empty: question.question,
                    };

                    if (questionnaireAnswerData[0] || userResponses[0]) {
                        question.options.forEach((option, index) => {
                            row[`option${index}`] = (
                                <Radio
                                    disabled
                                    checked={questionnaireAnswerData[0]?.responses?.responses[absoluteIndex]?.answer === option || userResponses[0].attributes.responses.responses[absoluteIndex]?.answer === option}
                                    onChange={() => {
                                        setGroupValues((prevState) => ({
                                            ...prevState,
                                            [absoluteIndex]: option,
                                        }));
                                    }}
                                />
                            );
                        });
                    } else {
                        question.options.forEach((option, index) => {
                            row[`option${index}`] = (
                                <Radio
                                    checked={groupValues[absoluteIndex] === option}
                                    onChange={() => {
                                        setGroupValues((prevState) => ({
                                            ...prevState,
                                            [absoluteIndex]: option,
                                        }));
                                    }}
                                />
                            );
                        });
                    }
                    return row;
                });
            };
            const columns = () => {
                const columns = [
                    {
                        title: '',
                        dataIndex: 'empty',
                        key: 'empty',
                        width: '100%',
                    },
                ];

                options.forEach((option, index) => {
                    columns.push({
                        title: option,
                        className: 'text-center',
                        dataIndex: `option${index}`,
                        key: `option${index}`,
                    });
                });

                return columns;
            };

            return (
                <Table
                    pagination={false}
                    className="shadow-md border-l-8 border-[#377ddf75] rounded-md"
                    columns={columns()}
                    dataSource={data()}
                />
            )
        }
    }

    return (
        groupedQuestions.map(generateQuestions)
    );
};

ScaleQuestionnaireForm.propTypes = {
    questions: PropTypes.arrayOf(
        PropTypes.shape({
            question: PropTypes.string.isRequired,
            options: PropTypes.arrayOf(PropTypes.string).isRequired,
        })
    ).isRequired,
    groupValues: PropTypes.object.isRequired,
    setGroupValues: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
};
