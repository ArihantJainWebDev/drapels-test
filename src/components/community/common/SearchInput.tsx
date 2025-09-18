'use client'
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '../../ui/input';
import { cn } from '../../../lib/utils';

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  debounceDelay?: number;
}

const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  placeholder = 'Search...',
  className,
  debounceDelay = 300,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, debounceDelay);

    return () => {
      clearTimeout(handler);
    };
  }, [query, onSearch, debounceDelay]);

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-10"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground hover:text-foreground"
        >
          <X />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
