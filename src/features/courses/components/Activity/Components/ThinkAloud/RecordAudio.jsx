import React, { useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';


export const RecordAudio = () => {
    const waveSurferRef = useRef(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [isRecording, setIsRecording] = useState(false);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);

            recorder.addEventListener('dataavailable', event => {
                // Aquí puedes hacer lo que quieras con los datos de audio
            });

            recorder.addEventListener('stop', () => {
                setIsRecording(false);
                waveSurferRef.current?.destroy();
            });

            recorder.start();
            setIsRecording(true);
            setMediaRecorder(recorder);
        } catch (error) {
            console.error('Error al iniciar la grabación:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
        }
    };

    // Inicializar Wavesurfer cuando el componente se monte
    React.useEffect(() => {
        waveSurferRef.current = WaveSurfer.create({
            container: '#waveform',
            waveColor: 'violet',
            progressColor: 'purple',
            cursorColor: 'navy',
            barWidth: 2,
            url: 'blob:https://wavesurfer.xyz/a921887e-d17f-4587-a563-b66342edbe8d',
            responsive: true,
        });

        return () => {
            waveSurferRef.current?.destroy();
        };
    }, []);

    return (
        <div>
            <div id="waveform" style={{ width: '100%', height: '200px' }}></div>
            {isRecording ? (
                <button onClick={stopRecording}>Detener Grabación</button>
            ) : (
                <button onClick={startRecording}>Iniciar Grabación</button>
            )}
        </div>
    );
};

