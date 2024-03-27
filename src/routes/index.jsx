import { useEffect, useState } from 'react';
import { useRoutes } from 'react-router-dom';
import { protectedRoutes } from './protected';
import { publicRoutes } from './public';
import { ErrorBoundary } from "react-error-boundary";
import Home from '../shared/home';
import Page404Screen from '../features/404/screens/Page404Screen';
import { Navbar } from '../shared/elements/Navbar/Navbar';
import { Sidebar } from '../shared/elements/Sidebar';
import { useAuthContext } from '../context/AuthContext';
import { MoonLoader } from 'react-spinners';
import { WebchatChatbot } from '../shared/elements/WebchatChatbot';
import { ErrorBoundaryScreen } from './ErrorBoundaryScreen';

export const AppRoutes = () => {
    const { isLoading, authenticated } = useAuthContext();

    const commonRoutes = [
        {
            path: '/',
            element: <Home />,
        },
        {
            path: '*',
            element: <Page404Screen />,
        }
    ];

    const routes = authenticated ? protectedRoutes : publicRoutes;
    const element = useRoutes([...routes, ...commonRoutes]);
    const pathSegments = new URL(window.location.href).pathname.split('/');
    const path = pathSegments[2];
    const inCourseCreate = pathSegments.join('/') === '/app/courses/create';

    if (!isLoading) {
        if (element.props.match.route.path === '*') return <div className='font-Poppins'>{element}</div>;
        else if (authenticated)
            return (
                isLoading ? <div className='flex items-center justify-center w-screen h-screen'><MoonLoader color="#363cd6" size={80} /></div> :
                    <div className='flex flex-col bg-white font-Poppins '>
                        <Navbar />
                        <div className='flex'>
                            <Sidebar section={path} />
                            <div className={`flex min-h-[calc(100vh-8rem)] overflow-x-auto ${!inCourseCreate ? " xl:ml-80 xl:min-w-[calc(100vw-22rem)" : ""} bg-white w-full max-w-[100vw]`}>
                                <ErrorBoundary fallback={<ErrorBoundaryScreen />}>
                                    {element}
                                </ErrorBoundary>
                            </div>
                            <WebchatChatbot />
                        </div>
                    </div>
            );
        else return <div className='font-Poppins'>{element}</div>;
    }
    else {
        return (
            <div className='flex items-center justify-center w-screen h-screen'><MoonLoader color="#363cd6" size={80} /></div>
        )
    }



}
