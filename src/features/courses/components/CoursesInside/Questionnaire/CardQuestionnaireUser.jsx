import React from 'react'
import { Avatar } from 'antd';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
export const CardQuestionnaireUser = ({ user, setQuestionnaireAnswerData }) => {
    const { t } = useTranslation();
    const handleOnClick = () => {
        setQuestionnaireAnswerData([{
            responses: user.attributes.responses,
            timeToComplete: user.attributes.timeToComplete,
            user: user.attributes.user
        }])
    }
    const gridColsStyle = user.attributes.qualification?.attributes?.qualification ? 'grid-cols-4' : 'grid-cols-3';
    const formattedDate = new Date(user.attributes.updatedAt).toLocaleDateString();
    return (
        <motion.div
            onClick={() => handleOnClick()}
            className={`grid ${gridColsStyle} p-5 bg-white rounded-md shadow-md border-l-8 border-[#35127775] hover:bg-gray-50 cursor-pointer items-center`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.01 }}
        >
            <div className='flex items-center gap-2'>
                <Avatar shape="square" size="large" src={user.attributes.user.data.attributes.profile_photo?.data?.attributes?.url} />
                <p className='text-sm font-medium text-gray-600'>{user.attributes.user.data.attributes.name}</p>
            </div>
            <p className='ml-auto text-sm text-gray-600'> <strong> {t("QUESTIONNAIRE.completed_in")}:</strong> {user.attributes.timeToComplete}</p>
            <p className='ml-auto text-sm text-gray-600'><strong> {t("QUESTIONNAIRE.completation_date")}:</strong>  {formattedDate}</p>
            {
                user.attributes.user.data?.attributes && (
                    <>
                        <div className='flex items-center gap-2'>
                            <Avatar shape="square" size="large" src={user.attributes.user?.data?.attributes.profile_photo?.data?.attributes?.url} />
                            <p className='text-sm font-medium text-gray-600'>{user.attributes.user.data.attributes.name}</p>
                        </div>
                        <p className='ml-auto text-sm text-gray-600'> <strong> Time to complete:</strong> {user.attributes.timeToComplete}</p>
                        <p className='ml-auto text-sm text-gray-600'><strong>Completion date:</strong>  {formattedDate}</p>
                        {
                            user.attributes.qualification?.attributes?.qualification && (
                                <div className='flex items-center justify-center h-full py-2 ml-auto bg-green-500 rounded-md w-9'>
                                    <p className='text-sm font-medium text-white'>{user.attributes.qualification?.attributes?.qualification}</p>
                                </div>
                            )
                        }
                    </>
                )
            }
        </motion.div>
    )

}
