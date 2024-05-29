import { useEffect, useState, React } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Tag } from '../../../shared/elements/Tag';
import { API } from "../../../constant";
import { useAuthContext } from "../../../context/AuthContext";
import { EditPanel } from '../components/EditPanel';
import { CoursesCardsProfile } from '../components/CoursesCardsProfile';
import { MoonLoader } from 'react-spinners';

const UserProfile = () => {

  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState([]);
  let { uid } = useParams();

  document.title = `${user.name} - Uptitude`

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
  console.log(userProfile)

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
    Promise.all([fetchCoursesCards(), fetchUserProfile()])
      .finally(() => {
        setLoading(false);
      });

  }, [uid]);

  return (
    <div className='max-w-full w-full max-h-full rounded-tl-3xl bg-[#e7eaf886]  '>
      {
        loading ?
          <div className='flex items-center justify-center h-screen'>
            <MoonLoader color="#363cd6" size={80} />
          </div>
          :
          <>

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
                  }}>
                  <span
                    id="blackOverlay"
                    className="absolute w-full h-full bg-black opacity-50 lg:rounded-tl-3xl"
                  />
                </div>
              </section>
              <section className="relative py-16 ">
                <div className="container px-[5vw] mx-auto xl:px-44">
                  <div className="relative flex flex-col w-full min-w-0 mb-6 -mt-64 break-words bg-white rounded-lg shadow-xl">
                    <div className="px-6">
                      <div className="flex flex-wrap justify-center">
                        <div className="flex justify-center w-full px-4 ">
                          <div className="flex justify-center w-full">
                            {userProfile && userProfile.profile_photo ? (
                              <img
                                src={userProfile && userProfile.profile_photo?.url}
                                className="object-fill -m-16 border-none rounded-lg shadow-xl w-[150px] h-[150px] lg:-ml-16"
                                alt=""
                              />
                            ) : (
                              <div></div>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end w-full px-4 lg:w-4/12 lg:order-2 lg:text-right lg:self-center">
                          <button
                            name='editButton'
                            onClick={handleOpenModal}
                            className={`p-2.5 lg:m-4 mt-8 bg-indigo-500 rounded-xl hover:rounded-3xl duration-300 hover:bg-indigo-600 text-white ${user?.id !== userProfile?.id ? 'invisible opacity-0' : ''
                              }`}
                          >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          {showModal && <EditPanel onClose={handleCloseModal} userProfile={userProfile} setUserProfile={setUserProfile} uid={uid} />}
                        </div>
                        <div className="w-full px-4 lg:w-4/12 lg:order-1">
                        </div>
                      </div>
                      <div className="mt-12 text-center">
                        <h3 className="flex items-center justify-center gap-3 text-4xl font-semibold leading-normal text-center text-blueGray-800">
                          {userProfile && userProfile.name}
                          <Tag className={'hidden lg:block'} User={userProfile} />
                        </h3>

                        <h3 className="text-xl font-medium leading-normal text-blueGray-500 mb-7">
                          <p>{userProfile && userProfile.username}</p>
                        </h3>
                        <div className="flex flex-col justify-center mb-2 text-blueGray-600">
                          <div className='flex justify-center'>
                            <i className="mr-2 text-lg fas fa-university text-blueGray-400" />
                            <p>{userProfile && userProfile.university}</p>
                          </div>
                          <p>{userProfile && userProfile.email}</p>

                        </div>
                      </div>
                      <div className="py-10 mt-10 text-center border-t border-blueGray-200">
                        <div className="flex flex-wrap justify-center">
                          <div className="w-full px-4 lg:w-9/12">
                            <p className="mb-4 text-base leading-relaxed text-blueGray-700" name='editDescription'>
                              {userProfile && userProfile.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className='border-t '>
                        <div className='flex flex-col items-center justify-center my-4'>
                          {courses.courses && courses.courses.map(renderCourseCard)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </>
      }
    </div>
  )
}

export default UserProfile;