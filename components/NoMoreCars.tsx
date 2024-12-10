import React from 'react'
import Image from 'next/image';

export const NoMoreCars = () => {


  return (
    <div className='flex text-center flex-col w-full pt-14 justify-center items-center'>


      <Image src="/desert-logo.png" alt="No More Cars" width={375} height={320} className='object-contain' />

      <h2 className='text-[25px] font-extrabold'>No more cars available</h2>
      <p>Try looking for a different model</p>
    </div>
  )
}
