import React from 'react'
import { PlanCard } from '.'

export const HowToPlanTrip = () => {
  return (
    <div className='text-center'>
          <h2 className='2xl:text-[30px] sm:text-[20px] text-[15px] font-semibold'>Plan your trip</h2>
          <h1 className='tittle-style'>Quick & easy car rental</h1>
          <div className='w-full flex justify-center flex-wrap'>
            <PlanCard
            tittle='Choose a Vehicle'
            text='Explore our extensive selection of cars and
                Find the ideal vehicle to match your requirements.'
            imgLink='/orange-car-logo.png'
            />
            <PlanCard
            tittle='Speak with Our Team'
            text='Connect with our approachable and well-informed team members who
                are available to address any inquiries or issues you might have'
            imgLink='/orange-agent-logo.png'
            />
            <PlanCard
            tittle='Start Your Journey'
            text='Embark on your journey with confidence,
                whether you are cruising the highways or navigating city streets,
                with our diverse fleet of vehicles.'
            imgLink='/orange-traveling-logo.png'
            />
          </div>
        </div>
  )
}
