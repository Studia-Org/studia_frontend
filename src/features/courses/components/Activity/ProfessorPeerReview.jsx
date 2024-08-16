import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { fetchCourseInformation } from '../../../../fetches/fetchCourseInformation'
import { fetchPeerReviewAnswers } from '../../../../fetches/fetchPeerReviewAnswers';
import { StudentRow } from './Components/PeerReview/StudentRow';
import { GroupRows } from './Components/PeerReview/GroupRows.jsx';
import { Button, Empty, message } from 'antd';
import generateExcelPeerReview from './utils/generateExcelPeerReview';
import CreatePeers from './Components/PeerReview/CreatePeers';
import { MoonLoader } from 'react-spinners';
import { BreadcrumbCourse } from '../CoursesInside/BreadcrumbCourse.jsx';
import { useTranslation } from 'react-i18next';

export const ProfessorPeerReview = ({ activityData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [courseContentInformation, setCourseContentInformation] = useState({});
  const [peerReviewAnswers, setPeerReviewAnswers] = useState([]);
  const [createPeerReview, setCreatePeerReview] = useState(false);
  const [studentGroups, setStudentGroups] = useState([])

  const peerReviewinGroups = activityData.activity?.data.attributes.groupActivity
  const [loading, setLoading] = useState(true)
  const [deadline, setDeadline] = useState(activityData.activity?.data.attributes.deadline ? new Date(activityData.activity?.data.attributes.deadline) : null)
  const [messageApi, contextHolder] = message.useMessage();
  const activityToReviewID = activityData.activity?.data.attributes.task_to_review?.data?.id
  const { courseId, activityId } = useParams()
  const { t } = useTranslation();

  const filteredStudents = peerReviewinGroups ?
    studentGroups.filter((group) => {
      return group.attributes?.users?.data.some((user) => {
        return user.attributes.name.toLowerCase().includes(searchTerm.toLowerCase())
      })
    })

    : courseContentInformation.students?.data.filter((student) =>
      student.attributes.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  async function fetchCourseData() {
    try {
      const passedDeadline = deadline ? new Date() > deadline : false;
      if (!loading && passedDeadline === false) {
        messageApi.open({
          type: 'loading',
          content: t("PEERREVIEW.updating_peer_reviews"),
        });
      }
      const { courseInformation, students, professors } = await fetchCourseInformation({ courseId });
      setCourseContentInformation({ courseInformation, students, professors });

      if (peerReviewinGroups) {
        const idAdded = [];
        const groups = students.data.flatMap((student) =>
          student.attributes.groups?.data.filter((group) => {
            if (idAdded.includes(group.id)) return false;
            idAdded.push(group.id);
            return group.attributes?.activity?.data?.id === activityToReviewID;
          })
        );
        setStudentGroups(groups);
      }
      const peerReviewAnswersDATA = await fetchPeerReviewAnswers(activityId);
      setPeerReviewAnswers(peerReviewAnswersDATA);
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
      messageApi.destroy();
    }
  }

  useEffect(() => {
    fetchCourseData();
    const interval = setInterval(() => {
      const passedDeadline = deadline ? new Date() > deadline : false;
      if (createPeerReview === false && passedDeadline === false) fetchCourseData();
    }, 15000);
    return () => clearInterval(interval);
  }, [createPeerReview, loading, deadline]);


  function renderTableRows() {
    if (peerReviewinGroups) {
      return (
        filteredStudents.map((group) => (
          <GroupRows group={group} peerReviewAnswers={peerReviewAnswers} key={group?.id}
            activityTitle={activityData.activity?.data.attributes.title} activityToReviewID={activityToReviewID} />
        ))
      )
    }
    return (
      filteredStudents.map((student) => (
        <StudentRow student={student} peerReviewAnswers={peerReviewAnswers} activityToReviewID={activityToReviewID}
          activityTitle={activityData.activity?.data.attributes.title} key={student?.id} peerReviewinGroups={peerReviewinGroups} />
      ))
    );
  }

  if (createPeerReview) {
    return (
      <CreatePeers
        students={courseContentInformation.students.data}
        setCreatePeerReview={setCreatePeerReview}
        activity={activityData.activity?.data}
        activityToReview={activityData.activity?.data.attributes.task_to_review?.data} />
    )
  }


  return (
    <div className='h-full p-5 max-w-[100%] overflow-x-scroll'>
      {contextHolder}
      <BreadcrumbCourse styles={'ml-5'} />
      <main className='mx-5'>
        <h2 className='mt-3 mb-2 text-lg font-medium'>{t("PEERREVIEW.peer_review")}</h2>
        <p className='mb-1 text-sm text-gray-500'>{t("PEERREVIEW.review_prof_text1")}</p>
        <p className='mb-4 text-sm text-gray-500'>{t("PEERREVIEW.review_prof_text2")}</p>
        <div className="relative max-h-[calc(100vh-8rem-185px)] overflow-x-auto max-w-[100%] shadow-md sm:rounded-lg bg-white">
          <div className="sticky top-0 z-50 flex items-center justify-between p-5 pb-4 bg-white">
            <label htmlFor="table-search" className="sr-only">Search</label>
            <div className="relative ">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input
                type="text"
                id="table-search-users"
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                placeholder={t("COMMON.search_students")} />
            </div>
            <section className='flex gap-x-2'>
              <Button onClick={() => setCreatePeerReview(true)} type="default" disabled={loading} className='flex items-center gap-x-1'>
                {t("PEERREVIEW.create_peers_manually")}
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
              </Button>
              <Button disabled={loading} onClick={() => generateExcelPeerReview(courseContentInformation.students.data, peerReviewAnswers, activityToReviewID, peerReviewinGroups)} type="default" className='flex items-center gap-x-1'>
                {t("PEERREVIEW.download_all")}
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </Button>
            </section>
          </div>
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="sticky text-xs text-gray-700 uppercase top-[74px] z-50 bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  {t("QUALIFICATIONS.name")}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t("QUALIFICATIONS.files")}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t("PEERREVIEW.qualificacion_received")}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t("PEERREVIEW.qualificacion_given")}
                </th>
              </tr>
            </thead>
            <tbody>
              {
                loading &&
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-sm text-center text-gray-500 whitespace-nowrap">
                    <div className="flex items-center justify-center w-full h-full">
                      <MoonLoader color="#363cd6" size={80} />
                    </div>
                  </td>
                </tr>
              }
              {courseContentInformation.students?.data.length === 0 &&
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                    <Empty description={<span className='text-gray-500'>There are no students enrolled in this course.</span>} />
                  </td>
                </tr>}
              {!loading && courseContentInformation.students?.data.length > 0 && renderTableRows()}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
