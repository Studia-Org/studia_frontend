import React from 'react'
import { Modal, Input, InputNumber } from 'antd'

const { TextArea } = Input;

export const ModalEditQualification = ({ student, saveChangesButton, setIsModalOpen, isModalOpen, placeholderComment,
    placeholderQualification, qualification, comments, setQualifications, setComments }) => {
    const handleOk = () => {
        saveChangesButton(student.id)
    };

    const handleCancel = () => {
        setQualifications('')
        setComments('')
        setIsModalOpen(false)
    };
    return (
        <Modal title="Edit qualification" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <p>Qualification</p>
            <InputNumber className='w-full mb-3' min={1} max={10} value={qualification} placeholder={placeholderQualification} onChange={(e) => setQualifications(e)} />
            <p>Description</p>
            <TextArea rows={4} value={comments} placeholder={placeholderComment} onChange={(e) => setComments(e.target.value)} />
        </Modal>
    )
}
