import { useRoutes } from 'react-router-dom'
import { protectedRoutes } from './protected';
import { publicRoutes } from './public';
import { checkAuthenticated } from '../helpers';
import Home from '../shared/home';
import Page404Screen from '../features/404/screens/Page404Screen';
import { Navbar } from '../shared/elements/Navbar';
import { Sidebar } from '../shared/elements/Sidebar';

export const AppRoutes = () => {

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
    const authenticated = checkAuthenticated();
    const routes = authenticated ? protectedRoutes : publicRoutes;
    const element = useRoutes([...routes, ...commonRoutes]);
    const pathSegments = new URL(window.location.href).pathname.split('/');
    const path = pathSegments[pathSegments.length - 1];
    if (element.props.match.route.path === '*') return <div className='font-Poppins'>{element}</div>;

    else if (authenticated)
        return (
            <div className='max-h-full font-Poppins  bg-white '>
                <Navbar />
                <Sidebar section={path} />
                <div className='flex min-h-[calc(100vh-8rem)] md:ml-80 md:min-w-[calc(100vw-20rem)] md:flex-nowrap bg-white'>
                    {element}
                </div>
            </div>
        )

    return <div className='font-Poppins'>{element}</div>;


}