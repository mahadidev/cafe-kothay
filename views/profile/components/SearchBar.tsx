import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="relative h-full flex items-center">
      <div className="absolute left-4 text-[#333]">
        <Search size={14} strokeWidth={3} />
      </div>
      <input 
        type="text" 
        placeholder="Search for a dish..." 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-none rounded-none py-3 pl-11 pr-4 text-xs text-[#E0E0E0] placeholder-[#222] focus:outline-none font-medium tracking-tight"
      />
    </div>
  );
};