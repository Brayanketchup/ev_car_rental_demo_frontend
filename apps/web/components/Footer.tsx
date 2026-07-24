import React from 'react'
import Image from 'next/image'
import { footerLinks } from '@/constants'
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className='flex  flex-col text-black-100 mt-5 border-t border-gray-100'>
      <div className='flex max-md:flex-col flex-wrap justify-between gap-5 sm:px-16 px-6 py-10'>
        <div className='flex flex-col justify-start items-start gap-6'>
          <Image src="/logo.png" alt='car logo' width={50} height={50} className='object-contain' />
          <p className='text-base text-gray-700'>My website &copy;</p>
        </div>

        <div className='flex-1 w-full flex md:justify-end flex-wrap max-md:mt-10 gap-20'>
          {footerLinks.map((link) => (
            <div key={link.title} className='flex flex-col gap-6 text-base min-w-[170px]'>
              <h3 className='font-bold'>{link.title}</h3>
              <div className="flex flex-col gap-5">
                {link.links.map((item) => (
                  <Link key={item.title}
                    href={item.url}
                    className="text-gray-600 button-color-transition"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>


    </footer>
  )
}
