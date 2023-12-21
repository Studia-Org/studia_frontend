import './Rubrica.css';

function Rubrica({ petite, title, data, index }) {


    const tableClass = petite ? 'petite' : '';

    return (
        <table id={'rubrica' + index} className={'max-w-full w-full min-h-[400px] border-collapse border-2 bg-white border-gray-300 rubrica ' + tableClass}>
            <caption className={` text-xl mb-3 ${title === false ? 'hidden' : ''} ` + tableClass}>Task Evaluation Criteria</caption>
            <thead>
                <tr className={'bg-color-[#f8f8f8]' + tableClass}>
                    <th className={'py-2 px-4 border border-gray-300 ' + tableClass} data-label="Criteria">Criteria</th>
                    {data['Criteria'].map((item, index) => {
                        return (
                            <th className={'py-2 px-4 border border-gray-300 ' + tableClass} data-label={item} key={item}>{item}</th>
                        )
                    })}
                </tr>
            </thead>
            <tbody>
                {Object.keys(data).map((key, index) => {
                    if (key === 'Criteria') return
                    return (
                        <tr className={'bg-color-[#f8f8f8]' + tableClass} key={key}>
                            <td className={'py-2 px-4 border  ' + tableClass} data-label={key}>{key}</td>
                            {data[key].map((item, index) => {
                                return (
                                    <td className={'py-2 px-4 border bg-white ' + tableClass}
                                        data-label={data["Criteria"][index]} key={item}>{item}</td>
                                )
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    );

};

export default Rubrica;
