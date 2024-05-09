import React, { useState } from 'react'
import '../styles/login.css'
import { BsFillArrowLeftSquareFill } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from "../../../context/AuthContext";
import { Button, Spin } from "antd";
import { API } from "../../../constant";
import { Toast } from "../../../shared/elements/Toasts";
import { setToken } from "../../../helpers";
import { ForgotPassword } from '../components/ForgotPassword';

const Login = () => {
    const navigate = useNavigate();
    const [forgotPasswordFlag, setForgotPasswordFlag] = useState(false);
    const { setAuthenticated } = useAuthContext();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { email, password } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const { setUser } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);

    const loginAccount = async () => {
        setIsLoading(true);
        try {
            const value = {
                identifier: email,
                password: password,
            };
            const response = await fetch(`${API}/auth/local`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(value),
            });

            const data = await response.json();
            if (data?.error) {
                throw data?.error;
            } else {
                setToken(data.jwt);
                setAuthenticated(true);
                setUser(data.user);
                Toast.fire({
                    icon: 'success',
                    title: 'Signed in successfully'
                })
                navigate("/app/courses");
            }
        } catch (error) {
            console.error(error);
            Toast.fire({
                icon: 'error',
                text: error?.message,
                title: 'Something went wrong'
            })
        } finally {
            setIsLoading(false);
        }
    };
    console.log(forgotPasswordFlag)

    if (forgotPasswordFlag) {
        return <ForgotPassword setForgotPasswordFlag={setForgotPasswordFlag} />
    } else {
        return (
            <div className="">
                <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.js" defer></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/zxcvbn/4.4.2/zxcvbn.js"></script>
                <style>@import url('https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/5.3.45/css/materialdesignicons.min.css')</style>
                <div className="min-w-screen min-h-screen  flex items-center justify-center px-5 py-5 bg-gradient-to-r from-indigo-400  to-[#6e66d6]">
                    <div className="w-full overflow-hidden text-gray-500 bg-gray-100 shadow-xl rounded-3xl " style={{ maxWidth: '1000px' }} >
                        <div className='absolute li bg-gray-100 shadow-lg transform sm:skew-y-0 sm:rounded-3xl -z-0 -translate-x-[9%]  translate-y-[14%] sm:w-[26rem] sm:h-[30rem] '>
                        </div>
                        <div className="z-50 w-full md:flex">
                            <div className="relative z-50 hidden w-1/2 px-10 py-10 md:block bg-image">
                                <div className='w-[2rem]'>
                                    <a href="/">
                                        <BsFillArrowLeftSquareFill size={30} style={{ cursor: "pointer", color: "rgba(255, 255, 255, 1)" }} />
                                    </a>
                                </div>
                                <div className='flex justify-center'>
                                    <div className='absolute w-2/4 top-48 '>
                                        <h1 className='text-4xl font-medium text-white '>Welcome back!</h1>
                                        <p className='py-3 text-white '>You can sign in     o access with your existing account.</p>
                                    </div>
                                </div>
                                <div className='absolute inset-x-0 flex flex-col items-center bottom-7'>
                                    <p className='text-xs text-sm text-center text-white' >In case you do not have an account already</p>
                                    <Link to="/auth/register" className="inline-flex items-center px-6 py-2 my-3 font-bold text-gray-800 transition-all bg-white border-b-2 border-indigo-400 rounded shadow-md hover:border-indigo-400 hover:bg-indigo-400 hover:text-white">
                                        <span className="">Register</span>
                                    </Link>
                                </div>
                            </div>
                            <div className="z-50 w-full px-5 py-10 md:w-1/2 md:px-10">
                                <div className="mb-10 text-center">
                                    <h1 className="text-3xl font-bold text-gray-900">Login</h1>
                                    <p>Enter your information</p>
                                </div>
                                <div>
                                    <div className="z-50 flex -mx-3">
                                        <div className="z-50 w-full px-3 mb-5">
                                            <label htmlFor="" className="px-1 text-xs font-semibold">Email</label>
                                            <div className="flex">
                                                <div className="z-10 flex items-center justify-center w-10 pl-1 text-center pointer-events-none"><i className="text-lg text-gray-400 mdi mdi-email-outline"></i></div>
                                                <input
                                                    type="email"
                                                    className="w-full py-2 pl-10 pr-3 -ml-10 border-2 border-gray-200 rounded-lg outline-none focus:border-indigo-500"
                                                    name='email'
                                                    value={email}
                                                    onChange={e => onChange(e)}
                                                    required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex -mx-3">
                                        <div className="relative w-full px-3 mb-2">
                                            <label htmlFor="" className="px-1 text-xs font-semibold">Password</label>
                                            <div className="flex">
                                                <div className="z-10 flex items-center justify-center w-10 pl-1 text-center pointer-events-none"><i className="text-lg text-gray-400 mdi mdi-lock-outline"></i></div>
                                                <input
                                                    type="password"
                                                    className="w-full py-2 pl-10 pr-3 -ml-10 border-2 border-gray-200 rounded-lg outline-none focus:border-indigo-500"
                                                    name='password'
                                                    value={password}
                                                    onChange={e => onChange(e)}
                                                    minLength='8'
                                                    required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex justify-end w-full'>
                                        <button onClick={() => setForgotPasswordFlag(true)} className='flex justify-end mb-12 text-xs'>Forgot password?</button>
                                    </div>

                                    <div className="flex justify-center mb-5 pt-7">
                                        <div className="w-full mb-5 text-center sm:ml-8 sm:pr-8">
                                            <button onClick={loginAccount} className=" inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                                                <span className=" w-[13rem] py-3.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                                    Login
                                                </span>
                                            </button>

                                        </div>
                                    </div>
                                    <div className='flex flex-col items-center text-center'>
                                        <p className='text-xs'>or connect with social media</p>
                                        <Button disabled className="my-5 text-white bg-[#4285F4]  focus:ring-4 
                                        focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center  mr-2 mb-2">
                                            <svg className="w-4 h-4 mr-2 -ml-1" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                                            Sign in with Google
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;

