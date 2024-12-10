import { CarProps, FilterProps } from "@/types";


export async function fetchCars(filters : FilterProps) {
  const { manufacturer, model, limit } = filters;

    const headers = {
		'X-RapidAPI-Key': '77e0ba7236mshcff3b078dc3937cp1d8eefjsnb04d71d3088c',
		'X-RapidAPI-Host': 'cars-by-api-ninjas.p.rapidapi.com'
	}
    const response = await fetch (`https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?make=${manufacturer}&model=${model}&limit=${limit}`, { headers: headers,});
    const result = await response.json();
    return result;
}

export const calculateCarRent = (city_mpg: number, year: number) => {
    const currentYear: number = new Date().getFullYear();
    const age: number = currentYear - year;
    const mileageAdjustment: number = Math.floor(city_mpg / 10000);
  
    const basePrice: number = 120;
    const ageDiscount: number = age * 5;
    const mileageDiscount: number = mileageAdjustment * 2;
  
    const price: number = basePrice - ageDiscount - mileageDiscount;
    console.log('price' ,price);
    return Math.max(price, 25);
  };

  export const updateSearchParams = (type: string, value: string) => {
    // Get the current URL search params
    const searchParams = new URLSearchParams(window.location.search);
  
    // Set the specified search parameter to the given value
    searchParams.set(type, value);
  
    // Set the specified search parameter to the given value
    const newPathname = `${window.location.pathname}?${searchParams.toString()}`;
  
    return newPathname;
  };


  export const getCarImage = (car: CarProps) => {
    const url = new URL("https://cdn.imagin.studio/getimage");
    const { make, model, year } = car;
  
    url.searchParams.append('customer', 'hrjavascript-mastery' || '');
    url.searchParams.append('make', make);
    url.searchParams.append('modelFamily', model.split(" ")[0]);
    url.searchParams.append('zoomType', 'fullscreen');
    url.searchParams.append('modelYear', `${year}`);
  
    return `${url }`;
  } 



  