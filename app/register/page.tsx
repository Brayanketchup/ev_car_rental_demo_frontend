'use client'


import { useState } from 'react';
import axios, { AxiosError } from 'axios'; // Import AxiosError type for error handling
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const RegisterPage = () => {
    const [username, setUsername] = useState<string>('');
    const [firstName, setFirstName] = useState<string>(''); // State for first name
    const [lastName, setLastName] = useState<string>(''); // State for last name
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [role, setRole] = useState<string>('user');  // Default role is 'user'
    const [message, setMessage] = useState<string>('');
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/register', {
                username,
                firstName,
                lastName,
                email,
                password,
                role  // Send role data to backend
            });

            if (response.status === 200) {
                setMessage('Registration successful!');
                router.push('/login');  // Redirect to login page after successful registration
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setMessage(error.response?.data?.message || 'Registration failed');
            } else {
                setMessage('An unknown error occurred');
            }
        }
    };

    return (
        <main>
            <h1 className='pt-20 font-extrabold text-4xl text-center'>Welcome to CarRental</h1>
            <section id='register' className='flex flex-col items-center justify-between p-24 overflow-hidden'>

                <div className=''>
                    <h1 className=' font-bold text-xl py-3'>Register</h1>
                    <form className='flex flex-col space-y-5 bg-[#e9e9e9] py-16 px-16 rounded-lg' onSubmit={handleRegister}>
                        <input
                            className='p-1 rounded-lg'
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            className='p-1 rounded-lg'
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        <input
                            className='p-1 rounded-lg'
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                        <input
                            className='p-1 rounded-lg'
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            className='p-1 rounded-lg'
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <select
                            className='p-1 rounded-lg bg-white'
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        <button type="submit" className='p-2 text-white bg-primary-color rounded-full'>Register</button>
                    </form>
                    {message && <p>{message}</p>} {/* Display message if present */}
                    <p className='py-3'>Already have an account? <Link href='/login' className='border px-3 py-1 border-primary-color'>Login</Link></p>
                    <p className='py-3'>return to the main page <Link href='/' className='border px-3 py-1 border-primary-color'>here</Link></p>
                </div>
            </section>
        </main>
    );
};

export default RegisterPage;
