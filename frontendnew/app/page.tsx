'use client'
import { useEffect } from 'react';
import useTokenStore from '@/store/store';
import { Poppins } from 'next/font/google';
import NavbarHome from '@/components/home/navbar'
import Link from 'next/link';
import { UserReviews } from '@/components/home/UserReview';
import NumberTicker from '@/components/magicui/number-ticker';

const font = Poppins({
  subsets: ['latin'],
  weight: ['600'],
});


const Home = () => {

  useEffect(() => {
    // Initialize Zustand token state from localStorage on client-side
    const tokenFromStorage = localStorage.getItem('token');
    if (tokenFromStorage) {
      useTokenStore.getState().setToken(tokenFromStorage);
    }
    const userInfo = localStorage.getItem('userInfo');
    if(userInfo){
      useTokenStore.getState().setUserInfo(JSON.parse(userInfo));
    }
  }, []);

  return (
    <div>
     <NavbarHome />
     <div className="lg:h-[50vh] my-12  items-center flex flex-col align-middle content-center justify-center">
     <h1 className={`text-3xl text-center lg:text-5xl text-wrap ${font.className}`}> Your Files, Share Easily, Always Accessible</h1>
     <h1 className={`text-3xl text-red-500 my-5 text-center lg:text-5xl text-wrap ${font.className}`}> With Unlimited Storage</h1>
     
     <div className="flex flex-row">
     <Link href={'/auth/register'} prefetch={false}>
     <div className="bg-black text-white mx-2 px-4 py-2 rounded-full">Get Started</div>
     </Link>
     <Link href={'/auth/register'} prefetch={false}>
     <div className="bg-green-700 text-white mx-2 px-6 py-2 rounded-full">Login</div>
     </Link>
     </div>
    
     </div>
     <UserReviews />
     <div className="flex">
   
     </div>
     

<footer className="bg-white rounded-lg shadow m-4 dark:bg-gray-800">
    <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
      <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a href="https://flowbite.com/" className="hover:underline">Eternal Storage</a>. All Rights Reserved.
    </span>
    <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
        <li>
            <a href="#" className="hover:underline me-4 md:me-6">About</a>
        </li>
        <li>
            <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
        </li>
        <li>
            <a href="#" className="hover:underline me-4 md:me-6">SignUp</a>
        </li>
        <li>
            <a href="#" className="hover:underline">SignIn</a>
        </li>
    </ul>
    </div>
</footer>

    </div>
  );
};

export default Home