import { useState, useEffect } from 'react';

export function useTimer({ testCompleted }) {
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [completed] = useState(testCompleted);
    console.log({ completed });
    useEffect(() => {
        if (!completed) {
            const interval = setInterval(() => {
                setSeconds((prevSeconds) => (prevSeconds === 59 ? 0 : prevSeconds + 1));
                if (seconds === 59) {
                    setSeconds(0);
                    setMinutes((prevMinutes) => prevMinutes + 1);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [completed, seconds]);

    return { seconds, minutes, }
}
