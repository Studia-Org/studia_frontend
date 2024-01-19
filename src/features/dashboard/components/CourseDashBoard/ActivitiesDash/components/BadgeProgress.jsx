import React from 'react'
import { Badge, Card, Space, Tooltip } from 'antd';


export const BadgeProgress = ({ objective }) => {
    if (objective.isUserObjective === true) {
        return (
            <>
                <Badge dot>
                    <Tooltip title="This objective is vinculated to your personal progress.">
                        <div className='bg-blue-500 rounded-md w-28 py-0.5 pl-2 hover:bg-blue-700 duration-100'>
                            <p className='text-white text-xs'>
                                {objective.objective}
                            </p>
                        </div>
                    </Tooltip>
                </Badge>
            </>
        )
    } else {
        return (
            <div className='bg-blue-500 rounded-md w-32 py-0.5 pl-2 hover:bg-blue-700 duration-100'>
                <p className='text-white text-xs'>
                    {objective.objective}
                </p>
            </div>
        )
    }
}
