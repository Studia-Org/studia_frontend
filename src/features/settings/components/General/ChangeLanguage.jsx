import { Select } from 'antd';
import React from 'react'
import { useTranslation } from 'react-i18next'

export const ChangeLanguage = () => {
    const { t, i18n } = useTranslation();

    const changeLng = async (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem("lng", lng);
    }

    return (
        <main className="w-full text-base md:w-1/2 py-14">
            <div className="w-full max-w-screen-xl px-4 text-gray-600 md:px-8">
                <h2 className='text-lg text-black mt-[3.2rem]'>{t("SETTINGS.SIDEBAR.language")}</h2>
                <main className="w-full text-base py-14">
                    <form className="flex flex-wrap items-center w-full text-gray-600 gap-x-4 ">
                        <Select
                            className='w-1/2'
                            size='large'
                            defaultValue={i18n.language}
                            onChange={changeLng}
                            options=
                            {
                                [
                                    {
                                        value: 'en',
                                        label:
                                            <div className='flex items-center gap-2'>
                                                <img className='w-5 h-4 rounded' src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/2560px-Flag_of_the_United_Kingdom_%283-5%29.svg.png" alt="" />
                                                {t("SETTINGS.LANGUAGE.english")}
                                            </div>
                                    },
                                    {
                                        value: 'es',
                                        label:
                                            <div className='flex items-center gap-2'>
                                                <img className='w-5 h-4 rounded' src="https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg" alt="" />
                                                <p>{t("SETTINGS.LANGUAGE.spanish")}</p>
                                            </div>
                                    },
                                    {
                                        value: 'ca',
                                        label:
                                            <div className='flex items-center gap-2'>
                                                <img className='w-5 h-4 rounded' src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Flag_of_Catalonia.svg" alt="" />
                                                {t("SETTINGS.LANGUAGE.catalan")}
                                            </div>
                                    }
                                ]
                            }
                        />
                    </form>
                </main>
            </div>
        </main>
    )
}
