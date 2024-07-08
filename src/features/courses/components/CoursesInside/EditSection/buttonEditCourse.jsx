import { FiChevronRight } from "react-icons/fi";
import { useTranslation } from "react-i18next";
export function ButtonSettings({ setSettingsFlag, setVisible, setForumFlag, setParticipantsFlag }) {
    const { t } = useTranslation();
    return (
        <button onClick={() => { setSettingsFlag(true); setForumFlag(false); setParticipantsFlag(false); if (setVisible) setVisible(false) }}
            className="bg-white p-3 rounded-md  flex items-center w-full border border-[#DADADA] shadow-none xl:shadow-md xl:border-none xl:w-[30rem]">
            <div className="flex items-center gap-2 ml-2">
                <p className="font-medium text-md text-start">{t("COURSEINSIDE.SETTINGS.title")}</p>
            </div>
            <div className="flex items-center ml-auto mr-2 duration-100 hover:translate-x-1">
                <p className='text-base font-medium text-indigo-700 text-md text-start'>{t("COURSEINSIDE.SETTINGS.button_edit")}</p>
                <FiChevronRight className='text-indigo-700' />
            </div>
        </button>
    )
}