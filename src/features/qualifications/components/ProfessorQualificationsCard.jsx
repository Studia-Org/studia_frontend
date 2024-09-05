import React from 'react'
import { useNavigate } from 'react-router-dom'

export const ProfessorQualificationsCard = ({ qualification }) => {
    const navigate = useNavigate();
    return (
        <button key={qualification.id} onClick={() => navigate(`courses/${qualification.id}`)} className='transform hover:scale-105  duration-150  bg-white rounded-md flex justify-end items-center relative font-normal text-base p-5 h-[10rem] w-[25rem] shadow-md text-right'>
            <img className='object-cover w-24 top-0 left-0 h-[10rem] absolute rounded-l-lg ' src={qualification.attributes?.cover?.data?.attributes?.url} alt="" />
            <div className='flex flex-col w-3/4'>
                <p className='font-semibold '>{qualification.attributes.title}</p>
                <div className='flex items-center mt-3 ml-auto '>
                    <img src={qualification.attributes.professor.data.attributes.profile_photo?.data?.attributes?.url} alt="" className='w-6 h-6 rounded-full' />
                    <p className='ml-2 text-sm '>{qualification.attributes.professor.data.attributes.name}</p>
                </div>
            </div>
        </button>
    )
}
