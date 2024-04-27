import { FiChevronRight } from "react-icons/fi";

export function ButtonSettings({ setSettingsFlag, setVisible, setForumFlag, setParticipantsFlag }) {
    return (
        <button onClick={() => { setSettingsFlag(true); setForumFlag(false); setParticipantsFlag(false); if (setVisible) setVisible(false) }}
            className="bg-white p-3 rounded-md  flex items-center w-full border border-[#DADADA] shadow-none xl:shadow-md xl:border-none xl:w-[30rem]">
            <div className="flex items-center gap-2 ml-2">
                <p className="text-lg font-medium"> Course Settings</p>
            </div>
            <div className="flex items-center ml-auto mr-2 duration-100 hover:translate-x-1">
                <p className='text-base font-medium text-indigo-700'>Edit course info</p>
                <FiChevronRight className='text-indigo-700' />
            </div>
        </button>
    )
}