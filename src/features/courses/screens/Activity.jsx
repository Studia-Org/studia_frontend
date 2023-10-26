import React, { useEffect, useState } from "react";
import { ActivityComponent } from "../components/ActivityComponent";
import { Sidebar } from "../../../shared/elements/Sidebar";
import { useParams } from "react-router-dom";
import { Navbar } from "../../../shared/elements/Navbar";
import { API } from "../../../constant";
import { useAuthContext } from "../../../context/AuthContext";

const Activity = () => {
  const { courseId, activityId } = useParams();
  const [userQualification, setUserQualification] = useState([]);

  const { user } = useAuthContext();

  const fetchUserQualificationsData = async () => {
    try {
      const response = await fetch(
        `${API}/users/${user.id}?populate=qualifications.activity,qualifications.evaluator.profile_photo,qualifications.file`
      );
      const data = await response.json();
      console.log(activityId);
      const dataFiltered = data.qualifications.filter(
        (qualification) => qualification.activity.id === Number(activityId)
      )[0];
      console.log(dataFiltered);
      if (dataFiltered !== undefined) {
        setUserQualification(dataFiltered);
      } else {
        const activityData = await fetch(
          `${API}/activities/${activityId}?populate=*`
        );
        const data = await activityData.json();
        setUserQualification({ activity: data.data.attributes });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserQualificationsData();
  }, [user]);

  return (
    <div className="max-w-full w-full max-h-full rounded-tl-3xl bg-[#e7eaf886] grid ">
      <div className="md:ml-12 ml-8 ">
        {userQualification.activity && (
          <ActivityComponent activityData={userQualification} />
        )}
      </div>
    </div>
  );
};

export default Activity;
