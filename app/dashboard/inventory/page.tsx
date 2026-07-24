'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import { AdminNavbar } from '@/components';

interface LegacyImageData {
    data: number[];
}

interface CarApiResponse {
    ID: number;
    manufacture: string;
    model: string;
    year: string | number;
    seats: number;
    doors: number;
    color: string;
    mileage: number;
    drive_type: string;
    price: number;
    description: string;
    image: LegacyImageData | null;
    status: string;
}

interface Car {
    ID: number;
    manufacture: string;
    model: string;
    year: string | number;
    seats: number;
    doors: number;
    color: string;
    mileage: number;
    drive_type: string;
    price: number;
    description: string;
    imageUrl: string | null;
    status: string;
}

interface FormValues {
    ID?: number;
    manufacture?: string;
    model?: string;
    year?: string | number;
    seats?: number;
    doors?: number;
    color?: string;
    mileage?: number;
    drive_type?: string;
    price?: number;
    description?: string;
    status?: string;
}

interface ApiMessageResponse {
    message?: string;
}

const numericFields = new Set([
    'seats',
    'doors',
    'mileage',
    'price',
]);

const getErrorMessage = (error: unknown): string => {
    return error instanceof Error
        ? error.message
        : 'An unknown error occurred.';
};

const Page = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [editingCar, setEditingCar] = useState<number | null>(null);
    const [formValues, setFormValues] = useState<FormValues>({});

    const objectUrlsRef = useRef<string[]>([]);

    const revokeObjectUrls = useCallback(() => {
        objectUrlsRef.current.forEach((url) => {
            URL.revokeObjectURL(url);
        });

        objectUrlsRef.current = [];
    }, []);

    const createImageUrl = (
        image: LegacyImageData | null
    ): string | null => {
        if (!image || !Array.isArray(image.data)) {
            return null;
        }

        const imageBlob = new Blob(
            [new Uint8Array(image.data)],
            {
                type: 'image/jpeg',
            }
        );

        const imageUrl = URL.createObjectURL(imageBlob);
        objectUrlsRef.current.push(imageUrl);

        return imageUrl;
    };

    const fetchCars = useCallback(async () => {
        setLoading(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cars/getallcars`
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to load cars: ${response.status} ${response.statusText}`
                );
            }

            const data = (await response.json()) as CarApiResponse[];

            revokeObjectUrls();

            const carsWithImages: Car[] = data.map((car) => ({
                ID: car.ID,
                manufacture: car.manufacture,
                model: car.model,
                year: car.year,
                seats: car.seats,
                doors: car.doors,
                color: car.color,
                mileage: car.mileage,
                drive_type: car.drive_type,
                price: car.price,
                description: car.description,
                imageUrl: createImageUrl(car.image),
                status: car.status,
            }));

            setCars(carsWithImages);
        } catch (error: unknown) {
            console.error(
                'Failed to fetch cars:',
                getErrorMessage(error)
            );

            alert(
                'Failed to fetch cars. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    }, [revokeObjectUrls]);

    useEffect(() => {
        void fetchCars();

        return () => {
            revokeObjectUrls();
        };
    }, [fetchCars, revokeObjectUrls]);

    const handleEditClick = (car: Car) => {
        setEditingCar(car.ID);

        setFormValues({
            ID: car.ID,
            manufacture: car.manufacture,
            model: car.model,
            year: car.year,
            seats: car.seats,
            doors: car.doors,
            color: car.color,
            mileage: car.mileage,
            drive_type: car.drive_type,
            price: car.price,
            description: car.description,
            status: car.status,
        });
    };

    const handleInputChange = (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = event.target;

        const normalizedValue =
            numericFields.has(name) && value !== ''
                ? Number(value)
                : value;

        setFormValues((currentValues) => ({
            ...currentValues,
            [name]: normalizedValue,
        }));
    };

    const handleFormSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!formValues.ID) {
            alert('Cannot update the car because its ID is missing.');
            return;
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cars/update`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formValues),
                }
            );

            const result =
                (await response.json()) as ApiMessageResponse;

            if (!response.ok) {
                throw new Error(
                    result.message || 'Failed to update car.'
                );
            }

            alert(result.message || 'Car updated successfully.');

            setEditingCar(null);
            setFormValues({});

            await fetchCars();
        } catch (error: unknown) {
            console.error(
                'Error updating car:',
                getErrorMessage(error)
            );

            alert(getErrorMessage(error));
        }
    };

    const setCarToMaintenance = async (
        carID: number
    ): Promise<void> => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/car/setmaintenance/${carID}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const result =
                (await response.json()) as ApiMessageResponse;

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        'Failed to update the car status.'
                );
            }

            alert(
                result.message ||
                    'Car moved to maintenance successfully.'
            );

            await fetchCars();
        } catch (error: unknown) {
            console.error(
                'Error updating car status:',
                getErrorMessage(error)
            );

            alert(getErrorMessage(error));
        }
    };

    return (
        <>
            <AdminNavbar />

            <main className="container mx-auto mt-10 p-5 py-16">
                <h1 className="w-full text-center text-2xl font-extrabold">
                    Inventory
                </h1>

                {loading && (
                    <p className="mt-6 text-center">
                        Loading inventory...
                    </p>
                )}

                {!loading && cars.length === 0 && (
                    <p className="mt-6 text-center">
                        No cars available.
                    </p>
                )}

                <div className="flex flex-col space-y-4">
                    {cars.map((car) => (
                        <article
                            key={car.ID}
                            className="car rounded-lg bg-white p-4"
                        >
                            <div className="w-fit">
                                <h2 className="text-xl font-bold">
                                    {car.manufacture} {car.model}{' '}
                                    ({car.year})
                                </h2>

                                <div className="h-[2px] w-full bg-orange-300" />
                            </div>

                            <ul className="flex flex-col space-y-1">
                                <li>
                                    <strong>Seats:</strong>{' '}
                                    {car.seats}
                                </li>

                                <li>
                                    <strong>Doors:</strong>{' '}
                                    {car.doors}
                                </li>

                                <li>
                                    <strong>Color:</strong>{' '}
                                    {car.color}
                                </li>

                                <li>
                                    <strong>Mileage:</strong>{' '}
                                    {car.mileage} miles
                                </li>

                                <li>
                                    <strong>Drive Type:</strong>{' '}
                                    {car.drive_type}
                                </li>

                                <li>
                                    <strong>Price:</strong>{' '}
                                    {car.price}
                                </li>

                                <li>
                                    <strong>Description:</strong>{' '}
                                    {car.description}
                                </li>

                                <li>
                                    <strong>Status:</strong>{' '}
                                    {car.status}
                                </li>
                            </ul>

                            {car.imageUrl && (
                                <div className="relative mt-4 h-72 w-full max-w-2xl overflow-hidden rounded-md">
                                    <Image
                                        src={car.imageUrl}
                                        alt={`${car.manufacture} ${car.model}`}
                                        fill
                                        unoptimized
                                        className="object-cover"
                                    />
                                </div>
                            )}

                            {car.status === 'available' && (
                                <div className="flex w-full flex-row justify-end space-x-2 pt-2">
                                    <button
                                        type="button"
                                        className="rounded-md bg-primary-color px-2 py-1 text-white"
                                        onClick={() =>
                                            handleEditClick(car)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            void setCarToMaintenance(
                                                car.ID
                                            )
                                        }
                                        className="rounded-md bg-red-600 px-2 py-1 text-white"
                                    >
                                        Set to Maintenance
                                    </button>
                                </div>
                            )}

                            {editingCar === car.ID && (
                                <form
                                    className="mt-4 space-y-2"
                                    onSubmit={handleFormSubmit}
                                >
                                    <div>
                                        <label
                                            htmlFor={`manufacture-${car.ID}`}
                                            className="block text-sm font-medium"
                                        >
                                            Manufacturer
                                        </label>

                                        <input
                                            id={`manufacture-${car.ID}`}
                                            type="text"
                                            name="manufacture"
                                            value={
                                                formValues.manufacture ??
                                                ''
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            className="w-full rounded border p-2"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor={`model-${car.ID}`}
                                            className="block text-sm font-medium"
                                        >
                                            Model
                                        </label>

                                        <input
                                            id={`model-${car.ID}`}
                                            type="text"
                                            name="model"
                                            value={
                                                formValues.model ?? ''
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            className="w-full rounded border p-2"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor={`seats-${car.ID}`}
                                            className="block text-sm font-medium"
                                        >
                                            Seats
                                        </label>

                                        <input
                                            id={`seats-${car.ID}`}
                                            type="number"
                                            name="seats"
                                            value={
                                                formValues.seats ?? ''
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            className="w-full rounded border p-2"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor={`doors-${car.ID}`}
                                            className="block text-sm font-medium"
                                        >
                                            Doors
                                        </label>

                                        <input
                                            id={`doors-${car.ID}`}
                                            type="number"
                                            name="doors"
                                            value={
                                                formValues.doors ?? ''
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            className="w-full rounded border p-2"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor={`color-${car.ID}`}
                                            className="block text-sm font-medium"
                                        >
                                            Color
                                        </label>

                                        <input
                                            id={`color-${car.ID}`}
                                            type="text"
                                            name="color"
                                            value={
                                                formValues.color ?? ''
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            className="w-full rounded border p-2"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor={`mileage-${car.ID}`}
                                            className="block text-sm font-medium"
                                        >
                                            Mileage
                                        </label>

                                        <input
                                            id={`mileage-${car.ID}`}
                                            type="number"
                                            step="0.1"
                                            name="mileage"
                                            value={
                                                formValues.mileage ??
                                                ''
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            className="w-full rounded border p-2"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor={`drive-type-${car.ID}`}
                                            className="block text-sm font-medium"
                                        >
                                            Drive Type
                                        </label>

                                        <input
                                            id={`drive-type-${car.ID}`}
                                            type="text"
                                            name="drive_type"
                                            value={
                                                formValues.drive_type ??
                                                ''
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            className="w-full rounded border p-2"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor={`price-${car.ID}`}
                                            className="block text-sm font-medium"
                                        >
                                            Price
                                        </label>

                                        <input
                                            id={`price-${car.ID}`}
                                            type="number"
                                            step="0.01"
                                            name="price"
                                            value={
                                                formValues.price ?? ''
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            className="w-full rounded border p-2"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor={`description-${car.ID}`}
                                            className="block text-sm font-medium"
                                        >
                                            Description
                                        </label>

                                        <textarea
                                            id={`description-${car.ID}`}
                                            name="description"
                                            value={
                                                formValues.description ??
                                                ''
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            className="w-full rounded border p-2"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor={`status-${car.ID}`}
                                            className="block text-sm font-medium"
                                        >
                                            Status
                                        </label>

                                        <input
                                            id={`status-${car.ID}`}
                                            type="text"
                                            name="status"
                                            value={
                                                formValues.status ?? ''
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            className="w-full rounded border p-2"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="rounded bg-blue-600 px-4 py-2 text-white"
                                    >
                                        Save
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingCar(null);
                                            setFormValues({});
                                        }}
                                        className="ml-2 rounded bg-gray-400 px-4 py-2 text-white"
                                    >
                                        Cancel
                                    </button>
                                </form>
                            )}
                        </article>
                    ))}
                </div>
            </main>
        </>
    );
};

export default Page;