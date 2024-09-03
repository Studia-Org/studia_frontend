import { Modal } from 'antd'
import React from 'react'

export const ShowSectionErrors = ({ subsectionErrors, isModalOpen, setIsModalOpen }) => {
    return (
        <Modal title="Basic Modal" open={isModalOpen} footer={null} onCancel={() => setIsModalOpen(false)}>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
        </Modal>
    )
}
