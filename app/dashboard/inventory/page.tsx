// 'use client'

// import React, { useState, useEffect } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';

// import { AdminNavbar } from '@/components';

// interface Car {
//     id: number;
//     manufacture: string;
//     model: string;
//     year: string;  // Using string here since you indicated it's stored as text.
//     seats: number;
//     doors: number;
//     color: string;
//     mileage: number;
//     drive_type: string;
//     price: number;
//     description: string;
//     image: Blob;
//     status: string;
// }

// const Page = () => {
//     const [cars, setCars] = useState<Car[]>([]);
//     const [loading, setLoading] = useState(false);
//     /////////////////////////////
//     const [editingCar, setEditingCar] = useState(null); // Track the car being edited
//     const [formValues, setFormValues] = useState({}); // Store form data

//     const handleEditClick = (car) => {
//         setEditingCar(car.ID); // Set the ID of the car being edited
//         setFormValues({ ...car }); // Populate form with car data
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormValues({ ...formValues, [name]: value });
//     };

//     const handleFormSubmit = async (e) => {
//         e.preventDefault();
//         console.log('formValues', formValues)
//         try {
//             const response = await fetch('http://localhost:5000/api/cars/update', {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(formValues),
//             });

//             const result = await response.json();

//             if (response.ok) {
//                 alert(result.message);
//                 setEditingCar(null); // Close the form
//                 // Optionally refresh car list here
//             } else {
//                 alert(result.message || 'Failed to update car.');
//             }
//         } catch (error) {
//             console.error('Error updating car:', error);
//             alert('An error occurred while updating the car.');
//         }
//     };
//     /////////////////////////////

//     const fetchCars = async () => {
//         setLoading(true);
//         try {
//             const response = await fetch('http://localhost:5000/api/cars/getallcars');
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             const data = await response.json();
//             const carsWithImages = data.map(car => ({
//                 ...car,
//                 image: car.image ? new Blob([new Uint8Array(car.image.data)], { type: 'image/jpeg' }) : null
//             }));
//             setCars(carsWithImages);
//         } catch (error) {
//             console.error('Failed to fetch cars:', error);
//             alert('Failed to fetch cars. Please try again later.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchCars();
//     }, []);


//     const setCarToMaintenance = async (carID: string): Promise<any> => {
//         try {
//             if (!carID) {
//                 throw new Error('Car ID is required');
//             }

