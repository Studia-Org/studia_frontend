import React, { useMemo } from 'react'
import { Popover, Steps } from 'antd';

export const StepsQuestionnaire = ({ currentPage, totalPages }) => {
    const generateItems = () => {
        let items = []
        for (let i = 0; i < totalPages; i++) {
            items.push({
                title: ``,
                description: ``,
            })
        }
        return items
    }

    const items = useMemo(() => generateItems(), [totalPages, currentPage])


    return (
        <Steps
            progressDot
            current={currentPage - 1}
            items={items}
        />
    )
}
