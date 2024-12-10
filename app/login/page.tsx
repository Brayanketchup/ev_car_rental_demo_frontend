'use client'

// app/login/page.tsx
import { useState } from 'react';
import axios, { AxiosError } from 'axios';  // Ensure AxiosError is imported from axios
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginPage = () => {
    const [identifier, setIdentifier] = useState<string>('');  // This can be either username or email
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                identifier,  // Changed from email to identifier
                password,
            }, {
                withCredentials: true  // Assuming you are handling sessions
            });

            if (response.status === 200) {
                setMessage('Login successful!');
                const { username, userId, firstName, lastName, role } = response.data;  // Destructure both username and userId from response

                localStorage.setItem('username', username);
                localStorage.setItem('userId', userId);
                localStorage.setItem('firstName', firstName);
                localStorage.setItem('lastName', lastName);
                localStorage.setItem('role', role);

                
                if(role == 'admin'){
                    router.push('/dashboard');
                }else if(role == 'mechanic'){
                    router.push('/maintaince');
                }
                else{
                    router.push('/');  // Redirect to home/dashboard after successful login
                }

            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setMessage(error.response?.data?.message || 'Login failed');
            } else {
                setMessage('An unknown error occurred');
            }
        }
    };

    return (
        <main>
            <section id='login' className='flex flex-col items-center justify-between p-24 overflow-hidden'>
                <div className='px-16'>
                    <h1 className='font-bold text-xl py-3'>Login</h1>
                    <form className='flex flex-col space-y-5 bg-[#e9e9e9] py-16 px-16 rounded-lg ' onSubmit={handleLogin}>
                        <input
                            className='p-1 rounded-lg'
                            type="text"  // Changed type from email to text to accept either username or email
                            placeholder="Username or Email"  // Updated placeholder to reflect input can be either
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                        />
                        <input
                            className='p-1 rounded-lg'
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className='p-2 text-white bg-primary-color rounded-full'>Login</button>
                    </form>
                    {message && <p>{message}</p>}
                    <p className='py-3'><Link href='/register' className='text-primary-color'>Don't have an account yet? Sign Up</Link></p>
                </div>
                <p className='text-xs text-wrap py-10'> By logging in, you agree to CarRental Inc.'s <Link href='/' className='text-blue-600'>Terms of service and <br />  privacy policy</Link></p>
            </section>
        </main>
    );
};

export default LoginPage;
