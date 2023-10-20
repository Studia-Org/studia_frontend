import { Route, Routes } from 'react-router-dom';

import CoursesHome from './CoursesHome';
import CoursesInside from './CoursesInside';
import Activity from './Activity';
import CreateCourse from './CreateCourse';
import Page404Screen from '../../../features/404/screens/Page404Screen';


export const CoursesRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<CoursesHome />} />
            <Route path=":courseId" element={<CoursesInside />} />
            <Route path=":courseId/activity/:activityId" element={<Activity />} />
            <Route path="/create" element={<CreateCourse />} />
            <Route path="*" element={<Page404Screen />} />
        </Routes>
    )
}
