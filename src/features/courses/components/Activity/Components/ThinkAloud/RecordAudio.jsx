import React from 'react';
import { AudioRecorder } from 'react-audio-voice-recorder';

export const RecordAudio = ({ audioFile, setAudioFile, passedDeadline }) => {
    const addAudioElement = (blob) => {
        setAudioFile(blob);
    };


    return (
        <div className='mx-5 my-10 space-y-5'>
            {
                !passedDeadline && (
                    <AudioRecorder
                        onRecordingComplete={addAudioElement}
                        audioTrackConstraints={{
                            noiseSuppression: true,
                            echoCancellation: true,
                        }}
                        onNotAllowedOrFound={(err) => console.table(err)}
                        downloadOnSavePress={false}
                        downloadFileExtension="webm"
                        mediaRecorderOptions={{
                            audioBitsPerSecond: 128000,
                        }}
                        showVisualizer={true}
                        disabled={true} // Deshabilitar la grabación si hay un archivo de audio proporcionado
                    />
                )
            }

            {audioFile && (
                <audio controls className='w-full' src={audioFile?.url || URL.createObjectURL(audioFile)} />
            )}
        </div>
    );
};
