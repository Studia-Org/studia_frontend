import React from 'react'
import { Modal } from 'antd'
import MDEditor from '@uiw/react-md-editor'
import { useTranslation } from 'react-i18next'

export const SubsectionContentModal = ({ isModalOpen, setIsModalOpen, setMarkdownContent, handleSubsectionChange, markdownContent }) => {
    const { t } = useTranslation()
    return (
        <Modal width={1200} title={t("CREATE_COURSES.COURSE_SECTIONS.EDIT_SECTION.EDIT_SUBSECTION.content")} open={isModalOpen}
            onOk={() => {
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
