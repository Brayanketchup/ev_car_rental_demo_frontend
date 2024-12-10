

'use client';
import React, { useEffect, useState } from 'react';
import { AdminNavbar } from '@/components';


interface Ticket {
    ticket_id: number;
    description: string;
    user_id: number;
    time_created: Date;
    status: 'done' | 'todo';
}

const Page = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);

    const fetchTickets = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/getalltickets');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTickets(data);
        } catch (error) {
            console.error('Failed to fetch tickets:', error);
            alert('Failed to fetch tickets. Please try again later.');
        }
    };

    const setTicketToDone = async (ticketID: number): Promise<void> => {
        try {
            const response = await fetch(`http://localhost:5000/api/ticketdone/${ticketID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to update ticket status: ${errorData.message || response.statusText}`);
            }

            alert('Ticket status updated successfully!');
            fetchTickets(); // Refresh the ticket list after updating status
        } catch (error: any) {
            console.error('Error updating ticket status:', error.message);
            alert(`Error: ${error.message}`);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    return (
        <>

            <AdminNavbar />
            <div className="container mx-auto mt-10 p-5 py-16">
                <h1 className="text-2xl font-extrabold w-full text-center mb-5">To-Do List</h1>
                <div className="grid gap-4">
                    {tickets.length > 0 ? (
                        tickets.map((ticket) => (
                            <div
                                key={ticket.ticket_id}
                                className="border border-gray-300 shadow-sm p-4 rounded-lg bg-white"
                            >
                                <h2 className="font-bold text-lg">Ticket ID: {ticket.ticket_id}</h2>
                                <p className="text-gray-700">Description: {ticket.description}</p>
                                <p className="text-gray-600">
                                    Created At: {new Date(ticket.time_created).toLocaleString()}
                                </p>
                                <p
                                    className={`text-sm font-semibold ${ticket.status === 'done' ? 'text-green-600' : 'text-red-600'
                                        }`}
                                >
                                    Status: {ticket.status}
                                </p>
                                {ticket.status === 'todo' && (
                                    <button
                                        onClick={() => setTicketToDone(ticket.ticket_id)}
                                        className="px-2 py-1 text-white rounded-md bg-green-600"
                                    >
                                        Mark as Done
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No tickets available.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Page;
