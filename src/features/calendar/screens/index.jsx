import { Route, Routes } from 'react-router-dom';

import CalendarEvents from './Calendar';
import Page404Screen from '../../../features/404/screens/Page404Screen';

export const CalendarRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<CalendarEvents />} />
            <Route path="*" element={<Page404Screen />} />
        </Routes>
    )
}
