import { useEffect, useState } from 'react'
import { getUserGroup } from '../../../../../fetches/getUserGroup';

export default function useGetGroup({ user, activityData, activityId, idQualification }) {
    const [activityGroup, setActivityGroup] = useState(null);
    const [loadingGroup, setLoadingGroup] = useState(true);
    const isActivityGroup = activityData.activity.data.attributes.groupActivity;

    useEffect(() => {
        if (!isActivityGroup) {
            setActivityGroup(null);
            setLoadingGroup(false);
            return
        }
        if (isActivityGroup && idQualification !== undefined) {
            const group = {
                ...activityData.group.data.attributes,
                id: activityData.group.data.id,
            }
            setActivityGroup(group);
            setLoadingGroup(false);
            return
        }
        async function getActivityGroup(user, activityId) {
            const group = await getUserGroup({ user, activityId });
            setActivityGroup(group);
            setLoadingGroup(false);
        }
        getActivityGroup(user, activityId)

    }, []);

    return { activityGroup, loadingGroup };
}
