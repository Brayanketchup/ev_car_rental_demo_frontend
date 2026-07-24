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


export const AdminNavbar = () => {
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




    return (
        <header className='w-full absolute z-10'>
            {/* desktop */}

            <nav className='lg:flex hidden max-w-[1440px] md:mx-auto justify-between items-center sm:px-16 px-6 py-4'>
                <Link rel="" href="/">
                    <Image src='/logo.png' alt='Car logo' width={50} height={50} className='object-contain' />
                </Link>

                <ul className='flex flex-row justify-center items-center '>

                    <li><Link
                        href="/dashboard" passHref

                        className='text-black
          font-extrabold p-2 button-color-transition'
                    >Main Dashboard</Link></li>



                    <a
                        onClick={onLogOut}
                        type='button'
                        href="/"
                        className='text-black
          font-extrabold p-2 button-color-transition'
                    >
                        Log out
                    </a>
                </ul>



            </nav>


        </header>
    )
}
