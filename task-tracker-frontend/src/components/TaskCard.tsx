import type { Task, TaskStatus } from '../types';
import StatusBadge from './StatusBadge';

interface TaskCardProps {
  task: Task;
  onUpdateStatus: (taskId: number, newStatus: TaskStatus) => void;
  onDelete: (taskId: number) => void;
  onEdit: (task: Task) => void;
  onView: (taskId: number) => void;
}

const TaskCard = ({ task, onUpdateStatus, onDelete, onEdit, onView }: TaskCardProps) => {
  const nextStatus: Record<TaskStatus, TaskStatus | null> = {
    TODO: 'IN_PROGRESS',
    IN_PROGRESS: 'DONE',
    DONE: null,
  };

  const prevStatus: Record<TaskStatus, TaskStatus | null> = {
    TODO: null,
    IN_PROGRESS: 'TODO',
    DONE: 'IN_PROGRESS',
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = () => {
    if (!task.dueDate || task.status === 'DONE') return false;
    return new Date(task.dueDate) < new Date();
  };

  return (
    <div
      onClick={() => onView(task.id)}
      className={`group bg-white p-6 rounded-2xl shadow-sm border transition-all duration-300 cursor-pointer ${
      task.status === 'DONE'
        ? 'border-emerald-200 bg-emerald-50/30'
        : isOverdue()
          ? 'border-red-200 hover:border-red-300'
          : 'border-slate-200 hover:border-blue-300'
    }`}>
      {/* Header: Status + Actions */}
      {/* <div><span className="text-xs text-slate-400 font-medium">ID: #{task.status === "TODO" ? task.id : "N/A"}</span></div> */}
      <div className="flex justify-between items-start mb-4">
        <StatusBadge status={task.status} />
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          {/* Move backward */}
          {prevStatus[task.status] && (
            <button
              onClick={() => onUpdateStatus(task.id, prevStatus[task.status]!)}
              className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
              title={`Move to ${prevStatus[task.status]?.replace('_', ' ')}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          {/* Move forward */}
          {nextStatus[task.status] && (
            <button
              onClick={() => onUpdateStatus(task.id, nextStatus[task.status]!)}
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              title={`Move to ${nextStatus[task.status]?.replace('_', ' ')}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          {/* Edit */}
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
            title="Edit task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          {/* Delete */}
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Delete task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className={`text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors ${
        task.status === 'DONE' ? 'text-slate-500 line-through' : 'text-slate-800'
      }`}>
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-2">
          {task.description}
        </p>
      )}
      {!task.description && <div className="mb-6" />}

      {/* Footer */}
      <div className={`flex items-center gap-2 text-xs font-medium -mx-6 -mb-6 p-4 rounded-b-2xl border-t ${
        isOverdue()
          ? 'text-red-500 bg-red-50 border-red-100'
          : 'text-slate-400 bg-slate-50 border-slate-100'
      }`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
        {isOverdue() ? 'Overdue: ' : 'Due: '}{formatDate(task.dueDate)}
      </div>
    </div>
  );
};

export default TaskCard;
