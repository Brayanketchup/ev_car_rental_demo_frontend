'use client';

import dynamic from 'next/dynamic';

import { Navbar } from '@/components';

const ChargingMap = dynamic(
    () => import('./ChargingMap'),
    {
        ssr: false,
        loading: () => (
            <div className="flex h-[60vh] items-center justify-center">
                <p>Loading charging-station map...</p>
            </div>
        ),
    }
);

const ChargingPointsPage = () => {
    return (
        <>
            <Navbar />
            <ChargingMap />
        </>
    );
};

export default ChargingPointsPage;