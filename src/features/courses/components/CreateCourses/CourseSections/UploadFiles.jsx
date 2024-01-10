import React, { useState } from 'react';
import { Upload } from 'antd';


export const UploadFiles = ({ fileList, setFileList, listType, maxCount }) => {
    const [error, setError] = useState(null);

    console.log(fileList);

    const props = {
        name: 'file',
        maxCount: maxCount,
        fileList: fileList,
        listType: listType,
        accept: '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.wmv,.flv,.mkv,.zip,.rar,.7z',
        multiple: true,
        action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        beforeUpload(file) {
            const isLt10M = file.size / 1024 / 1024 < 10;
            if (!isLt10M) {
                setError('File must be smaller than 10MB');
                return false;
            }
            setError(null); 
            return true;
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
                <div className='flex justify-center items-center'>
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
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </>

    )
}
