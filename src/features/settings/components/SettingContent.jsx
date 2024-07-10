import { React } from 'react';
import { SettingsBreadcrumb } from './SettingsBreadcrumb';
import { motion } from 'framer-motion';
import { NotImplemented } from '../../../shared/elements/NotImplemented';
import { CustomFunctions } from './CustomFunctions';
import { useTranslation } from 'react-i18next';
import { ChangePassword } from './General/ChangePassword';
import { ChangeLanguage } from './General/ChangeLanguage';
export const SettingContent = ({ selectedOption, setSelectedOption }) => {

    const { t, i18n } = useTranslation();

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

    return (
        <div>
            {selectedOption === 'general' && (
                <motion.div initial="hidden" animate="visible" exit="hidden" variants={variants} transition={transition}>
                    <div className='flex flex-wrap'>
                        <ChangePassword setSelectedOption={setSelectedOption} />
                        <ChangeLanguage />
                    </div>

                </motion.div>
            )}
            {selectedOption === 'notification' && (
                <motion.div initial="hidden" animate="visible" exit="hidden" variants={variants} transition={transition}>
                    <main className="text-base py-14">
                        <div className="max-w-screen-xl px-4 text-gray-600 md:px-8">
                            <SettingsBreadcrumb index={t("SETTINGS.SIDEBAR.notifications_settings")} />
                            <NotImplemented />
                        </div>
                    </main>
                </motion.div>
            )}

            {selectedOption === 'customFunctions' && (
                <motion.div initial="hidden" animate="visible" exit="hidden" variants={variants} transition={transition}>
                    <main className="text-base py-14">
                        <div className="max-w-screen-xl px-4 text-gray-600 md:px-8">
                            <SettingsBreadcrumb index={t("SETTINGS.SIDEBAR.custom_functions")} />
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
                                        <SettingsBreadcrumb index={t("SETTINGS.SIDEBAR.help")} />
                                    </h3>
                                    <div>

                                    </div>
                                    <p className="py-10 text-3xl font-bold text-gray-800 sm:text-4xl">
                                        {t("SETTINGS.HELP.title")}
                                    </p>
                                    <p className='font-medium'>
                                        {t("SETTINGS.HELP.text")}
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
                                                {t("SETTINGS.HELP.form.name")}
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
                                                {t("SETTINGS.HELP.form.email")}
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
                                                {t("SETTINGS.HELP.form.message")}
                                            </label>
                                            <textarea required name='message' className="w-full px-3 py-2 mt-2 bg-transparent border rounded-lg shadow-sm outline-none appearance-none resize-none h-36 focus:border-indigo-600"></textarea>
                                        </div>
                                        <button
                                            className="w-full px-4 py-2 font-medium text-white duration-150 bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-600"
                                        >
                                            {t("SETTINGS.HELP.form.send")}
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

