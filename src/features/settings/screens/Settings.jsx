import { useEffect, useState, React } from 'react';
import { checkAuthenticated } from "../../../helpers";
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from "../../../context/AuthContext";
import SidebarSetting from '../components/SidebarSetting';
import { SettingContent } from '../components/SettingContent';

const Settings = () => {
  const [selectedOption, setSelectedOption] = useState('help');
  const { user } = useAuthContext();
  document.title = 'Settings - Uptitude'

  return (
    <div className='max-w-full w-full max-h-full rounded-tl-3xl bg-[#e7eaf886] '>
      <div className='h-full text-2xl font-bold '>
        <div className='flex h-full '>
          <div className='flex flex-col h-full rounded-tl-3xl'>
            <SidebarSetting selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
          </div>
          <div className='flex justify-center w-full p-2 lg:block '>
            <SettingContent selectedOption={selectedOption} user={user} setSelectedOption={setSelectedOption} />
          </div>
        </div>
      </div>
    </div>


  )
}

export default Settings;