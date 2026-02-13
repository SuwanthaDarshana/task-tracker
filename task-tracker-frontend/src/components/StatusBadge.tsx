import type { TaskStatus } from '../types';

interface StatusBadgeProps {
  status: TaskStatus;
}

const statusConfig: Record<TaskStatus, { bg: string; label: string }> = {
  TODO: { bg: 'bg-slate-100 text-slate-700 border-slate-200', label: 'To Do' },
  IN_PROGRESS: { bg: 'bg-amber-100 text-amber-800 border-amber-200', label: 'In Progress' },
  DONE: { bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', label: 'Done' },
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status];
  return (
    <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border ${config.bg}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
