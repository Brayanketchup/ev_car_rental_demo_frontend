"use client";

import React from 'react';
import Image from 'next/image';
import { useEffect } from 'react';
import { useState } from 'react';

export const Hero = () => {

    const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);


    return (
        <div className='hero min-h-[100vh]'>

            <div className='flex-1 pt-24 px-6'>
                <h1 className='2xl:text-[72px] sm:text-[64px] text-[50px] font-extrabold'>
                    <span className="text-primary-color">Looking</span> to rent a car to rent a car
                </h1>
                <p className='text-[27px] text-black-100 font-light mt-5'>
                Find the perfect electric vehicle for your needs. From luxury EVs to economy options, with unbeatable prices, extended range, and eco-friendly features.
                </p>

                <a
                    href='#Cars'
                    className='p-2 mt-10 round-button bg-primary-color text-white button-shodow'>
                    <span className='flex flex-row text-center items-center'>
                        Explore cars
                    </span>
                </a>

            </div>
            <div className='xl:flex-[1.5] flex justify-end items-end w-full xl:h-screen'>
                <div className='hero-img'>
                    <Image src="/hero.png" alt="hero"
                        fill className='object-contain' />
                </div>
            </div>
        </div>
    )
}
