import React, { useState } from 'react'
import { UploadFiles } from '../../CreateCourses/CourseSections/UploadFiles';
import { Select, Avatar, Button, Modal, message } from 'antd';
import { Trans, useTranslation } from 'react-i18next';

export const AddParticipants = ({ participants, addedParticipants, addParticipant, deleteParticipant, setSelected, addType, selected }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const { t } = useTranslation();
    const { Option } = Select;
    const translatedType = t(`COURSEINSIDE.SETTINGS.${addType}`)
    const showModal = () => {
        setIsModalOpen(true);
    };

    const onChange = (value) => {
        setSelected(participants.find(item => item.id === value))
    };

    const uploadCSV = () => {
        setLoading(true);
        if (files.length === 0) {
            message.error('No file selected.');
            setLoading(false);
            return;
        }
        const file = files[0].originFileObj;
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const lines = content.split('\n');
            lines.forEach((line) => {
                const cleanLine = line.replace(/["\r]/g, '');
                const columns = cleanLine.split(',');
                const email = columns[0].trim();
                const participant = participants.find(item => item.email === email);
                if (participant) {
                    addParticipant(participant);
                }
            });
            setLoading(false);
            setIsModalOpen(false);
            message.success('Participants imported successfully.');
        };

        reader.onerror = (e) => {
            setLoading(false);
            message.error('Error occurred while reading the file.');
        };

        // Especificamos la codificación al leer el archivo
        reader.readAsText(file, 'utf-8');
    }


    return (
        <div className='sm:col-span-6'>
            <div className="space-y-2">
                <div className="space-y-1">
                    <div className='flex items-center'>
                        <label htmlFor="add-team-members" className="block text-sm font-medium text-gray-700">
                            {t("COMMON.add")} {translatedType}
                        </label>
                        <label className='block ml-auto text-sm font-medium text-gray-700'>{translatedType}: {addedParticipants?.length}</label>
                    </div>
                    <p className='text-xs text-gray-600'>{t("COURSEINSIDE.SETTINGS.reminder_add")}</p>


                    <div className="flex items-center">
                        <div className="flex-grow mt-3">
                            <Select
                                className='w-full'
                                showSearch
                                placeholder="Select a student"
                                optionFilterProp="label"
                                onChange={onChange}
                                filterOption={true}
                                optionLabelProp='label'
                            >
                                {participants.map(item => (
                                    <Option key={item.id} value={item.id} label={item.name}>
                                        <div className='flex items-center gap-3'>
                                            <Avatar src={item.profile_photo?.url}></Avatar>
                                            <p className='font-medium'>{item.name}</p>
                                        </div>
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <span className="mt-3 ml-3">
                            <Button
                                type="default"
                                onClick={() => addParticipant(selected)}
                                className="inline-flex items-center gap-2 bg-gray-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm.75-10.25v2.5h2.5a.75.75 0 0 1 0 1.5h-2.5v2.5a.75.75 0 0 1-1.5 0v-2.5h-2.5a.75.75 0 0 1 0-1.5h2.5v-2.5a.75.75 0 0 1 1.5 0Z" clipRule="evenodd" />
                                </svg>
                                <span>{t("COMMON.add")}</span>
                            </Button>
                        </span>
                        <span className="mt-3 ml-3">
                            <Button
                                type="default"
                                className="inline-flex items-center gap-2 bg-gray-200"
                                onClick={() => showModal()}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M4 2a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5V6.621a1.5 1.5 0 0 0-.44-1.06L9.94 2.439A1.5 1.5 0 0 0 8.878 2H4Zm4 9.5a.75.75 0 0 1-.75-.75V8.06l-.72.72a.75.75 0 0 1-1.06-1.06l2-2a.75.75 0 0 1 1.06 0l2 2a.75.75 0 1 1-1.06 1.06l-.72-.72v2.69a.75.75 0 0 1-.75.75Z" clipRule="evenodd" />
                                </svg>
                                <span>{t("ACTIVITY.create_groups.import_from_csv")}</span>
                            </Button>
                            <Modal title={<Trans
                                i18nKey="COURSEINSIDE.SETTINGS.import_from_csv"
                                values={{ type: translatedType }}
                            />} open={isModalOpen}
                                onCancel={() => setIsModalOpen(false)}
                                footer={[
                                    <Button key="back" onClick={() => setIsModalOpen(false)} className='bg-gray-200'>
                                        {t("COMMON.cancel")}
                                    </Button>,
                                    <Button key="submit" type="primary" loading={loading} onClick={uploadCSV}>
                                        {t("COMMON.import")}
                                    </Button>,
                                ]}
                            >
                                <p>{t("ACTIVITY.create_groups.please_upload_csv")}</p>
                                <ol className='mb-5 ml-10 list-disc'>
                                    <li>{t("COURSEINSIDE.SETTINGS.column1_student_email")}</li>
                                </ol>
                                <p>{t("COMMON.for_example")}:</p>
                                <img className='my-3' src={'https://res.cloudinary.com/dnmlszkih/image/upload/v1704474229/hwqyzbtduejhu3bwjrle.png'} alt="" />
                                <UploadFiles fileList={files} setFileList={setFiles} listType={'picture'} maxCount={1} />
                            </Modal>
                        </span>
                    </div>
                </div>

                <div className="border-b border-gray-200 overflow-y-auto max-h-[20rem]">
                    <ul className="divide-y divide-gray-200">
                        {addedParticipants?.map((person) => (
                            <li key={person.id} className="flex items-center py-4">
                                <img className="w-10 h-10 rounded-full" src={person?.attributes ? person?.attributes.profile_photo.data?.attributes.url : person?.profile_photo?.url} alt="" />
                                <div className="flex flex-col ml-3">
                                    <span className="text-sm font-medium text-gray-900">{person?.attributes ? person.attributes.name : person.name}</span>
                                    <span className="text-sm text-gray-500">{person?.attributes ? person.attributes.email : person.email}</span>
                                </div>
                                <svg onClick={() => deleteParticipant(person)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-auto cursor-pointer">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                                </svg>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
