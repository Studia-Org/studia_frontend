import { Button } from 'rsuite';
import './Rubrica.css';
import html2canvas from 'html2canvas';

function Rubrica({ petite, title, data, index }) {


    const tableClass = petite ? 'petite' : '';
    function download() {
        html2canvas(document.querySelector("#rubrica")).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imgData;
            link.download = 'rubrica.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
    return (
        <table id={'rubrica' + index} className={'max-w-full w-full min-h-[400px] border-collapse border-2 bg-white border-gray-300 rubrica ' + tableClass}>
            <caption className={` text-xl mb-3 ${title === false ? 'hidden' : ''} ` + tableClass}>Task Evaluation Criteria
                <Button className='ml-2 !border-solid !border-gray-400 !border-[1px]' onClick={download}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                </Button>
            </caption>
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
        </table >
    );

};

export default Rubrica;
