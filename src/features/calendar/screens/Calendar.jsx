import React, { useEffect, useState } from 'react'
import 'rsuite/dist/rsuite-no-reset.min.css';
import { Empty } from 'antd';
import { useAuthContext } from "../../../context/AuthContext";
import { Calendar, Whisper, Popover, Badge, Modal, Input, Button, Form, CustomProvider } from 'rsuite';
import { API } from "../../../constant";
import { message } from "antd";
import { fetchAllCoursesFromUser } from '../../../fetches/fetchAllCoursesFromUser';
import { getToken } from "../../../helpers";
import { FiPlus } from 'react-icons/fi';
import { MoonLoader } from "react-spinners";
import { useTranslation } from "react-i18next";
import { esES, enUS, caES } from 'rsuite/locales'
import './calendar.css'

const CalendarEvents = () => {
    const { t, i18n } = useTranslation();
    const locales = {
        'es': esES,
        'en': enUS,
        'ca': caES
    }
    const locale = locales[i18n.language] || enUS;
    const { user } = useAuthContext();
    const [open, setOpen] = useState(false);
    const [infoModal, setInfoModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [infoModalData, setInfoModalData] = useState({});
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [events, setEventList] = useState([]);
    const [innerWidth, setInnerWidth] = useState(window.innerWidth);

    document.title = `Calendar - Uptitude`
    const handleTitleChange = (value) => {
        setTitle(value);
    };

    const handleDateChange = (value) => {
        setDate(value);
    };

    const handleOpen = value => {
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    const handleAddEvent = async () => {
        const userData = {
            title: title,
            date: date,
            users: user.id
        };

        try {
            await fetch(`${API}/calendar-events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ data: userData })
            });
            fetchEvents();
            message.success(t("CALENDAR.event_added"));
        } catch (error) {
            console.error(error);
        }
        handleClose();
    }

    const fetchEvents = async () => {
        if (user) {
            try {

                const response = await fetch(`${API}/users/${user.id}?populate=calendar_events`, {
                    method: 'GET',
                });
                const data = await response.json();
                const eventsData = data.calendar_events.map(event => {
                    return {
                        id: event.id,
                        title: event.title,
                        date: new Date(event.date),
                        type: 'event'
                    };
                })
                const coursesUser = await fetchAllCoursesFromUser(user.id);
                coursesUser.forEach(course => {
                    course.attributes.sections.data.forEach(section => {
                        section.attributes.subsections.data.forEach(subsection => {
                            eventsData.push({
                                id: subsection.id,
                                title: `${course.attributes.title} - ${section.attributes.title} - ${subsection.attributes.title}`,
                                date: new Date(subsection.attributes.activity?.data?.attributes.deadline),
                                type: 'course'
                            })
                        })
                    })
                })
                setEventList(eventsData);
            } catch (error) {
                console.error(error)
                message.error(t("CALENDAR.error_fetching_events"));
            } finally {
                setIsLoading(false);
            }
        }
    }

    useEffect(() => {
        fetchEvents();
    }, [user])

    function getTodoList(date) {
        return events.filter((item) => {
            return (
                item.date.getFullYear() === date.getFullYear() &&
                item.date.getMonth() === date.getMonth() &&
                item.date.getDate() === date.getDate()
            );
        });
    }


    function renderCell(date) {
        const list = getTodoList(date);
        const displayList = list.filter((item, index) => index < 1);

        if (list.length) {
            const moreCount = list.length - displayList.length;
            const moreItem = (
                <li className=''>
                    <Whisper
                        placement="top"
                        trigger="click"
                        speaker={

                            <Popover>
                                {list.map((item, index) => (
                                    <p className='' key={index}>
                                        <b>{formatTime(item.date)}</b> - {item.title}
                                    </p>
                                ))}
                            </Popover>
                        }
                    >
                        <p className='float-left text-blue-600'>{moreCount} more</p>
                    </Whisper>
                </li>
            );
            return (
                <ul className="overflow-hidden calendar-todo-list over">
                    {displayList.map((item, index) => (

                        <li className={`text-left ${innerWidth < 690 ? "text-center" : ""}`} key={index}>
                            {innerWidth < 690 ?
                                item.type === 'event' ?
                                    <Badge />
                                    :
                                    <Badge color="blue" />

                                :
                                <>
                                    {
                                        item.type === 'event' ?
                                            <Badge />
                                            :
                                            <Badge color="blue" />
                                    }
                                    <b className='pl-1'>{formatTime(item.date)}</b> - {item.title}
                                </>
                            }

                        </li>
                    ))}
                    {moreCount && innerWidth > 690 ? moreItem : null}
                </ul>
            );
        }

        return null;
    }

    function selectDate(date) {
        setInfoModal(true);
        setTitle('');
        setDate(date);
        console.log(date)
        setInfoModalData(getTodoList(date))
    }

    window.addEventListener('resize', () => {
        setInnerWidth(window.innerWidth);
    });
    function formatTime(dateTimeString) {
        const options = {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };
        const date = new Date(dateTimeString);
        return date.toLocaleTimeString(undefined, options);
    }

    const formatDateExport = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}${month}${day}T${hours}${minutes}${seconds}`;
    };

    //IMPORTANTE: No formatear el return
    const exportCalendar = () => {
        const calendarEvents = events.map(event => {
            return `
BEGIN:VEVENT
SUMMARY:${event.title}
DTSTART:${formatDateExport(event.date)}
DESCRIPTION:${event.type}
END:VEVENT
    `;
        });

        const icsData = `
BEGIN:VCALENDAR
VERSION:2.0
${calendarEvents.join('')}
END:VCALENDAR
    `;

        const blob = new Blob([icsData], { type: 'text/calendar' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'calendar.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const deleteEvent = async (event) => {
        try {
            await fetch(`${API}/calendar-events/${event.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            fetchEvents();
            setInfoModal(false)
            message.success(t("CALENDAR.event_deleted"));
        } catch (error) {
            console.error(error);
        }
    }

    function formatDate(date) {
        if (date instanceof Date) {
            const isoString = date.toISOString();
            return isoString.slice(0, 16);
        }
    }


    return (
        <>
            {isLoading ? (
                <div className='flex items-center justify-center w-full h-full rounded-tl-3xl bg-[#e7eaf886]'>
                    <div className='flex items-center justify-center w-full h-full '>
                        <MoonLoader color='#363cd6' size={80} />
                    </div>
                </div>

            ) : (
                <div className='max-w-full rounded-tl-3xl bg-[#e7eaf886] '>

                    <div className='h-full overflow-y-auto text-2xl font-bold'>
                        <div className='grid h-full '>
                            <div className='font-normal max-w-[95%] max-h-[100%] mt-8 mb-10 overflow-hidden bg-white rounded-xl my-auto mx-auto border'>
                                <div className='flex w-full'>
                                    <Button bordered onClick={() => exportCalendar()} className='gap-2 mt-3 ml-auto mr-3'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                            <path d="M13.75 7h-3v5.296l1.943-2.048a.75.75 0 0 1 1.114 1.004l-3.25 3.5a.75.75 0 0 1-1.114 0l-3.25-3.5a.75.75 0 1 1 1.114-1.004l1.943 2.048V7h1.5V1.75a.75.75 0 0 0-1.5 0V7h-3A2.25 2.25 0 0 0 4 9.25v7.5A2.25 2.25 0 0 0 6.25 19h7.5A2.25 2.25 0 0 0 16 16.75v-7.5A2.25 2.25 0 0 0 13.75 7Z" />
                                        </svg>
                                        {t("CALENDAR.export_calendar")}
                                    </Button>
                                </div>
                                <CustomProvider locale={locale} >
                                    <Calendar isoWeek={true} onSelect={selectDate} compact={innerWidth < 690} bordered renderCell={renderCell} />
                                </CustomProvider>
                            </div>
                        </div>
                    </div>
                    <div className='fixed right-[6.5rem] bottom-12'>
                        <button
                            type="button"
                            data-dial-toggle="speed-dial-menu-dropdown"
                            aria-controls="speed-dial-menu-dropdown"
                            className="flex items-center justify-center w-[3.2rem] h-[3.2rem] ml-auto text-white transition bg-[#3c3c3c] rounded-full shadow-xl hover:bg-[#4f4f4f] hover-scale active-scale "
                            onClick={handleOpen}
                        >
                            <FiPlus size={26} />
                            <span className="sr-only"></span>
                        </button>
                    </div>
                </div>
            )}
            <div className='flex shadow-lg'>
                <Modal size='sm' open={open} onClose={handleClose}>
                    <Modal.Header>
                        <Modal.Title>{t("CALENDAR.add_event")}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group >
                            <Form.ControlLabel>{t("CALENDAR.event_title")}</Form.ControlLabel>
                            <Input value={title} onChange={handleTitleChange} />
                        </Form.Group >
                        <Form.Group className='mt-6' >
                            <Form.ControlLabel>{t("CALENDAR.date")}</Form.ControlLabel>
                            <Input type='datetime-local' value={formatDate(date)} onChange={handleDateChange} />
                        </Form.Group >
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={handleClose} appearance="subtle">
                            {t("COMMON.cancel")}
                        </Button>
                        <Button onClick={handleAddEvent} appearance="primary">
                            {t("CALENDAR.add_event")}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            <div className='shadow-lg '>
                <Modal size='xs' open={infoModal} onClose={() => setInfoModal(false)}>
                    <Modal.Header>
                        <Modal.Title>
                            {infoModalData && infoModalData.length > 0 && (
                                <div>
                                    <b>{new Date(infoModalData[0].date).toLocaleDateString()}</b>
                                </div>
                            )}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {
                            Object.keys(infoModalData).length === 0 && (
                                <div>
                                    <Empty description={t("CALENDAR.there_are_no_events")} />
                                </div>
                            )
                        }
                        {infoModalData && (
                            Object.keys(infoModalData).map((item, index) => (
                                <div key={index} className='flex items-center w-full p-3 rounded hover:bg-gray-50'>
                                    <div className="flex-grow">
                                        <b>{infoModalData[item].title}</b> - {new Date(infoModalData[item].date).toLocaleTimeString()}
                                    </div>
                                    {
                                        infoModalData[item].type === 'event' && (
                                            <div className='ml-2'>
                                                <Button onClick={() => deleteEvent(infoModalData[item])}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-auto">
                                                        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
                                                    </svg>
                                                </Button>
                                            </div>
                                        )
                                    }
                                </div>
                            ))

                        )}

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => setInfoModal(false)} appearance="subtle">
                            {t("COMMON.cancel")}
                        </Button>
                        <Button onClick={() => { setInfoModal(false); setOpen(true) }} appearance="primary">
                            {t("CALENDAR.add_event")}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>

    )
}

export default CalendarEvents