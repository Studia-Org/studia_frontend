import React, { useEffect, useState } from 'react'
import { ActivityComponent } from '../components/ActivityComponent'
import { Sidebar } from '../../../shared/elements/Sidebar';
import { useParams } from 'react-router-dom';
import { Navbar } from '../../../shared/elements/Navbar';
import { API } from '../../../constant';
import { useAuthContext } from '../../../context/AuthContext';

const Activity = () => {
  const { courseId, activityId } = useParams();
  const [userQualification, setUserQualification] = useState([]);
  const { user } = useAuthContext();

  const fetchUserQualificationsData = async () => {
    try {
      const response = await fetch(`${API}/users/${user.id}?populate=qualifications.activity,qualifications.evaluator.profile_photo,qualifications.file`);
      const data = await response.json();
      console.log((data.qualifications.filter(qualification => qualification.activity.id === Number(activityId))[0]))
      setUserQualification((data.qualifications.filter(qualification => qualification.activity.id === Number(activityId))[0]))
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserQualificationsData();
  }, [user]);

  return (
    <div>
      <div className='max-h-full max-w-full bg-white '>
        <Navbar />
        <div className='flex flex-wrap-reverse  min-h-[calc(100vh-8rem)]  sm:flex-nowrap bg-white'>
          <Sidebar section={'courses'} />
          <div className='max-w-full w-full max-h-full rounded-tl-3xl bg-[#e7eaf886] grid '>
            <div className='ml-12 '>
              {userQualification.activity && (
                <ActivityComponent activityData={userQualification} />
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Activity