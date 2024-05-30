import React, { useMemo } from 'react';
import { Button, Empty, Table, message } from 'antd';

const formatFileSize = (bytes) => {
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
};

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
            message.error('Something went wrong');
        }
    } catch (error) {
        message.error('Something went wrong: ', error);
    }
};

const DownloadButton = ({ file }) => (
    <Button
        shape='default'
        className='flex items-center justify-center h-auto px-3'
        onClick={() => downloadFile(file)}
    >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M13.75 7h-3v5.296l1.943-2.048a.75.75 0 0 1 1.114 1.004l-3.25 3.5a.75.75 0 0 1-1.114 0l-3.25-3.5a.75.75 0 1 1 1.114-1.004l1.943 2.048V7h1.5V1.75a.75.75 0 0 0-1.5 0V7h-3A2.25 2.25 0 0 0 4 9.25v7.5A2.25 2.25 0 0 0 6.25 19h7.5A2.25 2.25 0 0 0 16 16.75v-7.5A2.25 2.25 0 0 0 13.75 7Z" />
        </svg>
    </Button>
);

export const TaskFiles = ({ files }) => {
    const dataSource = useMemo(() => files?.map((file, index) => ({
        key: index,
        files: file.attributes.name,
        size: formatFileSize(file.attributes.size),
        download: <div className='flex items-center justify-center'><DownloadButton file={file.attributes} /></div>
    })), [files]);

    const columns = [
        {
            title: 'Activity files',
            dataIndex: 'files',
            key: 'files',
        },
        {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
        },
        {
            title: '',
            dataIndex: 'download',
            key: 'download',
        }
    ];

    if (!files?.length) {
        return (
            <div className='p-5 bg-white border rounded-md'>
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    className='mt-6'
                    description={<span className='font-normal text-gray-400'>Professor did not upload any files</span>}
                />
            </div>
        );
    } else {
        return (
            <Table
                dataSource={dataSource}
                columns={columns}
                className='border rounded-md'
                pagination={false}
            />
        );
    }
};
