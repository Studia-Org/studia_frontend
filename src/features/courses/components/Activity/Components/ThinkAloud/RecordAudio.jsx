import React, { useEffect } from "react";
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";

export const RecordAudio = ({ audioFile, setAudioFile }) => {
    const recorderControls = useVoiceVisualizer();
    const {
        // ... (Extracted controls and states, if necessary)
        recordedBlob,
        error,
        audioRef,
    } = recorderControls;

    // Get the recorded audio blob
    useEffect(() => {
        if (!recordedBlob) return;
        setAudioFile(recordedBlob);
    }, [recordedBlob, error]);

    // Get the error when it occurs
    useEffect(() => {
        if (!error) return;

        console.error(error);
    }, [error]);

    return (
        <div className="bg-white rounded-md shadow-md">
            <VoiceVisualizer ref={audioRef} controls={recorderControls} mainBarColor="black" secondaryBarColor='black' />

        </div>
    );
};
