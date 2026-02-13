import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { taskService } from "../api/taskService";
import type { Task, TaskStatus } from "../types";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import FilterBar from "../components/FilterBar";
import EmptyState from "../components/EmptyState";
import EditTaskModal from "../components/EditTaskModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import Pagination from "../components/Pagination";

const PAGE_SIZE = 6;

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [activeFilter, setActiveFilter] = useState<TaskStatus | "ALL">("ALL");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchTasks = useCallback(async (page: number = currentPage) => {
    if (!user) return;
    try {
      setError("");
      const pageData = await taskService.getTasks(user.id, page, PAGE_SIZE);
      setTasks(pageData.content);
      setTotalPages(pageData.totalPages);
      setTotalElements(pageData.totalElements);
      setCurrentPage(pageData.number);
    } catch {
      setError("Failed to load tasks. Please try again.");
      toast.error("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }, [user, currentPage]);

  useEffect(() => {
    fetchTasks(currentPage);
  }, [currentPage, fetchTasks]);

  // Create task
  const handleCreateTask = async (title: string, description: string, dueDate: string) => {
    if (!user) return;
    setCreating(true);
    try {
      await taskService.createTask(user.id, {
        title,
        description,
        status: "TODO",
        dueDate,
      });
      // Jump to first page to see the newest task (sorted by dueDate desc)
      setCurrentPage(0);
      await fetchTasks(0);
      toast.success("Task created successfully!");
    } catch {
      toast.error("Failed to create task.");
    } finally {
      setCreating(false);
    }
  };

  // Update status (from TaskCard arrows)
  const handleUpdateStatus = async (taskId: number, newStatus: TaskStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await taskService.updateTask(taskId, { ...task, status: newStatus });
      toast.success("Status updated!");
    } catch {
      toast.error("Failed to update status.");
      // Revert on error
      await fetchTasks();
    }
  };

  // Edit task (from modal)
  const handleEditTask = async (
    taskId: number,
    updates: { title: string; description: string; status: TaskStatus; dueDate: string }
  ) => {
    await taskService.updateTask(taskId, updates);
    await fetchTasks();
    toast.success("Task updated successfully!");
  };

  // Open delete confirmation modal
  const handleDeleteTask = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) setDeletingTask(task);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!deletingTask) return;
    setDeleting(true);

    const taskId = deletingTask.id;
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setDeletingTask(null);

    try {
      await taskService.deleteTask(taskId);
      // Re-fetch current page (may need to go back if last item on page)
      await fetchTasks(currentPage);
      toast.success("Task deleted successfully!");
    } catch {
      toast.error("Failed to delete task.");
      await fetchTasks(currentPage);
    } finally {
      setDeleting(false);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered tasks
  const filteredTasks =
    activeFilter === "ALL"
      ? tasks
      : tasks.filter((t) => t.status === activeFilter);

  // Task counts for filter badges
  const taskCounts = {
    ALL: tasks.length,
    TODO: tasks.filter((t) => t.status === "TODO").length,
    IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    DONE: tasks.filter((t) => t.status === "DONE").length,
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      <main className="max-w-5xl mx-auto p-8">
        {/* Create Task Form */}
        <TaskForm onSubmit={handleCreateTask} loading={creating} />

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm border border-red-100 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => fetchTasks(currentPage)} className="text-red-700 font-semibold hover:underline cursor-pointer">
              Retry
            </button>
          </div>
        )}

        {/* Filter Bar */}
        {!loading && tasks.length > 0 && (
          <FilterBar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            taskCounts={taskCounts}
          />
        )}

        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-20">
              <div className="flex items-center gap-3 text-slate-400">
                <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading your tasks...
              </div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <EmptyState
              title={activeFilter === "ALL" ? "No tasks yet" : `No ${activeFilter.replace("_", " ").toLowerCase()} tasks`}
              message={
                activeFilter === "ALL"
                  ? "Create your first task above to get started!"
                  : "Tasks with this status will appear here."
              }
            />
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDeleteTask}
                onEdit={setEditingTask}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && filteredTasks.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
      </main>

      {/* Edit Modal */}
      <EditTaskModal
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleEditTask}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deletingTask}
        taskTitle={deletingTask?.title ?? ''}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingTask(null)}
        loading={deleting}
      />
    </div>
  );
};

export default Dashboard;
