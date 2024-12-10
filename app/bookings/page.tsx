// 'use client'


// import React, { useState, useEffect } from 'react';
// import { Navbar, Footer, Hero } from '@/components';  // Assuming these are correctly set up
// import axios from 'axios';


// // Define TypeScript interfaces for your data
// interface Booking {
//     booking_id: string;
//     manufacture: string;
//     model: string;
//     year: number;
//     pickup_return_location: string;
//     trip_start: string;
//     trip_end: string;
//     status: string;
//     car_id?: string; // For reviews, optional field
// }

// interface ReviewData {
//     description: string;
//     score: string;
// }

// interface NewDates {
//     startDate: string;
//     endDate: string;
// }




// const page = () => {
//     const [futureBookings, setFutureBookings] = useState([]);
//     const [cancelledBookings, setCancelledBookings] = useState([]);
//     const [completedBookings, setCompletedBookings] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const [editingBooking, setEditingBooking] = useState(null);
//     const [newDates, setNewDates] = useState({ startDate: '', endDate: '' });

//     const [showForm, setShowForm] = useState(false);
//     const [reviewData, setReviewData] = useState({
//         description: '',
//         score: '',
//     });




//     useEffect(() => {
//         const fetchBookings = async () => {
//             try {
//                 const userID = localStorage.getItem('userId'); // Replace with actual session management logic
//                 if (!userID) {
//                     setError("User not logged in.");
//                     return;
//                 }

//                 const response = await axios.get(`http://localhost:5000/api/bookings/user/${userID}`);
//                 const bookings = response.data;

//                 // Categorize bookings
//                 const today = new Date();
//                 setFutureBookings(
//                     bookings.filter((booking) =>
//                         new Date(booking.trip_start) > today && booking.status === 'on coming'
//                     )
//                 );
//                 setCancelledBookings(bookings.filter((booking) => booking.status === 'cancelled'));
//                 setCompletedBookings(bookings.filter((booking) => booking.status === 'complete'));
//             } catch (err) {
//                 console.error('Failed to fetch bookings:', err);
//                 // setError("Failed to fetch bookings. Please try again later.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchBookings();
//     }, []);

//     const handleChangeBookingDates = async (booking_id) => {
//         console.log('trip_start ', newDates.startDate, 'endDate ', newDates.endDate, 'booking_id ', booking_id)
//         try {
//             const response = await fetch('http://localhost:5000/api/bookings/update-dates', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     booking_id,
//                     newStartDate: newDates.startDate,
//                     newEndDate: newDates.endDate,
//                 }),
//             });

//             if (response.ok) {
//                 alert('Booking dates updated successfully.');
//                 setFutureBookings((prevBookings) =>
//                     prevBookings.map((booking) =>
//                         booking.booking_id === booking_id
//                             ? {
//                                 ...booking,
//                                 trip_start: newDates.startDate,
//                                 trip_end: newDates.endDate,
//                             }
//                             : booking
//                     )
//                 );
//                 setEditingBooking(null); // Close the form
//             } else {
//                 const errorData = await response.json();
//                 alert(`Failed to update booking dates: ${errorData.message}`);
//             }
//         } catch (error) {
//             console.error('Error updating booking dates:', error);
//             alert('An error occurred. Please try again.');
//         }
//     };

//     const toggleEditingBooking = (booking_id) => {
//         setEditingBooking(booking_id === editingBooking ? null : booking_id);
//         setNewDates({ startDate: '', endDate: '' }); // Reset dates when toggling
//     };

//     const handleCancelBooking = async (booking_id) => {
//         console.log('you are trying to cancel the following car id booking', booking_id)

//         try {
//             // Example API call to cancel booking
//             const response = await fetch('http://localhost:5000/api/bookings/cancel', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ booking_id }), // Send booking_id in the request body
//             });

//             if (response.ok) {
//                 alert('Booking cancelled successfully.');
//                 // Optionally, update the state to remove the cancelled booking
//                 setFutureBookings((prevBookings) =>
//                     prevBookings.filter((booking) => booking.booking_id !== booking_id)
//                 );
//             } else {
//                 const errorData = await response.json();
//                 alert(`Failed to cancel booking: ${errorData.message}`);
//             }
//         } catch (error) {
//             console.error('Error cancelling booking:', error);
//             alert('An error occurred. Please try again.');
//         }
//     };

//     const handleReviewCreate = async (carID) => {
//         try {
//             const userID = localStorage.getItem('userId'); // Replace with actual session management logic
//             // const carID = 123; // Replace with the appropriate car ID context

