import { message } from 'antd'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API } from '../../../constant'

export const ForgotPassword = ({ setForgotPasswordFlag }) => {
    const [email, setEmail] = useState('')
    const navigate = useNavigate()

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    async function sendEmail(event) {
        event.preventDefault()
        if (!validateEmail(email)) {
            message.error('Invalid email address')
            return;
        }
        //check if email exists
        const result = await fetch(`${API}/users?filters[email][$eq]=${email}`)
            .then(res => res.json())
            .then(data => data)

        if (result.length === 0) {
            message.error('This email is not registered')
            return;
        }

        await fetch(`${API}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.error) {
                    message.error('Something went wrong')
                } else {
                    message.success(`We've sent you an email to ${email} with a link to reset your password.`)
                    setForgotPasswordFlag(false)
                }
            })
    }

    return (

        <div className="min-w-screen min-h-screen  flex items-center justify-center px-5 py-5 bg-gradient-to-r from-indigo-400  to-[#6e66d6]">
            <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.js" defer></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/zxcvbn/4.4.2/zxcvbn.js"></script>
            <style>@import url('https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/5.3.45/css/materialdesignicons.min.css')</style>
            <div className="w-full p-5 overflow-hidden text-gray-500 bg-gray-100 shadow-xl rounded-3xl " style={{ maxWidth: '1000px' }} >
                <button className='flex items-center text-sm duration-150 w-fit hover:-translate-x-2 ' onClick={() => setForgotPasswordFlag(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                    </svg>
                    <p className='ml-1'>Back to login</p>
                </button>
                <form className='p-5' onSubmit={sendEmail}>
                    <h2 className='text-2xl font-bold text-gray-900'>Password Recovery</h2>
                    <p className='text-sm'>Recover the password for your associated account.</p>
                    <div className='flex flex-col items-center'>
                        <div className='w-1/2 mt-10'>
                            <p className='my-5'>Enter the email address associated with your account and we'll send you a link to reset your password.</p>
                            <div className="z-50 w-full mb-5">
                                <label htmlFor="" className="mb-1 text-xs font-semibold">Email</label>
                                <div className="flex">
                                    <div className="z-10 flex items-center justify-center w-10 text-center pointer-events-none"><i className="text-lg text-gray-400 mdi mdi-email-outline"></i></div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full py-2 pl-10 pr-3 -ml-10 border-2 border-gray-200 rounded-lg outline-none focus:border-indigo-500"
                                        name='email'
                                        required />
                                </div>
                            </div>
                            <div className="flex justify-center mb-5 ">
                                <div className="w-full mb-5 text-center ">
                                    <button type='submit' className="w-full inline-flex items-center justify-center p-0.5 mb-2  overflow-hidden text-sm 
                                    font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 
                                    group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                                        <span className="w-full py-3.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                            Continue
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <p className='mt-20 text-center'>Don't have an account?
                                <button onClick={() => navigate('/auth/register')} className='ml-1 font-medium text-indigo-600 cursor-pointer'>
                                    Sign up
                                </button>
                            </p>
                        </div>

                    </div>

                </form>

            </div>
        </div>
    )
}
