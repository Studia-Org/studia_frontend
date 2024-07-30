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
        setStillToImprove(Array.from(worsen));
    }, [checkImprovement])

    return (
        <Modal title="Improvements" open={isModalOpen} onCancel={handleCancel} footer={null} width={"60rem"}>
            <p>What did you improve: </p>

            <List
                className='my-3 bg-green-200'
                bordered
                dataSource={improved}
                renderItem={(item) => (
                    <List.Item className='flex'>
                        <p className='mr-10'>{item}</p>

                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="absolute w-5 h-5 right-4">
                            <path d="M1 8.25a1.25 1.25 0 1 1 2.5 0v7.5a1.25 1.25 0 1 1-2.5 0v-7.5ZM11 3V1.7c0-.268.14-.526.395-.607A2 2 0 0 1 14 3c0 .995-.182 1.948-.514 2.826-.204.54.166 1.174.744 1.174h2.52c1.243 0 2.261 1.01 2.146 2.247a23.864 23.864 0 0 1-1.341 5.974C17.153 16.323 16.072 17 14.9 17h-3.192a3 3 0 0 1-1.341-.317l-2.734-1.366A3 3 0 0 0 6.292 15H5V8h.963c.685 0 1.258-.483 1.612-1.068a4.011 4.011 0 0 1 2.166-1.73c.432-.143.853-.386 1.011-.814.16-.432.248-.9.248-1.388Z" />
                        </svg>

                    </List.Item>
                )}
            />
            <p>What did you worsen:</p>

            <List
                locale={localeWorsen}
                className='my-3 '
                bordered
                dataSource={worsen}
                renderItem={(item) => (
                    <List.Item>
                        {item}
                    </List.Item>
                )}
            />

        </Modal>
    )
}