//             if (!userID) {
//                 alert('User not logged in.');
//                 return;
//             }

//             const { description, score } = reviewData;

//             const response = await fetch('http://localhost:5000/api/reviews', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     user_id: userID,
//                     car_id: carID,
//                     description,
//                     score: Number(score),
//                 }),
//             });

//             if (response.ok) {
//                 alert('Review submitted successfully.');
//                 setReviewData({ description: '', score: '' }); // Reset form
//             } else {
//                 const errorData = await response.json();
//                 alert(`Failed to submit review: ${errorData.message}`);
//             }
//         } catch (error) {
//             console.error('Error submitting review:', error);
//             alert('An error occurred. Please try again.');
//         }
//     };



//     if (loading) return <p>Loading...</p>;
//     if (error) return <p className="text-red-500">{error}</p>;

//     return (
//         <main>
//             <Navbar />
//             <section className='py-16 px-20'>
//                 <div className='text-black'>
//                     <h1 className="text-2xl font-bold mb-4">My Bookings</h1>

//                     {/* Future Bookings */}
//                     <div className="mb-8">
//                         <h2 className="text-xl font-semibold mb-2">Future Bookings</h2>
//                         {futureBookings.length > 0 ? (
//                             <ul className="space-y-4">
//                                 {futureBookings.map((booking) => (
//                                     <li key={booking.booking_id} className="p-4 border rounded-md">
//                                         <strong>{booking.manufacture} {booking.model} ({booking.year})</strong>
//                                         <p>Pickup & Return Location: {booking.pickup_return_location}</p>
//                                         <p>Trip Dates: {new Date(booking.trip_start).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} - {new Date(booking.trip_end).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
//                                         <p>Status: {booking.status}</p>

//                                         {/* Cancel Booking Button */}



//                                         <button
//                                             onClick={() => handleCancelBooking(booking.booking_id)}

//                                             className="mt-2 mr-3 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
//                                         >
//                                             Cancel Booking
//                                         </button>

//                                         <button
//                                             onClick={() => toggleEditingBooking(booking.booking_id)}
//                                             className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                                         >
//                                             {editingBooking === booking.booking_id
//                                                 ? 'Close Date Editor'
//                                                 : 'Change Booking Dates'}
//                                         </button>

//                                         {/* Form to Change Dates */}
//                                         {editingBooking === booking.booking_id && (
//                                             <div className="mt-4">
//                                                 <label className="block mb-2">
//                                                     Start Date:
//                                                     <input
//                                                         type="date"
//                                                         className="block w-full mt-1 border rounded-md p-2"
//                                                         value={newDates.startDate}
//                                                         onChange={(e) =>
//                                                             setNewDates((prev) => ({
//                                                                 ...prev,
//                                                                 startDate: e.target.value,
//                                                             }))
//                                                         }
//                                                     />
//                                                 </label>
//                                                 <label className="block mb-2">
//                                                     End Date:
//                                                     <input
//                                                         type="date"
//                                                         className="block w-full mt-1 border rounded-md p-2"
//                                                         value={newDates.endDate}
//                                                         onChange={(e) =>
//                                                             setNewDates((prev) => ({
//                                                                 ...prev,
//                                                                 endDate: e.target.value,
//                                                             }))
//                                                         }
//                                                     />
//                                                 </label>
//                                                 <button
//                                                     onClick={() => handleChangeBookingDates(booking.booking_id)}
//                                                     className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
//                                                 >
//                                                     Submit New Dates
//                                                 </button>
//                                             </div>
//                                         )}
//                                         {/* <button
//                                             onClick={() => {
//                                                 const newStartDate = prompt('Enter new start date (YYYY-MM-DD):');
//                                                 const newEndDate = prompt('Enter new end date (YYYY-MM-DD):');
//                                                 if (newStartDate && newEndDate) {
//                                                     handleChangeBookingDates(booking.booking_id, newStartDate, newEndDate);
//                                                 }
//                                             }}
//                                             className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                                         >
//                                             Change Booking Dates
//                                         </button> */}


//                                     </li>
//                                 ))}
//                             </ul>
//                         ) : (
//                             <p>No future bookings available.</p>
//                         )}
//                     </div>

