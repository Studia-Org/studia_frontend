import React from 'react'
import { Modal, Table } from 'antd';
import { useTranslation } from 'react-i18next';

export const ModalRubrica = ({ setIsModalOpen, isModalOpen, rubricData }) => {
    const { t } = useTranslation();
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
            title: '',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: t("QUALIFICATIONS.qualification"),
            dataIndex: 'numericValue',
            key: 'numericValue',
        },
        {
            title: t("QUALIFICATIONS.comments"),
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
        <Modal title={t("PEERREVIEW.peer_review_answers")} width={1000} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} cancelText={t("COMMON.cancel")}>
            <Table className='w-full mt-5' dataSource={transformedData} columns={columns} pagination={false} />
        </Modal>
    )
}
