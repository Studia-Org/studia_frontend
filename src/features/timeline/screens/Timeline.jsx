import React, { useState, useEffect } from 'react'
import TimelineComponent from '../components/TimelineComponent';
import { useAuthContext } from "../../../context/AuthContext"
import { API } from '../../../constant';



const Timeline = () => {
    const { user } = useAuthContext();
    const [timelineItems, setTimelineItems] = useState([]);
    const groups = [{ id: '1', bgColor: '#f490e5' }, { id: '2', bgColor: '#f29dd0' }, { id: '3', bgColor: '#f29dd0' }, { id: '4', bgColor: '#f29dd0' }, { id: '5', bgColor: '#f29dd0' }]

    const fetchCourseInformation = async () => {
        try {
            const courseContentInformation = [];
            var counter = 0;
            const response = await fetch(`${API}/users/${user.id}?populate=courses.sections.subsections&filter=courses`);
            const data = await response.json();

            data.courses.forEach(course => {
                counter++;
                course.sections.forEach(section => {
                    section.subsections.forEach(subsection => {
                        const info = {
                            id: Math.floor(Math.random() * Math.floor(Math.random() * Date.now())),
                            group: counter.toString(),
                            title: subsection.title,
                            start: new Date(subsection.start_date).getTime(),
                            end: new Date(subsection.end_date).getTime(),
                            description: subsection.description,
                            fase: subsection.fase,
                        };
                        courseContentInformation.push(info);
                    });
                });
            });
            setTimelineItems(courseContentInformation);
        } catch (error) {
            console.error(error);
        } finally {
        }
    };

    useEffect(() => {
        if (user) {
            fetchCourseInformation();
        }
    }, [user]);

    return (
        <div className='rounded-tl-3xl bg-[#e7eaf886] w-full '>
            <div className='pt-9 pl-12 font-bold text-2xl h-[95%]  w-full '>
                <div className='bg-[#f7f7f7] p-4 pb-0  rounded-t-2xl  h-full shadow-lg w-full '>
                    {timelineItems && <TimelineComponent groups={groups} timelineItems={timelineItems} createCourseFlag={false} />}
                </div>
            </div>
        </div>

    )

}

export default Timeline