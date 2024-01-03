import { useRoutes } from 'react-router-dom'
import { protectedRoutes } from './protected';
import { publicRoutes } from './public';
import { checkAuthenticated } from '../helpers';
import Home from '../shared/home';
import Page404Screen from '../features/404/screens/Page404Screen';
import { Navbar } from '../shared/elements/Navbar/Navbar';
import { Sidebar } from '../shared/elements/Sidebar';
import { useAuthContext } from '../context/AuthContext';
import { MoonLoader } from 'react-spinners';

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
    const path = pathSegments[2];
    const { isLoading } = useAuthContext();

    if (element.props.match.route.path === '*') return <div className='font-Poppins'>{element}</div>;
    else if (authenticated)

        return (
            isLoading ? <div className='flex justify-center items-center h-screen w-screen'><MoonLoader color="#363cd6" size={80} /></div> :
                <div className='font-Poppins  bg-white flex flex-col '>
                    <Navbar />
                    <div className='flex'>
                        <Sidebar section={path} />
                        <div className='flex min-h-[calc(100vh-8rem)] overflow-x-auto xl:ml-80 xl:min-w-[calc(100vw-22rem)] bg-white w-full max-w-[100vw]'>
                            {element}
                        </div>
                    </div>
                </div>
        )

    return <div className='font-Poppins'>{element}</div>;


}