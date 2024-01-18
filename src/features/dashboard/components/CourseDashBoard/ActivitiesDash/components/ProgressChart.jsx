import React from 'react'
import { Progress, Divider } from 'antd';
import { BadgeProgress } from './BadgeProgress';

export const ProgressChart = ({ objectivesList }) => {
    return (
        <div className="space-y-4">
            {
                objectivesList.map((objective, index) => {
                    return (
                        <div className='flex items-center'>
                            <Progress percent={30} status="active" showInfo={false} />
                            <Divider type="vertical" />
                            <BadgeProgress objective={objective} />
                        </div>
                    )
                })
            }
        </div>
    )
}
