import React from 'react'
import { BsFillArrowLeftSquareFill } from 'react-icons/bs'
import { FilePond } from 'react-filepond';
import { Button } from 'antd';

export const UserObjectives = ({ setPageSelector, description, onChange, registerAccount, profilePhoto, setProfilePhoto, loading }) => {
    return (
        <div className="bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden " style={{ maxWidth: '1000px' }} >
            <div className="md:flex w-full ">
                <div className="hidden md:block w-full py-10 px-10 relative ">
                    <button onClick={(e) => setPageSelector(1)}>
                        <BsFillArrowLeftSquareFill size={30} style={{ cursor: "pointer", color: "rgba(0, 0, 0, 1)" }} />
                    </button>
                    <h1 className='justify-center text-center  font-bold text-3xl text-gray-900'>One last steps...</h1>
                    <p className='text-center mb-5 mt-2'>Add some personalization to your profile!</p>
                    <div className="flex -mx-3">
                        <div className="w-full px-3 mb-5">
                            <label for="" className="text-xs font-semibold px-1 ">Add a brief description about yourself</label>
                            <div className="flex">
                                <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i class="mdi mdi-comment-text text-gray-400 text-lg"></i></div>
                                <textarea
                                    type="email"

                                    className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500 resize-none"
                                    placeholder=""
                                    rows={3}
                                    name='description'
                                    value={description}
                                    onChange={e => onChange(e)}
                                    required />
                            </div>
                        </div>
                    </div>
                    <div className='flex -mx-3'>
                        <div className="w-full px-3 mb-5">
                            <label for="" className="text-xs font-semibold px-1">Add a profile photo</label>
                            <FilePond
                                files={profilePhoto}
                                onupdatefiles={fileItems => {
                                    setProfilePhoto(fileItems.map(fileItem => fileItem.file))
                                }}
                                allowMultiple={false}
                                maxFiles={1}
                            />
                        </div>
                    </div>
                    <Button loading={loading} type="button" onClick={registerAccount}
                        className="flex items-center gap-2 ml-auto justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2  focus:outline-none">
                        Create user
                    </Button>
                </div>
            </div>
        </div>
    )
}
