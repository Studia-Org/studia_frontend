import React, { useEffect, useState } from 'react'
import { Sidebar } from '../../../shared/elements/Sidebar';
import { Navbar } from '../../../shared/elements/Navbar';
import 'rsuite/dist/rsuite-no-reset.min.css';
import { useAuthContext } from "../../../context/AuthContext";
import { Calendar, Whisper, Popover, Badge, Modal, Input, Button, Form } from 'rsuite';
import { API } from "../../../constant";
import { message } from "antd";
import { getToken } from "../../../helpers";
import { FiPlus } from 'react-icons/fi';
import './calendar.css'

const CalendarEvents = () => {
    const { user } = useAuthContext();
    const [open, setOpen] = useState(false);
    const [infoModal, setInfoModal] = useState(false);
    const [infoModalData, setInfoModalData] = useState({});
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [events, setEventList] = useState([]);
    const [innerWidth, setInnerWidth] = useState(window.innerWidth);

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
            const response = await fetch(`${API}/calendar-events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ data: userData })
            });
            const data = await response.json();
            message.success("Event Added Successfully");
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
                        title: event.title,
                        date: new Date(event.date),
                    };
                });
                setEventList(eventsData);
            } catch (error) {
                console.error(error)
                message.error("Error fetching events");
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
                        <p className='text-blue-600 float-left'>{moreCount} more</p>
                    </Whisper>
                </li>
            );
            return (
                <ul className="calendar-todo-list over overflow-hidden">

                    {displayList.map((item, index) => (

                        <li onClick={() => { setInfoModal(true); setInfoModalData(list) }} className={`text-left ${innerWidth < 690 ? "text-center" : ""}`} key={index}>
                            {innerWidth < 690 ? <Badge /> :
                                <>
                                    <Badge />
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
    return (
        <>
            <div className='max-w-full rounded-tl-3xl bg-[#e7eaf886] '>
                <div className='font-bold text-2xl overflow-y-auto h-full'>

                    <div className='grid h-full '>
                        <div className='font-normal max-w-[95%] max-h-[95%] overflow-hidden bg-white rounded-xl my-auto mx-auto '>
                            <Calendar compact={innerWidth < 690} bordered renderCell={renderCell} />
                        </div>
                    </div>
                </div>
                <div className='fixed right-10 bottom-10'>
                    <button
                        type="button"
                        data-dial-toggle="speed-dial-menu-dropdown"
                        aria-controls="speed-dial-menu-dropdown"
                        className="flex shadow-lg items-center transition  justify-center ml-auto text-white bg-blue-600 rounded-full w-14 h-14 hover:bg-blue-600 hover-scale active-scale  "
                        onClick={handleOpen}
                    >
                        <FiPlus size={26} />
                        <span className="sr-only"></span>
                    </button>
                </div>
            </div>
            <div className='flex shadow-lg'>
                <Modal size='sm' open={open} onClose={handleClose}>
                    <Modal.Header>
                        <Modal.Title>Add Event</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group >
                            <Form.ControlLabel>Title</Form.ControlLabel>
                            <Input value={title} onChange={handleTitleChange} />
                        </Form.Group >
                        <Form.Group >
                            <Form.ControlLabel>Date</Form.ControlLabel>
                            <Input type='datetime-local' value={date} onChange={handleDateChange} />
                        </Form.Group >
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={handleClose} appearance="subtle">
                            Cancel
                        </Button>
                        <Button onClick={handleAddEvent} appearance="primary">
                            Add Event
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            <div className=' shadow-lg'>
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
                        {infoModalData && (
                            Object.keys(infoModalData).map((item, index) => (
                                <div key={index}>
                                    <b> {infoModalData[item].title}</b> - {new Date(infoModalData[item].date).toLocaleTimeString()}
                                </div>
                            ))
                        )}

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => setInfoModal(false)} appearance="subtle">
                            Close
                        </Button>
                        <Button onClick={() => { setInfoModal(false); setOpen(true) }} appearance="primary">
                            Add Event
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>

    )
}

export default CalendarEvents