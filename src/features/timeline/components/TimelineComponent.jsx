import React, { useState, useEffect } from "react";
import { API } from "../../../constant";
import { useAuthContext } from "../../../context/AuthContext";

import Timeline, {
  DateHeader,
  TimelineHeaders,
  TimelineMarkers,
  TodayMarker,
} from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import '../styles/timelineStyles.css'



const keys = {
  groupIdKey: "id",
  groupTitleKey: "title",
  groupRightTitleKey: "rightTitle",
  itemIdKey: "id",
  itemTitleKey: "title",
  itemDivTitleKey: "title",
  itemGroupKey: "group",
  itemTimeStartKey: "start",
  itemTimeEndKey: "end",
  groupLabelKey: "title"
};

const TimelineComponent = () => {
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


  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() - today.getDay() + 9);

  const itemRenderer = ({
    item,
    timelineContext,
    itemContext,
    getItemProps,
    getResizeProps
  }) => {
    const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
    const backgroundColor = 'white'
    const borderColor = itemContext.resizing ? "red" : item.color;
    var colorStyle = undefined;

    if (item.fase === 'Performance') {
      colorStyle = { backgroundColor: '#eab308' }
    } else if (item.fase === 'Self-reflection') {
      colorStyle = { backgroundColor: '#ef4444' }
    } else if (item.fase === 'Forethought') {
      colorStyle = { backgroundColor: '#166534' }
    }

    console.log(item)

    return (
      <div
        {...getItemProps({
          style: {
            backgroundColor,
            color: item.color,
            borderColor,
            borderStyle: "solid",
            padding: "10px",
            borderWidth: 1,
            borderRadius: 7,
            borderLeftWidth: itemContext.selected ? 3 : 1,
            borderRightWidth: itemContext.selected ? 3 : 1
          },
          onMouseDown: () => {
          }
        })}
      >
        {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : null}
        <div className="flex h-full">
          <div className="w-2 rounded-md mr-3" style={colorStyle}>
          </div>
          <div className="flex flex-col leading-none justify-center pb-2">
            <h1 className="font-semibold text-base">
              {itemContext.title}
            </h1>
            <p className="font-normal pt-2 text-gray-500">
              {item.description}
            </p>

          </div>
        </div>

        {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : null}
      </div>
    );
  };

  return (
    <Timeline
      groups={groups}
      items={timelineItems}
      keys={keys}
      minZoom={60 * 60 * 1000 * 24 * 9}
      maxZoom={60 * 60 * 1000 * 24 * 9}
      defaultTimeStart={startOfWeek}
      defaultTimeEnd={endOfWeek}
      itemTouchSendsClick={false}
      stackItems
      lineHeight={153}
      itemHeightRatio={0.70}
      canMove={false}
      canChangeGroup={false}
      canResize={false}
      sidebarWidth={0}
      itemRenderer={itemRenderer}
    >
      <TimelineHeaders>
        <DateHeader
          unit="day"
          labelFormat="MM/DD"
          height={55}
          intervalRenderer={({ getIntervalProps, intervalContext }) => {
            const [month, day] = intervalContext.intervalText.split('/').map(item => parseInt(item, 10));
            const intervalDate = new Date(today.getFullYear(), month - 1, day);
            const date = new Date(2023, month - 1, day);
            const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const dayOfWeek = daysOfWeek[date.getDay()];

            if (today.toDateString() === intervalDate.toDateString()) {
              return (
                <div className="h-full bg-white items-center justify-center flex " {...getIntervalProps()}>
                  <div className=" bg-[#3573f9] text-white py-2 px-10 rounded-lg">
                    <div className="flex font-normal text-base ">
                      <p className=" whitespace-pre">{dayOfWeek}</p>
                      <p className="font-semibold">, {day}</p>
                    </div>
                  </div>

                </div>
              );
            } else {
              return (
                <div className="h-full bg-white items-center justify-center flex " {...getIntervalProps()}>
                  <div className="flex font-normal text-base">
                    <p className="text-gray-600 whitespace-pre">{dayOfWeek}</p>
                    <p className="font-semibold">, {day}</p>
                  </div>
                </div>
              );
            }


          }}


        />
      </TimelineHeaders>
      <TimelineMarkers>
        <TodayMarker>
          {({ styles }) => (
            <div style={{ ...styles, backgroundColor: '#3573f9', zIndex: '100', width: '1px' }} />
          )}
        </TodayMarker>
      </TimelineMarkers>
    </Timeline>


  );
};

export default TimelineComponent;
