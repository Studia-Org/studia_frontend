import React, { useState } from 'react'
import { SettingsBreadcrumb } from '../SettingsBreadcrumb'
import { useTranslation } from 'react-i18next'
import { API } from '../../../../constant'
import { getToken } from '../../../../helpers'
import { Toast } from "../../../../shared/elements/Toasts";


export const ChangePassword = ({ setSelectedOption }) => {
    const { t } = useTranslation()
    const [isOldPasswordHidden, setOldPasswordHidden] = useState(true)
    const [isNewPasswordHidden, setNewPasswordHidden] = useState(true)
    const [isNewRePasswordHidden, setNewRePasswordHidden] = useState(true)

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordRepeat, setNewPasswordRepeat] = useState('')

    const changePasswordButton = async (data) => {
        try {
            const response = await fetch(`${API}/auth/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                    currentPassword: currentPassword,
                    password: newPassword,
                    passwordConfirmation: newPasswordRepeat,
                }),
            });
            const responseData = await response.json();
            if (response.status !== 200) {
                throw responseData;
            }
            Toast.fire({
                icon: 'success',
                title: t("SETTINGS.CHANGE_PASSWORD.toast.title_success"),
                text: t("SETTINGS.CHANGE_PASSWORD.toast.success")
            })
            setSelectedOption('help')

        } catch (error) {
            console.error(error.error);
            Toast.fire({
                icon: 'error',
                title: t("SETTINGS.CHANGE_PASSWORD.toast.title_error"),
                text: t("SETTINGS.CHANGE_PASSWORD.toast.error")
            })
        }
    };


    return (
        <main className="w-full text-base py-14 md:w-1/2">
            <div className="w-full px-4 text-gray-600 md:px-8">
                <SettingsBreadcrumb index={t("SETTINGS.SIDEBAR.general")} />
                <h2 className='mt-8 text-lg text-black'>{t("SETTINGS.SIDEBAR.change_pswd")}</h2>
                <div className='mt-8 '>
                    <div className='flex flex-col w-full space-y-8 text-base font-normal'>
                        <div className='w-full'>
                            <label className="font-medium text-gray-600">{t("SETTINGS.CHANGE_PASSWORD.current_password")}</label>
                            <div className="relative w-full max-w-xs mt-2">
                                <button className="absolute inset-y-0 my-auto text-gray-400 right-3 active:text-gray-600"
                                    onClick={() => setOldPasswordHidden(!isOldPasswordHidden)}
                                >
                                    {
                                        isOldPasswordHidden ? (
                                            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>

                                        )
                                    }
                                </button>
                                <input
                                    type={isOldPasswordHidden ? "password" : "text"}
                                    placeholder={t("SETTINGS.CHANGE_PASSWORD.enter_current_password")}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full py-2 pl-3 pr-12 text-gray-500 border rounded-lg shadow-sm outline-none focus:border-indigo-600"
                                />
                            </div>
                        </div>
                        <div className='w-full'>

                            <label className="font-medium text-gray-600">{t("SETTINGS.CHANGE_PASSWORD.new_password")}</label>
                            <div className="relative max-w-xs mt-2">
                                <button className="absolute inset-y-0 my-auto text-gray-400 right-3 active:text-gray-600"
                                    onClick={() => setNewPasswordHidden(!isNewPasswordHidden)}
                                >
                                    {
                                        isNewPasswordHidden ? (
                                            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>

                                        )
                                    }
                                </button>
                                <input
                                    type={isNewPasswordHidden ? "password" : "text"}
                                    placeholder={t("SETTINGS.CHANGE_PASSWORD.enter_new_password")}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full py-2 pl-3 pr-12 text-gray-500 border rounded-lg shadow-sm outline-none focus:border-indigo-600"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="font-medium text-gray-600">{t("SETTINGS.CHANGE_PASSWORD.rewrite_password")}</label>
                            <div className="relative max-w-xs mt-2">
                                <button className="absolute inset-y-0 my-auto text-gray-400 right-3 active:text-gray-600"
                                    onClick={() => setNewRePasswordHidden(!isNewRePasswordHidden)}
                                >
                                    {
                                        isNewRePasswordHidden ? (
                                            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>

                                        )
                                    }
                                </button>
                                <input
                                    type={isNewRePasswordHidden ? "password" : "text"}
                                    placeholder={t("SETTINGS.CHANGE_PASSWORD.rewrite_new_password")}
                                    onChange={(e) => setNewPasswordRepeat(e.target.value)}
                                    className="w-full py-2 pl-3 pr-12 text-gray-500 border rounded-lg shadow-sm outline-none focus:border-indigo-600"
                                />
                            </div>
                        </div>
                    </div >
                    <button onClick={changePasswordButton}
                        className="px-3 mt-8 py-1.5 text-sm text-white duration-150 bg-indigo-600 rounded-lg hover:bg-indigo-700 active:shadow-lg"
                    >
                        {t("SETTINGS.CHANGE_PASSWORD.change_password")}
                    </button>
                </div>
            </div>
        </main>
    )
}
