import React from 'react'
import { useNavigate } from 'react-router-dom';
import { FiChevronRight } from "react-icons/fi";

export const ProfessorData = ({ professor, evaluatorFlag }) => {
    const navigate = useNavigate();
    let link = null
    if (professor.attributes === null) return (<div></div>)
    if (evaluatorFlag === true) {
        link = '/app/profile/' + professor.attributes.id + '/';
    } else {
        link = '/app/profile/' + professor.id + '/';
    }
    return (
        <div className='flex-shrink-0 w-full '>
            <div className={`${evaluatorFlag ? 'mt-0' : 'mt-4 collapse'} flex flex-col bg-white rounded-lg  px-5 py-5  sm:mr-9 sm:right-0 max-w-[30rem] shadow-md sm:visible `}>
                <div className='flex items-center'>
                    {
                        evaluatorFlag === true ?
                            <p className='text-lg font-medium'>About the evaluator</p> :
                            <p className='text-lg font-medium'>About the professor</p>
                    }
                    <button onClick={() => navigate(link)} className='text-base ml-auto font-medium text-indigo-700'>View profile</button>
                    <FiChevronRight className='text-indigo-700' />
                </div>

                <div className='flex my-4 items-center space-x-3'>
                    {
                        professor.attributes.profile_photo.url ?
                            <img className='w-[3rem] rounded' src={professor.attributes.profile_photo.url} alt="" />
                            :
                            <img className='w-[3rem] rounded' src={professor.attributes.profile_photo.data.attributes.url} alt="" />
                    }
                    <p className='text-base font-medium'>{professor.attributes.name}</p>
                </div>
                <p className={`text-gray-700 text-sm  ${evaluatorFlag ? '' : 'truncate'}`}>{professor.attributes.description}</p>
            </div>
        </div>
    )
}
