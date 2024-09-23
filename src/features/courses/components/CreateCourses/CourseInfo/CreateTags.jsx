import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Input, Tag, theme, Tooltip } from 'antd';


const tagInputStyle = {
    width: 104,
    height: 22,
    marginInlineEnd: 8,
    verticalAlign: 'top',
};

export const CreateTags = ({ courseBasicInfoTags, setCourseBasicInfo }) => {
    const { token } = theme.useToken();
    const [tags, setTags] = useState(courseBasicInfoTags || []);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [editInputIndex, setEditInputIndex] = useState(-1);
    const [editInputValue, setEditInputValue] = useState('');
    const inputRef = useRef(null);
    const editInputRef = useRef(null);
    useEffect(() => {
        if (inputVisible) {
            inputRef.current?.focus();
        }
    }, [inputVisible]);
    useEffect(() => {
        editInputRef.current?.focus();
    }, [editInputValue]);

    const handleClose = (removedTag) => {
        const newTags = tags.filter((tag) => tag !== removedTag);
        setTags(newTags);
        setCourseBasicInfo((prevInfo) => {
            const newInfo = { ...prevInfo, ['tags']: newTags };
            localStorage.setItem('courseBasicInfo', JSON.stringify(newInfo));
            return newInfo;
        });
    };

    const showInput = () => {
        setInputVisible(true);
    };
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    const handleInputConfirm = () => {
        if (inputValue && !tags.includes(inputValue)) {
            setTags([...tags, inputValue]);
            setCourseBasicInfo((prevInfo) => {
                const newInfo = { ...prevInfo, ['tags']: [...tags, inputValue] };
                localStorage.setItem('courseBasicInfo', JSON.stringify(newInfo));
                return newInfo;
            });

        }
        setInputVisible(false);
        setInputValue('');
    };
    const handleEditInputChange = (e) => {
        setEditInputValue(e.target.value);
    };
    const handleEditInputConfirm = () => {
        const newTags = [...tags];
        newTags[editInputIndex] = editInputValue;

        setTags(newTags);
        setCourseBasicInfo((prevInfo) => {
            const newInfo = { ...prevInfo, ['tags']: newTags };
            localStorage.setItem('courseBasicInfo', JSON.stringify(newInfo));
            return newInfo;
        });
        setEditInputIndex(-1);
        setEditInputValue('');
    };
    const tagPlusStyle = {
        height: 22,
        background: token.colorBgContainer,
        borderStyle: 'dashed',
    };
    return (
        <div className='flex flex-wrap p-2 bg-white border border-gray-300 rounded'>
            {tags.map((tag, index) => {
                if (editInputIndex === index) {
                    return (
                        <Input
                            ref={editInputRef}
                            key={tag}
                            size="small"
                            style={tagInputStyle}
                            value={editInputValue}
                            onChange={handleEditInputChange}
                            onBlur={handleEditInputConfirm}
                            onPressEnter={handleEditInputConfirm}
                        />
                    );
                }
                const isLongTag = tag.length > 20;
                const tagElem = (
                    <Tag
                        className='flex items-center '
                        key={tag}
                        closable
                        style={{
                            userSelect: 'none',
                        }}
                        onClose={() => handleClose(tag)}
                    >
                        <span
                            onDoubleClick={(e) => {
                                if (index !== 0) {
                                    setEditInputIndex(index);
                                    setEditInputValue(tag);
                                    e.preventDefault();
                                }
                            }}
                        >
                            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                        </span>
                    </Tag>
                );
                return isLongTag ? (
                    <Tooltip title={tag} key={tag}>
                        {tagElem}
                    </Tooltip>
                ) : (
                    tagElem
                );
            })}
            {inputVisible ? (
                <Input
                    ref={inputRef}
                    className='w-48 border border-[#d9d9d9] rounded-md pl-3 text-xs'
                    type="text"
                    size="small"
                    style={tagInputStyle}
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                />
            ) : (
                <Tag className='flex items-center ' style={tagPlusStyle} icon={<PlusOutlined />} onClick={showInput}>
                    New Tag
                </Tag>
            )}
        </div>
    );
}
