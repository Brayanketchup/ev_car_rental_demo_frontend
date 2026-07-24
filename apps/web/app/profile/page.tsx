'use client';

import axios from 'axios';
import {
    useEffect,
    useState,
    type FormEvent,
} from 'react';

import { Navbar } from '@/components';

interface UserInfo {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
}

interface UpdateInfo {
    first_name: string;
    last_name: string;
    email: string;
}

interface PasswordForm {
    password: string;
    confirmPassword: string;
}

interface ApiMessageResponse {
    message?: string;
}

const initialUpdateInfo: UpdateInfo = {
    first_name: '',
    last_name: '',
    email: '',
};

const initialPasswords: PasswordForm = {
    password: '',
    confirmPassword: '',
};

const getRequestErrorMessage = (
    error: unknown,
    fallbackMessage: string
): string => {
    if (
        axios.isAxiosError<ApiMessageResponse>(error)
    ) {
        return (
            error.response?.data?.message ??
            fallbackMessage
        );
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallbackMessage;
};

const Page = () => {
    const [userId, setUserId] =
        useState<string | null>(null);

    const [userInfo, setUserInfo] =
        useState<UserInfo | null>(null);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const [showUpdateForm, setShowUpdateForm] =
        useState<boolean>(false);

    const [
        showChangePasswordForm,
        setShowChangePasswordForm,
    ] = useState<boolean>(false);

    const [updateInfo, setUpdateInfo] =
        useState<UpdateInfo>(initialUpdateInfo);

    const [passwords, setPasswords] =
        useState<PasswordForm>(initialPasswords);

    useEffect(() => {
        let isMounted = true;

        const fetchUserInfo = async (): Promise<void> => {
            const storedUserId =
                window.localStorage.getItem('userId');

            if (!storedUserId) {
                if (isMounted) {
                    setError('User ID not found.');
                    setLoading(false);
                }

                return;
            }

            const apiBaseUrl =
                process.env.NEXT_PUBLIC_API_BASE_URL;

            if (!apiBaseUrl) {
                if (isMounted) {
                    setError(
                        'The API address is not configured.'
                    );
                    setLoading(false);
                }

                return;
            }

            setUserId(storedUserId);

            try {
                const response =
                    await axios.get<UserInfo>(
                        `${apiBaseUrl}/api/users/${storedUserId}`
                    );

                if (!isMounted) {
                    return;
                }

                setUserInfo(response.data);

                setUpdateInfo({
                    first_name:
                        response.data.first_name,
                    last_name:
                        response.data.last_name,
                    email: response.data.email,
                });
            } catch (requestError: unknown) {
                if (!isMounted) {
                    return;
                }

                const message =
                    getRequestErrorMessage(
                        requestError,
                        'Failed to fetch user information.'
                    );

                console.error(
                    'Failed to fetch user information:',
                    message
                );

                setError(message);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        void fetchUserInfo();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleUpdateInfoSubmit = async (
        event: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        event.preventDefault();

        if (!userId) {
            alert('User ID not found.');
            return;
        }

        const apiBaseUrl =
            process.env.NEXT_PUBLIC_API_BASE_URL;

        if (!apiBaseUrl) {
            alert('The API address is not configured.');
            return;
        }

        try {
            const response =
                await axios.put<ApiMessageResponse>(
                    `${apiBaseUrl}/api/users/update`,
                    {
                        ...updateInfo,
                        user_id: userId,
                    }
                );

            setUserInfo((currentUser) => {
                if (!currentUser) {
                    return currentUser;
                }

                return {
                    ...currentUser,
                    ...updateInfo,
                };
            });

            alert(
                response.data.message ??
                    'Profile updated successfully.'
            );

            setShowUpdateForm(false);
        } catch (requestError: unknown) {
            const message =
                getRequestErrorMessage(
                    requestError,
                    'An error occurred while updating your information.'
                );

            console.error(
                'Error updating user information:',
                message
            );

            alert(message);
        }
    };

    const handleChangePasswordSubmit = async (
        event: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        event.preventDefault();

        if (
            passwords.password !==
            passwords.confirmPassword
        ) {
            alert('Passwords do not match.');
            return;
        }

        if (!passwords.password) {
            alert('Password is required.');
            return;
        }

        if (!userId) {
            alert('User ID not found.');
            return;
        }

        const apiBaseUrl =
            process.env.NEXT_PUBLIC_API_BASE_URL;

        if (!apiBaseUrl) {
            alert('The API address is not configured.');
            return;
        }

        try {
            const response =
                await axios.put<ApiMessageResponse>(
                    `${apiBaseUrl}/api/users/change-password`,
                    {
                        password: passwords.password,
                        confirmPassword:
                            passwords.confirmPassword,
                        user_id: userId,
                    }
                );

            alert(
                response.data.message ??
                    'Password changed successfully.'
            );

            setPasswords(initialPasswords);
            setShowChangePasswordForm(false);
        } catch (requestError: unknown) {
            const message =
                getRequestErrorMessage(
                    requestError,
                    'An error occurred while changing your password.'
                );

            console.error(
                'Error changing password:',
                message
            );

            alert(message);
        }
    };

    return (
        <main>
            <Navbar />

            <section className="mx-auto max-w-4xl px-6 py-16 md:px-20">
                <h1 className="mb-6 text-3xl font-bold">
                    My Profile
                </h1>

                {loading && (
                    <p>Loading profile...</p>
                )}

                {!loading && error && (
                    <p className="text-red-600">
                        {error}
                    </p>
                )}

                {!loading &&
                    !error &&
                    !userInfo && (
                        <p>
                            No user information found.
                        </p>
                    )}

                {!loading && userInfo && (
                    <>
                        <p className="mb-2">
                            <strong>Username:</strong>{' '}
                            {userInfo.username}
                        </p>

                        <p className="mb-2">
                            <strong>
                                First Name:
                            </strong>{' '}
                            {userInfo.first_name}
                        </p>

                        <p className="mb-2">
                            <strong>Last Name:</strong>{' '}
                            {userInfo.last_name}
                        </p>

                        <p className="mb-6">
                            <strong>Email:</strong>{' '}
                            {userInfo.email}
                        </p>

                        <div className="space-y-4">
                            <button
                                type="button"
                                className="rounded bg-primary-color px-4 py-2 text-white hover:bg-primary-color-100"
                                onClick={() =>
                                    setShowUpdateForm(
                                        (current) =>
                                            !current
                                    )
                                }
                            >
                                Update My Info
                            </button>

                            {showUpdateForm && (
                                <div className="mt-4 rounded bg-gray-100 p-4 shadow-md">
                                    <h2 className="mb-2 text-lg font-semibold">
                                        Update Information
                                    </h2>

                                    <form
                                        onSubmit={
                                            handleUpdateInfoSubmit
                                        }
                                    >
                                        <div className="mb-2">
                                            <label
                                                htmlFor="first-name"
                                                className="block"
                                            >
                                                First Name
                                            </label>

                                            <input
                                                id="first-name"
                                                type="text"
                                                value={
                                                    updateInfo.first_name
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setUpdateInfo(
                                                        (
                                                            current
                                                        ) => ({
                                                            ...current,
                                                            first_name:
                                                                event
                                                                    .target
                                                                    .value,
                                                        })
                                                    )
                                                }
                                                className="mt-1 w-full rounded border px-3 py-2"
                                            />
                                        </div>

                                        <div className="mb-2">
                                            <label
                                                htmlFor="last-name"
                                                className="block"
                                            >
                                                Last Name
                                            </label>

                                            <input
                                                id="last-name"
                                                type="text"
                                                value={
                                                    updateInfo.last_name
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setUpdateInfo(
                                                        (
                                                            current
                                                        ) => ({
                                                            ...current,
                                                            last_name:
                                                                event
                                                                    .target
                                                                    .value,
                                                        })
                                                    )
                                                }
                                                className="mt-1 w-full rounded border px-3 py-2"
                                            />
                                        </div>

                                        <div className="mb-2">
                                            <label
                                                htmlFor="email"
                                                className="block"
                                            >
                                                Email
                                            </label>

                                            <input
                                                id="email"
                                                type="email"
                                                value={
                                                    updateInfo.email
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setUpdateInfo(
                                                        (
                                                            current
                                                        ) => ({
                                                            ...current,
                                                            email:
                                                                event
                                                                    .target
                                                                    .value,
                                                        })
                                                    )
                                                }
                                                className="mt-1 w-full rounded border px-3 py-2"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                                        >
                                            Save
                                        </button>
                                    </form>
                                </div>
                            )}

                            <div>
                                <button
                                    type="button"
                                    className="rounded bg-primary-color px-4 py-2 text-white hover:bg-primary-color-100"
                                    onClick={() =>
                                        setShowChangePasswordForm(
                                            (
                                                current
                                            ) =>
                                                !current
                                        )
                                    }
                                >
                                    Change My Password
                                </button>
                            </div>

                            {showChangePasswordForm && (
                                <div className="mt-4 rounded bg-gray-100 p-4 shadow-md">
                                    <h2 className="mb-2 text-lg font-semibold">
                                        Change Password
                                    </h2>

                                    <form
                                        onSubmit={
                                            handleChangePasswordSubmit
                                        }
                                    >
                                        <div className="mb-2">
                                            <label
                                                htmlFor="new-password"
                                                className="block"
                                            >
                                                New Password
                                            </label>

                                            <input
                                                id="new-password"
                                                type="password"
                                                value={
                                                    passwords.password
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setPasswords(
                                                        (
                                                            current
                                                        ) => ({
                                                            ...current,
                                                            password:
                                                                event
                                                                    .target
                                                                    .value,
                                                        })
                                                    )
                                                }
                                                className="mt-1 w-full rounded border px-3 py-2"
                                            />
                                        </div>

                                        <div className="mb-2">
                                            <label
                                                htmlFor="confirm-password"
                                                className="block"
                                            >
                                                Confirm Password
                                            </label>

                                            <input
                                                id="confirm-password"
                                                type="password"
                                                value={
                                                    passwords.confirmPassword
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setPasswords(
                                                        (
                                                            current
                                                        ) => ({
                                                            ...current,
                                                            confirmPassword:
                                                                event
                                                                    .target
                                                                    .value,
                                                        })
                                                    )
                                                }
                                                className="mt-1 w-full rounded border px-3 py-2"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                                        >
                                            Change Password
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </section>
        </main>
    );
};

export default Page;