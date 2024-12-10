import React from 'react'

export const Banner = () => {
  return (
    <div className='relative inset-0 h-96 flex'>
      <div className='h-full bg-white opacity-30 w-full flex absolute z-[1]'> </div>
      <div className='bg-banner-bg bg-cover h-full w-full flex z-0'></div>
    </div>
  )
}
