import { useState, React } from 'react';
import { SettingsBreadcrumb } from './SettingsBreadcrumb';
import { motion } from 'framer-motion';
import { NotImplemented } from '../../../shared/elements/NotImplemented';
import { API } from "../../../constant";
import { Toast } from "../../../shared/elements/Toasts";
import { getToken } from "../../../helpers";
import { CustomFunctions } from './CustomFunctions';

export const SettingContent = ({ selectedOption, setSelectedOption }) => {
    const [isOldPasswordHidden, setOldPasswordHidden] = useState(true)
    const [isNewPasswordHidden, setNewPasswordHidden] = useState(true)
    const [isNewRePasswordHidden, setNewRePasswordHidden] = useState(true)

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordRepeat, setNewPasswordRepeat] = useState('')

    const contactMethods = [
        {
            icon:
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
            ,
            contact: "uptitudeapp@gmail.com"
        },
        {
            icon:
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
            ,
            contact: "Barcelona."
        },
    ]

    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };
    const transition = { duration: 0.3 };

    const limpiarCampos = () => {
        setTimeout(() => {
            const nameInput = document.querySelector('input[name="name"]');
            const emailInput = document.querySelector('input[name="email"]');
            const messageInput = document.querySelector('textarea[name="message"]');

            if (nameInput) nameInput.value = '';
            if (emailInput) emailInput.value = '';
            if (messageInput) messageInput.value = '';
        }, 1000);
    };


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
                text: 'Password has been updated',
                title: 'Success!'
            })
            setSelectedOption('help')

        } catch (error) {
            console.error(error.error);
            Toast.fire({
                icon: 'error',
                text: error.error.message,
                title: 'Failure'
            })
        }
    };

    return (
        <div>
            {selectedOption === 'password' && (
                <motion.div initial="hidden" animate="visible" exit="hidden" variants={variants} transition={transition}>
                    <main className="text-base py-14">
                        <div className="px-4 text-gray-600 md:px-8 ">
                            <SettingsBreadcrumb index={'Change password'} />
                            <div className='mt-16 '>
                                <div className='flex flex-col space-y-8 text-base font-normal'>
                                    <div>
                                        <label className="font-medium text-gray-600">
                                            Old Password
                                        </label>
                                        <div className="relative max-w-xs mt-2">
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
                                                placeholder="Enter your old password"
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="w-full py-2 pl-3 pr-12 text-gray-500 border rounded-lg shadow-sm outline-none focus:border-indigo-600"
                                            />
                                        </div>
                                    </div>
                                    <div>

                                        <label className="font-medium text-gray-600">
                                            New password
                                        </label>
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
                                                placeholder="Enter your new password"
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full py-2 pl-3 pr-12 text-gray-500 border rounded-lg shadow-sm outline-none focus:border-indigo-600"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="font-medium text-gray-600">
                                            Rewrite your new password
                                        </label>
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
                                                placeholder="Rewrite your password"
                                                onChange={(e) => setNewPasswordRepeat(e.target.value)}
                                                className="w-full py-2 pl-3 pr-12 text-gray-500 border rounded-lg shadow-sm outline-none focus:border-indigo-600"
                                            />
                                        </div>
                                    </div>
                                </div >
                                <button onClick={changePasswordButton}
                                    className="px-3 mt-8 py-1.5 text-sm text-white duration-150 bg-indigo-600 rounded-lg hover:bg-indigo-700 active:shadow-lg"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </main>
                </motion.div>
            )}
            {selectedOption === 'language' && (
                <motion.div initial="hidden" animate="visible" exit="hidden" variants={variants} transition={transition}>
                    <main className="text-base py-14">
                        <div className="max-w-screen-xl px-4 text-gray-600 md:px-8">
                            <SettingsBreadcrumb index={'Language'} />
                            <NotImplemented />
                        </div>
                    </main>
                </motion.div>
            )}

            {selectedOption === 'notification' && (
                <motion.div initial="hidden" animate="visible" exit="hidden" variants={variants} transition={transition}>
                    <main className="text-base py-14">
                        <div className="max-w-screen-xl px-4 text-gray-600 md:px-8">
                            <SettingsBreadcrumb index={'Notification preferences'} />
                            <NotImplemented />
                        </div>
                    </main>
                </motion.div>
            )}

            {selectedOption === 'customFunctions' && (
                <motion.div initial="hidden" animate="visible" exit="hidden" variants={variants} transition={transition}>
                    <main className="text-base py-14">
                        <div className="max-w-screen-xl px-4 text-gray-600 md:px-8">
                            <SettingsBreadcrumb index={'Custom functions'} />
                            <CustomFunctions />
                        </div>
                    </main>
                </motion.div>
            )}

            {selectedOption === 'help' && (
                <motion.div initial="hidden" animate="visible" exit="hidden" variants={variants} transition={transition}>
                    <main className="text-base py-14">
                        <div className="px-4 text-gray-600 md:px-8">
                            <div className="flex-wrap max-w-lg gap-24 lg:flex lg:max-w-none ">
                                <div className="max-w-lg space-y-3">
                                    <h3 className="font-semibold text-indigo-600">
                                        <SettingsBreadcrumb index={'Help'} />
                                    </h3>
                                    <div>

                                    </div>
                                    <p className="py-10 text-3xl font-bold text-gray-800 sm:text-4xl">
                                        Let us know how we can help
                                    </p>
                                    <p className='font-medium'>
                                        We’re here to help and answer any question you might have, We look forward to hearing from you! Please fill out the form, or use the contact information below.
                                    </p>
                                    <div>
                                        <ul className="flex flex-wrap items-center mt-6 gap-x-10 gap-y-6">
                                            {
                                                contactMethods.map((item, idx) => (
                                                    <li key={idx} className="flex items-center mt-6 gap-x-3">
                                                        <div className="flex-none text-gray-400 ">
                                                            {item.icon}
                                                        </div>
                                                        <p className='font-normal '>{item.contact}</p>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                </div>
                                <div className="flex-1 mt-20 min-w-[400px] max-w-2xl bg-white rounded p-7 shadow-lg ">
                                    <form
                                        method='POST'
                                        action='https://getform.io/f/qalowrqb'
                                        onSubmit={() => limpiarCampos()}
                                        className="space-y-5 font-normal"
                                    >
                                        <div>
                                            <label className="font-medium">
                                                Full name
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                name='name'
                                                className="w-full px-3 py-2 mt-2 text-gray-500 bg-transparent border rounded-lg shadow-sm outline-none focus:border-indigo-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="font-medium">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                name='email'
                                                className="w-full px-3 py-2 mt-2 text-gray-500 bg-transparent border rounded-lg shadow-sm outline-none focus:border-indigo-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="font-medium">
                                                Message
                                            </label>
                                            <textarea required name='message' className="w-full px-3 py-2 mt-2 bg-transparent border rounded-lg shadow-sm outline-none appearance-none resize-none h-36 focus:border-indigo-600"></textarea>
                                        </div>
                                        <button
                                            className="w-full px-4 py-2 font-medium text-white duration-150 bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-600"
                                        >
                                            Submit
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </main>
                </motion.div>
            )}
        </div>
    );
};

