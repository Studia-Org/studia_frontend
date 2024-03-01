import React from 'react'
import { List, Typography } from 'antd'

export const RecommendationCard = ({ recommendationList }) => {

    return (
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
    )
}
