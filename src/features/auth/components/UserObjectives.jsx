import React from 'react'
import { BsFillArrowLeftSquareFill } from 'react-icons/bs'

export const UserObjectives = ({ setPageSelector }) => {
    return (
        <div class="bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden " style={{ maxWidth: '1000px' }} >
            <div className="md:flex w-full ">
                <div className="hidden md:block w-1/2  py-10 px-10 relative ">
                    <button onClick={(e) => setPageSelector(1)}>
                        <BsFillArrowLeftSquareFill size={30} style={{ cursor: "pointer", color: "rgba(0, 0, 0, 1)" }} />
                    </button>
                    <h1>One last steps...</h1>

                </div>
            </div>
        </div>
    )
}
