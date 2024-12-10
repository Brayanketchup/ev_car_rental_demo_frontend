
'use client';

import React, { useState, useEffect } from 'react';
import { Footer, Navbar } from "@/components";
import axios from 'axios';


export interface ICar {
    ID: number; // Primary key
    manufacture: string | null; // Manufacturer of the car
    model: string | null; // Model of the car
    year: number | null; // Manufacturing year
    seats: number | null; // Number of seats
    doors: number | null; // Number of doors
    color: string | null; // Car color
    mileage: number | null; // Mileage of the car
    drive_type: 'AWD' | 'RWD' | 'FWD' | null; // Drive type
    price: number | null; // Price in decimal format
    description: string | null; // Car description
    image: Blob | null; // Medium blob for the image
    status: 'booked' | 'maintenance' | 'available' | null; // Status of the car
}


interface IReview {
    review_id: string;
    first_name: string;
    score: number;
    description: string;
    date_posted: string;
}



interface PageProps {
    params: {
        carID: string;
    };
}




const Page = ({ params }: PageProps) => {
    
    const [car, setCar] = useState<ICar | null>(null);
    const [reviews, setReviews] = useState<IReview[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [tripStart, setTripStart] = useState<string>('');
    const [tripEnd, setTripEnd] = useState<string>('');
    const [pickupReturnLocation, setPickupReturnLocation] = useState<string>('');
    const [userId, setUserId] = useState<string | null>(null);


    const { carID } = params;


    useEffect(() => {
        const idUser = localStorage.getItem('userId') || '';
        // const storedUsername = localStorage.getItem('username');
        setUserId(idUser);

        if (carID) {
            const fetchCar = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get<ICar>(`http://localhost:5000/api/cars/${carID}`);
                    setCar({
                        ...response.data,
                        image: response.data.image
                            ? URL.createObjectURL(new Blob([new Uint8Array(response.data.image.data)], { type: 'image/jpeg' }))
                            : null,
                    });

                    // Fetch reviews for the car
                    const reviewsResponse = await axios.get<IReview[]>(`http://localhost:5000/api/customer-reviews/${carID}`);
                    setReviews(reviewsResponse.data); // Assuming setReviews is defined

                } catch (err) {
                    setError('Failed to fetch car details. Sorry for the inconvenience.');
                } finally {
                    setLoading(false);
                }
            };
            fetchCar();
        }
    }, [carID]);

    const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const today = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD format

        if (tripStart <= today) {
            alert("The start date must be a future date.");
            return;
        }

        if (tripEnd <= tripStart) {
            alert("The end date must be after the start date.");
            return;
        }

        try {
            const bookingData = {
                carID,
                userId,
                tripStart,
                tripEnd,
                pickupReturnLocation,
            };

            const response = await axios.post('http://localhost:5000/api/bookings', bookingData);

            if (response.status === 201) {
                alert("Booking successful!");
                setTripStart('');
                setTripEnd('');
                setPickupReturnLocation('');
            }
        } catch (error) {
            console.error("Booking failed:", error);
            alert("Failed to book the car. Please try again.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!car) return <p>No car found. Sorry for the inconvenience.</p>;

    return (
        <>
            <Navbar />
            <section className='px-24 py-10 flex flex-col'>
                <div className='px-24 py-10 '>

                    {car.image && (
                        <img
                            src={car.image}
                            alt={`${car.manufacture} ${car.model}`}
                            className=" w-full rounded-xl"
                            onLoad={() => URL.revokeObjectURL(car.image)}
                        />
                    )}
                </div>


                <div className='flex flex-row '>

                    <div className='flex flex-col w-full'>

                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            {car.manufacture} {car.model} - {car.year}
                        </h1>


                        {car.status !== 'available' ? <div> <h1>This car is already booked</h1></div> :


                            <form onSubmit={handleBooking} className="space-y-4">
                                <div>
                                    <label htmlFor="tripStart" className="block text-gray-600 mb-1">Trip Start</label>
                                    <input
                                        type="date"
                                        id="tripStart"
                                        value={tripStart}
                                        onChange={(e) => setTripStart(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="tripEnd" className="block text-gray-600 mb-1">Trip End</label>
                                    <input
                                        type="date"
                                        id="tripEnd"
                                        value={tripEnd}
                                        onChange={(e) => setTripEnd(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md"
                                        required
                                    />
                                </div>

                                <div className='w-full h-[2px] bg-gray-200 rounded-full' />

                                <div>
                                    <label htmlFor="pickupReturnLocation" className="block text-gray-600 mb-1">Pickup and Return Location</label>
                                    <select
                                        id="pickupReturnLocation"
                                        value={pickupReturnLocation}
                                        onChange={(e) => setPickupReturnLocation(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md"
                                        required
                                    >
                                        <option value="">Select Location</option>
                                        <option value="NWR">Newark, New Jersey</option>
                                        <option value="JFK">JFK, New York</option>
                                    </select>
                                </div>

                                <button type="submit" className="w-full bg-primary-color text-white py-2 rounded-md hover:bg-primary-color-100">
                                    Book Now
                                </button>
                            </form>
                        }

                        <div className='w-full h-[2px] bg-gray-200 rounded-full my-3' />


                        <ul className=' grid grid-cols-2 grid-flow-row text-gray-700 space-y-2 mb-6 py-4'>
                            <li><strong>Seats:</strong> {car.seats}</li>
                            <li><strong>Doors:</strong> {car.doors}</li>
                            <li><strong>Mileage:</strong> {car.mileage} miles</li>
                            <li><strong>Drive Type:</strong> {car.drive_type}</li>
                        </ul>

                        <div className='w-full h-[2px] bg-gray-200 rounded-full my-3' />

                        <div className='py-2'>
                            <strong>Description:</strong>
                            <p>
                                {car.description}
                            </p>

                        </div>

                        <div className='py-2'>
                            <strong>Child safety seat:</strong>
                            <p>
                                $25/trip
                                {/* {car.description} */}
                            </p>

                        </div>
                        <div className='w-full h-[2px] bg-gray-200 rounded-full my-3' />
                        <div className='pt-4'>
                            <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
                            <ul className="w-full">
                                {reviews.length > 0 ? (
                                    reviews.map((review) => (
                                        <li key={review.review_id} className="flex flex-col w-full">
                                            <div className="flex flex-row w-full">
                                                <div className="flex px-2">
                                                    <p className="font-semibold">{review.first_name}</p>
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="space-y-1">
                                                        <span className="font-medium">Score:</span> {review.score}/5
                                                    </p>
                                                    <p className="space-y-1">
                                                        <span className="font-medium">Date Posted:</span> {new Date(review.date_posted).toLocaleDateString()}
                                                    </p>
                                                    <p className="space-y-1">
                                                        <span className="font-medium">Review:</span> {review.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="w-full h-[2px] bg-gray-200 rounded-full my-3" />
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No reviews available for this car.</p>
                                )}
                            </ul>
                        </div>
                    </div>


                </div>

            </section>
        </>
    );
};

export default Page;
