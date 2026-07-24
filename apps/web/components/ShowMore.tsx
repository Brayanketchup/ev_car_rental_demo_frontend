"use client";

import { useRouter } from "next/navigation";
import { ShowMoreProps } from "@/types";
import { updateSearchParams } from "@/utils/apiUtils";

export const ShowMore = ({ pageNumber, isNext }: ShowMoreProps) => {
  const router = useRouter();

  const handleNavigation = () => {
    // Calculate the new limit based on the page number and navigation type
    const newLimit = (pageNumber + 1) * 10;

    // Update the "limit" search parameter in the URL with the new value
    const newPathname = updateSearchParams("limit", `${newLimit}`);
    
    router.push(newPathname,{scroll:false});
  };

  return (
    
    <div className="w-full flex items-center justify-center gap-5 mt-10">
      {!isNext && (
        <button
          type="button"
          className="bg-primary-color rounded-full text-white flex flex-row relative justify-center items-center py-3 px-6 outline-none button-shodow"
          onClick={handleNavigation}
        >Show More</button>
      )}
    </div>
  );
};

