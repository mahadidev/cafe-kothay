import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <div className="flex items-center gap-1 p-1 h-full min-w-max">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onSelectCategory(cat)}
          className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
            activeCategory === cat 
            ? 'bg-[#5E6AD2] text-white shadow-lg shadow-[#5E6AD2]/20' 
            : 'text-[#555] hover:text-white hover:bg-white/5'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};