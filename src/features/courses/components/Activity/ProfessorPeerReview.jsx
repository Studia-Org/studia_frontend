import React, { useState, useEffect } from 'react'
import BackToCourse from './Components/BackToCourse'
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCourseInformation } from '../../../../fetches/fetchCourseInformation'
import { fetchPeerReviewAnswers } from '../../../../fetches/fetchPeerReviewAnswers';
import { StudentRow } from './Components/PeerReview/StudentRow';


export const ProfessorPeerReview = ({ activityData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [courseContentInformation, setCourseContentInformation] = useState({});
  const [peerReviewAnswers, setPeerReviewAnswers] = useState([]);
  const navigate = useNavigate()
  const { courseId } = useParams()

  useEffect(() => {
    async function fetchCourseData() {
      const { courseInformation, students, professors } =
        await fetchCourseInformation({ courseId });
      setCourseContentInformation({ courseInformation, students, professors });
    }
    fetchCourseData();
  }, [courseId]);

  useEffect(() => {
    async function fetchPeerReviewData() {
      const peerReviewAnswers =
        await fetchPeerReviewAnswers();
      setPeerReviewAnswers(peerReviewAnswers);
    }
    fetchPeerReviewData();
  }, []);

  function renderTableRows() {
    const filteredStudents = courseContentInformation.students?.data.filter((student) =>
      student.attributes.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
      <>
        {filteredStudents.map((student) => (
          <StudentRow student={student} peerReviewAnswers={peerReviewAnswers} activityToReviewID={activityData.activity.data.attributes.task_to_review.data?.id} activityTitle={activityData.activity.data.attributes.title} key={student?.id} />
        ))}
      </>
    );
  }



  return (
    <div className='p-5'>
      <BackToCourse courseId={courseId} navigate={navigate} />
      <div className='mx-5'>
        <h2 className='mt-10 font-medium text-lg'>Peer Review</h2>
        <p className='text-gray-500 text-sm mb-4'>In this section, you will be able to see the evaluations that students have given to their peers.</p>
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg  ">
          <div class="flex items-center justify-between pb-4 bg-white  p-5">
            <label for="table-search" class="sr-only">Search</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input
                type="text"
                id="table-search-users"
                onChange={(e) => setSearchTerm(e.target.value)}
                class="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                placeholder="Search for users" />
            </div>
          </div>
          <table class="w-full text-sm text-left text-gray-500 ">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50  ">
              <tr>
                <th scope="col" class="px-6 py-3">
                  Name
                </th>
                <th scope="col" class="px-6 py-3">
                  Files delivered
                </th>
                <th scope="col" class="px-6 py-3">
                  Qualifications recieved
                </th>
                <th scope="col" class="px-6 py-3">
                  Qualifications given
                </th>
              </tr>
            </thead>
            <tbody>
              {courseContentInformation.students?.data.length > 0 && renderTableRows()}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
