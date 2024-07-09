import React, { useState } from 'react'
import { BsFillArrowLeftSquareFill } from 'react-icons/bs'
import { Link } from 'react-router-dom';
import { message } from 'antd';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond/dist/filepond.min.css';
import { useTranslation } from 'react-i18next';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
registerPlugin(FilePondPluginFileValidateSize);
registerPlugin(FilePondPluginImagePreview);

export const UserInformation = ({ onChange, formData, username, email, university, password, repassword, name, setPageSelector, setProfilePhoto, profilePhoto }) => {
    const { t } = useTranslation();
    function handleContinue() {
        if (!username || !email || !university || !password || !repassword || !name || profilePhoto.length === 0) {
            if (!username) message.error(t('REGISTER.fill_username'));
            if (!name) message.error(t('REGISTER.fill_name'));
            if (!email) message.error(t('REGISTER.fill_email'));
            if (!university) message.error(t('REGISTER.fill_university'));
            if (!password) message.error(t('REGISTER.fill_password'));
            if (!repassword) message.error(t('REGISTER.fill_repassword'));
            if (profilePhoto.length === 0) message.error(t('REGISTER.upload_profile_photo'));
            if (password.length < 6) message.error(t('REGISTER.password_length'));
        } else if (password !== repassword) {
            message.error(t('REGISTER.passwords_do_not_match'));
        }
        else {
            setPageSelector(2)
        }
    }

    return (
        <div class="bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden " style={{ maxWidth: '1000px' }} >
            <div className="w-full md:flex ">
                <div className="relative hidden w-1/2 px-10 py-10 md:block bg-image ">
                    <div className='w-[2rem]'>
                        <a href="/">
                            <BsFillArrowLeftSquareFill size={30} style={{ cursor: "pointer", color: "rgba(255, 255, 255, 1)" }} />
                        </a>
                    </div>
                    <div className='flex justify-center'>
                        <div className='absolute top-[16rem] w-2/4   '>
                            <h1 className='text-4xl font-medium text-white '>{t("REGISTER.card_title")}</h1>
                            <p className='my-5 text-white '>{t("REGISTER.card_text")}</p>
                        </div>
                    </div>
                    <div className='absolute inset-x-0 flex flex-col items-center bottom-7'>
                        <p className='text-sm text-center text-white' >{t("REGISTER.in_case")}</p>
                        <Link to="/auth/login" class="my-3 bg-white text-gray-800 font-bold rounded border-b-2 border-indigo-400  transition-all hover:border-indigo-400 hover:bg-indigo-400 hover:text-white shadow-md py-2 px-6 inline-flex items-center">
                            <span class="">{t("REGISTER.login")}</span>
                        </Link>
                    </div>
                </div>
                <div class="w-full md:w-1/2 py-10 px-5 md:px-10">
                    <div className="mb-10 text-center">
                        <h1 class="font-bold text-3xl text-gray-900">{t("REGISTER.register")}</h1>
                        <p>{t("REGISTER.enter_information")}</p>
                    </div>
                    <div>
                        <div class="flex -mx-3">
                            <div class="w-full px-3 mb-5">
                                <label for="" class="text-xs font-semibold px-1">{t("REGISTER.username")} *</label>
                                <div class="flex">
                                    <div class="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i class="mdi mdi-account text-gray-400 text-lg"></i></div>
                                    <input
                                        type="email"
                                        class="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                                        placeholder=""
                                        name='username'
                                        value={username}
                                        onChange={e => onChange(e)}
                                        required />
                                </div>
                            </div>
                        </div>
                        <div class="flex -mx-3">
                            <div class="w-full px-3 mb-5">
                                <label for="" class="text-xs font-semibold px-1">{t("REGISTER.name")} *</label>
                                <div class="flex">
                                    <div class="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i class="mdi mdi-account-group text-gray-400 text-lg"></i></div>
                                    <input
                                        type="email"
                                        class="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                                        placeholder=""
                                        name='name'
                                        value={name}
                                        onChange={e => onChange(e)}
                                        required />
                                </div>
                            </div>
                        </div>
                        <div class="flex -mx-3">
                            <div class="w-full px-3 mb-5">
                                <label for="" class="text-xs font-semibold px-1">{t("REGISTER.email")} *</label>
                                <div class="flex">
                                    <div class="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i class="mdi mdi-email-outline text-gray-400 text-lg"></i></div>
                                    <input
                                        type="email"
                                        class="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                                        placeholder=""
                                        name='email'
                                        value={email}
                                        onChange={e => onChange(e)}
                                        required />
                                </div>
                            </div>
                        </div>
                        <div class="flex -mx-3">
                            <div class="w-full px-3 mb-5">
                                <label for="" class="text-xs font-semibold px-1">{t("REGISTER.university")} *</label>
                                <div class="flex">
                                    <div class="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i class="mdi mdi-school text-gray-400 text-lg"></i></div>
                                    <input
                                        type="email"
                                        class="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                                        placeholder=""
                                        name='university'
                                        value={university}
                                        onChange={e => onChange(e)}
                                        required />
                                </div>
                            </div>
                        </div>
                        <div className='flex -mx-3'>
                            <div className="w-full px-3 mb-5">
                                <label for="" className="px-1 text-xs font-semibold">{t("REGISTER.profile_photo")} *</label>
                                <FilePond
                                    files={profilePhoto}
                                    labelIdle={t("DRAGANDDROP.drag_drop")}
                                    maxFileSize={'10MB'}
                                    beforeAddFile={(file) => {
                                        if (file.file.type !== 'image/jpeg' && file.file.type !== 'image/png') {
                                            message.error(t("DRAGANDDROP.invalid_type"))
                                            return false
                                        }
                                        if (file.file.size > 10485760) {
                                            message.error(t("DRAGANDDROP.large_file"))
                                            return false
                                        }

                                        setProfilePhoto([file.file])
                                        return true
                                    }}
                                    onremovefile={() => setProfilePhoto([])}
                                    maxFiles={1}
                                />
                            </div>
                        </div>
                        <div class="flex -mx-3">
                            <div class="w-full px-3 mb-12 relative">
                                <label for="" class="text-xs font-semibold px-1">{t("REGISTER.password")} *</label>
                                <div class="flex">
                                    <div class="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i class="mdi mdi-lock-outline text-gray-400 text-lg"></i></div>
                                    <input
                                        type="password"
                                        class="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                                        placeholder=""
                                        name='password'
                                        value={password}
                                        onChange={e => onChange(e)}
                                        minLength={6}
                                        required />
                                </div>
                            </div>
                            <div class="w-full px-3 mb-12 relative">
                                <label for="" class="text-xs font-semibold px-1">{t("REGISTER.repassword")} *</label>
                                <div class="flex">
                                    <div class="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i class="mdi mdi-lock-outline text-gray-400 text-lg"></i></div>
                                    <input
                                        type="password"
                                        class="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                                        placeholder=""
                                        name='repassword'
                                        value={repassword}
                                        onChange={e => onChange(e)}
                                        minLength={6}
                                        required />
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-center pt-7 mb-5">
                            <div class="w-full  sm:ml-8 mb-5 text-center ml-auto">
                                <button type="button" onClick={() => handleContinue()}
                                    className="flex items-center gap-2 ml-auto justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2  focus:outline-none">
                                    {t("REGISTER.continue")}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
