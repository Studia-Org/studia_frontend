import React from 'react'
import { Popover, Steps, Progress } from 'antd';

export const StepsQuestionnaire = ({ currentPage, totalPages }) => {

    const percentage = (currentPage / totalPages) * 100

    return (
        <Progress
            percent={percentage}
            status="active"
            showInfo={false}
            size={[, 13]}
            strokeColor={{
                from: '#87a2f2',
                to: '#6E66D6',
            }}
        />
    )
}
