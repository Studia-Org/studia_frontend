import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Table, Radio } from 'antd';

export const ScaleQuestionnaireForm = ({ questions, groupValues, setGroupValues, currentPage }) => {
    const startIdx = (currentPage - 1) * 10;

    const generateColumns = () => {
        const columns = [
            {
                title: '',
                dataIndex: 'empty',
                key: 'empty',
                width: '100%',
            },
        ];

        questions[0].options.forEach((option, index) => {
            columns.push({
                title: option,
                className: 'text-center',
                dataIndex: `option${index}`,
                key: `option${index}`,
            });
        });

        return columns;
    };

    const generateData = () => {
        return questions.map((question, questionIndex) => {
            const absoluteIndex = startIdx + questionIndex;
            const row = {
                key: questionIndex,
                empty: question.question,
            };

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

            return row;
        });
    };

    const columns = useMemo(generateColumns, [questions]);
    const data = useMemo(generateData, [questions, groupValues, startIdx, setGroupValues]);

    return (
        <>
            <Table
                pagination={false}
                className="shadow-md border-l-8 border-[#377ddf75] rounded-md"
                columns={columns}
                dataSource={data}
            />
        </>
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
