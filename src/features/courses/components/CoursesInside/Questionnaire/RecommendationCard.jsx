import React, { useState } from 'react'
import { List, Typography, Button } from 'antd'
import { RecommendationImprovement } from './RecommendationImprovement'

export const RecommendationCard = ({ recommendationList, checkImprovement }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className='relative mt-5'>
            <List
                header={
                    <div>
                        <h3 className='text-base font-medium'>Recommendations based on your answers</h3>
                        <a className='text-xs text-gray-600' href='https://www.srl-o.com/' >Referenced Broadbent, J., Panadero, E., Lodge, J. & Fuller-Tyszkiewicz, M. (2021). The Self-Regulation for Learning Online (SRL-O) questionnaire manual. From www.srl-o.com</a>
                    </div>
                }
                className='mb-5 bg-white'
                bordered
                dataSource={recommendationList.filter(element => element !== null)}
                renderItem={(item) => (
                    <List.Item>
                        <Typography.Text mark>[Recommendation]</Typography.Text> {item}
                    </List.Item>
                )}
            />

            {
                checkImprovement &&
                <RecommendationImprovement checkImprovement={checkImprovement} setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} />
            }

            {
                checkImprovement.status && (

                    <Button onClick={() => setIsModalOpen(true)} className='absolute bg-white rounded-md -top-3 -right-3 ' size='large'>
                        <span class="absolute flex h-3 w-3 -top-3 -right-1">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75 mt-[0.415rem]"></span>
                            <span class="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                        </span>
                        <div className='flex items-center gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
                            </svg>
                            <p className='font-medium'>Feedback</p>
                        </div>

                    </Button>


                )
            }
        </div>
    )
}
