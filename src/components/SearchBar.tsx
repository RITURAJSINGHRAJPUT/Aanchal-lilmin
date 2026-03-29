import { Search, Filter } from 'lucide-react';

interface Props {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterClass: string;
  onFilterChange: (value: string) => void;
  classes: string[];
  placeholder?: string;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  filterClass,
  onFilterChange,
  classes,
  placeholder = 'Search students...',
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 animate-fade-in">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-teal-200 bg-white/80 text-teal-800 
          placeholder-teal-300 font-medium text-sm transition-all duration-200"
        />
      </div>

      {/* Class Filter */}
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
        <select
          value={filterClass}
          onChange={(e) => onFilterChange(e.target.value)}
          className="pl-11 pr-8 py-3 rounded-xl border border-teal-200 bg-white/80 text-teal-800 
          font-medium text-sm appearance-none cursor-pointer transition-all duration-200 min-w-[160px]"
        >
          <option value="">All Classes</option>
          {classes.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
