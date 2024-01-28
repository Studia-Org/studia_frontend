import React from 'react'
import { Modal } from 'antd'
import MDEditor from '@uiw/react-md-editor'

export const SubsectionContentModal = ({ isModalOpen, setIsModalOpen, setMarkdownContent, handleSubsectionChange, markdownContent }) => {
    return (
        <Modal width={1200} title="Subsection Content" open={isModalOpen} onOk={() => {
            setIsModalOpen(false)
            handleSubsectionChange('content', markdownContent)
            document.body.style.overflow = 'auto';
        }} onCancel={() => {
            setIsModalOpen(false)
            document.body.style.overflow = 'auto';
        }}>
            <MDEditor className='mt-2 mb-2' data-color-mode='light' height={500} onChange={setMarkdownContent}
                value={markdownContent} visibleDragbar={false} />
        </Modal>
    )
}
