'use client';

import Image from 'next/image';

export const Hero = () => {
  return (
    <div className="hero min-h-[100vh]">
      <div className="flex-1 px-6 pt-24">
        <h1 className="text-[50px] font-extrabold sm:text-[64px] 2xl:text-[72px]">
          <span className="text-primary-color">Looking</span> to rent a car
        </h1>

        <p className="mt-5 text-[27px] font-light text-black-100">
          Find the perfect electric vehicle for your needs. From luxury EVs
          to economy options, with unbeatable prices, extended range, and
          eco-friendly features.
        </p>

        <a
          href="#Cars"
          className="button-shodow round-button mt-10 bg-primary-color p-2 text-white"
        >
          <span className="flex flex-row items-center text-center">
            Explore cars
          </span>
        </a>
      </div>

      <div className="flex w-full items-end justify-end xl:h-screen xl:flex-[1.5]">
        <div className="hero-img">
          <Image
            src="/hero.png"
            alt="Electric rental vehicle"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};