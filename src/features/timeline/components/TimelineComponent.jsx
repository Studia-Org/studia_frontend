import React, { useState } from "react";
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
  const groups = [{ id: '1', bgColor: '#f490e5' }, { id: '2', bgColor: '#f29dd0' }, { id: '3', bgColor: '#f29dd0' }, { id: '4', bgColor: '#f29dd0' }, { id: '5', bgColor: '#f29dd0' }]
  const items = [
    {
      id: '0',
      group: '2',
      title: 'Use the optical PCI interface, then you can copy the mobile pixel!',
      start: new Date('2023-08-07').getTime(),
      end: new Date('2023-08-10').getTime(),
      canMove: true,
      canResize: 'both',
      itemProps: { 'data-tip': 'We need to compress the open-source DRAM application!' }
    }, {
      id: '1',
      group: '1',
      title: 'Use the optical PCI interface, then you can copy the mobile pixel!',
      start: new Date('2023-08-8').getTime(),
      end: new Date('2023-08-11').getTime(),
      canMove: true,
      canResize: 'both',
      itemProps: { 'data-tip': 'We need to compress the open-source DRAM application!' }
    }

  ]

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() - today.getDay() + 9);

  const [timelineItems, setTimelineItems] = useState(items);

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
          <div className="w-2  bg-red-500 rounded-md mr-3">
          </div>
          <div className="flex flex-col leading-none justify-center pb-2">
            <h1 className="font-semibold text-base">
              {itemContext.title}
            </h1>
            <p className="font-normal pt-2 text-gray-500">
              Descripcion de test
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
