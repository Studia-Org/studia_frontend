import React from 'react'
import { Progress, Divider } from 'antd';
import { BadgeProgress } from './BadgeProgress';
export const ProgressChart = ({ objectivesList }) => {
    return (
        <div className="space-y-4">
            {
                objectivesList.map((objective, index) => {
                    return (
                        <div key={objective.objective} className='flex items-center'>
                            <Progress percent={objective.percentage} status="active" showInfo={false} strokeWidth={13} />
                            <Divider type="vertical" />
                            <BadgeProgress objective={objective} />
                        </div>
                    )
                })
            }
        </div>
    )
}
