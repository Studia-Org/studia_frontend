import React, { useEffect, useState } from "react";
import { ActivityComponent } from "../components/Activity/ActivityComponent";
import PeerReviewComponent from "../components/Activity/PeerReviewComponent.jsx";
import { useParams } from "react-router-dom";
import { API, BEARER } from "../../../constant";
import { useAuthContext } from "../../../context/AuthContext";
import { getToken } from "../../../helpers.js";
import { SelfAssesmentComponent } from "../components/Activity/SelfAssesmentComponent.jsx";
import { MoonLoader } from "react-spinners";
import { useCourseContext } from "../../../context/CourseContext.js";
import { SideBarButton } from "../components/Activity/Components/SideBarButton.jsx";

const Activity = () => {
  const { activityId } = useParams();
  const [userQualification, setUserQualification] = useState([]);
  const [subsectionsCompleted, setSubsectionsCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();
  const { setActivitySelected, setCourse, setSectionSelected, setSubsectionSelected, course } = useCourseContext();

  function completeContext(course_, section, subsection) {

    if (!course) {
      setCourse(course_.data.attributes);
      setSectionSelected(section);
      setSubsectionSelected(subsection);
    }
  }

  const fetchUserResponsesData = async () => {
    const token = getToken();
    try {
      const response = await fetch(
        `${API}/users/me?populate=subsections_completed`,
        {
          headers: { Authorization: `${BEARER} ${token}` },
        }
      );
      const data = await response.json();
      setSubsectionsCompleted(data.subsections_completed);
    } catch (error) {
      console.error(error);
    }
  };


  const fetchUserQualificationsData = async () => {
    setLoading(true);
    try {
      if (!user) return;

      const activityData = await fetch(
        `${API}/activities/${activityId}?populate=qualifications.file,qualifications.user,qualievaluators.profile_photo,section,task_to_review,subsection.section.course.sections.subsections,selfAssesmentAnswer.user,BeingReviewedBy,file`, {
        headers: {
          Authorization: `${BEARER} ${getToken()}`
        }
      }
      );
      const activityDataa = await activityData.json();
      let filters;

      if (activityDataa.data.attributes.groupActivity) {
        filters = `&populate[group][populate][users][fields][0]=*` +
          `&populate[group][populate][users][populate][profile_photo][fields][0]=url` +
          `&populate[group][populate][PeerReviewAnswers][populate][qualifications][populate][user][fields][0]=username` +
          `&populate[group][populate][PeerReviewAnswers][populate][qualifications][populate][group][fields][0]=id` +
          `&populate[group][populate][activity][fields][0]=id` +
          `&filters[group][users][id]=${user.id}`

        if (activityDataa.data.attributes.type === "peerReview") {
          filters += `&filters[group][activity][id]=${activityDataa.data.attributes.task_to_review.data.id}`

        }
        else {
          filters += `&filters[group][activity][id]=${activityId}`
        }
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
          
          `&populate[activity][populate][task_to_review][populate][peer_review_qualifications][fields][0]=*` +
          `&populate[activity][populate][subsection][populate][section][populate][course][populate][sections][populate][subsections][fields][0]=*` +
          `&filters[activity][id]=${activityId}` +
          `&populate[user][populate][PeerReviewAnswers][populate][qualifications][populate][user][fields][0]=username` +
          `&populate[evaluator][populate][profile_photo][fields][0]=url` +
          `&populate[PeerReviewAnswers][populate][user][populate][qualifications][populate][Answers][fields][0]=*` +
          `&populate[SelfAssesmentAnswers][populate][user][populate][qualifications][fields][0]=*` +
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
          activity: data.data[0].attributes,
          idQualification: data.data[0]["id"],
          idSubsection: data.data[0].attributes.activity.data.attributes.subsection.data.id
        });
        setActivitySelected({
          activity: data.data[0].attributes.activity.data.attributes.title
        });
        completeContext(data.data[0].attributes.activity.data.attributes.subsection.data.attributes.section.data.attributes.course,
          data.data[0].attributes.activity.data.attributes.subsection.data.attributes.section.data.attributes.title,
          data.data[0].attributes.activity.data.attributes.subsection.data);
      } else {
        const qualificationData = {
          activity: { data: activityDataa.data },
          idQualification: null,
          idSubsection: activityDataa.data.attributes.subsection.data.id
        }
        setUserQualification({ activity: qualificationData })
        setActivitySelected({
          activity: activityDataa.data.attributes.title
        });
        completeContext(activityDataa.data.attributes.subsection.data.attributes.section.data.attributes.course,
          activityDataa.data.attributes.subsection.data.attributes.section.data.attributes.title,
          activityDataa.data.attributes.subsection.data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  function selectTypeOfActivity() {
    const type = userQualification.activity.activity.data.attributes.type;
    switch (type) {
      case "peerReview":
        return <PeerReviewComponent activityData={userQualification.activity} idQualification={userQualification.idQualification} />;
      case "selfAssessment":
        return <SelfAssesmentComponent activityData={userQualification.activity} idQualification={userQualification.idQualification} idSubsection={userQualification.idSubsection || userQualification.activity.idSubsection} />;
      default:
        return <ActivityComponent activityData={userQualification.activity} idQualification={userQualification.idQualification}
          setUserQualification={setUserQualification} userQualification={userQualification} subsectionsCompleted={subsectionsCompleted} />;

    }

  }
  useEffect(() => {
    fetchUserResponsesData();
    fetchUserQualificationsData();
  }, [user]);

  return (
    <div className='max-w-full w-full max-h-full rounded-tl-3xl bg-[#e7eaf886] grid '>
      {
        loading ?
          <div className='flex items-center justify-center w-full h-full'>
            <MoonLoader color='#363cd6' size={80} />
          </div>
          :
          <>
            {
              userQualification.activity && course && (
                selectTypeOfActivity()
              )
            }
            <SideBarButton subsectionsCompleted={subsectionsCompleted} />
          </>

      }
    </div>
  )
}

export default Activity;
