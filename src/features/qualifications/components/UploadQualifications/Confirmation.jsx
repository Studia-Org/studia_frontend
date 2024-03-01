import React from 'react'
import { Spin, message } from 'antd';
import { API } from '../../../../constant';
import { getToken } from '../../../../helpers';
import Swal from 'sweetalert2';

export const Confirmation = () => {
    return (
        <div className='h-[20rem]'>
            <p className='mt-2 text-sm text-gray-500'>Please wait until the system has created all the qualifications, it will not take more than a minute. </p>
            <div className='flex items-center justify-center h-[95%]'>
                <Spin tip="Creating qualifications..." size="large">
                    <div className="mr-14" />
                </Spin>
            </div>

        </div>
    )
}

export async function uploadQualificationsPerGroup({ dataTable, activity, user, }) {
    try {

        for (const { group } of dataTable) {
            const grade = group.qualification?.data
            if (grade?.id) {
                const response = await fetch(`${API}/qualifications/${grade.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify({
                        data: {
                            comments: group.Comments,
                            qualification: group.Qualification,
                        }
                    }),
                }).catch(error => {
                    throw new Error('An error occurred while uploading the qualifications');
                });
                console.log(response.status)
                if (response.status !== 200) throw new Error('An error occurred while uploading the qualifications');
            }
            else {
                const response = await fetch(`${API}/qualifications`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify({
                        data: {
                            activity: JSON.parse(activity).id,
                            group: group.id,
                            comments: group.Comments,
                            evaluator: user.id,
                            qualification: group.Qualification,
                            file: null,
                            delivered: true
                        }
                    }),
                }).catch(error => {
                    throw new Error('An error occurred while uploading the qualifications');
                });
                console.log(response.status)
                if (response.status !== 200) throw new Error('An error occurred while uploading the qualifications');
            }
        }
        Swal.fire({
            title: 'Qualifications uploaded successfully',
            icon: 'success',
            confirmButtonText: 'Ok'
        }).then(() => {
            window.location.reload();
        });


    } catch (error) {
        message.error(error.message);
    } finally {
    }
}
export async function uploadQualifications({ dataTable, activity, user }) {
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
    Swal.fire({
        title: 'Qualifications uploaded successfully',
        icon: 'success',
        confirmButtonText: 'Ok'
    }).then(() => {
        window.location.reload();
    });
}