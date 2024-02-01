import Rubrica from "../Rubrica"
import { Avatar } from "antd"


export default function UsersToReview({ usersToCorrect, usersWithAnswers, setUserIndexSelected, data, usersToPair }) {
    return (
        <section className="flex flex-wrap flex-1 w-full gap-x-10 ">
            <div className="flex flex-col px-5 my-2">
                <h3 className="mb-2"> You have to review {usersToPair} colleagues to finish the activity</h3>
                <h3 >Left to review: {usersToPair - usersWithAnswers.length} </h3>
                {usersToCorrect.map((user, index) => {
                    return (
                        <div key={index}
                            onClick={() => setUserIndexSelected(index)}
                            className="flex cursor-pointer hover:scale-105 duration-150  px-3 py-1 w-[250px] border-2 border-gray-700 bg-white rounded-md items-center gap-2 mt-3">
                            <Avatar size="large" src={user.attributes.profile_photo.data?.attributes?.url} />
                            <p className="text-lg text-black">{user.attributes.username}</p>
                            {
                                usersWithAnswers.find((userWithAnswer) => userWithAnswer.id === user.id) !== undefined &&
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" className="w-6 h-6 ml-auto">
                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                </svg>


                            }
                        </div>
                    )
                })}
            </div>
            <div className="mt-2 w-full overflow-x-hidden flex flex-1 px-5 basis-[450px]">
                <div className="w-full max-w-4xl mx-auto">
                    <Rubrica data={data} petite={true} />
                </div>
            </div>
        </section>
    )
}