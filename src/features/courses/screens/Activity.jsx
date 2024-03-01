import React, { useEffect, useState } from "react";
import { ActivityComponent } from "../components/Activity/ActivityComponent";
import PeerReviewComponent from "../components/Activity/PeerReviewComponent.jsx";
import { useParams } from "react-router-dom";
import { API, BEARER } from "../../../constant";
import { useAuthContext } from "../../../context/AuthContext";
import { getToken } from "../../../helpers.js";

const Activity = () => {
  const { courseId, activityId } = useParams();
  const [userQualification, setUserQualification] = useState([]);


  const { user } = useAuthContext();

  const fetchUserQualificationsData = async () => {
    try {
      if (!user) return;

      const activityData = await fetch(
        `${API}/activities/${activityId}?populate=*`
      );
      const activityDataa = await activityData.json();
      let filters;

      if (activityDataa.data.attributes.groupActivity) {
        filters = `&populate[group][populate][users][fields][0]=*` +
          `&populate[group][populate][users][populate][profile_photo][fields][0]=url` +
          `&populate[group][populate][activity][fields][0]=id` +
          `&filters[group][users][id]=${user.id}` +
          `&filters[group][activity][id]=${activityId}`
      }
      else {
        filters = `&filters[user][id]=${user.id}`
      }

      const response =
        await fetch(
          `${API}/qualifications?qualification` +
          `&populate[file][fields][0]=*` +
          `&populate[activity][populate][evaluators][fields][0]=*` +
          `&populate[activity][populate][file][fields][0]=*` +
          `&populate[activity][populate][task_to_review][fields][0]=*` +
          `&filters[activity][id]=${activityId}` +
          `&populate[user][populate][PeerReviewAnswers][populate][qualifications][populate][user][fields][0]=username` +
          `&populate[evaluator][populate][profile_photo][fields][0]=url` +
          `&populate[PeerReviewAnswers][populate][user][populate][qualifications][populate][Answers][fields][0]=*` +
          `&populate[peer_review_qualifications][populate][file][fields][0]=*` +
          `&populate[peer_review_qualifications][populate][user][fields][0]=username` +
          `&populate[peer_review_qualifications][populate][user][populate][profile_photo][fields][0]=url` +
          `&populate[peer_review_qualifications][populate][group][populate][users][fields][0]=*` +
          `&populate[peer_review_qualifications][populate][group][populate][users][populate][profile_photo][fields][0]=url` +

          filters
          , {
            headers: { Authorization: `${BEARER} ${getToken()}` },
          }
        )

      const data = await response.json();
      if (data.data.length > 0) {
        setUserQualification({
          activity:
            data.data[0].attributes,
          idQualification: data.data[0]["id"]
        });
      } else {
        const qualificationData = {
          activity: {
            data: activityDataa.data
          }
        }
        setUserQualification({ activity: qualificationData })
      }


    } catch (error) {
      console.error(error);
    }
  };

  function selectTypeOfActivity() {
    const type = userQualification.activity.activity.data.attributes.type;
    switch (type) {
      case "peerReview":
        return <PeerReviewComponent activityData={userQualification.activity} idQualification={userQualification.idQualification} />;
      default:
        return <ActivityComponent activityData={userQualification.activity} idQualification={userQualification.idQualification}
          setUserQualification={setUserQualification} userQualification={userQualification} />;

    }

  }
  useEffect(() => {
    fetchUserQualificationsData();

  }, [user]);

  return (
    <div className='max-w-full w-full max-h-full rounded-tl-3xl bg-[#e7eaf886] grid '>
      {userQualification.activity && (
        selectTypeOfActivity()
      )}
    </div>
  )
}

export default Activity;
