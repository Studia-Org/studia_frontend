import React, { useState } from 'react';
import { AudioRecorder } from 'react-audio-voice-recorder';
import { Button, message } from 'antd';
import { API } from '../../../../../../constant';
import { getToken } from '../../../../../../helpers';

export const RecordAudio = ({ audioFile, setAudioFile, passedDeadline, idQualification, setUserQualification }) => {
    const [loading, setLoading] = useState(false);

    const addAudioElement = (blob) => {
        setAudioFile(blob);
    };

    const deleteAudio = async () => {
        setLoading(true);
        if (audioFile) {
            setAudioFile(null);
            setUserQualification((prev) => (
                {
                    ...prev,
                    activity: {
                        ...prev.activity,
                        delivered: false,
                        file: null
                    }
                }
            ));
            await fetch(`${API}/qualifications/${idQualification}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                }
            });
            message.success('Audio deleted successfully');
            setLoading(false);
        } else {
            message.error('No audio to delete');
            setLoading(false);
        }
    }

    return (
        <div className='mx-5 my-5 space-y-5'>

            {
                !passedDeadline && (
                    <div className='flex items-center justify-between'>
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
                            disabled={true}
                        />
                        <Button loading={loading} onClick={() => deleteAudio()} danger className='bg-[#ff4d4f] hover:bg-[#ff4d50c5] !text-white'>
                            Delete audio
                        </Button>
                    </div>


                )
            }

            {audioFile && (
                <audio controls className='w-full' src={audioFile?.url || URL.createObjectURL(audioFile)} />
            )}

        </div>
    );
};
