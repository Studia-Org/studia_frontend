import React, { useState } from 'react';
import { Upload } from 'antd';
import Papa from 'papaparse';

export const UploadFiles = ({ fileList, setFileList, listType, maxCount, accept }) => {
    const [error, setError] = useState(null);

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
            setError(null);

            if (!isLt10M) {
                setError('File must be smaller than 10MB');
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
                                    setError("Not a valid email detected in the CSV file\nPlease check if file format is correct\nRenaming the file to .csv may not work");
                                    isCorrect = false;
                                    break;
                                }
                            }
                            resolve();
                        }
                    });
                });
            }

            if (isCorrect) setError(null);
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
            e.dataTransfer.files.forEach((file) => {
                setFileList([...fileList, file]);
            });
        },
    };
    return (
        <>
            <Upload.Dragger {...props}>
                <div className='flex items-center justify-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                    </svg>
                </div>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                    banned files.
                </p>
            </Upload.Dragger>
            {error && <pre style={{ color: 'red' }}>{error}</pre>}
        </>

    )
}
