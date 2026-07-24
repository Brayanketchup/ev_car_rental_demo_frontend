import React from 'react'
import Image from 'next/image'

export const ContactInfo = () => {
    return (
        <div className='w-full flex flex-col gap-4 '>
            <h1 className='tittle-style'>Need additional information?</h1>
            <p>A versatile expert proficient in various research and development
                fields and a specialist in learning, with over 15 years of experience.</p>
            <a href="/" className='flex flex-row'><Image className='mx-2 object-contain' src={'/phone-logo.png'} height={20} width={20} alt='phone icon' />
                &nbsp;(123) 123-1231</a>
            <a href="/" className='flex flex-row'><Image className='mx-2 object-contain' src={'/mail-logo.png'} height={20} width={20} alt='mail icon' />&nbsp;company@carrental.com</a>
            <a href="/" className='flex flex-row'><Image className='mx-2 object-contain' src={'/location-logo.png'} height={20} width={20} alt='location icon' />&nbsp;Manhattan, New York</a>
        </div>
    )
}
