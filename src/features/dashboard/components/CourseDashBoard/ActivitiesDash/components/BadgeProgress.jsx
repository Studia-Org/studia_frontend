import React from 'react'

export const BadgeProgress = ({ objective }) => {
    return (
        <div className='bg-blue-500 rounded-md w-32 py-0.5 pl-1 hover:bg-blue-700 duration-100'>
            <p className='text-white text-xs'>
                {objective}
            </p>
        </div>
    )
}
