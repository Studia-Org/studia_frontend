import React from 'react'
import { format } from 'date-fns'



export const CourseHasNotStarted = ({ startDate }) => {
    const dateFormated = new Date(startDate)
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full p-5 mt-4 bg-white border rounded-md">
            <p className="my-8 text-lg font-semibold">This course has not started yet</p>
            <p className='mb-8'>It will start on {dateFormated.toLocaleDateString("en-US", options)}</p>
            <img className="w-2/3" src="https://cdn.elearningindustry.com/wp-content/uploads/2020/08/5-ways-to-improve-your-course-cover-design-1024x575.png" alt="" />
        </div>
    )
}