//                     {/* Cancelled Bookings */}
//                     <div className="mb-8">
//                         <h2 className="text-xl font-semibold mb-2">Cancelled Bookings</h2>
//                         {cancelledBookings.length > 0 ? (
//                             <ul className="space-y-4">
//                                 {cancelledBookings.map((booking) => (
//                                     <li key={booking.booking_id} className="p-4 border rounded-md">
//                                         <strong>{booking.manufacture} {booking.model} ({booking.year})</strong>
//                                         <p>Pickup & Return Location: {booking.pickup_return_location}</p>
//                                         <p>Trip Dates: {new Date(booking.trip_start).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} - {new Date(booking.trip_end).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
//                                         {/* <p>Trip Dates: {booking.trip_start} - {booking.trip_end}</p> */}
//                                         <p>Status: {booking.status}</p>
//                                     </li>
//                                 ))}
//                             </ul>
//                         ) : (
//                             <p>No cancelled bookings available.</p>
//                         )}
//                     </div>

//                     {/* Completed Bookings */}
//                     <div>
//                         <h2 className="text-xl font-semibold mb-2">Completed Bookings</h2>
//                         {completedBookings.length > 0 ? (
//                             <ul className="space-y-4">
//                                 {completedBookings.map((booking) => (
//                                     <li key={booking.booking_id} className="p-4 border rounded-md">
//                                         <strong>{booking.manufacture} {booking.model} ({booking.year})</strong>
//                                         <p>Pickup & Return Location: {booking.pickup_return_location}</p>
//                                         <p>Trip Dates: {new Date(booking.trip_start).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} - {new Date(booking.trip_end).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>

//                                         <p>Status: {booking.status}</p>



//                                         <button
//                                             onClick={() => setShowForm(!showForm)}
//                                             className="mt-2 px-4 py-2 bg-primary-color text-white rounded-md hover:bg-primary-color-100"
//                                         >
//                                         <p>
//                                             Leave a Review
//                                         </p>
//                                         </button>

//                                         {showForm && (
//                                             <form
//                                                 onSubmit={(e) => {
//                                                     e.preventDefault();
//                                                     handleReviewCreate(booking.car_id);
//                                                 }}
//                                                 className="space-y-4"
//                                             >
//                                                 <div>
//                                                     <label className="block mb-2">
//                                                         Description:
//                                                         <textarea
//                                                             className="block w-full mt-1 border rounded-md p-2"
//                                                             value={reviewData.description}
//                                                             onChange={(e) =>
//                                                                 setReviewData((prev) => ({
//                                                                     ...prev,
//                                                                     description: e.target.value,
//                                                                 }))
//                                                             }
//                                                             required
//                                                         />
//                                                     </label>
//                                                 </div>
//                                                 <div>
//                                                     <label className="block mb-2">
//                                                         Score (1-5):
//                                                         <input
//                                                             type="number"
//                                                             min="1"
//                                                             max="5"
//                                                             className="block w-full mt-1 border rounded-md p-2"
//                                                             value={reviewData.score}
//                                                             onChange={(e) =>
//                                                                 setReviewData((prev) => ({
//                                                                     ...prev,
//                                                                     score: e.target.value,
//                                                                 }))
//                                                             }
//                                                             required
//                                                         />
//                                                     </label>
//                                                 </div>
//                                                 <button
//                                                     type="submit"
//                                                     className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
//                                                 >
//                                                     Submit Review
//                                                 </button>
//                                             </form>

//                                         )}
//                                     </li>
//                                 ))}
//                             </ul>
//                         ) : (
//                             <p>No completed bookings available.</p>
//                         )}
//                     </div>
//                 </div>
//             </section>
//         </main>
//     );
// };

// export default page
'use client'


import React, { useState, useEffect } from 'react';
import { Navbar, Footer, Hero } from '@/components';  // Assuming these are correctly set up
import axios from 'axios';


// Define TypeScript interfaces for your data
interface Booking {
    booking_id: string;
    manufacture: string;
    model: string;
    year: number;
    pickup_return_location: string;
    trip_start: string;
    trip_end: string;
    status: string;
    car_id?: string; // For reviews, optional field
}

interface ReviewData {
    description: string;
    score: string;
}

interface NewDates {
    startDate: string;
    endDate: string;
}




