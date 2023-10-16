import { Route, Routes } from 'react-router-dom';
import Timeline from './Timeline';

export const TimelineRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Timeline />} />
        </Routes>
    )
}
