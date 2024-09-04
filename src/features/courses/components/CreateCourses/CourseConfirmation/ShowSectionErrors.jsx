import { List, Modal } from 'antd'
import React from 'react'

export const ShowSectionErrors = ({ subsectionErrors, isModalOpen, setIsModalOpen }) => {
    const data = [];

    for (const key in subsectionErrors) {
        if (subsectionErrors.hasOwnProperty(key)) {
            const item = subsectionErrors[key];

            item.errors.forEach(error => {
                data.push({
                    title: item.title,
                    description: error
                });
            });
        }
    }

    return (
        <Modal title="Errors" open={isModalOpen} footer={null} onCancel={() => setIsModalOpen(false)}>
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            title={<p className='font-medium'>{item.title} </p>}
                            description={item.description}
                        />
                    </List.Item>
                )}
            />
        </Modal>
    )
}
