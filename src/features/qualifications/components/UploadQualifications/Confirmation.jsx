import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Spin, message } from 'antd';
import { API } from '../../../../constant';
import { getToken } from '../../../../helpers';
import { useAuthContext } from '../../../../context/AuthContext';


export const Confirmation = ({ dataTable, activity, setUploadQualificationsFlag }) => {
    const { user } = useAuthContext()
    const navigate = useNavigate();

    useEffect(() => {
        if (dataTable.length > 0) {
            uploadQualifications()
        }
    })

    async function uploadQualifications() {
        for (const student of dataTable) {
            const grade = student.Name.student.attributes.qualifications.data.find(
                qualification => qualification.attributes.activity.data?.id === JSON.parse(activity).id
            );
            const gradeId = grade ? grade.id : null;
            if (gradeId === null || gradeId === undefined) {
                await fetch(`${API}/qualifications`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify({
                        data: {
                            activity: JSON.parse(activity).id,
                            user: student.key,
                            comments: student.Comments,
                            evaluator: user.id,
                            qualification: student.Qualification,
                            file: null,
                            delivered: true
                        }
                    }),
                });
            } else {
                await fetch(`${API}/qualifications/${gradeId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify({
                        data: {
                            comments: student.Comments,
                            qualification: student.Qualification,
                        }
                    }),
                });
            }
        }
        message.success('Qualifications uploaded successfully');
        navigate(`/app/qualifications/`);
        setUploadQualificationsFlag(false)
    }

    return (
        <div className='h-[20rem]'>
            <p className='text-sm text-gray-500 mt-2'>Please wait until the system has created all the qualifications, it will not take more than a minute. </p>
            <div className='flex items-center justify-center h-[95%]'>
                <Spin tip="Creating qualifications..." size="large">
                    <div className="mr-14" />
                </Spin>
            </div>

        </div>
    )
}
