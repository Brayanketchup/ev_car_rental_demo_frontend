"use client";

import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { LogoutButton } from '@/components'
import { handleLogout } from '../utils/logUtils'
import { useRouter } from 'next/navigation';

// router.push('/')


export const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const pathname = usePathname();
  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleUserInfo = () => setIsOpen2(!isOpen2);
  const [userlog, setuserlog] = useState<string | null>(null);
  // const [username, setUsername] = useState<string | null>(null);


  const onLogOut = () => {
    handleLogout();
    // setUsername(null); // Clear the username state immediately

  }

  useEffect(() => {
    let user = localStorage.getItem('username');
    return () => {
      if (user) {
        setuserlog(user)
      }
      else {
        setuserlog(null)
      }
    }
  }, [])


  //function to close the menu in case of screen size change
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth > 1024) {
        setIsOpen(false); // Set isOpen to false if desktop
        window.removeEventListener('resize', checkScreenSize); // Remove event listener
      }
    };
    // if isOpen add the event listener
    if (isOpen) {
      window.addEventListener('resize', checkScreenSize);
    }

    // Initially check if desktop
    checkScreenSize();

    // remove the event listener when isOpen is false
    return () => {
      if (isOpen) {
        window.removeEventListener('resize', checkScreenSize);
      }
    };
  }, [isOpen]); // use effect will run when isOpen change



  return (
    <header className='w-full absolute z-10'>
      {/* desktop */}

      <nav className='lg:flex hidden max-w-[1440px] md:mx-auto justify-between items-center sm:px-16 px-6 py-4'>
        <Link rel="" href="/">
          <Image src='/logo.png' alt='Car logo' width={50} height={50} className='object-contain' />
        </Link>

        <ul className='flex flex-row justify-center '>
          <li><Link
            href='/'
            className={`${(pathname === '/') ? 'text-primary-color' : ' text-black'} 
          font-extrabold p-2 button-color-transition`}
          >Home</Link></li>

          <li><Link
            href='/about'
            className={`${(pathname === '/about') ? 'text-primary-color' : ' text-black'} 
          font-extrabold p-2 button-color-transition`}
          >About</Link></li>

          <li><Link
            href='/contact'
            className={`${(pathname === '/contact') ? 'text-primary-color' : ' text-black'} 
          font-extrabold p-2 button-color-transition`}
          >Contact</Link></li>
          <li><Link
            href='/charginpoints'
            className={`${(pathname === '/charginpoints') ? 'text-primary-color' : ' text-black'} 
          font-extrabold p-2 button-color-transition`}
          >Charging Loc</Link></li>

          


        </ul>

        {!userlog ? (
          <ul className='flex flex-row justify-end'>
            <li><Link
              type='button'
              href="/register"
              className='min-w-[130px] font-extrabold button-color-transition round-button '>
              Register
            </Link></li>

            <li><Link
              type='button'
              href="/login"
              className='min-w-[130px] round-button bg-primary-color text-white button-shodow'>
              Login
            </Link></li>

          </ul>
        ) : (

          <div className='user_menu  flex flex-row space-x-3 items-center'>

            <Link
              type='button'
              href="/bookings"
              className='text-black font-extrabold p-2 button-color-transition'
            >
              My Bookings
            </Link>
            <Link
              type='button'
              href="/profile"
              className='text-black font-extrabold p-2 button-color-transition'
            >
              My Profile
            </Link>
            
            


            <a
              onClick={onLogOut}
              type='button'
              href="/"
              className='min-w-[130px] round-button bg-primary-color text-white button-shodow'
            >
              log out
            </a>


            {/* <button rel="" onClick={toggleUserInfo} className="z-50">
              <Image src='/profile_Icon.Jpg' alt='person logo' width={50} height={50} className='object-contain' />
            </button> */}
            
          </div>

        )
        }
      </nav>


      {/* mobile */}
      <nav className=' lg:hidden justify-between'>
        <Link rel="" href="/">
          <Image src='/logo.png' alt='Car logo' width={50} height={50} className='object-contain m-2' />
        </Link>

        <button onClick={toggleMenu} className="flex flex-col gap-1 fixed top-5 right-5 z-50">
          <div className="rounded-full h-[3px] w-[20px] bg-black" />
          <div className="rounded-full h-[3px] w-[15px] bg-black" />
          <div className="rounded-full h-[3px] w-[25px] bg-black" />
        </button>

        <div className={`fixed flex items-center justify-center top-0 h-[100vh] w-[100vw] text-center bg-white transition-transform duration-500 ease-in-out transform ${isOpen ? 'translate-x-0 ' : 'translate-x-full'
          }`}>

          <ul className="flex flex-col-reverse gap-4 p-4">
            <li><Link href="/" className="flex justify-center items-center">
              <Image src="/logo.png" alt="Car logo" width={50} height={50} className="object-contain" />
            </Link></li>

            <div className='border-t border-gray-200'></div>

            <li><Link href="/" onClick={toggleMenu} className="min-w-[130px] font-extrabold button-color-transition">Home</Link></li>
            <li><Link href="/about" onClick={toggleMenu} className="min-w-[130px] font-extrabold button-color-transition">About</Link></li>
            <li><Link href="/contact" onClick={toggleMenu} className="min-w-[130px] font-extrabold button-color-transition">Contact</Link></li>
            {userlog? <li><Link href="/bookings" onClick={toggleMenu} className="min-w-[130px] font-extrabold button-color-transition">My Bookings</Link></li> : '' }
            

            <div className='border-t border-gray-200'></div>



            {!userlog ? (

              <ul className='flex flex-col-reverse gap-4 p-4'>
                <li><Link href="/register" onClick={toggleMenu} className="min-w-[130px] font-extrabold button-color-transition">Register</Link></li>
                <li> <Link href="/login" onClick={toggleMenu} className="min-w-[130px] font-extrabold button-color-transition">Login</Link></li>

              </ul>

            ) : (
              <a
                onClick={onLogOut}
                type='button'
                href="/"
                className="min-w-[130px] font-extrabold button-color-transition"
              >
                log out
              </a>


            )
            }

          </ul>
        </div>
      </nav>

    </header>
  )
}
