import { useState } from 'react';

interface TaskFormProps {
  onSubmit: (title: string, description: string, dueDate: string) => Promise<void>;
  loading?: boolean;
}

const TaskForm = ({ onSubmit, loading }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      // Use date string directly to avoid timezone shift
      const dueDateISO = dueDate
        ? `${dueDate}T00:00:00`
        : new Date().toISOString();

      await onSubmit(title.trim(), description.trim(), dueDateISO);
      setTitle('');
      setDescription('');
      setDueDate('');
    } catch {
      setError('Failed to create task. Please try again.');
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-10">
      <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
        <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
        Create New Task
      </h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Title *</label>
            <input
              placeholder="What needs to be done?"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
            />
          </div>
          <div className="md:col-span-4">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Description</label>
            <input
              placeholder="Add some details..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Due Date</label>
            <input
              type="date"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={today}
            />
          </div>
          <div className="md:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default TaskForm;
