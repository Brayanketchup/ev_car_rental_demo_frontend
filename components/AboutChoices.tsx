import Link from 'next/link';
import React from 'react';

export const AboutChoices = () => {
  return (
    <div className='w-full text-center max-w-[700px] '>
            <h1 className='tittle-style'>Unlimited Choices</h1>
            <h3 className='subtitle-style'>Explore the most extensive car sharing platform globally</h3>
            <p className='pb-5'>From a spacious SUV perfect for family vacations, 
              a rugged pickup built for tough tasks, to a sleek luxury sports car designed 
              for exclusive evenings, explore the perfect electric vehicle for every occasion 
              and budget with us.</p>
            <Link
              href="/"
              className='mt-3 w-fit px-4 py-2 square-button'>
              Book The Perfect Car.
            </Link>
          </div>
          
  )
}
