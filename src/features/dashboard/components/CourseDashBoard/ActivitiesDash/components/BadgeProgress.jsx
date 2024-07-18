import React from 'react'
import { Badge, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';

export const BadgeProgress = ({ objective }) => {
    const { t } = useTranslation();

    if (objective.isUserObjective === true) {
        return (
            <>
                <Badge dot>
                    <Tooltip title={t("OBJECTIVES_CONSTANT.linked_objectives")}>
                        <div className='bg-blue-500 rounded-md w-32 py-0.5 pl-2 hover:bg-blue-700 duration-100'>
                            <p className='text-white text-xs'>
                                {t("OBJECTIVES_CONSTANT." + objective.objective)}
                            </p>
                        </div>
                    </Tooltip>
                </Badge>
            </>
        )
    } else {
        return (
            <div className='bg-blue-500 rounded-md w-44 py-0.5 pl-2 hover:bg-blue-700 duration-100'>
                <p className='text-white text-xs'>
                    {t("OBJECTIVES_CONSTANT." + objective.objective)}
                </p>
            </div>
        )
    }
}
