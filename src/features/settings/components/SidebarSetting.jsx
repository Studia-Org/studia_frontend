import React, { useState } from 'react';
import { FiBell, FiLogOut, FiLock } from 'react-icons/fi';
import { FaLanguage } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { BiHelpCircle } from 'react-icons/bi';
import Swal from 'sweetalert2'
import { removeToken } from "../../../helpers";
import { useAuthContext } from '../../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const SidebarSetting = ({ setSelectedOption }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { setAuthenticated } = useAuthContext();
    const { user } = useAuthContext();
    const { t } = useTranslation();

    const navigate = useNavigate();

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    const toggleDropdown = () => {
        setIsOpen((prevIsOpen) => !prevIsOpen);
    };

    function logOut() {
        Swal.fire({
            title: t("SETTINGS.LOGOUT.swal.title"),
            text: t("SETTINGS.LOGOUT.swal.text"),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t("SETTINGS.LOGOUT.swal.confirm"),
            cancelButtonText: t("SETTINGS.LOGOUT.swal.cancel")
        }).then((result) => {
            if (result.isConfirmed) {
                removeToken();
                setAuthenticated(false);
                navigate('/');
                Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                }).fire({
                    icon: 'success',
                    title: t("SETTINGS.LOGOUT.toast.title_success")
                })
            }
        })
    }
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            setIsOpen(false);
        }
    })

    return (
        <>
            <button
                onClick={toggleDropdown}
                className='absolute p-4 text-blue-600 lg:hidden'
            >
                <svg
                    className={`w-6 h-6 ${isOpen ? 'transform rotate-90' : ''}`}
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M19 9l-7 7-7-7'
                    />
                </svg>
            </button>

            <div className={`lg:rounded-tl-3xl h-full bg-[#eaedfa] pl-12 p-9 text-base space-y-6 border-r border-[#b7bcd4] ${isOpen ? 'fixed w-96' : 'hidden lg:block'}`}>
                <button
                    onClick={toggleDropdown}
                    className='absolute top-0 right-0 p-4 text-blue-600 lg:hidden'
                >
                    <svg
                        className={`w-6 h-6  ${isOpen ? 'transform rotate-90' : ''}`}
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M19 9l-7 7-7-7'
                        />
                    </svg>
                </button>
                <div className='space-y-4'>
                    <h1 className='pb-1 text-lg font-semibold tracking-tight'>{t("SETTINGS.SIDEBAR.user_account")}</h1>
                    <button className='flex items-center pl-4 gap-3 hover:text-indigo-600 hover:translate-x-[5px] transition-all' onClick={() => handleOptionChange('password')}>
                        <FiLock />
                        <h2 className='font-normal tracking-tight text-left text-gray-700 hover:text-indigo-600'>{t("SETTINGS.SIDEBAR.change_pswd")}</h2>
                    </button>

                    <button className='flex items-center pl-4 gap-3 hover:text-indigo-600 hover:translate-x-[5px] transition-all' onClick={() => handleOptionChange('language')}>
                        <FaLanguage />
                        <h2 className='font-normal tracking-tight text-left text-gray-700 hover:text-indigo-600'>{t("SETTINGS.SIDEBAR.language")}</h2>
                    </button>
                </div>
                <div className='space-y-4 '>
                    <h1 className='pb-1 text-lg font-semibold tracking-tight'>{t("SETTINGS.SIDEBAR.notifications")}</h1>
                    <button className='flex items-center pl-4 gap-3 hover:text-indigo-600 hover:translate-x-[5px] transition-all' onClick={() => handleOptionChange('notification')}>
                        <FiBell />
                        <h2 className='font-normal tracking-tight text-left text-gray-700 hover:text-indigo-600'>{t("SETTINGS.SIDEBAR.notifications_settings")}</h2>
                    </button>
                </div>

                {
                    user.role_str !== 'admin' && (
                        <div className='space-y-4 '>
                            <h1 className='pb-1 text-lg font-semibold tracking-tight'>{t("SETTINGS.SIDEBAR.admin_settings")}</h1>
                            <button className='flex items-center pl-4 gap-3 hover:text-indigo-600 hover:translate-x-[5px] transition-all' onClick={() => handleOptionChange('customFunctions')}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                                </svg>
                                <h2 className='font-normal tracking-tight text-left text-gray-700 hover:text-indigo-600'>{t("SETTINGS.SIDEBAR.custom_functions")}</h2>
                            </button>
                        </div>
                    )
                }

                <div className='space-y-3'>
                    <hr className='mt-24 border-[#b7bcd4]' />
                    <button className='flex items-center gap-2 hover:text-indigo-600 hover:translate-x-[5px] transition-all mt-14 pt-2' onClick={() => handleOptionChange('help')}>
                        <BiHelpCircle className='w-5 h-5' />
                        <h1 className='pb-1 text-base font-medium tracking-tight '>{t("SETTINGS.SIDEBAR.help")}</h1>
                    </button>
                    <button className='flex items-center gap-2 hover:text-indigo-600 hover:translate-x-[5px] transition-all' onClick={() => logOut()}>
                        <FiLogOut className='w-5 h-5' />
                        <h1 className='pb-1 text-base font-medium tracking-tight'>{t("SETTINGS.SIDEBAR.logout")}</h1>
                    </button>
                </div>
            </div>
        </>
    );
};

export default SidebarSetting; 
