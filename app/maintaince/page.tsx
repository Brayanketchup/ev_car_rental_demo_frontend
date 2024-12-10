
'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { MechanicNavbar } from '@/components';

interface Car {
    ID: number;
    manufacture: string;
    model: string;
    year: string; // Year as text
    seats: number;
    doors: number;
    color: string;
    mileage: number;
    drive_type: string;
    price: number;
    description: string;
    image: Blob | null;
    status: string;
}


interface FormValues {
    manufacture?: string;
    model?: string;
    seats?: number;
    doors?: number;
    color?: string;
    mileage?: number;
    drive_type?: string;
    price?: number;
    description?: string;
    status?: string;
}


const Page = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [editingCar, setEditingCar] = useState<number | null>(null); // Track the car being edited
    const [formValues, setFormValues] = useState<FormValues>({}); // Store form data

    const handleEditClick = (car: Car) => {
        setEditingCar(car.ID); // Set the ID of the car being edited
        setFormValues({ ...car }); // Populate form with car data
    };

    const handleInputChange = (e :  React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleFormSubmit = async (e :  React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('formValues', formValues)
        try {
            const response = await fetch('http://localhost:5000/api/cars/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formValues),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                setEditingCar(null); // Close the form
                // Optionally refresh car list here
            } else {
                alert(result.message || 'Failed to update car.');
            }
        } catch (error) {
            console.error('Error updating car:', error);
            alert('An error occurred while updating the car.');
        }
    };
    /////////////////////////////

    const fetchCars = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/cars/getallcars');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Car[] = await response.json();
            const carsWithImages = data.map(car => ({
                ...car,
                image: car.image ? new Blob([new Uint8Array(car.image.data)], { type: 'image/jpeg' }) : null
            }));
            setCars(carsWithImages);
        } catch (error) {
            console.error('Failed to fetch cars:', error);
            alert('Failed to fetch cars. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);


    const setCarToavaliable = async (carID: number): Promise<void> => {
        try {
            if (!carID) {
                throw new Error('Car ID is required');
            }

            const response = await fetch(`http://localhost:5000/api/car/setavaliable/${carID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to update car status: ${errorData.message || response.statusText}`);
            }

            const responseData = await response.json();
            console.log('Car status updated successfully:', responseData);

            // Refresh the car list after updating status
            fetchCars();
        } catch (error: any) {
            console.error('Error updating car status:', error.message);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <>
        <MechanicNavbar/>
            <div className="container mx-auto mt-10 p-5 py-16">
                <h1 className="text-2xl font-extrabold w-full text-center">Maintenance Cars</h1>
                <div className="flex flex-col space-y-4">
                    {cars.filter((car) => car.status === 'maintenance').length > 0 ? (
                        cars
                            .filter((car) => car.status === 'maintenance')
                            .map((car) => (
                                <div key={car.ID} className="car bg-white rounded-lg p-4">
                                    <div className="w-fit">
                                        <h2 className="text-xl font-bold">
                                            {car.manufacture} {car.model} ({car.year})
                                        </h2>
                                        <div className="content-none h-[2px] w-full bg-orange-300" />
                                    </div>
                                    <ul className="flex flex-col space-y-1">
                                        <li>
                                            <p>
                                                <strong>Seats:</strong> {car.seats}
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <strong>Doors:</strong> {car.doors}
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <strong>Color:</strong> {car.color}
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <strong>Mileage:</strong> {car.mileage} miles
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <strong>Drive Type:</strong> {car.drive_type}
                                            </p>
                                        </li>
                                        {/* <li>
                                            <p>
                                                <strong>Price:</strong> {car.price}
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <strong>Description:</strong> {car.description}
                                            </p>
                                        </li> */}
                                        <li>
                                            <p>
                                                <strong>Status:</strong> {car.status}
                                            </p>
                                        </li>
                                    </ul>
                                    {car.image && (
                                        <img
                                            src={URL.createObjectURL(car.image)}
                                            alt={`${car.manufacture} ${car.model}`}
                                            className="rounded-md"
                                            onLoad={() => URL.revokeObjectURL(URL.createObjectURL(car.image))}
                                        />
                                    )}
                                    <button
                                        onClick={() => setCarToavaliable(car.ID)}
                                        className="px-2 py-1 text-white rounded-md bg-green-600"
                                    >
                                        Set to Avaliable
                                    </button>
                                </div>
                            ))
                    ) : (
                        <p>No cars under maintenance.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Page;
