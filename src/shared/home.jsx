import { useEffect, React } from "react";
import bg_img from '../assets/uptitudenewlogo.png'
import { useNavigate } from "react-router-dom";
import { Divider } from 'antd';
import './styles/home.css'

const Home = () => {
    return (
        <div className='bg-[#f2f2f2] overflow-y-hidden'>
            <div class="overflow-x-hidden overflow-y-hidden antialiased h-full">
                <header class="relative z-50 w-full h-[10vh] ">
                    <div
                        class="container flex items-center justify-center h-full max-w-6xl px-8 mx-auto sm:justify-between xl:px-0">
                        <a href="/" class="relative flex flex-row items-center h-full font-black leading-none">
                            <span class="ml-3 flex flex-row text-xl text-gray-800 "> Uptitude <span class="text-pink-500">.</span> </span>
                        </a>
                        <div
                            class="absolute left-0 flex-col items-center justify-center hidden w-full pb-8 mt-48 border-b border-gray-200 md:relative md:w-auto md:bg-transparent md:border-none md:mt-0 md:flex-row md:p-0 md:items-end md:flex md:justify-between">

                            <svg class="absolute top-0 left-0 hidden w-screen max-w-3xl -mt-64 -ml-12 lg:block"
                                viewBox="0 0 818 815" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <defs>

                                    <linearGradient x1="0%" y1="0%" x2="100%" y2="100%" id="f">
                                        <stop stop-color="#657DE9" offset="0%" />
                                        <stop stop-color="#1C0FD7" offset="100%" />
                                    </linearGradient>

                                    <path
                                        d="M159.107 107.829H656.55c17.83 0 24.296 1.856 30.815 5.342 6.518 3.487 11.634 8.602 15.12 15.12 3.486 6.52 5.343 12.985 5.343 30.816V656.55c0 17.83-1.857 24.296-5.343 30.815-3.486 6.518-8.602 11.634-15.12 15.12-6.519 3.486-12.985 5.343-30.815 5.343H159.107c-17.83 0-24.297-1.857-30.815-5.343-6.519-3.486-11.634-8.602-15.12-15.12-3.487-6.519-5.343-12.985-5.343-30.815V159.107c0-17.83 1.856-24.297 5.342-30.815 3.487-6.519 8.602-11.634 15.12-15.12 6.52-3.487 12.985-5.343 30.816-5.343z"
                                        id="e" />
                                </defs>
                                <g fill="none" fill-rule="evenodd" opacity=".9">
                                    <g transform="rotate(65 416.452 409.167)">
                                        <use fill="#000" filter="url(#a)" xlinkHref="#b" />
                                        <use fill="url(#c)" xlinkHref="#b" />
                                    </g>
                                    <g transform="rotate(29 421.929 414.496)">
                                        <use fill="#000" filter="url(#d)" xlinkHref="#e" />
                                        <use fill="url(#f)" xlinkHref="#e" />
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>
                </header>
                <div class="relative items-center justify-center w-full overflow-x-hidden lg:pt-40 lg:pb-40 xl:pt-40 xl:pb-64 h-[90vh]  ">
                    <div
                        class="container flex flex-col items-center justify-between h-full max-w-6xl px-8 mx-auto -mt-32 lg:flex-row xl:px-0">
                        <div
                            class="z-30 flex flex-col items-center w-full max-w-xl pt-48 text-center lg:items-start lg:w-1/2 lg:pt-20 xl:pt-40 lg:text-left justify-center">
                            <h1
                                class="relative mb-4 text-3xl font-black leading-tight text-gray-900 sm:text-6xl xl:mb-8 tracking-tighter mt-24">
                                Welcome to the new era of Learning </h1>
                            <p class="pr-0 mt-7 text-base text-gray-900 sm:text-lg xl:text-xl lg:pr-20 z-20 ">Join the future of
                                education with our user-friendly e-learning platform designed for the University of Barcelona.</p>
                            <div className='relative z-20 py-6 lg:left-48 top-5'>
                                <a href="/auth/login
                                ">
                                    <button class="inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900  rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white  focus:ring-4 focus:outline-none focus:ring-blue-300 ">
                                        <span class=" px-8 py-3.5 transition-all ease-in duration-75 bg-white  rounded-md group-hover:bg-opacity-0 font-medium">
                                            Enter the classroom
                                        </span>
                                    </button>
                                </a>
                            </div>
                            <p className="mt-24 mb-5 text-gray-500 -translate-x-32 lg:mb-0">Funded by:</p>
                            <div className="flex flex-wrap mb-5 space-y-4 lg:flex-nowrap lg:items-center lg:space-x-4 lg:-translate-x-32">
                                <img className="w-60 h-14 " src="https://res.cloudinary.com/dnmlszkih/image/upload/v1706026314/iqehusa8b2l5xdyjubgf.png" alt="" />
                                <Divider type="vertical" />
                                <img className="w-52 h-14" src="https://res.cloudinary.com/dnmlszkih/image/upload/v1706026555/yifow75yq6pzoskyojgj.jpg" alt="" />
                                <img className="w-48 h-30" src="https://res.cloudinary.com/dnmlszkih/image/upload/v1706025981/pstxitj0uzzqjsq1cznv.png" alt="" />
                                <Divider type="vertical" />
                                <img className="w-48 h-12 " src="https://res.cloudinary.com/dnmlszkih/image/upload/v1706027481/nzkikoai1bmnht3ihrot.png" alt="" />
                            </div>

                            <svg class="absolute left-0 max-w-md mt-24 -ml-64 left-svg hidden lg:flex" viewBox="0 0 423 423"
                                xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <defs>
                                    <linearGradient x1="100%" y1="0%" x2="4.48%" y2="0%" id="linearGradient-1">
                                        <stop stop-color="#5C54DB" offset="0%" />
                                        <stop stop-color="#6A82E7" offset="100%" />
                                    </linearGradient>
                                    <filter x="-9.3%" y="-6.7%" width="118.7%" height="118.7%" filterUnits="objectBoundingBox"
                                        id="filter-3">
                                        <feOffset dy="8" in="SourceAlpha" result="shadowOffsetOuter1" />
                                        <feGaussianBlur stdDeviation="8" in="shadowOffsetOuter1" result="shadowBlurOuter1" />
                                        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" in="shadowBlurOuter1" />
                                    </filter>
                                    <rect id="path-2" x="63" y="504" width="300" height="300" rx="40" />
                                </defs>
                                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" opacity=".9">
                                    <g id="Desktop-HD" transform="translate(-39 -531)">
                                        <g id="Hero" transform="translate(43 83)">
                                            <g id="Rectangle-6" transform="rotate(45 213 654)">
                                                <use fill="#000" filter="url(#filter-3)" xlinkHref="#path-2" />
                                                <use fill="url(#linearGradient-1)" xlinkHref="#path-2" />
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </div>
                        <div class="relative z-50 hidden flex-col items-end justify-center w-full h-full lg:w-1/2 ms:pl-10  lg:flex">
                            <div class="container  left-0 w-full max-w-4xl lg:absolute xl:max-w-6xl lg:w-screen">
                                <img src={bg_img} alt="Uptitude - E-learning platform"
                                    class="w-full h-auto  mb-20 ml-0 lg:mt-24 xl:mt-40 lg:-mb-16 lg:h-full lg:ml-20" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div >
    )
}

export default Home