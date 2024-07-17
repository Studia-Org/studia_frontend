import React, { useState } from 'react';
import { Upload, Alert, message } from 'antd';
import Papa from 'papaparse';
import { API, BEARER } from '../../../../../constant';
import { getToken } from '../../../../../helpers';
import { useTranslation } from 'react-i18next';

export const UploadFiles = ({ fileList, setFileList, listType, maxCount, accept, disabled, showRemoveIcon }) => {
    const [errors, setErrors] = useState([]);
    const { t } = useTranslation();

    const generateAlert = (message, index) => {
        return (
            <Alert
                key={index}
                message={message}
                className={`mb-2 ${index === 0 ? "mt-2" : ""}`}
                type="error"
                showIcon
                closable
                onClose={() => handleAlertClose(index)}
            />
        );
    };

    const handleAlertClose = (index) => {
        setErrors(prevErrors => prevErrors.filter((_, i) => i !== index));
    };

    const addError = (message) => {
        setErrors(prevErrors => [...prevErrors, message]);
    };

    const props = {
        name: 'file',
        maxCount: maxCount,
        fileList: fileList,
        listType: listType,
        accept: accept ? accept : '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.wmv,.flv,.mkv,.zip,.rar,.7z,.csv',
        multiple: true,
        action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        async beforeUpload(file) {
            const isLt10M = file.size / 1024 / 1024 < 10;
            let isCorrect = true;

            if (!isLt10M) {
                addError(t("UPLOADFILES.file_MB"));
                return false;
            }

            if (accept && file.type === 'text/csv') {
                await new Promise((resolve, reject) => {
                    Papa.parse(file, {
                        complete: function (results) {
                            for (let i = 0; i < results.data.length; i++) {
                                var expresionRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                if (!expresionRegular.test(results.data[i][0])) {
                                    if (results.data[i][0] === "") continue;
                                    addError(t("UPLOADFILES.csv_error"));
                                    isCorrect = false;
                                    break;
                                }
                            }
                            resolve();
                        }
                    });
                });
            }

            return isCorrect;
        },
        onChange(info) {
            let { status } = info.file;
            if (status !== undefined) {
                info.file.status = 'done';
                setFileList(info.fileList);
            }
        },
        onDrop(e) {
            e.preventDefault();
            const newFiles = Array.from(e.dataTransfer.files);
            setFileList([...fileList, ...newFiles]);
        },
    };

    const handleRemove = () => {
        return async (file) => {
            setFileList(fileList.filter((f) => f.uid !== file.uid));
            if (file?.IdFromBackend) {
                try {
                    await fetch(`${API}/upload/files/${file.IdFromBackend}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `${BEARER} ${getToken()}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    message.success(t("UPLOADFILES.file_removed_success"));
                } catch (error) {
                    console.error(t("UPLOADFILES.file_removed_error"), error);
                }
            }
        };
    };


    return (
        <>
            <Upload.Dragger onRemove={handleRemove()} showUploadList={{
                showRemoveIcon: showRemoveIcon,
                removeIcon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            }} disabled={disabled} {...props}>
                <div className='flex items-center justify-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                    </svg>
                </div>
                <p className="ant-upload-text">{t("UPLOADFILES.principal_text")}</p>
                <p className="px-5 ant-upload-hint">{t("UPLOADFILES.secondary_text")}</p>
            </Upload.Dragger>
            {errors.map((error, index) => generateAlert(error, index))}
        </>
    );
};
