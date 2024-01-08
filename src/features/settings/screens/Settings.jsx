import { useEffect, useState, React } from 'react';
import { checkAuthenticated } from "../../../helpers";
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from "../../../context/AuthContext";
import SidebarSetting from '../components/SidebarSetting';
import { SettingContent } from '../components/SettingContent';

const Settings = () => {
  const [selectedOption, setSelectedOption] = useState('help');
  const { user } = useAuthContext();
  const navigate = useNavigate();
  document.title = 'Settings - Uptitude'  

  useEffect(() => {
    if (!checkAuthenticated()) {
      navigate('/');
    }
  }, []);


  return (

    <div className='max-w-full w-full max-h-full rounded-tl-3xl bg-[#e7eaf886] '>
      <div className=' font-bold text-2xl h-full '>
        <div className='flex h-full '>
          <div className=' h-full rounded-tl-3xl flex flex-col'>
            <SidebarSetting selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
          </div>
          <div className='p-2 w-full flex justify-center lg:block  '>
            <SettingContent selectedOption={selectedOption} user={user} setSelectedOption={setSelectedOption} />
          </div>
        </div>
      </div>
    </div>


  )
}

export default Settings;