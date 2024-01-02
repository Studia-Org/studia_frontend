import Timeline, {
  DateHeader,
  TimelineHeaders,
  TimelineMarkers,
  TodayMarker,
} from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import '../styles/timelineStyles.css'
import { useEffect, useRef, useState } from "react";


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

const TimelineComponent = ({ groups, timelineItems, createCourseFlag }) => {

  let alturaElemento = (5 * groups.length) + 5
  const lineHeight = createCourseFlag ? 60 : 153;
  const itemHeightRatio = createCourseFlag ? 0.8 : 0.70;

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());


  const [endOfWeek, setEndOfWeek] = useState(new Date());
  const timelineContainer = useRef();
  const updateEndOfWeek = () => {
    const today = new Date();

    if (timelineContainer.current === null || timelineContainer.current === undefined) return;

    const screenTimeline = timelineContainer?.current.clientWidth;
    let dayOffset = 7;
    if (screenTimeline > 900) {
      dayOffset = 7;
    }
    else if (screenTimeline > 700 && screenTimeline < 900) {
      dayOffset = 5;
    }
    else if (screenTimeline > 500) {
      dayOffset = 4;
    }
    else if (screenTimeline >= 400) {
      dayOffset = 3;
    }
    else if (screenTimeline < 300) dayOffset = 1;
    else dayOffset = 2;
    const newEndOfWeek = new Date(today);
    newEndOfWeek.setDate(today.getDate() - today.getDay() + dayOffset);

    setEndOfWeek(newEndOfWeek);
  };

  useEffect(() => {
    updateEndOfWeek();
    window.addEventListener('resize', updateEndOfWeek);
    return () => {
      window.removeEventListener('resize', updateEndOfWeek);
    };
  }, []);



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

    if (item.fase.toLowerCase() === 'performance') {
      colorStyle = { backgroundColor: '#eab308' }
    } else if (item.fase.toLowerCase() === 'self-reflection') {
      colorStyle = { backgroundColor: '#ef4444' }
    } else if (item.fase.toLowerCase() === 'forethought') {
      colorStyle = { backgroundColor: '#166534' }
    }
    else colorStyle = { backgroundColor: '#3573f9' }
    return (
      <div className="pt-70">
        <div
          className="mt-10 flex"
          {...getItemProps({
            style: {
              padding: '10px',
              backgroundColor,
              color: item.color,
              borderColor,
              borderStyle: "solid",
              borderWidth: 1,
              borderRadius: 7,
              borderLeftWidth: itemContext.selected ? 3 : 1,
              borderRightWidth: itemContext.selected ? 3 : 1
            },
            onMouseDown: () => {
            }
          })}

        >
          {itemContext.useResizeHandle ? <div className="" {...leftResizeProps} /> : null}

          <div className="flex h-full ">

            <div className="w-2 rounded-md mr-3" style={colorStyle}>
            </div>
            <div className="flex flex-col leading-none justify-center">
              <h1 className="font-semibold text-base">
                {itemContext.title}
              </h1>
              <p className="font-normal  text-gray-500">
                {item.description}
              </p>

            </div>
          </div>

          {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : null}
        </div>
      </div>

    );
  };

  function TimelineComponentStructure() {
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
        lineHeight={lineHeight}
        itemHeightRatio={itemHeightRatio}
        canMove={false}
        canChangeGroup={false}
        canResize={true}
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

              if (today.toDateString() === intervalDate.toDateString() && !createCourseFlag) {
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
                  <div className={`h-full ${createCourseFlag ? 'bg-gray-50 border-t border-b' : 'bg-white'}  items-center justify-center flex `} {...getIntervalProps()}>
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
          {!createCourseFlag ? (
            <TodayMarker>
              {({ styles }) => (
                <div style={{ ...styles, backgroundColor: '#3573f9', zIndex: '100', width: '1px' }} />
              )}
            </TodayMarker>
          ) : null}
        </TimelineMarkers>
      </Timeline>

    )
  }

  return (
    createCourseFlag ?

      <main ref={timelineContainer} style={{ height: alturaElemento + 'rem' }}>
        <TimelineComponentStructure />
      </main>

      :

      <main ref={timelineContainer} style={{ height: "100%" }}>
        <TimelineComponentStructure />
      </main>

  )
};

export default TimelineComponent;