const page = () => {
    const [futureBookings, setFutureBookings] = useState<Booking[]>([]);
    const [cancelledBookings, setCancelledBookings] = useState<Booking[]>([]);
    const [completedBookings, setCompletedBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editingBooking, setEditingBooking] = useState<string | null>(null);
    const [newDates, setNewDates] = useState<NewDates>({ startDate: '', endDate: '' });

    const [showForm, setShowForm] = useState<boolean>(false);
    const [reviewData, setReviewData] = useState<ReviewData>({
        description: '',
        score: '',
    });




    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const userID = localStorage.getItem('userId'); // Replace with actual session management logic
                if (!userID) {
                    setError("User not logged in.");
                    return;
                }

                const response = await axios.get<Booking[]>(`http://localhost:5000/api/bookings/user/${userID}`);
                const bookings = response.data;

                // Categorize bookings
                const today = new Date();
                setFutureBookings(
                    bookings.filter((booking) =>
                        new Date(booking.trip_start) > today && booking.status === 'on coming'
                    )
                );
                setCancelledBookings(bookings.filter((booking) => booking.status === 'cancelled'));
                setCompletedBookings(bookings.filter((booking) => booking.status === 'complete'));
            } catch (err) {
                console.error('Failed to fetch bookings:', err);
                // setError("Failed to fetch bookings. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleChangeBookingDates = async (booking_id : string) => {
        console.log('trip_start ', newDates.startDate, 'endDate ', newDates.endDate, 'booking_id ', booking_id)
        try {
            const response = await fetch('http://localhost:5000/api/bookings/update-dates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    booking_id,
                    newStartDate: newDates.startDate,
                    newEndDate: newDates.endDate,
                }),
            });

            if (response.ok) {
                alert('Booking dates updated successfully.');
                setFutureBookings((prevBookings) =>
                    prevBookings.map((booking) =>
                        booking.booking_id === booking_id
                            ? {
                                ...booking,
                                trip_start: newDates.startDate,
                                trip_end: newDates.endDate,
                            }
                            : booking
                    )
                );
                setEditingBooking(null); // Close the form
            } else {
                const errorData = await response.json();
                alert(`Failed to update booking dates: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error updating booking dates:', error);
            alert('An error occurred. Please try again.');
        }
    };

    const toggleEditingBooking = (booking_id : string) => {
        setEditingBooking(booking_id === editingBooking ? null : booking_id);
        setNewDates({ startDate: '', endDate: '' }); // Reset dates when toggling
    };

    const handleCancelBooking = async (booking_id : string) => {
        console.log('you are trying to cancel the following car id booking', booking_id)

        try {
            // Example API call to cancel booking
            const response = await fetch('http://localhost:5000/api/bookings/cancel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ booking_id }), // Send booking_id in the request body
            });

            if (response.ok) {
                alert('Booking cancelled successfully.');
                // Optionally, update the state to remove the cancelled booking
                setFutureBookings((prevBookings) =>
                    prevBookings.filter((booking) => booking.booking_id !== booking_id)
                );
            } else {
                const errorData = await response.json();
                alert(`Failed to cancel booking: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
            alert('An error occurred. Please try again.');
        }
    };

    const handleReviewCreate = async (carID : string) => {
        try {
            const userID = localStorage.getItem('userId'); // Replace with actual session management logic
            // const carID = 123; // Replace with the appropriate car ID context

            if (!userID) {
                alert('User not logged in.');
                return;
            }

            const { description, score } = reviewData;

            const response = await fetch('http://localhost:5000/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userID,
                    car_id: carID,
                    description,
                    score: Number(score),
                }),
            });

            if (response.ok) {
                alert('Review submitted successfully.');
                setReviewData({ description: '', score: '' }); // Reset form
            } else {
                const errorData = await response.json();
                alert(`Failed to submit review: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('An error occurred. Please try again.');
        }
    };



    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <main>
            <Navbar />
            <section className='py-16 px-20'>
                <div className='text-black'>
                    <h1 className="text-2xl font-bold mb-4">My Bookings</h1>

                    {/* Future Bookings */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">Future Bookings</h2>
                        {futureBookings.length > 0 ? (
                            <ul className="space-y-4">
                                {futureBookings.map((booking) => (
                                    <li key={booking.booking_id} className="p-4 border rounded-md">
                                        <strong>{booking.manufacture} {booking.model} ({booking.year})</strong>
                                        <p>Pickup & Return Location: {booking.pickup_return_location}</p>
                                        <p>Trip Dates: {new Date(booking.trip_start).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} - {new Date(booking.trip_end).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        <p>Status: {booking.status}</p>

                                        {/* Cancel Booking Button */}



                                        <button
                                            onClick={() => handleCancelBooking(booking.booking_id)}

                                            className="mt-2 mr-3 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                        >
                                            Cancel Booking
                                        </button>

                                        <button
                                            onClick={() => toggleEditingBooking(booking.booking_id)}
                                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                        >
                                            {editingBooking === booking.booking_id
                                                ? 'Close Date Editor'
                                                : 'Change Booking Dates'}
                                        </button>

                                        {/* Form to Change Dates */}
                                        {editingBooking === booking.booking_id && (
                                            <div className="mt-4">
                                                <label className="block mb-2">
                                                    Start Date:
                                                    <input
                                                        type="date"
                                                        className="block w-full mt-1 border rounded-md p-2"
                                                        value={newDates.startDate}
                                                        onChange={(e) =>
                                                            setNewDates((prev) => ({
                                                                ...prev,
                                                                startDate: e.target.value,
                                                            }))
                                                        }
                                                    />
                                                </label>
                                                <label className="block mb-2">
                                                    End Date:
                                                    <input
                                                        type="date"
                                                        className="block w-full mt-1 border rounded-md p-2"
                                                        value={newDates.endDate}
                                                        onChange={(e) =>
                                                            setNewDates((prev) => ({
                                                                ...prev,
                                                                endDate: e.target.value,
                                                            }))
                                                        }
                                                    />
                                                </label>
                                                <button
                                                    onClick={() => handleChangeBookingDates(booking.booking_id)}
                                                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                                >
                                                    Submit New Dates
                                                </button>
                                            </div>
                                        )}
                                        {/* <button
                                            onClick={() => {
                                                const newStartDate = prompt('Enter new start date (YYYY-MM-DD):');
                                                const newEndDate = prompt('Enter new end date (YYYY-MM-DD):');
                                                if (newStartDate && newEndDate) {
                                                    handleChangeBookingDates(booking.booking_id, newStartDate, newEndDate);
                                                }
                                            }}
                                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                        >
                                            Change Booking Dates
                                        </button> */}


                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No future bookings available.</p>
                        )}
                    </div>

                    {/* Cancelled Bookings */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">Cancelled Bookings</h2>
                        {cancelledBookings.length > 0 ? (
                            <ul className="space-y-4">
                                {cancelledBookings.map((booking) => (
                                    <li key={booking.booking_id} className="p-4 border rounded-md">
                                        <strong>{booking.manufacture} {booking.model} ({booking.year})</strong>
                                        <p>Pickup & Return Location: {booking.pickup_return_location}</p>
                                        <p>Trip Dates: {new Date(booking.trip_start).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} - {new Date(booking.trip_end).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        {/* <p>Trip Dates: {booking.trip_start} - {booking.trip_end}</p> */}
                                        <p>Status: {booking.status}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No cancelled bookings available.</p>
                        )}
                    </div>

                    {/* Completed Bookings */}
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Completed Bookings</h2>
                        {completedBookings.length > 0 ? (
                            <ul className="space-y-4">
                                {completedBookings.map((booking) => (
                                    <li key={booking.booking_id} className="p-4 border rounded-md">
                                        <strong>{booking.manufacture} {booking.model} ({booking.year})</strong>
                                        <p>Pickup & Return Location: {booking.pickup_return_location}</p>
                                        <p>Trip Dates: {new Date(booking.trip_start).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} - {new Date(booking.trip_end).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                                        <p>Status: {booking.status}</p>



                                        <button
                                            onClick={() => setShowForm(!showForm)}
                                            className="mt-2 px-4 py-2 bg-primary-color text-white rounded-md hover:bg-primary-color-100"
                                        >
                                        <p>
                                            Leave a Review
                                        </p>
                                        </button>

                                        {showForm && (
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    handleReviewCreate(booking.car_id);
                                                }}
                                                className="space-y-4"
                                            >
                                                <div>
                                                    <label className="block mb-2">
                                                        Description:
                                                        <textarea
                                                            className="block w-full mt-1 border rounded-md p-2"
                                                            value={reviewData.description}
                                                            onChange={(e) =>
                                                                setReviewData((prev) => ({
                                                                    ...prev,
                                                                    description: e.target.value,
                                                                }))
                                                            }
                                                            required
                                                        />
                                                    </label>
                                                </div>
                                                <div>
                                                    <label className="block mb-2">
                                                        Score (1-5):
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max="5"
                                                            className="block w-full mt-1 border rounded-md p-2"
                                                            value={reviewData.score}
                                                            onChange={(e) =>
                                                                setReviewData((prev) => ({
                                                                    ...prev,
                                                                    score: e.target.value,
                                                                }))
                                                            }
                                                            required
                                                        />
                                                    </label>
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                                >
                                                    Submit Review
                                                </button>
                                            </form>

                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No completed bookings available.</p>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default page