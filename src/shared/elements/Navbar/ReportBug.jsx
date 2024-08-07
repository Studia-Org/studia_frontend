import React, { useState } from 'react';
import { Button, Popover, message } from 'antd';
import { UploadFiles } from '../../../features/courses/components/CreateCourses/CourseSections/UploadFiles';
import { API } from '../../../constant';
import { getToken } from '../../../helpers';
import { useAuthContext } from '../../../context/AuthContext';
import { useTranslation } from 'react-i18next';
export const ReportBug = () => {
    const githubToken = process.env.REACT_APP_GITHUB_SECRET
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useAuthContext();
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        screenshot: null,
        message: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (fileList) => {
        setFormData({ ...formData, screenshot: fileList[0] });
    };

    const handleSubmit = async (e) => {
        let imageDataURL = null;
        setLoading(true);
        try {
            if (formData.message === '') {
                message.error(t('NAVBAR.BUG_REPORT.all_fields'));
                return;
            }
            if (formData.screenshot?.originFileObj) {
                const formDataScreenshot = new FormData();
                formDataScreenshot.append('files', formData.screenshot.originFileObj);
                const response = await fetch(`${API}/upload`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    },
                    body: formDataScreenshot,
                });
                const data = await response.json();
                imageDataURL = data[0].url;
            }
            // Crear la issue en GitHub

            const response = await fetch('https://api.github.com/repos/Studia-Org/studia_frontend/issues', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
                body: JSON.stringify({
                    title: `Bug report ${user.name} \n`,
                    body: `**Nombre:** ${user.name} \n` +
                        `**Email:** ${user.email} \n` +
                        `**Mensaje:** ${formData.message} \n` +
                        `![image-title](${imageDataURL})`
                    ,
                    labels: ['bug']
                })
            });
            if (response.ok) {
                // Issue creada exitosamente
                message.success(t('NAVBAR.BUG_REPORT.toast.title_success'));
            } else {
                // Manejar errores de la respuesta de GitHub
                message.error(t('NAVBAR.BUG_REPORT.toast.title_error'));
                console.error('Error al crear la issue:', response.statusText);
            }
        } catch (error) {
            // Manejar errores de red u otros errores
            message.error(t('NAVBAR.BUG_REPORT.toast.title_error'));
            console.error('Error al enviar la solicitud:', error);
        } finally {
            setLoading(false);
            setFormData({
                name: '',
                email: '',
                screenshot: null,
                message: ''
            })
            setOpen(false);
        }
    };

    const content = (
        <div className="w-full mx-auto md:w-96 md:max-w-full">
            <div className="p-6 mb-8 border border-gray-300 sm:rounded-md">
                <form>
                    <label className="block mb-6">
                        <span className="text-gray-700">{t('NAVBAR.BUG_REPORT.bug_description')}</span>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            rows="8"
                            placeholder={t('NAVBAR.BUG_REPORT.bug_description_placeholder')}
                        ></textarea>
                    </label>
                    <label className="block mb-6">
                        <span className="text-gray-700">{t('NAVBAR.BUG_REPORT.screenshot')} <span className='text-xs text-gray-500'>({t('NAVBAR.BUG_REPORT.optional')})</span></span>
                        <UploadFiles fileList={formData.screenshot ? [formData.screenshot] : []} setFileList={handleFileChange} listType={'picture'} maxCount={1} />
                    </label>

                    <div className="mb-6">
                        <Button
                            loading={loading}
                            onClick={handleSubmit}
                            className="h-10 px-5 transition-colors duration-150 rounded-lg focus:shadow-outline "
                        >
                            {t('NAVBAR.BUG_REPORT.send')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );

    const contentTitle = (
        <div className="flex flex-col max-w-md ">
            <h2 className="text-base font-medium">{t('NAVBAR.BUG_REPORT.bug_report_title')}</h2>
            <p className="my-2 text-sm font-normal text-gray-400">{t('NAVBAR.BUG_REPORT.bug_report_text')}</p>
        </div>
    );

    return (
        <Popover content={content} title={contentTitle}
            open={open}
            onOpenChange={() => setOpen(!open)}
            trigger="click">
            <Button shape="circle" className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
                </svg>
            </Button>
        </Popover>
    );
};
