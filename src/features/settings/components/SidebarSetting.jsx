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
                    <button className='flex items-center pl-4 gap-3 hover:text-indigo-600 hover:translate-x-[5px] transition-all' onClick={() => handleOptionChange('general')}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M4.5 1.938a.75.75 0 0 1 1.025.274l.652 1.131c.351-.138.71-.233 1.073-.288V1.75a.75.75 0 0 1 1.5 0v1.306a5.03 5.03 0 0 1 1.072.288l.654-1.132a.75.75 0 1 1 1.298.75l-.652 1.13c.286.23.55.492.785.786l1.13-.653a.75.75 0 1 1 .75 1.3l-1.13.652c.137.351.233.71.288 1.073h1.305a.75.75 0 0 1 0 1.5h-1.306a5.032 5.032 0 0 1-.288 1.072l1.132.654a.75.75 0 0 1-.75 1.298l-1.13-.652c-.23.286-.492.55-.786.785l.652 1.13a.75.75 0 0 1-1.298.75l-.653-1.13c-.351.137-.71.233-1.073.288v1.305a.75.75 0 0 1-1.5 0v-1.306a5.032 5.032 0 0 1-1.072-.288l-.653 1.132a.75.75 0 0 1-1.3-.75l.653-1.13a4.966 4.966 0 0 1-.785-.786l-1.13.652a.75.75 0 0 1-.75-1.298l1.13-.653a4.965 4.965 0 0 1-.288-1.073H1.75a.75.75 0 0 1 0-1.5h1.306a5.03 5.03 0 0 1 .288-1.072l-1.132-.653a.75.75 0 0 1 .75-1.3l1.13.653c.23-.286.492-.55.786-.785l-.653-1.13A.75.75 0 0 1 4.5 1.937Zm1.14 3.476a3.501 3.501 0 0 0 0 5.172L7.135 8 5.641 5.414ZM8.434 8.75 6.94 11.336a3.491 3.491 0 0 0 2.81-.305 3.49 3.49 0 0 0 1.669-2.281H8.433Zm2.987-1.5H8.433L6.94 4.664a3.501 3.501 0 0 1 4.48 2.586Z" clipRule="evenodd" />
                        </svg>
                        <h2 className='font-normal tracking-tight text-left text-gray-700 hover:text-indigo-600'>{t("SETTINGS.SIDEBAR.general")}</h2>
                    </button>
                </div>
                <div className='space-y-4 '>
                    <h1 className='pb-1 text-lg font-semibold tracking-tight'>{t("SETTINGS.SIDEBAR.notifications")}</h1>
                    <button className='flex items-center pl-4 gap-3 hover:text-indigo-600 hover:translate-x-[5px] transition-all' onClick={() => handleOptionChange('notification')}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M12 5a4 4 0 0 0-8 0v2.379a1.5 1.5 0 0 1-.44 1.06L2.294 9.707a1 1 0 0 0-.293.707V11a1 1 0 0 0 1 1h2a3 3 0 1 0 6 0h2a1 1 0 0 0 1-1v-.586a1 1 0 0 0-.293-.707L12.44 8.44A1.5 1.5 0 0 1 12 7.38V5Zm-5.5 7a1.5 1.5 0 0 0 3 0h-3Z" clipRule="evenodd" />
                        </svg>

                        <h2 className='font-normal tracking-tight text-left text-gray-700 hover:text-indigo-600'>{t("SETTINGS.SIDEBAR.notifications_settings")}</h2>
                    </button>
                </div>

                {
                    user.role_str === 'admin' && (
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
