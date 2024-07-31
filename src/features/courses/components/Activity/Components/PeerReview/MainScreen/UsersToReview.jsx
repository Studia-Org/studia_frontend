import Rubrica from "../Rubrica"
import { AvatarGroup, Avatar } from "rsuite"
import { Trans, useTranslation } from "react-i18next"

export default function UsersToReview({ usersToCorrect, usersWithAnswers, setUserIndexSelected, data, usersToPair, correctActivityGroup }) {
    const { t } = useTranslation();
    const usersToPairAdapted = correctActivityGroup ? usersToCorrect.length : usersToPair
    return (
        <section className="flex flex-wrap flex-1 w-full gap-x-10 ">
            <div className="flex flex-col px-5 my-2">
                <h3 className="mb-2"><Trans i18nKey="PEERREVIEW.users_to_review" components={{ "usersToPairAdapted": usersToPairAdapted }} /></h3>
                <h3 >{t("PEERREVIEW.left_to_review")}: {usersToPairAdapted - usersWithAnswers.length} </h3>
                {usersToCorrect.map((user, index) => {
                    const groupName = user.attributes.GroupName || (index + 1)
                    return (
                        <div key={index}
                            onClick={() => setUserIndexSelected(index)}
                            className="flex cursor-pointer hover:scale-105 duration-150  px-3 py-1 w-[250px] border-2 border-gray-700 bg-white rounded-md items-center gap-2 mt-3">
                            {
                                correctActivityGroup ?
                                    <AvatarGroup stack>
                                        {user.attributes.users.data.map((user, index) => {
                                            return (
                                                <Avatar
                                                    circle
                                                    src={user.attributes?.profile_photo?.data?.attributes?.url}
                                                    style={{ background: '#3730a3', width: '2rem', height: '2rem', fontSize: '0.75rem', fontWeight: '400' }} />
                                            )
                                        })}
                                    </AvatarGroup> :
                                    <Avatar size="large"
                                        src={user.attributes?.profile_photo?.data?.attributes?.url} />
                            }

                            <p className="text-lg text-black">{
                                correctActivityGroup ?
                                    ("Group " + groupName) :
                                    user.attributes.username
                            }</p>
                            {
                                usersWithAnswers.find((userWithAnswer) => {
                                    return userWithAnswer.id === user.id
                                }) !== undefined &&
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