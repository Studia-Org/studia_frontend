import { List, Modal } from 'antd'
import React from 'react'

export const ShowSectionErrors = ({
    setSectionToEdit, subsectionErrors, isModalOpen, setEditCourseSectionFlag, setSubsectionToEditError,
    setIsModalOpen, setCreateCourseOption }) => {
    const data = [];
    for (const key in subsectionErrors) {
        if (subsectionErrors.hasOwnProperty(key)) {
            const item = subsectionErrors[key];
            item.errors.forEach(error => {
                data.push({
                    title: item.title,
                    description: error,
                    id: key,
                    section: item.section
                });
            });
        }
    }
    function handleClick(item) {
        setIsModalOpen(false);
        setCreateCourseOption(1);
        setEditCourseSectionFlag(true);
        setSectionToEdit(item.section);
        setSubsectionToEditError(item.id);

    }
    return (
        <Modal title="Errors" open={isModalOpen} footer={null} onCancel={() => setIsModalOpen(false)}>
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            className='px-2 rounded-md cursor-pointer hover:bg-gray-100'
                            onClick={() => handleClick(item)}
                            title={<p className='font-medium'>{item.title} </p>}
                            description={item.description}
                        />
                    </List.Item>
                )}
            />
        </Modal>
    )
}
