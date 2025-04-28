import { useState, useEffect } from 'react';

const placeholders = [
  'Search services...',
  'Need a Non-Veg?',
  'Need a Veg?',
  
];

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
}

const SearchBar = ({ value = '', onChange }: SearchBarProps) => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholders[0]);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
      setCurrentPlaceholder(placeholders[placeholderIndex]);
    }, 3000);

    return () => clearInterval(interval);
  }, [placeholderIndex]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleSearch}
        placeholder={currentPlaceholder}
        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
      />
      <svg
        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
};

export default SearchBar; 