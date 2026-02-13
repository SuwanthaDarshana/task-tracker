import type { TaskStatus } from '../types';

interface FilterBarProps {
  activeFilter: TaskStatus | 'ALL';
  onFilterChange: (filter: TaskStatus | 'ALL') => void;
  taskCounts: Record<TaskStatus | 'ALL', number>;
}

const filters: { key: TaskStatus | 'ALL'; label: string; color: string }[] = [
  { key: 'ALL', label: 'All Tasks', color: 'bg-blue-600' },
  { key: 'TODO', label: 'To Do', color: 'bg-slate-500' },
  { key: 'IN_PROGRESS', label: 'In Progress', color: 'bg-amber-500' },
  { key: 'DONE', label: 'Done', color: 'bg-emerald-500' },
];

const FilterBar = ({ activeFilter, onFilterChange, taskCounts }: FilterBarProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
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
  );
};

export default FilterBar;
