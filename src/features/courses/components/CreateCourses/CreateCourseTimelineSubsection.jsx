import React from 'react'
import TimelineComponent from '../../../timeline/components/TimelineComponent'

export const CreateCourseTimelineSubsection = ({ createCourseSectionsList, sectionId }) => {
  const sectionFiltered = createCourseSectionsList.filter((section) => section.id === sectionId)[0]
  const groups = Array.from({ length: sectionFiltered.subsections.length }, (_, index) => ({
    id: (index + 1).toString(),
    bgColor: '#f490e5',
  }));
  let counter = 1;
  let timelineItems = []

  let alturaElemento = (5 * groups.length) + 5

  sectionFiltered.subsections.forEach(subsection => {
    const info = {
      id: Math.floor(Math.random() * Math.floor(Math.random() * Date.now())),
      group: counter.toString(),
      title: subsection.title,
      start: new Date(subsection.start_date).getTime(),
      end: new Date(subsection.end_date).getTime(),
      description: subsection.description,
      fase: subsection.fase,
    };
    counter++;
    timelineItems.push(info);
  });



  return (
    groups.length === 0 ?
      <div className='bg-white shadow-md rounded-md p-5 mb-10 flex items-center justify-center flex-col'>
        <img className='my-5 w-52 opacity-60' src="https://liferay-support.zendesk.com/hc/article_attachments/360032795211/empty_state.gif" alt="" />
        <p className='text-gray-400'>Add your first item!</p>
      </div> :
      alturaElemento &&
      <div style={{ height: alturaElemento + 'rem' }} className={`bg-white shadow-md rounded-md p-5  mb-10  `}>
        {timelineItems.length > 0 && <TimelineComponent groups={groups} timelineItems={timelineItems} createCourseFlag={true} />}
      </div>
  )
}
