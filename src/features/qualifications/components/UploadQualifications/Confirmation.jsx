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

export async function uploadQualificationsPerGroup({ dataTable, activity, user, fullActivity }) {
    try {
        for (const { group } of dataTable) {
            const grade = group.qualification

            const isPeerReview = fullActivity.attributes.BeingReviewedBy.data !== null
            let qualification = 0;
            if (isPeerReview) {
                const isNan = isNaN(group.averageGradePeerReview)
                const ponderationStudent = fullActivity.attributes.ponderationStudent / 100

                if (isNan) {
                    qualification = group.Qualification
                }
                else {
                    qualification = group.Qualification * (1 - ponderationStudent) + group.averageGradePeerReview * ponderationStudent
                }
            }
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
                            qualification: +qualification.toFixed(2),
                        }
                    }),
                }).catch(error => {
                    throw new Error('An error occurred while uploading the qualifications');
                });
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
                            qualification: +qualification.toFixed(2),
                            file: null,
                            delivered: true
                        }
                    }),
                }).catch(error => {
                    throw new Error('An error occurred while uploading the qualifications');
                });
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
export async function uploadQualifications({ dataTable, activity, user, fullActivity }) {
    for (const student of dataTable) {
        const grade = student.Name.student.attributes.qualifications.data.find(
            qualification => qualification.attributes.activity.data?.id === JSON.parse(activity).id
        );
        const gradeId = grade ? grade.id : null;
        const isPeerReview = fullActivity.attributes.BeingReviewedBy.data !== null
        let qualification = 0;
        if (isPeerReview) {
            const isNan = isNaN(student.averageGradePeerReview)
            const ponderationStudent = fullActivity.attributes.ponderationStudent / 100

            if (isNan) {
                qualification = student.Qualification
            }
            else {
                qualification = student.Qualification * (1 - ponderationStudent) + student.averageGradePeerReview * ponderationStudent
            }
        }
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
                        qualification: qualification.toFixed(2),
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
                        qualification: qualification.toFixed(2),
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