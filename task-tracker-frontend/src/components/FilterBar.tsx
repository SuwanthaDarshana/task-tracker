import type { TaskStatus, SortOption } from '../types';

interface FilterBarProps {
  activeFilter: TaskStatus | 'ALL';
  onFilterChange: (filter: TaskStatus | 'ALL') => void;
  taskCounts: Record<TaskStatus | 'ALL', number>;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const filters: { key: TaskStatus | 'ALL'; label: string; color: string }[] = [
  { key: 'ALL', label: 'All Tasks', color: 'bg-blue-600' },
  { key: 'TODO', label: 'To Do', color: 'bg-slate-500' },
  { key: 'IN_PROGRESS', label: 'In Progress', color: 'bg-amber-500' },
  { key: 'DONE', label: 'Done', color: 'bg-emerald-500' },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'dueDate_desc', label: 'Due Date (Newest)' },
  { value: 'dueDate_asc', label: 'Due Date (Oldest)' },
  { value: 'title_asc', label: 'Title (A → Z)' },
  { value: 'title_desc', label: 'Title (Z → A)' },
  { value: 'status_asc', label: 'Status (To Do first)' },
  { value: 'status_desc', label: 'Status (Done first)' },
];

const FilterBar = ({
  activeFilter,
  onFilterChange,
  taskCounts,
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
}: FilterBarProps) => {
  return (
    <div className="mb-8 space-y-4">
      {/* Search + Sort row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks by title or description..."
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
          </svg>
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="appearance-none pl-9 pr-9 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-slate-700 cursor-pointer min-w-45"
          >
            {sortOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Status Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {filters.map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeFilter === key
                ? `${color} text-white shadow-lg`
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {label}
            <span className={`ml-2 px-1.5 py-0.5 rounded-md text-xs font-bold ${
              activeFilter === key ? 'bg-white/20' : 'bg-slate-100'
            }`}>
              {taskCounts[key]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
