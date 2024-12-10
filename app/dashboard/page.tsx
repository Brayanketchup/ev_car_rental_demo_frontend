'use client'


import React, { useState } from 'react';
import Link from 'next/link';
import { AdminNavbar } from '@/components';


const page = () => {
    const [carData, setCarData] = useState({
        manufacturer: '',
        model: '',
        year: '',
        seats: '',
        doors: '',
        color: '',
        mileage: '',
        driveType: '',
        price: '',
        description: '',
        status: 'available' // defaulting to available
    });
    const [showForm, setShowForm] = useState(false); // State to manage form visibility

    const handleChange = (e) => {
        setCarData({
            ...carData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting the following data to the backend:", carData);
        const formData = new FormData();
        for (const key in carData) {
            if (key === 'image') {
                formData.append(key, carData[key]);
            } else {
                formData.append(key, carData[key]);
            }
        }
        try {
            const response = await fetch('http://localhost:5000/api/cars/add', {
                method: 'POST',
                body: formData, // sending as FormData
            });
            if (response.ok) {
                alert('Car added successfully!');
                setShowForm(false);
            } else {
                alert('Failed to add car. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error adding car. Please check your connection and try again.');
        }
    };

    const handleChangeFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCarData({ ...carData, image: file });
        }
    };





    return (

        <>
            <AdminNavbar />


            <section className="max-w-xl mx-auto p-5 w-full min-h-[100vh] py-14">

                <h1>
                    <strong>
                        Welcome to the admin Dashboard
                    </strong>
                </h1>

                <div className='felx flex-row space-x-4'>



                    <Link href="/dashboard/inventory" passHref>
                        <button className='bg-primary-color hover:bg-primary-color-100 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
                            Go to Inventory</button>
                    </Link>

                    <Link href="/dashboard/tickets" passHref>
                        <button className='bg-primary-color hover:bg-primary-color-100 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
                            Tickets</button>
                    </Link>


                    <button onClick={() => setShowForm(!showForm)} className="bg-primary-color hover:bg-primary-color-100 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        {showForm ? 'Close Form' : 'Add New Car'}
                    </button>

                    {/* <Link href="/dashboard/inventory" passHref>
                    <button className='bg-primary-color hover:bg-primary-color-100 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
                        </button>
                </Link> */}

                    {showForm && (
                        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-4">
                            <h2 className="block text-gray-700 text-lg font-bold mb-2">Add New Car</h2>
                            {/* Form fields remain the same as before, just wrapped in a conditional rendering */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="manufacturer">
                                    Manufacturer:
                                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="manufacturer" value={carData.manufacturer} onChange={handleChange} />
                                </label>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="model">
                                    Model:
                                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="model" value={carData.model} onChange={handleChange} />
                                </label>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="year">
                                    Year:
                                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="number" name="year" value={carData.year} onChange={handleChange} />
                                </label>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="seats">
                                    Seats:
                                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="number" name="seats" value={carData.seats} onChange={handleChange} />
                                </label>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="doors">
                                    Doors:
                                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="number" name="doors" value={carData.doors} onChange={handleChange} />
                                </label>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="color">
                                    Color:
                                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="color" value={carData.color} onChange={handleChange} />
                                </label>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mileage">
                                    Mileage:
                                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="number" name="mileage" value={carData.mileage} onChange={handleChange} />
                                </label>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="driveType">
                                    Drive Type:
                                    <select className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="driveType" value={carData.driveType} onChange={handleChange}>
                                        <option value="" disabled>Select Drive Type</option>
                                        <option value="AWD">AWD</option>
                                        <option value="RWD">RWD</option>
                                        <option value="FWD">FWD</option>
                                    </select>

                                </label>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                                    Price:
                                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="price" value={carData.price} onChange={handleChange} />
                                </label>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                    Description:
                                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="description" value={carData.description} onChange={handleChange}></textarea>
                                </label>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                                    Car Image:
                                    <input
                                        type="file"
                                        name="image"
                                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        onChange={(e) => handleChangeFile(e)}
                                    />
                                </label>
                            </div>
                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add Car</button>
                        </form>


                    )}
                </div>
            </section>
        </>
    );
};

export default page;

