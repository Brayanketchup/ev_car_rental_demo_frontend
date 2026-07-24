"use client";

import React from 'react'
import Image from 'next/image';
import { CarProps } from '@/types';
import { useState } from 'react';
import { calculateCarRent, getCarImage } from '@/utils/apiUtils';
import { CarInfo } from '@/components';


interface CarCardProps {
    car: CarProps
}

export const CarCard = ({ car }: CarCardProps) => {

    const { city_mpg, year, make, model, transmission, drive } = car;
    const [isOpen, setisOpen] = useState(false)

    const carRent = calculateCarRent(city_mpg, year);

    return (
        <div className='flex flex-col min-h-[400px] w-[305px] p-6 justify-center items-start text-black bg-primary-color-100 hover:bg-white hover:shadow-md rounded-3xl group'>
            <div className='w-full flex justify-between items-start gap-2'>
                <h2 className='text-[22px] leading-[26px] font-bold capitalize'>
                    {make} {model}
                </h2>

            </div>
            <p className='flex mt-6 text-[32px] font-extrabold'>
                <span className='self-start text-[14px] font-semibold'>
                    $
                </span>
                {carRent}
                <span className='self-start text-[14px] font-semibold'>
                    /day
                </span>
            </p>
            <div className='relative w-full h-40 my-3 '>
                <Image src={getCarImage(car)} alt='car picture' fill priority className=' object-contain' />
            </div>
            <div className='relative flex w-full mt-2'>
                <div className='flex group-hover:invisible w-full justify-between text-gray'>
                    <div className='flex flex-col justify-center items-center gap-2'>
                        <Image src="/gear-shift.png" width={20} height={20} alt='gear shift icon' />
                        <p className='text-[14px]'></p>
                        {transmission === 'a' ? 'Automatic' : "Manual"}
                    </div>
                    <div className='flex flex-col justify-center items-center gap-2'>
                        <Image src="/tire-logo.png" width={20} height={17} alt='tire icon' />
                        <p className='text-[14px]'></p>
                        {drive ? drive.toUpperCase() : "N/A"}
                    </div>
                    <div className='flex flex-col justify-center items-center gap-2'>
                        <Image src="/gas-logo.png" width={20} height={21} alt='gas pump icon' />
                        <p className='text-[14px]'></p>
                        {city_mpg} MPG
                    </div>
                </div>

                <div className='hidden group-hover:flex absolute bottom-0 w-full z-10'>
                    <button
                        disabled={false}
                        type='button'
                        onClick={() => setisOpen(true)}
                        className='round-button w-full  bg-primary-color hover:bg-orange-700 transition-colors
                        '
                    >
                        <span className='flex flex-row text-center items-center text-white text-[14px] leading-[17px] font-bold'>
                            View More
                        </span>

                    </button>

                </div>
            </div>
            <CarInfo isOpen={isOpen} closeModal={() => setisOpen(false)} car={car} />
        </div>
    )
}
