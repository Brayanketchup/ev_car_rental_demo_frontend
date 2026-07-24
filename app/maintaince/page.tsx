'use client';

import Image from 'next/image';
import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import { MechanicNavbar } from '@/components';

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

interface ApiMessageResponse {
    message?: string;
}

const getErrorMessage = (error: unknown): string => {
    return error instanceof Error
        ? error.message
        : 'An unknown error occurred.';
};

const Page = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const imageUrlsRef = useRef<string[]>([]);

    const revokeImageUrls = useCallback(() => {
        imageUrlsRef.current.forEach((url) => {
            URL.revokeObjectURL(url);
        });

        imageUrlsRef.current = [];
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
        imageUrlsRef.current.push(imageUrl);

        return imageUrl;
    };

    const fetchCars = useCallback(async (): Promise<void> => {
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

            const data =
                (await response.json()) as CarApiResponse[];

            revokeImageUrls();

            const carsWithImages: Car[] = data.map(
                ({ image, ...car }) => ({
                    ...car,
                    imageUrl: createImageUrl(image),
                })
            );

            setCars(carsWithImages);
        } catch (error: unknown) {
            const message = getErrorMessage(error);

            console.error('Failed to fetch cars:', message);
            alert(
                'Failed to fetch cars. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    }, [revokeImageUrls]);

    useEffect(() => {
        void fetchCars();

        return () => {
            revokeImageUrls();
        };
    }, [fetchCars, revokeImageUrls]);

    const setCarToAvailable = async (
        carID: number
    ): Promise<void> => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/car/setavaliable/${carID}`,
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
                    'Car returned to service successfully.'
            );

            await fetchCars();
        } catch (error: unknown) {
            const message = getErrorMessage(error);

            console.error(
                'Error updating car status:',
                message
            );

            alert(`Error: ${message}`);
        }
    };

    const maintenanceCars = cars.filter(
        (car) => car.status === 'maintenance'
    );

    return (
        <>
            <MechanicNavbar />

            <main className="container mx-auto mt-10 p-5 py-16">
                <h1 className="w-full text-center text-2xl font-extrabold">
                    Maintenance Cars
                </h1>

                {loading && (
                    <p className="mt-6 text-center">
                        Loading maintenance vehicles...
                    </p>
                )}

                {!loading &&
                    maintenanceCars.length === 0 && (
                        <p className="mt-6 text-center">
                            No cars under maintenance.
                        </p>
                    )}

                <div className="flex flex-col space-y-4">
                    {maintenanceCars.map((car) => (
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

                            <button
                                type="button"
                                onClick={() =>
                                    void setCarToAvailable(
                                        car.ID
                                    )
                                }
                                className="mt-4 rounded-md bg-green-600 px-2 py-1 text-white"
                            >
                                Set to Available
                            </button>
                        </article>
                    ))}
                </div>
            </main>
        </>
    );
};

export default Page;