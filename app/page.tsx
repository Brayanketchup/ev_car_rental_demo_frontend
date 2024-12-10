

'use client';

import React, { useState, useEffect } from 'react';
import { Navbar, Footer, Hero } from '@/components';  
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { manufacturersData } from '@/constants';
import Link from 'next/link';

export default function Home() {
  const [username, setUsername] = useState(null);
  const [carResults, setCarResults] = useState([]);
  const [searchParams, setSearchParams] = useState({
    manufacture: '',
    model: '',
    year: '',
    price: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [models, setModels] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    setModels(manufacturersData[searchParams.manufacture] || []);
  }, [searchParams.manufacture]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prevParams => ({ ...prevParams, [name]: value }));
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data } = await axios.get('http://localhost:5000/api/cars/search', {
        params: searchParams
      });
      setCarResults(data);
    } catch (error) {
      setError('Failed to fetch cars. Please try again later.');
      console.error('Failed to fetch cars:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Navbar />
      <Hero />
      
      <section id='Cars' className="container mx-auto p-24">
        {/* <h1 className="text-4xl font-extrabold">Welcome to CarRental, {username || 'Guest'}</h1> */}
        <h1 className="text-4xl font-extrabold text-center">Car Catalogue</h1>
        <div className="search-form max-w-md mx-auto my-8">
          <div className="grid grid-cols-2 gap-4">
            <select
              className="form-select p-2 border border-gray-300 rounded-md"
              name="manufacture"
              value={searchParams.manufacture}
              onChange={handleInputChange}
            >
              <option value="">Select Manufacturer</option>
              {Object.keys(manufacturersData).map(manufacture => (
                <option key={manufacture} value={manufacture}>{manufacture}</option>
              ))}
            </select>
            <select
              className="form-select p-2 border border-gray-300 rounded-md"
              name="model"
              value={searchParams.model}
              onChange={handleInputChange}
              disabled={!searchParams.manufacture}
            >
              <option value="">Select Model</option>
              {models.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            
            <input
              type="text"
              className="form-input p-2 border border-gray-300 rounded-md"
              name="price"
              value={searchParams.price}
              onChange={handleInputChange}
              placeholder="Max Price"
            />
          </div>
          <div className="mt-4">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full p-3 bg-primary-color text-white rounded-md hover:bg-primary-color-100 disabled:bg-gray-300"
            >
              Search
            </button>
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {isLoading ? <p>Loading...</p> : (
          <div className="cars-list space-y-4 mt-8">
            {carResults.length > 0 ? carResults.map(car => (
              <div key={car.ID} className="car-details bg-gray-100 p-6 rounded-lg flex flex-col space-x-2">
                <h2 className="text-2xl font-bold">{car.manufacture} {car.model} - {car.year}</h2>
                {/* <p>{car.description}</p> */}
                <p>{car.price} / day</p>
                {car.image && (
                  <img
                    src={`data:image/jpeg;base64,${btoa(
                      new Uint8Array(car.image.data)
                        .reduce((data, byte) => data + String.fromCharCode(byte), '')
                    )}`}
                    alt={`${car.manufacture} ${car.model}`}
                    className="w-full h-[550px] object-cover rounded-md"
                  />
                )}
                <Link href={`/carinfo/${car.ID}`} className="mt-4 w-fit text-white bg-primary-color hover:bg-primary-color-100 rounded-md p-2">
                  Show More
                </Link>
              </div>
            )) : <p></p>}
          </div>
        )}
      </section>
      {/* <Footer /> */}
    </main>
  );
}