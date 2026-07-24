'use client';

import axios from 'axios';
import Link from 'next/link';
import {
    useEffect,
    useState,
    type ChangeEvent,
} from 'react';

import { Hero, Navbar } from '@/components';
import { manufacturersData } from '@/constants';

interface LegacyImageData {
    data: number[];
}

interface CarSearchResult {
    ID: number;
    manufacture: string;
    model: string;
    year: string | number;
    price: number;
    description?: string | null;
    image: LegacyImageData | null;
}

interface SearchParams {
    manufacture: string;
    model: string;
    year: string;
    price: string;
}

type SearchFieldName = keyof SearchParams;

const manufacturerModels =
    manufacturersData as Record<string, string[]>;

const createLegacyImageDataUrl = (
    image: LegacyImageData | null
): string | null => {
    if (!image || !Array.isArray(image.data)) {
        return null;
    }

    const bytes = new Uint8Array(image.data);

    let binaryString = '';

    bytes.forEach((byte) => {
        binaryString += String.fromCharCode(byte);
    });

    return `data:image/jpeg;base64,${window.btoa(binaryString)}`;
};

export default function Home() {
    const [carResults, setCarResults] = useState<
        CarSearchResult[]
    >([]);

    const [searchParams, setSearchParams] =
        useState<SearchParams>({
            manufacture: '',
            model: '',
            year: '',
            price: '',
        });

    const [isLoading, setIsLoading] =
        useState<boolean>(false);

    const [error, setError] = useState<string>('');
    const [models, setModels] = useState<string[]>([]);

    useEffect(() => {
        const selectedModels =
            manufacturerModels[
                searchParams.manufacture
            ] ?? [];

        setModels(selectedModels);

        setSearchParams((currentParams) => {
            if (
                !currentParams.model ||
                selectedModels.includes(
                    currentParams.model
                )
            ) {
                return currentParams;
            }

            return {
                ...currentParams,
                model: '',
            };
        });
    }, [searchParams.manufacture]);

    const handleInputChange = (
        event: ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) => {
        const name =
            event.target.name as SearchFieldName;
        const value = event.target.value;

        setSearchParams((currentParams) => ({
            ...currentParams,
            [name]: value,
        }));
    };

    const handleSearch = async (): Promise<void> => {
        const apiBaseUrl =
            process.env.NEXT_PUBLIC_API_BASE_URL;

        if (!apiBaseUrl) {
            setError(
                'The API address is not configured.'
            );
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response =
                await axios.get<CarSearchResult[]>(
                    `${apiBaseUrl}/api/cars/search`,
                    {
                        params: searchParams,
                    }
                );

            setCarResults(response.data);
        } catch (requestError: unknown) {
            console.error(
                'Failed to fetch cars:',
                requestError
            );

            setError(
                'Failed to fetch cars. Please try again later.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <Navbar />
            <Hero />

            <section
                id="Cars"
                className="container mx-auto p-6 md:p-12 lg:p-24"
            >
                <h1 className="text-center text-4xl font-extrabold">
                    Car Catalogue
                </h1>

                <div className="search-form mx-auto my-8 max-w-md">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="manufacture"
                                className="mb-1 block text-sm font-medium"
                            >
                                Manufacturer
                            </label>

                            <select
                                id="manufacture"
                                className="form-select w-full rounded-md border border-gray-300 p-2"
                                name="manufacture"
                                value={
                                    searchParams.manufacture
                                }
                                onChange={
                                    handleInputChange
                                }
                            >
                                <option value="">
                                    Select Manufacturer
                                </option>

                                {Object.keys(
                                    manufacturerModels
                                ).map(
                                    (manufacturer) => (
                                        <option
                                            key={
                                                manufacturer
                                            }
                                            value={
                                                manufacturer
                                            }
                                        >
                                            {
                                                manufacturer
                                            }
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="model"
                                className="mb-1 block text-sm font-medium"
                            >
                                Model
                            </label>

                            <select
                                id="model"
                                className="form-select w-full rounded-md border border-gray-300 p-2"
                                name="model"
                                value={
                                    searchParams.model
                                }
                                onChange={
                                    handleInputChange
                                }
                                disabled={
                                    !searchParams.manufacture
                                }
                            >
                                <option value="">
                                    Select Model
                                </option>

                                {models.map((model) => (
                                    <option
                                        key={model}
                                        value={model}
                                    >
                                        {model}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="year"
                                className="mb-1 block text-sm font-medium"
                            >
                                Year
                            </label>

                            <input
                                id="year"
                                type="number"
                                className="form-input w-full rounded-md border border-gray-300 p-2"
                                name="year"
                                value={searchParams.year}
                                onChange={
                                    handleInputChange
                                }
                                placeholder="Year"
                                min="1900"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="price"
                                className="mb-1 block text-sm font-medium"
                            >
                                Maximum Price
                            </label>

                            <input
                                id="price"
                                type="number"
                                className="form-input w-full rounded-md border border-gray-300 p-2"
                                name="price"
                                value={searchParams.price}
                                onChange={
                                    handleInputChange
                                }
                                placeholder="Max price"
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={() =>
                                void handleSearch()
                            }
                            disabled={isLoading}
                            className="w-full rounded-md bg-primary-color p-3 text-white hover:bg-primary-color-100 disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                            {isLoading
                                ? 'Searching...'
                                : 'Search'}
                        </button>
                    </div>
                </div>

                {error && (
                    <p className="text-center text-red-500">
                        {error}
                    </p>
                )}

                {!isLoading &&
                    !error &&
                    carResults.length === 0 && (
                        <p className="text-center text-gray-600">
                            Search the catalogue to find
                            available cars.
                        </p>
                    )}

                <div className="cars-list mt-8 space-y-4">
                    {carResults.map((car) => {
                        const imageUrl =
                            createLegacyImageDataUrl(
                                car.image
                            );

                        return (
                            <article
                                key={car.ID}
                                className="car-details flex flex-col rounded-lg bg-gray-100 p-6"
                            >
                                <h2 className="text-2xl font-bold">
                                    {car.manufacture}{' '}
                                    {car.model} - {car.year}
                                </h2>

                                <p>
                                    ${car.price} / day
                                </p>

                                {imageUrl && (
                                    <img
                                        src={imageUrl}
                                        alt={`${car.manufacture} ${car.model}`}
                                        className="mt-4 h-[550px] w-full rounded-md object-cover"
                                    />
                                )}

                                <Link
                                    href={`/carinfo/${car.ID}`}
                                    className="mt-4 w-fit rounded-md bg-primary-color p-2 text-white hover:bg-primary-color-100"
                                >
                                    Show More
                                </Link>
                            </article>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}