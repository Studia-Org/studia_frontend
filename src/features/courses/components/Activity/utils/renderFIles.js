export default function renderFiles(file) {
    return (
        <button key={file.id} onClick={() => downloadFile(file)} className='flex w-full p-3 text-white bg-green-700 rounded-md shadow-md'>
            <p className='max-w-[calc(100%-4rem)] overflow-hidden text-ellipsis'>{file.attributes.name}</p>
            <div className='ml-auto mr-2'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
            </div>
        </button>
    )
}
export const downloadFile = async (file) => {
    try {
        const response = await fetch(file.attributes.url);
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.attributes.name;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } else {
            console.error('Error al descargar el archivo');
        }
    } catch (error) {
        console.error('Error en la descarga: ', error);
    }
};