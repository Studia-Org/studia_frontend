import { useEffect, useState, React } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Tag } from '../../../shared/elements/Tag';
import { API } from "../../../constant";
import { useAuthContext } from "../../../context/AuthContext";
import { EditPanel } from '../components/EditPanel';
import { CoursesCardsProfile } from '../components/CoursesCardsProfile';
import { checkAuthenticated } from "../../../helpers";

const UserProfile = () => {

  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuthContext();
  const [userProfile, setUserProfile] = useState([]);
  let { uid } = useParams();

  document.title = `${user.name} - Uptitude`
  
  const navigate = useNavigate();
  useEffect(() => {
    if (!checkAuthenticated()) {
      navigate('/');
    }
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  function renderCourseCard(course) {
    return (
      <>
        {user && <CoursesCardsProfile course={course} user={user} />}
      </>
    )
  }


  function fetchCoursesCards() {
    fetch(`${API}/users/${uid}?populate=courses.cover,courses.students,courses.professor,courses.professor.profile_photo`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
      })
      .catch((error) => console.error(error));
  }

  function fetchUserProfile() {
    fetch(`${API}/users/${uid}?populate=*`)
      .then((res) => res.json())
      .then((data) => {
        setUserProfile(data);
      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    fetchCoursesCards();
    fetchUserProfile();
  }, [uid]);

  return (

    <div className='container-fluid w-full  rounded-tl-3xl bg-[#e7eaf886]  '>
      <>
        <link
          rel="stylesheet"
          href="https://demos.creative-tim.com/notus-js/assets/styles/tailwind.css"
        />
        <link
          rel="stylesheet"
          href="https://demos.creative-tim.com/notus-js/assets/vendor/@fortawesome/fontawesome-free/css/all.min.css"
        />
        <main className="profile-page">
          <section className="relative block h-96">
            <div
              className="absolute top-0 w-full h-full bg-center bg-cover lg:rounded-tl-3xl"
              style={{
                backgroundImage: `url(${userProfile?.landscape_photo?.url})`
              }}
            >

              <span
                id="blackOverlay"
                className="w-full h-full absolute opacity-50 bg-black lg:rounded-tl-3xl"
              />
            </div>

          </section>
          <section className="relative py-16 ">
            <div className="container mx-auto px-4">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
                <div className="px-6">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                      <div className="relative">
                        {userProfile && userProfile.profile_photo ? (
                          <img
                            src={userProfile && userProfile.profile_photo.url}
                            className="shadow-xl rounded-lg h-36 w-36 object-cover  align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
                            alt=""
                          />
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </div>

                    <div className="w-full lg:w-4/12 px-4  flex justify-end lg:order-2 lg:text-right lg:self-center">
                      <button
                        name='editButton'
                        onClick={handleOpenModal}
                        className={`p-2.5 lg:m-4 mt-8 bg-indigo-500 rounded-xl hover:rounded-3xl hover:bg-indigo-600 text-white ${user?.id !== userProfile?.id ? 'invisible opacity-0' : ''
                          }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      {showModal && <EditPanel onClose={handleCloseModal} userProfile={userProfile} uid={uid} />}
                    </div>
                    <div className="w-full lg:w-4/12 px-4 lg:order-1">
                    </div>
                  </div>
                  <div className="text-center mt-12">
                    <h3 className="text-4xl font-semibold leading-normal text-blueGray-800 flex items-center justify-center text-center">
                      {userProfile && userProfile.name}
                      <Tag className={'hidden lg:block'} User={userProfile} />
                    </h3>

                    <h3 className="text-xl font-medium leading-normal text-blueGray-500 mb-7">
                      <p>{userProfile && userProfile.username}</p>
                    </h3>
                    <div className="mb-2 text-blueGray-600 flex justify-center">
                      <i className="fas fa-university mr-2 text-lg text-blueGray-400" />
                      <p>{userProfile && userProfile.university}</p>
                    </div>
                  </div>
                  <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                    <div className="flex flex-wrap justify-center">
                      <div className="w-full lg:w-9/12 px-4">
                        <p className="mb-4 text-base leading-relaxed text-blueGray-700" name='editDescription'>
                          {userProfile && userProfile.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='border-t '>
                    <div className='my-4 flex flex-col justify-center items-center'>
                      {courses.courses && courses.courses.map(renderCourseCard)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </>
    </div>

  )
}

export default UserProfile;