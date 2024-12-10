'use client'
import React, { useState } from 'react';
import { Banner, ContactForm, ContactInfo, Navbar } from '@/components'
import { useEffect } from 'react';
// import { useRouter } from 'next/router'
import axios from 'axios';

export default function contact() {

  const [description, setDescription] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const idUser = localStorage.getItem('userId') || '';
    setUserId(idUser);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || !description) {
      alert('All fields are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/tickets/create', {
        description,
        user_id: userId,
      });

      alert(response.data.message);
      setDescription(''); // Clear the description after successful submission
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Failed to create the ticket.');
    }
  };

  return (
    <main>
      <Navbar />
      <Banner />
      <section id='contact-section' className='flex min-h-screen flex-col items-center justify-between  p-24 overflow-hidden'>

        <div className='flex flex-wrap gap-6 justify-center w-full py-4'>
          <div className='max-w-[410px] w-full'>
            <ContactInfo />
          </div>

          <div className='max-w-[410px] w-full'>
            <ContactForm />
          </div>
        </div>

        {userId ? (
          <>
            <div className='w-full h-[2px] bg-primary-color content-none space-y-4' />



            <div className='flex flex-wrap gap-6 justify-center w-full py-4'>
              <div className='max-w-[410px] w-full'>
                <div className='w-full flex flex-col gap-4 '>
                  <h1 className='tittle-style'>Don't have an Email?</h1>
                  <p>Write up a ticket explaining your issue and we will get back to you as soon as possible.</p>

                </div>


              </div>

              <div className='max-w-[410px] w-full'>
                <h2 className="text-2xl font-bold text-center mb-6">Create a New Ticket</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-gray-100 p-6 rounded shadow-md">
                  <textarea
                    placeholder="Enter ticket description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded"
                    required
                  />
                  <button
                    type="submit"
                    className="square-button"
                  >
                    Submit Ticket
                  </button>
                </form>
              </div>
            </div>

          </>
        ):('')}
      </section>
      <div className='w-full h-auto py-10 px-5 flex flex-wrap justify-center text-white bg-[#2d2d2d] '>
        <h1 className='tittle-style'>Book a car by getting in touch with us</h1>
        <p className='tittle-style text-primary-color'>&nbsp;(123) 123-1231</p>
      </div>
    </main>
  )
}

