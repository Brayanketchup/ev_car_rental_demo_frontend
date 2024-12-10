import React from 'react'
import { HowToPlanTrip, Banner, WhyUs, AboutChoices, Navbar } from '@/components'

export default function about() {
  return (

    <main>
      <Navbar/>
      <Banner />
      <section id='about-us' className='flex min-h-screen flex-col items-center justify-between p-24 overflow-hidden '>
        <HowToPlanTrip />
        <article id='why-us?'>
          <WhyUs />
        </article>

        <div className=' w-full flex flex-col justify-center items-center my-5'>
          <span className=' h-1 w-28 bg-orange-500 rounded-xl m-1'></span>
          <span className=' h-1 w-28 bg-orange-500 rounded-xl m-1 -translate-x-1/2'></span>
        </div>

        <article id='Unlimited-Choices'>
        <AboutChoices/>
        </article>
      </section>
    </main>


  )
}

