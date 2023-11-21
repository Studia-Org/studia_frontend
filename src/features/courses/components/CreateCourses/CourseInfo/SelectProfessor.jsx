import React, { Fragment, useState, useEffect } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { API } from '../../../../../constant';
import { message } from 'antd';


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function SelectProfessor({ setCourseBasicInfo }) {
    const [professors, setProfessors] = useState([])
    const [selected, setSelected] = useState()

    const fetchProfessorInformation = async () => {
        try {
            const response = await fetch(`${API}/users/?populate=profile_photo`);
            const data = await response.json();
            data.forEach(user => {
                if (user.role_str === 'professor') {
                    setProfessors(prevState => [...prevState,
                    {
                        id: user.id,
                        name: user.name,
                        avatar: user.profile_photo.url,
                        description: user.description
                    }
                    ])
                }
            });
        } catch (error) {
            message.error(error);
        } finally {
        }
    };

    useEffect(() => {
        if (professors.length === 0) {
            fetchProfessorInformation();
        }
    }, []);

    useEffect(() => {
        if (professors.length > 0) {
            setSelected(professors[0]);
        }
    }, [professors]);

    const handleSelectChange = (newValue) => {
        setSelected(newValue);
        setCourseBasicInfo(prevState => ({
            ...prevState,
            evaluator: {
                id: newValue.id,
                name: newValue.name,
                avatar: newValue.avatar,
                description: newValue.description
            }
        }))
    };


    return (
        professors.length > 0 && (
            <Listbox value={selected} onChange={handleSelectChange}>
                {({ open }) => (
                    <>
                        <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Professor</Listbox.Label>
                        <div className="relative mt-2">
                            {selected &&
                                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-3 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                                    <span className="flex items-center">
                                        <img src={selected.avatar} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
                                        <span className="ml-3 block truncate">{selected.name}</span>
                                    </span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
                                            <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
                                        </svg>

                                    </span>
                                </Listbox.Button>
                            }

                            <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {professors &&
                                        professors.map((person) => (
                                            <Listbox.Option
                                                key={person.id}
                                                className={({ active }) =>
                                                    classNames(
                                                        active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                                                        'relative cursor-default select-none py-2 pl-3 pr-9'
                                                    )
                                                }
                                                value={person}
                                            >
                                                {({ selected, active }) => (
                                                    <>
                                                        <div className="flex items-center">
                                                            <img src={person.avatar} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
                                                            <span
                                                                className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                                                            >
                                                                {person.name}
                                                            </span>
                                                        </div>

                                                        {selected ? (
                                                            <span
                                                                className={classNames(
                                                                    active ? 'text-white' : 'text-indigo-600',
                                                                    'absolute inset-y-0 right-0 flex items-center pr-4'
                                                                )}
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                                                </svg>
                                                            </span>
                                                        ) : null}
                                                    </>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </>
                )}
            </Listbox>
        )
    )
}