import { useEffect, useState, React } from 'react';
import { checkAuthenticated } from "../../../helpers";
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from "../../../context/AuthContext";
import { Sidebar } from '../../../shared/elements/Sidebar';
import { Navbar } from '../../../shared/elements/Navbar';
import SidebarSetting from '../components/SidebarSetting';
import { SettingContent } from '../components/SettingContent';

const Settings = () => {
  const [selectedOption, setSelectedOption] = useState('help');
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkAuthenticated()) {
      navigate('/');
    }
  }, []);


  return (
    <div className='max-h-full  bg-white '>
      <Navbar />
      <Sidebar section={'courses'} />
      <div className='flex min-h-[calc(100vh-8rem)] md:ml-64 md:min-w-[calc(100vw-16rem)] md:flex-nowrap bg-white'>
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
      </div>
    </div>

  )
}

export default Settings;