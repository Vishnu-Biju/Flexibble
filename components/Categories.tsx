"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { categoryFilters } from '@/constants';

type CategoriesProps = {
  category: string | null;
  onCategoryChange: (selectedCategory: string | null) => void;
};

const Categories: React.FC<CategoriesProps> = ({ category, onCategoryChange }) => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const handleTags = (item: string) => {
    onCategoryChange(item);
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
              category === filter ? 'bg-light-white-300 font-medium' : 'font-normal'
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
