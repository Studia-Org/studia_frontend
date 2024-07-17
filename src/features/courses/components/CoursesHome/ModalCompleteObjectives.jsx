import { Modal, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { getToken } from '../../../../helpers';
import { API } from '../../../../constant';
import { fetchUserInformationComplete } from '../../../../fetches/fetchUserInformationComplete';
import { ContentObjectiveInformation } from './ContentObjectiveInformation';
import { Trans, useTranslation } from 'react-i18next';

export const ModalCompleteObjectives = ({ isModalOpen, setIsModalOpen, setObjectives, propsObjectives, setConfettiExplode }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const textCompleted = propsObjectives?.completed ? t("COURSESHOME.objectives.text_modal_not_complete_objective") : t("COURSESHOME.objectives.text_modal_complete_objective");
    const okText = propsObjectives?.completed ? t("COURSESHOME.objectives.not_complete_objetive_button") : t("COURSESHOME.objectives.complete_objetive_button");

    useEffect(() => {
        const fetchData = async () => {
            const userInfo = await fetchUserInformationComplete();
            setUserInfo(userInfo);
        };
        fetchData();
    }, [propsObjectives]);

    const handleOk = async () => {
        setLoading(true);
        try {
            const updateUserObjectives = await fetch(`${API}/user-objectives/${propsObjectives.id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: { completed: !propsObjectives.completed, id: propsObjectives.id } }),
            });
            await updateUserObjectives.json();
            const updatedObjective = { ...propsObjectives, completed: !propsObjectives.completed };
            setObjectives((prevObjectives) => {
                return prevObjectives.map((obj) =>
                    obj.id === updatedObjective.id ? updatedObjective : obj
                );
            });
            setIsModalOpen(false);
            if (propsObjectives.completed === false) {
                setConfettiExplode(true);
            }
            message.success('Objective updated successfully');
            setLoading(false);
        } catch (error) {
            setLoading(false);
            message.error('Error updating objective');
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <Modal title={textCompleted} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText={okText} cancelText={t("COMMON.cancel")}
            okButtonProps={
                {
                    loading: loading,
                }
            }>
            <Trans i18nKey="COURSESHOME.objectives.complete_objective" components={{
                "objective": propsObjectives?.objective
            }} />
            <ContentObjectiveInformation user={userInfo} propsObjectives={propsObjectives} />
        </Modal>
    )
}