//             const response = await fetch(`http://localhost:5000/api/car/setmaintenance/${carID}`, {
//                 method: 'POST', // Assuming this is a POST request; adjust if needed
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (!response.ok) {
//                 // Handle HTTP errors
//                 const errorData = await response.json();
//                 throw new Error(`Failed to update car status: ${errorData.message || response.statusText}`);
//             }

//             const responseData = await response.json();
//             console.log('Car status updated successfully:', responseData);
//             return responseData;
//         } catch (error: any) {
//             console.error('Error updating car status:', error.message);
//             throw error;
//         }
//     };

//     return (
//         <>
//             <AdminNavbar />
//             <div className="container mx-auto mt-10 p-5 py-16">
//                 <h1 className="text-2xl font-extrabold w-full text-center">Inventory</h1>
//                 <div className="flex flex-col space-y-4">
//                     {cars.length > 0 ? (
//                         cars.map((car) => (
//                             <div key={car.ID} className="car bg-white rounded-lg p-4">
//                                 <div className="w-fit">
//                                     <h2 className="text-xl font-bold">
//                                         {car.manufacture} {car.model} ({car.year})
//                                     </h2>
//                                     <div className="content-none h-[2px] w-full bg-orange-300" />
//                                 </div>
//                                 <ul className="flex flex-col space-y-1">
//                                     <li><p><strong>Seats:</strong> {car.seats}</p></li>
//                                     <li><p><strong>Doors:</strong> {car.doors}</p></li>
//                                     <li><p><strong>Color:</strong> {car.color}</p></li>
//                                     <li><p><strong>Mileage:</strong> {car.mileage} miles</p></li>
//                                     <li><p><strong>Drive Type:</strong> {car.drive_type}</p></li>
//                                     <li><p><strong>Price:</strong> {car.price}</p></li>
//                                     <li><p><strong>Description:</strong> {car.description}</p></li>
//                                     <li><p><strong>Status:</strong> {car.status}</p></li>
//                                 </ul>
//                                 {car.image && (
//                                     <img
//                                         src={URL.createObjectURL(car.image)}
//                                         alt={`${car.manufacture} ${car.model}`}
//                                         className="rounded-md"
//                                         onLoad={() => URL.revokeObjectURL(URL.createObjectURL(car.image))}
//                                     />
//                                 )}



//                                 {car.status == 'available' && (


//                                     <div className="flex flex-row space-x-2 w-full justify-end pt-2">
//                                         <button
//                                             className="px-2 py-1 text-white rounded-md bg-primary-color"
//                                             onClick={() => handleEditClick(car)}
//                                         >
//                                             Edit
//                                         </button>
//                                         <button className="px-2 py-1 text-white rounded-md bg-red-600">Unlist</button>
//                                         <button
//                                             onClick={() => setCarToMaintenance(car.ID)}
//                                             className="px-2 py-1 text-white rounded-md bg-red-600"
//                                         >
//                                             Set to Maintenance
//                                         </button>
//                                         {/* <button onClick={setCarToMaintenance(car.ID)} className="px-2 py-1 text-white rounded-md bg-red-600">Set to Maintance</button> */}
//                                     </div>

//                                 )}


//                                 {editingCar === car.ID && (
//                                     // <form className="mt-4 space-y-2" onSubmit={handleFormSubmit}>
//                                     //     <div>
//                                     //         <label className="block text-sm font-medium">Manufacture</label>
//                                     //         <input
//                                     //             type="text"
//                                     //             name="manufacture"
//                                     //             value={formValues.manufacture || ''}
//                                     //             onChange={handleInputChange}
//                                     //             className="border p-2 w-full rounded"
//                                     //         />
//                                     //     </div>
//                                     //     <div>
//                                     //         <label className="block text-sm font-medium">Model</label>
//                                     //         <input
//                                     //             type="text"
//                                     //             name="model"
//                                     //             value={formValues.model || ''}
//                                     //             onChange={handleInputChange}
//                                     //             className="border p-2 w-full rounded"
//                                     //         />
//                                     //     </div>
//                                     //     <div>
//                                     //         <label className="block text-sm font-medium">Seats</label>
//                                     //         <input
//                                     //             type="number"
//                                     //             name="seats"
//                                     //             value={formValues.seats || ''}
//                                     //             onChange={handleInputChange}
//                                     //             className="border p-2 w-full rounded"
//                                     //         />
//                                     //     </div>
//                                     //     <div>
//                                     //         <label className="block text-sm font-medium">Price</label>
//                                     //         <input
//                                     //             type="number"
//                                     //             step="0.01"
//                                     //             name="price"
//                                     //             value={formValues.price || ''}
//                                     //             onChange={handleInputChange}
//                                     //             className="border p-2 w-full rounded"
//                                     //         />
//                                     //     </div>
//                                     //     {/* Add more fields as needed */}
//                                     //     <button
//                                     //         type="submit"
//                                     //         className="px-4 py-2 bg-blue-600 text-white rounded"
//                                     //     >
//                                     //         Save
//                                     //     </button>
//                                     //     <button
//                                     //         type="button"
//                                     //         onClick={() => setEditingCar(null)}
//                                     //         className="ml-2 px-4 py-2 bg-gray-400 text-white rounded"
//                                     //     >
//                                     //         Cancel
//                                     //     </button>
//                                     // </form>
//                                     <form className="mt-4 space-y-2" onSubmit={handleFormSubmit}>
//                                         <div>
//                                             <label className="block text-sm font-medium">Manufacture</label>
//                                             <input
//                                                 type="text"
//                                                 name="manufacture"
//                                                 value={formValues.manufacture || ''}
//                                                 onChange={handleInputChange}
//                                                 className="border p-2 w-full rounded"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium">Model</label>
//                                             <input
//                                                 type="text"
//                                                 name="model"
//                                                 value={formValues.model || ''}
//                                                 onChange={handleInputChange}
//                                                 className="border p-2 w-full rounded"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium">Seats</label>
//                                             <input
//                                                 type="number"
//                                                 name="seats"
//                                                 value={formValues.seats || ''}
//                                                 onChange={handleInputChange}
//                                                 className="border p-2 w-full rounded"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium">Doors</label>
//                                             <input
//                                                 type="number"
//                                                 name="doors"
//                                                 value={formValues.doors || ''}
//                                                 onChange={handleInputChange}
//                                                 className="border p-2 w-full rounded"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium">Color</label>
//                                             <input
//                                                 type="text"
//                                                 name="color"
//                                                 value={formValues.color || ''}
//                                                 onChange={handleInputChange}
//                                                 className="border p-2 w-full rounded"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium">Mileage</label>
//                                             <input
//                                                 type="number"
//                                                 step="0.1"
//                                                 name="mileage"
//                                                 value={formValues.mileage || ''}
//                                                 onChange={handleInputChange}
//                                                 className="border p-2 w-full rounded"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium">Drive Type</label>
//                                             <input
//                                                 type="text"
//                                                 name="drive_type"
//                                                 value={formValues.drive_type || ''}
//                                                 onChange={handleInputChange}
//                                                 className="border p-2 w-full rounded"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium">Price</label>
//                                             <input
//                                                 type="number"
//                                                 step="0.01"
//                                                 name="price"
//                                                 value={formValues.price || ''}
//                                                 onChange={handleInputChange}
//                                                 className="border p-2 w-full rounded"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium">Description</label>
//                                             <textarea
//                                                 name="description"
//                                                 value={formValues.description || ''}
//                                                 onChange={handleInputChange}
//                                                 className="border p-2 w-full rounded"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium">Status</label>
//                                             <input
//                                                 type="text"
//                                                 name="status"
//                                                 value={formValues.status || ''}
//                                                 onChange={handleInputChange}
//                                                 className="border p-2 w-full rounded"
//                                             />
//                                         </div>
//                                         <button
//                                             type="submit"
//                                             className="px-4 py-2 bg-blue-600 text-white rounded"
//                                         >
//                                             Save
//                                         </button>
//                                         <button
//                                             type="button"
//                                             onClick={() => setEditingCar(null)}
//                                             className="ml-2 px-4 py-2 bg-gray-400 text-white rounded"
//                                         >
//                                             Cancel
//                                         </button>
//                                     </form>

//                                 )}

//                             </div>
//                         ))
//                     ) : (
//                         <p>No cars available.</p>
//                     )}
//                 </div>
//             </div>
//         </>
//     );
// };

// export default Page;
'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { AdminNavbar } from '@/components';

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

    const handleEditClick = (car : Car) => {
        setEditingCar(car.ID); // Set the ID of the car being edited
        setFormValues({ ...car }); // Populate form with car data
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleFormSubmit = async (e) => {
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


    const setCarToMaintenance = async (carID: number): Promise<any> => {
        try {
            if (!carID) {
                throw new Error('Car ID is required');
            }

            const response = await fetch(`http://localhost:5000/api/car/setmaintenance/${carID}`, {
                method: 'POST', // Assuming this is a POST request; adjust if needed
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                // Handle HTTP errors
                const errorData = await response.json();
                throw new Error(`Failed to update car status: ${errorData.message || response.statusText}`);
            }

            const responseData = await response.json();
            console.log('Car status updated successfully:', responseData);
            return responseData;
        } catch (error: any) {
            console.error('Error updating car status:', error.message);
            throw error;
        }
    };

    return (
        <>
            <AdminNavbar />
            <div className="container mx-auto mt-10 p-5 py-16">
                <h1 className="text-2xl font-extrabold w-full text-center">Inventory</h1>
                <div className="flex flex-col space-y-4">
                    {cars.length > 0 ? (
                        cars.map((car) => (
                            <div key={car.ID} className="car bg-white rounded-lg p-4">
                                <div className="w-fit">
                                    <h2 className="text-xl font-bold">
                                        {car.manufacture} {car.model} ({car.year})
                                    </h2>
                                    <div className="content-none h-[2px] w-full bg-orange-300" />
                                </div>
                                <ul className="flex flex-col space-y-1">
                                    <li><p><strong>Seats:</strong> {car.seats}</p></li>
                                    <li><p><strong>Doors:</strong> {car.doors}</p></li>
                                    <li><p><strong>Color:</strong> {car.color}</p></li>
                                    <li><p><strong>Mileage:</strong> {car.mileage} miles</p></li>
                                    <li><p><strong>Drive Type:</strong> {car.drive_type}</p></li>
                                    <li><p><strong>Price:</strong> {car.price}</p></li>
                                    <li><p><strong>Description:</strong> {car.description}</p></li>
                                    <li><p><strong>Status:</strong> {car.status}</p></li>
                                </ul>
                                {car.image && (
                                    <img
                                        src={URL.createObjectURL(car.image)}
                                        alt={`${car.manufacture} ${car.model}`}
                                        className="rounded-md"
                                        onLoad={() => URL.revokeObjectURL(URL.createObjectURL(car.image))}
                                    />
                                )}



                                {car.status == 'available' && (


                                    <div className="flex flex-row space-x-2 w-full justify-end pt-2">
                                        <button
                                            className="px-2 py-1 text-white rounded-md bg-primary-color"
                                            onClick={() => handleEditClick(car)}
                                        >
                                            Edit
                                        </button>
                                        {/* <button className="px-2 py-1 text-white rounded-md bg-red-600">Unlist</button> */}
                                        <button
                                            onClick={() => setCarToMaintenance(car.ID)}
                                            className="px-2 py-1 text-white rounded-md bg-red-600"
                                        >
                                            Set to Maintenance
                                        </button>
                                        {/* <button onClick={setCarToMaintenance(car.ID)} className="px-2 py-1 text-white rounded-md bg-red-600">Set to Maintance</button> */}
                                    </div>

                                )}


                                {editingCar === car.ID && (
                                    // <form className="mt-4 space-y-2" onSubmit={handleFormSubmit}>
                                    //     <div>
                                    //         <label className="block text-sm font-medium">Manufacture</label>
                                    //         <input
                                    //             type="text"
                                    //             name="manufacture"
                                    //             value={formValues.manufacture || ''}
                                    //             onChange={handleInputChange}
                                    //             className="border p-2 w-full rounded"
                                    //         />
                                    //     </div>
                                    //     <div>
                                    //         <label className="block text-sm font-medium">Model</label>
                                    //         <input
                                    //             type="text"
                                    //             name="model"
                                    //             value={formValues.model || ''}
                                    //             onChange={handleInputChange}
                                    //             className="border p-2 w-full rounded"
                                    //         />
                                    //     </div>
                                    //     <div>
                                    //         <label className="block text-sm font-medium">Seats</label>
                                    //         <input
                                    //             type="number"
                                    //             name="seats"
                                    //             value={formValues.seats || ''}
                                    //             onChange={handleInputChange}
                                    //             className="border p-2 w-full rounded"
                                    //         />
                                    //     </div>
                                    //     <div>
                                    //         <label className="block text-sm font-medium">Price</label>
                                    //         <input
                                    //             type="number"
                                    //             step="0.01"
                                    //             name="price"
                                    //             value={formValues.price || ''}
                                    //             onChange={handleInputChange}
                                    //             className="border p-2 w-full rounded"
                                    //         />
                                    //     </div>
                                    //     {/* Add more fields as needed */}
                                    //     <button
                                    //         type="submit"
                                    //         className="px-4 py-2 bg-blue-600 text-white rounded"
                                    //     >
                                    //         Save
                                    //     </button>
                                    //     <button
                                    //         type="button"
                                    //         onClick={() => setEditingCar(null)}
                                    //         className="ml-2 px-4 py-2 bg-gray-400 text-white rounded"
                                    //     >
                                    //         Cancel
                                    //     </button>
                                    // </form>
                                    <form className="mt-4 space-y-2" onSubmit={handleFormSubmit}>
                                        <div>
                                            <label className="block text-sm font-medium">Manufacture</label>
                                            <input
                                                type="text"
                                                name="manufacture"
                                                value={formValues.manufacture || ''}
                                                onChange={handleInputChange}
                                                className="border p-2 w-full rounded"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium">Model</label>
                                            <input
                                                type="text"
                                                name="model"
                                                value={formValues.model || ''}
                                                onChange={handleInputChange}
                                                className="border p-2 w-full rounded"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium">Seats</label>
                                            <input
                                                type="number"
                                                name="seats"
                                                value={formValues.seats || ''}
                                                onChange={handleInputChange}
                                                className="border p-2 w-full rounded"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium">Doors</label>
                                            <input
                                                type="number"
                                                name="doors"
                                                value={formValues.doors || ''}
                                                onChange={handleInputChange}
                                                className="border p-2 w-full rounded"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium">Color</label>
                                            <input
                                                type="text"
                                                name="color"
                                                value={formValues.color || ''}
                                                onChange={handleInputChange}
                                                className="border p-2 w-full rounded"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium">Mileage</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                name="mileage"
                                                value={formValues.mileage || ''}
                                                onChange={handleInputChange}
                                                className="border p-2 w-full rounded"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium">Drive Type</label>
                                            <input
                                                type="text"
                                                name="drive_type"
                                                value={formValues.drive_type || ''}
                                                onChange={handleInputChange}
                                                className="border p-2 w-full rounded"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium">Price</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                name="price"
                                                value={formValues.price || ''}
                                                onChange={handleInputChange}
                                                className="border p-2 w-full rounded"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium">Description</label>
                                            <textarea
                                                name="description"
                                                value={formValues.description || ''}
                                                onChange={handleInputChange}
                                                className="border p-2 w-full rounded"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium">Status</label>
                                            <input
                                                type="text"
                                                name="status"
                                                value={formValues.status || ''}
                                                onChange={handleInputChange}
                                                className="border p-2 w-full rounded"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded"
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditingCar(null)}
                                            className="ml-2 px-4 py-2 bg-gray-400 text-white rounded"
                                        >
                                            Cancel
                                        </button>
                                    </form>

                                )}

                            </div>
                        ))
                    ) : (
                        <p>No cars available.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Page;
