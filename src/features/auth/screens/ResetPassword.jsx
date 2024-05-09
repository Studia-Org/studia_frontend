import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { API } from '../../../constant'
import { message } from 'antd';

export const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [code, setCode] = useState('')

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        setCode(searchParams.get('code'));
    }, [location.search]);

    async function resetPassword() {
        const passwordValidation = validatePassword(password, passwordConfirmation);
        if (passwordValidation !== "Valid password.") {
            message.error(passwordValidation);
            return;
        }
        await fetch(`${API}/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code, password, passwordConfirmation })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    message.error(data.error)
                } else {
                    message.success('Password reset successfully')
                    navigate('/app/login')
                }
            })
    }

    function validatePassword(password, passwordConfirm) {
        if (password !== passwordConfirm) return "Passwords do not match.";
        if (password.length < 8 || password.length > 20) return "Password must be between 8 and 20 characters.";
        if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
        if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
        if (!/[0-9]/.test(password)) return "Password must contain at least one digit.";
        if (!/[$&+,:;=?@#|'<>.^*()%!-]/.test(password)) return "Password must contain at least one special character.";
        return "Valid password.";
    }

    return (
        <div className="min-w-screen min-h-screen  flex items-center justify-center px-5 py-5 bg-gradient-to-r from-indigo-400  to-[#6e66d6]">
            <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.js" defer></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/zxcvbn/4.4.2/zxcvbn.js"></script>
            <style>@import url('https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/5.3.45/css/materialdesignicons.min.css')</style>
            <div className="w-full p-5 overflow-hidden text-gray-500 bg-gray-100 shadow-xl rounded-3xl " style={{ maxWidth: '1000px' }} >
                <div className='p-5'>
                    <h2 className='text-2xl font-bold text-gray-900'>Password Recovery</h2>
                    <p className='text-sm'>Recover the password for your associated account.</p>
                    <div className='flex flex-col items-center'>
                        <div className='w-1/2 mt-10'>
                            <p className='my-5'>Enter a new password for your account.</p>
                            <div className="z-50 w-full mb-5">
                                <label htmlFor="" className="mb-1 text-xs font-semibold">New Password</label>
                                <div className="flex">
                                    <div className="z-10 flex items-center justify-center w-10 pl-1 text-center pointer-events-none"><i className="text-lg text-gray-400 mdi mdi-lock-outline"></i></div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full py-2 pl-10 pr-3 -ml-10 border-2 border-gray-200 rounded-lg outline-none focus:border-indigo-500"
                                        name='password'
                                        required />
                                </div>
                            </div>

                            <div className="z-50 w-full mb-5">
                                <label htmlFor="" className="mb-1 text-xs font-semibold">Confirm Password</label>
                                <div className="flex">
                                    <div className="z-10 flex items-center justify-center w-10 pl-1 text-center pointer-events-none"><i className="text-lg text-gray-400 mdi mdi-lock-outline"></i></div>
                                    <input
                                        type="password"
                                        value={passwordConfirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                        className="w-full py-2 pl-10 pr-3 -ml-10 border-2 border-gray-200 rounded-lg outline-none focus:border-indigo-500"
                                        name='passwordConfirm'
                                        required />
                                </div>
                            </div>
                            <div className="flex justify-center mt-16 mb-5 ">
                                <div className="w-full mb-5 text-center ">
                                    <button onClick={() => resetPassword()} className="w-full inline-flex items-center justify-center p-0.5 mb-2  overflow-hidden text-sm 
                                    font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 
                                    group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                                        <span className="w-full py-3.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                            Continue
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
