"use client";

import { CarProps } from '@/types';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getCarImage } from '@/utils/apiUtils';
import Link from 'next/link';


interface CarInfoProps {
  isOpen: boolean;
  closeModal: () => void;
  car: CarProps
}


export const CarInfo = ({ isOpen, closeModal, car }: CarInfoProps) => {

  const [shouldRender, setShouldRender] = useState(false);
  const [showAnimation, setshowAnimation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        setshowAnimation(true);
      }, 300); // Delay match the duration of transition
      return () => clearTimeout(timer);
    } else {
      setshowAnimation(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Delay match the duration of transition
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <>
      {shouldRender && (
        <div className="fixed inset-0 z-10 overflow-y-auto" role="dialog" aria-modal="true">
          <div className={`fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-in-out ${showAnimation ? 'opacity-100' : 'opacity-0'}`} onClick={closeModal}></div>
          <div className={`flex min-h-full items-center justify-center p-4 transition-opacity duration-300 ease-in-out ${showAnimation ? 'opacity-100' : 'opacity-0'}`}>


            <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg w-full">
              <div className="p-4">


                <div className='flex flex-row justify-between'>
                  <div className='relative flex-1 rounded-lg h-40 bg-cover bg-center bg-no-repeat'  style={{ backgroundImage: "url('/patter-background.jpg')"}}>
                    <Image src={getCarImage(car)} alt='car model' fill priority className='object-contain' />
                  </div>
                </div>
                  <h3 className="text-lg leading-6 font-bold text-gray-900 py-5" id="modal-title"> {car.make} {car.model}</h3>
                  

                <>
                  {Object.entries(car).map(([key, value]) => (
                    <div className='flex justify-between gap-5 w-full sm:text-sm' key={key} >
                      <h4 className='text-grey capitalize'>
                        {key.split("_").join(" ")}
                      </h4>
                      <p className='text-black-100 font-semibold text-sm sm:text-lg '>
                        {value}
                      </p>
                    </div>
                  ))}
                </>


              </div>

              <div className="bg-gray-50 px-4 py-3 flex justify-end">
                <Link href='/'
                className="mt-3 px-4 py-2 square-button" onClick={closeModal}>
                  Book
                </Link>
                <button type="button" 
                className="mt-3 px-4 py-2 square-button" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </>
  )
}
