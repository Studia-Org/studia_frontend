import { Empty, List, Modal, Typography } from 'antd'
import React, { useEffect, useState } from 'react'


export const RecommendationImprovement = ({ isModalOpen, setIsModalOpen, checkImprovement }) => {
    const [improved, setImproved] = useState([]);
    const [worsen, setStillToImprove] = useState([]);

    let localeWorsen = {
        emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Congratulations! You haven't worsened anything. Keep up the great work!" />,
    };

    let localeImprove = {
        emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="You haven't improved anything. Keep working!" />,
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    useEffect(() => {
        const improved = new Set();
        const worsen = new Set();
        if (checkImprovement.previous.length > 0 && checkImprovement.current.length > 0) {
            checkImprovement?.previous?.forEach(recommendation => {
                if (!checkImprovement.current.includes(recommendation)) {
                    improved.add(recommendation);
                }
            });
            checkImprovement.current.forEach(recommendation => {
                if (!checkImprovement.previous.includes(recommendation)) {
                    worsen.add(recommendation);
                }
            });
        }
        setImproved(Array.from(improved));
        setStillToImprove(['Se piensa que la motivación intrínseca es más útil que la motivación extrínseca. Sin embargo, puedes mejorar tu motivación extrínseca estableciendo una meta externa, como una calificación o ingresar a un curso de posgrado.']);

    }, [checkImprovement])


    return (
        <Modal title="Feedback SRL-O questionnaire" open={isModalOpen} onCancel={handleCancel} footer={null} width={"60rem"}>
            <p>What did you improve: </p>

            <List
                locale={localeImprove}
                className='my-3 border-r-[4rem] border-green-600 '
                bordered
                dataSource={improved}
                renderItem={(item) => (
                    <List.Item className='flex'>
                        <p className='mr-10'>{item}</p>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="absolute w-5 h-5 -right-[52px]">
                            <path d="M1 8.25a1.25 1.25 0 1 1 2.5 0v7.5a1.25 1.25 0 1 1-2.5 0v-7.5ZM11 3V1.7c0-.268.14-.526.395-.607A2 2 0 0 1 14 3c0 .995-.182 1.948-.514 2.826-.204.54.166 1.174.744 1.174h2.52c1.243 0 2.261 1.01 2.146 2.247a23.864 23.864 0 0 1-1.341 5.974C17.153 16.323 16.072 17 14.9 17h-3.192a3 3 0 0 1-1.341-.317l-2.734-1.366A3 3 0 0 0 6.292 15H5V8h.963c.685 0 1.258-.483 1.612-1.068a4.011 4.011 0 0 1 2.166-1.73c.432-.143.853-.386 1.011-.814.16-.432.248-.9.248-1.388Z" />
                        </svg>
                    </List.Item>
                )}
            />
            <List
                locale={localeWorsen}
                className='my-3 border-r-[4rem] border-red-700'
                bordered
                dataSource={worsen}
                renderItem={(item) => (
                    <List.Item>
                        <p className='mr-10'>{item}</p>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="absolute w-5 h-5 -right-[52px]">
                            <path d="M18.905 12.75a1.25 1.25 0 1 1-2.5 0v-7.5a1.25 1.25 0 0 1 2.5 0v7.5ZM8.905 17v1.3c0 .268-.14.526-.395.607A2 2 0 0 1 5.905 17c0-.995.182-1.948.514-2.826.204-.54-.166-1.174-.744-1.174h-2.52c-1.243 0-2.261-1.01-2.146-2.247.193-2.08.651-4.082 1.341-5.974C2.752 3.678 3.833 3 5.005 3h3.192a3 3 0 0 1 1.341.317l2.734 1.366A3 3 0 0 0 13.613 5h1.292v7h-.963c-.685 0-1.258.482-1.612 1.068a4.01 4.01 0 0 1-2.166 1.73c-.432.143-.853.386-1.011.814-.16.432-.248.9-.248 1.388Z" />
                        </svg>

                    </List.Item>
                )}
            />

        </Modal>
    )
}
