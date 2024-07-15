import React from 'react'
import { Modal, Button, Empty } from 'antd'
import { Trans, useTranslation } from 'react-i18next';

export const ModalFiles = ({ grade, isModalOpen, setIsModalOpen, student, group = false }) => {
    const title = grade?.attributes?.activity?.data?.attributes?.title
    const { t } = useTranslation();
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

    function renderFiles(file, index) {

        return (
            <Button key={index} onClick={() => downloadFile(file.attributes)} className='flex items-center w-full pl-4 border rounded-md p-7'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <p className='max-w-[100%] overflow-x-hidden text-ellipsis'>{file.attributes.name}</p>
            </Button>
        )
    }
    return (
        <Modal title={title} open={isModalOpen} onOk={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)}
            footer={[
                <Button key="submit" type="primary" onClick={() => setIsModalOpen(false)}>
                    OK
                </Button>
            ]}>
            {group === false && <p className='text-sm text-gray-700'>
                <Trans i18nKey='QUALIFICATIONS.files_delivered_by'
                    components={{
                        student: student.attributes.name,
                        activity: title
                    }}
                />

            </p>}
            {
                (grade?.attributes?.file?.data?.length === 0 || !grade?.attributes?.file.data) &&
                <Empty className='mt-7' description={t("QUALIFICATIONS.no_files_delivered")} />
            }
            <div className='mt-3 space-y-5'>
                {grade?.attributes?.file?.data?.map(renderFiles)}
            </div>
        </Modal>
    )
}
