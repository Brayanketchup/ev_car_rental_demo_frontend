'use client';

import Link from 'next/link';
import {
    useState,
    type ChangeEvent,
    type FormEvent,
} from 'react';

import { AdminNavbar } from '@/components';

interface CarFormData {
    manufacturer: string;
    model: string;
    year: string;
    seats: string;
    doors: string;
    color: string;
    mileage: string;
    driveType: string;
    price: string;
    description: string;
    status: string;
    image: File | null;
}

interface ApiResponse {
    message?: string;
}

type TextFieldName = Exclude<keyof CarFormData, 'image'>;

const initialCarData: CarFormData = {
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
    status: 'available',
    image: null,
};

const getErrorMessage = (error: unknown): string => {
    return error instanceof Error
        ? error.message
        : 'An unknown error occurred.';
};

const Page = () => {
    const [carData, setCarData] =
        useState<CarFormData>(initialCarData);

    const [showForm, setShowForm] = useState<boolean>(false);
    const [submitting, setSubmitting] =
        useState<boolean>(false);

    const handleChange = (
        event: ChangeEvent<
            HTMLInputElement |
            HTMLSelectElement |
            HTMLTextAreaElement
        >
    ) => {
        const name = event.target.name as TextFieldName;
        const value = event.target.value;

        setCarData((currentData) => ({
            ...currentData,
            [name]: value,
        }));
    };

    const handleChangeFile = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0] ?? null;

        setCarData((currentData) => ({
            ...currentData,
            image: file,
        }));
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        setSubmitting(true);

        const formData = new FormData();

        formData.append(
            'manufacturer',
            carData.manufacturer
        );
        formData.append('model', carData.model);
        formData.append('year', carData.year);
        formData.append('seats', carData.seats);
        formData.append('doors', carData.doors);
        formData.append('color', carData.color);
        formData.append('mileage', carData.mileage);
        formData.append('driveType', carData.driveType);
        formData.append('price', carData.price);
        formData.append(
            'description',
            carData.description
        );
        formData.append('status', carData.status);

        if (carData.image) {
            formData.append('image', carData.image);
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cars/add`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const result =
                (await response.json()) as ApiResponse;

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    'Failed to add the car.'
                );
            }

            alert(
                result.message ||
                'Car added successfully!'
            );

            setCarData(initialCarData);
            setShowForm(false);
        } catch (error: unknown) {
            const message = getErrorMessage(error);

            console.error('Error adding car:', message);
            alert(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <AdminNavbar />

            <main className="mx-auto min-h-screen w-full max-w-xl p-5 py-14">
                <h1 className="font-bold">
                    Welcome to the Admin Dashboard
                </h1>

                <div className="mt-4 flex flex-row flex-wrap gap-4">
                    <Link
                        href="/dashboard/inventory"
                        className="rounded bg-primary-color px-4 py-2 font-bold text-white hover:bg-primary-color-100 focus:outline-none focus:shadow-outline"
                    >
                        Go to Inventory
                    </Link>

                    <Link
                        href="/dashboard/tickets"
                        className="rounded bg-primary-color px-4 py-2 font-bold text-white hover:bg-primary-color-100 focus:outline-none focus:shadow-outline"
                    >
                        Tickets
                    </Link>

                    <button
                        type="button"
                        onClick={() =>
                            setShowForm((current) => !current)
                        }
                        className="rounded bg-primary-color px-4 py-2 font-bold text-white hover:bg-primary-color-100 focus:outline-none focus:shadow-outline"
                    >
                        {showForm
                            ? 'Close Form'
                            : 'Add New Car'}
                    </button>
                </div>

                {showForm && (
                    <form
                        onSubmit={handleSubmit}
                        className="mt-4 rounded bg-white px-8 pb-8 pt-6 shadow-md"
                    >
                        <h2 className="mb-2 text-lg font-bold text-gray-700">
                            Add New Car
                        </h2>

                        <div className="mb-4">
                            <label
                                htmlFor="manufacturer"
                                className="mb-2 block text-sm font-bold text-gray-700"
                            >
                                Manufacturer
                            </label>

                            <input
                                id="manufacturer"
                                type="text"
                                name="manufacturer"
                                value={carData.manufacturer}
                                onChange={handleChange}
                                required
                                className="w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="model"
                                className="mb-2 block text-sm font-bold text-gray-700"
                            >
                                Model
                            </label>

                            <input
                                id="model"
                                type="text"
                                name="model"
                                value={carData.model}
                                onChange={handleChange}
                                required
                                className="w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="year"
                                className="mb-2 block text-sm font-bold text-gray-700"
                            >
                                Year
                            </label>

                            <input
                                id="year"
                                type="number"
                                name="year"
                                value={carData.year}
                                onChange={handleChange}
                                required
                                className="w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="seats"
                                className="mb-2 block text-sm font-bold text-gray-700"
                            >
                                Seats
                            </label>

                            <input
                                id="seats"
                                type="number"
                                name="seats"
                                value={carData.seats}
                                onChange={handleChange}
                                required
                                className="w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="doors"
                                className="mb-2 block text-sm font-bold text-gray-700"
                            >
                                Doors
                            </label>

                            <input
                                id="doors"
                                type="number"
                                name="doors"
                                value={carData.doors}
                                onChange={handleChange}
                                required
                                className="w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="color"
                                className="mb-2 block text-sm font-bold text-gray-700"
                            >
                                Color
                            </label>

                            <input
                                id="color"
                                type="text"
                                name="color"
                                value={carData.color}
                                onChange={handleChange}
                                required
                                className="w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="mileage"
                                className="mb-2 block text-sm font-bold text-gray-700"
                            >
                                Mileage
                            </label>

                            <input
                                id="mileage"
                                type="number"
                                name="mileage"
                                value={carData.mileage}
                                onChange={handleChange}
                                required
                                className="w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="driveType"
                                className="mb-2 block text-sm font-bold text-gray-700"
                            >
                                Drive Type
                            </label>

                            <select
                                id="driveType"
                                name="driveType"
                                value={carData.driveType}
                                onChange={handleChange}
                                required
                                className="w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none focus:shadow-outline"
                            >
                                <option value="" disabled>
                                    Select Drive Type
                                </option>
                                <option value="AWD">AWD</option>
                                <option value="RWD">RWD</option>
                                <option value="FWD">FWD</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="price"
                                className="mb-2 block text-sm font-bold text-gray-700"
                            >
                                Price
                            </label>

                            <input
                                id="price"
                                type="number"
                                step="0.01"
                                name="price"
                                value={carData.price}
                                onChange={handleChange}
                                required
                                className="w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="description"
                                className="mb-2 block text-sm font-bold text-gray-700"
                            >
                                Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={carData.description}
                                onChange={handleChange}
                                required
                                className="w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="image"
                                className="mb-2 block text-sm font-bold text-gray-700"
                            >
                                Car Image
                            </label>

                            <input
                                id="image"
                                type="file"
                                name="image"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleChangeFile}
                                className="w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting
                                ? 'Adding Car...'
                                : 'Add Car'}
                        </button>
                    </form>
                )}
            </main>
        </>
    );
};

export default Page;