import React, { useState, useEffect } from 'react'
import { Button, Tabs } from "antd";
import { ForumInside } from './ForumInside';
import { useAuthContext } from "../../../../../context/AuthContext";
import { ForumAddThread } from './ForumAddThread';
import { useTranslation } from 'react-i18next';
const { TabPane } = Tabs;


export const ForumComponent = ({ allForums, setAllForums, courseData }) => {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const { user } = useAuthContext();

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  }


  useEffect(() => {
    setItems((prevItems) => {
      if (prevItems.length === 0) {
        return allForums.map((forum) => ({
          key: forum.id,
          label: forum.attributes.title,
          children: (
            <ForumInside
              posts={forum.attributes.posts.data.sort((a, b) => new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt))}
              setAllForums={setAllForums}
              forumId={forum.id}
            />
          ),
          icon: forum.attributes.title === 'News' ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M10 3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v9a2 2 0 0 0 2 2h8a2 2 0 0 1-2-2V3ZM4 4h4v2H4V4Zm4 3.5H4V9h4V7.5Zm-4 3h4V12H4v-1.5Z" clipRule="evenodd" />
              <path d="M13 5h-1.5v6.25a1.25 1.25 0 1 0 2.5 0V6a1 1 0 0 0-1-1Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path d="M1 8.849c0 1 .738 1.851 1.734 1.947L3 10.82v2.429a.75.75 0 0 0 1.28.53l1.82-1.82A3.484 3.484 0 0 1 5.5 10V9A3.5 3.5 0 0 1 9 5.5h4V4.151c0-1-.739-1.851-1.734-1.947a44.539 44.539 0 0 0-8.532 0C1.738 2.3 1 3.151 1 4.151V8.85Z" />
              <path d="M7 9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-.25v1.25a.75.75 0 0 1-1.28.53L9.69 12H9a2 2 0 0 1-2-2V9Z" />
            </svg>
          ),
        }));
      } else {
        return allForums.map((forum) => ({
          key: forum.id,
          label: forum.attributes.title,
          children: (
            <ForumInside
              posts={forum.attributes.posts.data.sort((a, b) => new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt))}
              setAllForums={setAllForums}
              forumId={forum.id}
            />
          ),
          icon: forum.attributes.title === 'News' ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M10 3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v9a2 2 0 0 0 2 2h8a2 2 0 0 1-2-2V3ZM4 4h4v2H4V4Zm4 3.5H4V9h4V7.5Zm-4 3h4V12H4v-1.5Z" clipRule="evenodd" />
              <path d="M13 5h-1.5v6.25a1.25 1.25 0 1 0 2.5 0V6a1 1 0 0 0-1-1Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path d="M1 8.849c0 1 .738 1.851 1.734 1.947L3 10.82v2.429a.75.75 0 0 0 1.28.53l1.82-1.82A3.484 3.484 0 0 1 5.5 10V9A3.5 3.5 0 0 1 9 5.5h4V4.151c0-1-.739-1.851-1.734-1.947a44.539 44.539 0 0 0-8.532 0C1.738 2.3 1 3.151 1 4.151V8.85Z" />
              <path d="M7 9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-.25v1.25a.75.75 0 0 1-1.28.53L9.69 12H9a2 2 0 0 1-2-2V9Z" />
            </svg>
          ),
        }));
      }
    });



    if (activeKey === null) {
      setActiveKey(allForums[0].id.toString());
    }
  }, [allForums, courseData, showModal, activeKey]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  return (
    <div className='flex flex-col pt-5 '>
      <div className=''>
        <div className='flex items-center mb-5'>
          <h2 className='text-xl font-bold'>{t("COURSEINSIDE.FORUM.forum")}</h2>
          {(user.role_str === 'professor' || activeKey !== (allForums[0]?.id)?.toString()) && (
            <Button className='flex items-center gap-2 ml-auto bg-blue-500' type='primary' onClick={handleOpenModal}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" />
              </svg>
              {t("COURSEINSIDE.FORUM.add_thread")}
            </Button>
          )}

        </div>
        {
          items.length > 0 &&
          <Tabs
            tabBarStyle={{ borderBottom: '1px solid #d1d5db' }}
            onChange={handleTabChange}
            defaultActiveKey={activeKey}
          >
            {items.map((item) => (
              <TabPane key={item.key} tab={<span className='flex items-center justify-center gap-2'>{item.icon} {item.label}</span>}>
                {item.children}
              </TabPane>
            ))}
          </Tabs>
        }
        {showModal && <ForumAddThread onClose={handleCloseModal} user={user} forumID={activeKey} setAllForums={setAllForums} courseData={courseData} />}
      </div>
    </div>
  )
}
