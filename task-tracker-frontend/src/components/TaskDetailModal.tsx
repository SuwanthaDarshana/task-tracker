import { useEffect, useState, useCallback } from 'react';
import type { Task } from '../types';
import { taskService } from '../api/taskService';
import StatusBadge from './StatusBadge';

interface TaskDetailModalProps {
  taskId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

const TaskDetailModal = ({ taskId, isOpen, onClose, onEdit, onDelete }: TaskDetailModalProps) => {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !taskId) {
      setTask(null);
      return;
    }

    const fetchTask = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await taskService.getTaskById(taskId);
        setTask(data);
      } catch {
        setError('Failed to load task details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId, isOpen]);

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue = (task: Task) => {
    if (!task.dueDate || task.status === 'DONE') return false;
    return new Date(task.dueDate) < new Date();
  };

  const statusLabel: Record<string, string> = {
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    DONE: 'Completed',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
            Task Details
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-slate-400">
                <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading task details...
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 text-center">
              {error}
            </div>
          ) : task ? (
            <div className="space-y-5">
              {/* Status */}
              <div className="flex items-center justify-between">
                <StatusBadge status={task.status} />
                <span className="text-xs text-slate-400 font-medium">ID: #{task.id}</span>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Title</label>
                <h2 className={`text-xl font-bold ${task.status === 'DONE' ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                  {task.title}
                </h2>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Description</label>
                {task.description ? (
                  <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {task.description}
                  </p>
                ) : (
                  <p className="text-slate-400 text-sm italic">No description provided</p>
                )}
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Status</label>
                  <p className="text-sm font-semibold text-slate-700">{statusLabel[task.status]}</p>
                </div>
                <div className={`p-4 rounded-xl border ${
                  isOverdue(task) 
                    ? 'bg-red-50 border-red-100' 
                    : 'bg-slate-50 border-slate-100'
                }`}>
                  <label className={`block text-xs font-medium uppercase tracking-wider mb-1 ${
                    isOverdue(task) ? 'text-red-400' : 'text-slate-400'
                  }`}>
                    {isOverdue(task) ? 'Overdue' : 'Due Date'}
                  </label>
                  <p className={`text-sm font-semibold ${isOverdue(task) ? 'text-red-600' : 'text-slate-700'}`}>
                    {formatDate(task.dueDate)}
                  </p>
                  {task.dueDate && (
                    <p className={`text-xs mt-0.5 ${isOverdue(task) ? 'text-red-400' : 'text-slate-400'}`}>
                      {formatTime(task.dueDate)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer Actions */}
        {task && !loading && !error && (
          <div className="flex gap-3 px-6 pb-6">
            <button
              onClick={() => { onClose(); onEdit(task); }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Task
            </button>
            <button
              onClick={() => { onClose(); onDelete(task.id); }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 border border-red-200 transition-all cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetailModal;
