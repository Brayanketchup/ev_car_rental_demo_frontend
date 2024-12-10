
'use client'
import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { Navbar } from '@/components';

const page = () => {
    const [userInfo, setUserInfo] = useState(null); // State to store user information
    const [loading, setLoading] = useState(true); // State to track loading
    const [error, setError] = useState(null); // State to track errors

    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);




    // localStorage.getItem('userId')
    // const user_id = 1; // Replace with dynamic ID as needed (e.g., from session or route params)
    const user_id = localStorage.getItem('userId');

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/${user_id}`);
                setUserInfo(response.data);
            } catch (err) {
                console.error('Failed to fetch user information:', err);
            }
        };

        fetchUserInfo(); // Call the async function to fetch data


        return () => {
            setUserInfo(null);
        };
    }, [user_id]);

    const [updateInfo, setUpdateInfo] = useState({
        first_name: userInfo?.first_name || '',
        last_name: userInfo?.last_name || '',
        email: userInfo?.email || '',
    });

    const [passwords, setPasswords] = useState({
        password: '',
        confirmPassword: '',
    });

    const handleUpdateInfoSubmit = async () => {
        // const user_id = localStorage.getItem('userId'); // Retrieve user ID from localStorage
        if (!user_id) {
            alert('User ID not found.');
            return;
        }

        try {
            const response = await axios.put('http://localhost:5000/api/users/update', {
                ...updateInfo,
                user_id, // Include user ID in the payload
            });
            alert(response.data.message);
            setShowUpdateForm(false);
        } catch (error) {
            console.error('Error updating user info:', error);
            alert(
                error.response?.data?.message || 'An error occurred while updating info.'
            );
        }
    };

    const handleChangePasswordSubmit = async () => {
        if (passwords.password !== passwords.confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        // const user_id = localStorage.getItem(' userId'); // Retrieve user ID from localStorage
        if (!user_id) {
            alert('User ID not found.');
            return;
        }

        try {
            const response = await axios.put('http://localhost:5000/api/users/change-password', {
                ...passwords,
                user_id, // Include user ID in the payload
            });
            alert(response.data.message);
            setShowChangePasswordForm(false);
        } catch (error) {
            console.error('Error changing password:', error);
            alert(
                error.response?.data?.message || 'An error occurred while changing password.'
            );
        }
    };



    return (
        <main>
            <Navbar />
            <section className="py-16 px-20 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">My Profile</h1>
                {userInfo ? (
                    <>
                        <p className="mb-2">
                            <strong>Username:</strong> {userInfo.username}
                        </p>
                        <p className="mb-2">
                            <strong>First Name:</strong> {userInfo.first_name}
                        </p>
                        <p className="mb-2">
                            <strong>Last Name:</strong> {userInfo.last_name}
                        </p>
                        <p className="mb-6">
                            <strong>Email:</strong> {userInfo.email}
                        </p>

                        <div className="space-y-4 space-x-2">
                            <button
                                className="px-4 py-2 bg-primary-color text-white rounded hover:bg-primary-color-100"
                                onClick={() => setShowUpdateForm(!showUpdateForm)}
                            >
                                Update My Info
                            </button>

                            {showUpdateForm && (
                                <div className="bg-gray-100 p-4 rounded shadow-md mt-4">
                                    <h2 className="text-lg font-semibold mb-2">
                                        Update Information
                                    </h2>
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleUpdateInfoSubmit();
                                        }}
                                    >
                                        <label className="block mb-2">
                                            First Name:
                                            <input
                                                type="text"
                                                value={updateInfo.first_name}
                                                onChange={(e) =>
                                                    setUpdateInfo({
                                                        ...updateInfo,
                                                        first_name: e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 border rounded mt-1"
                                            />
                                        </label>
                                        <label className="block mb-2">
                                            Last Name:
                                            <input
                                                type="text"
                                                value={updateInfo.last_name}
                                                onChange={(e) =>
                                                    setUpdateInfo({
                                                        ...updateInfo,
                                                        last_name: e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 border rounded mt-1"
                                            />
                                        </label>
                                        <label className="block mb-2">
                                            Email:
                                            <input
                                                type="email"
                                                value={updateInfo.email}
                                                onChange={(e) =>
                                                    setUpdateInfo({
                                                        ...updateInfo,
                                                        email: e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 border rounded mt-1"
                                            />
                                        </label>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4"
                                        >
                                            Save
                                        </button>
                                    </form>
                                </div>
                            )}

                            <button
                                className="px-4 py-2 bg-primary-color text-white rounded  hover:bg-primary-color-100 "
                                onClick={() => setShowChangePasswordForm(!showChangePasswordForm)}
                            >
                                Change My Password
                            </button>

                            {showChangePasswordForm && (
                                <div className="bg-gray-100 p-4 rounded shadow-md mt-4">
                                    <h2 className="text-lg font-semibold mb-2">
                                        Change Password
                                    </h2>
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleChangePasswordSubmit();
                                        }}
                                    >
                                        <label className="block mb-2">
                                            New Password:
                                            <input
                                                type="password"
                                                value={passwords.password}
                                                onChange={(e) =>
                                                    setPasswords({
                                                        ...passwords,
                                                        password: e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 border rounded mt-1"
                                            />
                                        </label>
                                        <label className="block mb-2">
                                            Confirm Password:
                                            <input
                                                type="password"
                                                value={passwords.confirmPassword}
                                                onChange={(e) =>
                                                    setPasswords({
                                                        ...passwords,
                                                        confirmPassword: e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 border rounded mt-1"
                                            />
                                        </label>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4"
                                        >
                                            Change Password
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <p>No user information found.</p>
                )}
            </section>
        </main>


    );
};
export default page