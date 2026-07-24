import React from 'react'
import Image from 'next/image'
import { PlanCardProps } from '@/types'


export const PlanCard = ({tittle, text, imgLink} : PlanCardProps) => {


  return (
    <div className='flex flex-col items-center h-[400px] w-[305px]  py-6 px-8'> 
    <Image src={`${imgLink}`} alt='' height={170} width={170} className=' object-contain'></Image> 
    <h3 className=' subtitle-style'>{tittle}</h3>
    <p>{text}</p>
  </div>
  )
}

