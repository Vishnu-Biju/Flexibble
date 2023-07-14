"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { categoryFilters } from "@/constants";

type Props = {
  category: string | null; // Update the type of the category prop
};
const Categories = ({ category }: Props) => {
  const router = useRouter();
  const pathName = usePathname();

  const handleTags = (item: string) => {
    router.push(`${pathName}?category=${item}`);
  };

  return (
    <div className="flexBetween w-full gap-5 flex-wrap">
      <ul className="flex gap-2 overflow-auto">
        {categoryFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => handleTags(filter)}
            className={`${
              category === filter
                ? "bg-light-white-300 font-medium"
                : "font-normal"
            } px-4 py-3 rounded-lg capitalize whitespace-nowrap`}
          >
            {filter}
          </button>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
