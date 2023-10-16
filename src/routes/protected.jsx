import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Spinner } from '../shared/elements/Spinner';
import { CoursesRoutes } from '../features/courses/screens'; 
import { QualificationsRoutes } from '../features/qualifications/screens';
import { UserProfileRoutes } from '../features/userProfile/screens';
import { CalendarRoutes } from '../features/calendar/screens';
import { SettingsRoutes } from '../features/settings/screens';
import { TimelineRoutes } from '../features/timeline/screens';

const App = () => {
    return (
        <Suspense
          fallback={
            <div className="h-screen w-screen flex items-center justify-center">
              <Spinner size="xl" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
    );
  };


  export const protectedRoutes = [
    {
      path: '/app',
      element: <App />,
      children: [
        { path: 'courses/*', element: <CoursesRoutes /> },
        { path: 'qualifications/*', element: <QualificationsRoutes /> },
        { path: 'profile/*', element: <UserProfileRoutes /> },
        { path: 'settings/*', element: <SettingsRoutes /> },
        { path: 'calendar/*', element: <CalendarRoutes /> },
        { path: 'timeline/*', element: <TimelineRoutes /> },
      ],
    },
  ];