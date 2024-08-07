import React from 'react'
import { Modal, Button, Empty } from 'antd'
import { Trans } from 'react-i18next';

export const ModalFilesPR = ({ files, activityTitle, isModalOpen, setIsModalOpen, studentName = "" }) => {
    const downloadFile = async (file) => {
        try {
            const response = await fetch(file.url);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                console.error('Error al descargar el archivo');
            }
        } catch (error) {
            console.error('Error en la descarga: ', error);
        }
    };

    function renderFiles(file) {
        return (
            <Button onClick={() => downloadFile(file.attributes)} className='flex items-center w-full pl-4 border rounded-md p-7 '>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <p className='max-w-[100%] text-ellipsis overflow-x-hidden'>{file.attributes.name}</p>
            </Button>
        )
    }
    return (
        <Modal title={activityTitle} open={isModalOpen} onOk={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)}
            footer={[
                <Button key="submit" type="primary" onClick={() => setIsModalOpen(false)}>
                    OK
                </Button>
            ]}>
            <p className='text-sm text-gray-700'>
                <Trans i18nKey='QUALIFICATIONS.files_delivered_by'
                    components={{
                        student: studentName,
                        activity: activityTitle
                    }}
                />
            </p>
            {
                (files?.length === 0 || !files) &&
                <Empty className='mt-7' description='There are no files delivered' />
            }
            <div className='mt-3 space-y-5'>
                {files?.map(renderFiles)}
            </div>
        </Modal>
    )
}
