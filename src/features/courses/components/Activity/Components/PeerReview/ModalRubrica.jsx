import React from 'react'
import { Button, Modal, Table } from 'antd';


export const ModalRubrica = ({ setIsModalOpen, isModalOpen, rubricData }) => {
    let transformedData = []
    if (rubricData.attributes?.Answers) {
        transformedData = Object.keys(rubricData.attributes.Answers).map((key) => {
            const numericValue = Object.keys(rubricData.attributes.Answers[key])[0];
            const comment = rubricData.attributes.Answers[key][numericValue];

            return {
                key: key,
                numericValue: numericValue,
                comment: comment,
            };
        });
    }

    const columns = [
        {
            title: 'Category',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Qualification',
            dataIndex: 'numericValue',
            key: 'numericValue',
        },
        {
            title: 'Comment',
            dataIndex: 'comment',
            key: 'comment',
        },
    ];
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <Modal title="Peer Review Answers" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <Table className='mt-5' dataSource={transformedData} columns={columns} pagination={false} />
        </Modal>
    )
}
