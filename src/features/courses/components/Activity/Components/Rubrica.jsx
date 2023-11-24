import React, { useState } from 'react';
import './Rubrica.css';

const Rubrica = () => {
    const [rubricaNombre, setRubricaNombre] = useState('');
    const [criterios, setCriterios] = useState([
        { nombre: 'Creatividad', puntuacion: 8 },
        { nombre: 'Presentación', puntuacion: 6 },
        { nombre: 'Contenido', puntuacion: 9 },
    ],);

    const handleNombreChange = (event) => {
        setRubricaNombre(event.target.value);
    };

    const handleCriterioChange = (index, key, value) => {
        const newCriterios = [...criterios];
        newCriterios[index][key] = value;
        setCriterios(newCriterios);
    };

    const handlePuntuacionChange = (index, value) => {
        handleCriterioChange(index, 'puntuacion', value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Aquí puedes enviar la información de la rubrica al servidor o hacer lo que necesites
        console.log({ rubricaNombre, criterios });
    };

    return (
        <table className='w-full min-h-[400px] border-collapse border-2 bg-white border-gray-300 '>
            <caption className='text-xl mb-3'>Task Evaluation Criteria</caption>
            <thead>
                <tr className='bg-color-[#f8f8f8]'>
                    <th className='py-2 px-4 '>Criteria</th>
                    <th className='py-2 px-4'>0-3</th>
                    <th className='py-2 px-4'>3-5</th>
                    <th className='py-2 px-4'>6-8</th>
                    <th className='py-2 px-4'>8-10</th>
                </tr>
            </thead>
            <tbody>
                <tr className='bg-color-[#f8f8f8]'>
                    <td className='py-2 px-4 bg-gray-200 border border-gray-300 ' data-label="Completeness">Completeness</td>
                    <td className='py-2 px-4 border border-gray-300 ' data-label="0-3">The task lacks necessary components or is significantly unfinished.</td>
                    <td className='py-2 px-4 border border-gray-300 ' data-label="3-5">Some elements are complete, but important parts are missing or incomplete.</td>
                    <td className='py-2 px-4 border border-gray-300 ' data-label="6-8">The task is almost finished, with a few minor elements remaining.</td>
                    <td className='py-2 px-4 border border-gray-300 ' data-label="8-10">Every aspect of the task is thoroughly and completely finished.</td>
                </tr>
                <tr className='bg-color-[#f8f8f8]'>
                    <td className='py-2 px-4 bg-gray-200 border border-gray-300 ' data-label="Accuracy">Accuracy</td>
                    <td className='py-2 px-4 border border-gray-300 ' data-label="0-3">The task contains significant errors, making it unreliable or incorrect.</td>
                    <td className='py-2 px-4 border border-gray-300 ' data-label="3-5">Some aspects are correct, but there are notable inaccuracies.</td>
                    <td className='py-2 px-4 border border-gray-300 ' data-label="6-8">The majority of the task is accurate, with minor errors.</td>
                    <td className='py-2 px-4 border border-gray-300 ' data-label="8-10">Every detail is precise and error-free.</td>
                </tr>
                <tr className='bg-color-[#f8f8f8]'>
                    <td className='py-2 px-4 bg-gray-200 border border-gray-300 ' data-label="Efficiency">Efficiency</td>
                    <td className='py-2 px-4 border border-gray-300 ' data-label="0-3">The task is time-consuming and resource-intensive.</td>
                    <td className='py-2 px-4 border border-gray-300 ' data-label="3-5">The task uses resources reasonably, but there's room for improvement.</td>
                    <td className='py-2 px-4 border border-gray-300 ' data-label="6-8">The task is completed in a timely and resource-effective manner.</td>
                    <td className='py-2 px-4 border border-gray-300 ' data-label="8-10">The task is accomplished with maximum efficiency and minimal resource usage.</td>
                </tr>
                <tr className='bg-color-[#f8f8f8]'>
                    <td className='py-2 px-4 bg-gray-200 border border-gray-300 ' data-label="Clarity">Clarity</td>
                    <td className='py-2 px-4 border border-gray-300 ' data-label="0-3">The task is confusing and hard to understand.</td>
                    <td className='py-2 px-4 border border-gray-300 ' data-label="3-5">Some parts are clear, but overall understanding is hindered.</td>
                    <td className='py-2 px-4 border border-gray-300 ' data-label="6-8">The task is generally clear, with a few unclear elements.</td>
                    <td className='py-2 px-4 border border-gray-300 ' data-label="8-10">Every aspect of the task is presented in a clear and easily understandable manner.</td>
                </tr>
            </tbody>
        </table>
    );

};

export default Rubrica;
