import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { taskService } from "../api/taskService";
import type { Task, TaskStatus, SortOption } from "../types";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import FilterBar from "../components/FilterBar";
import EmptyState from "../components/EmptyState";
import EditTaskModal from "../components/EditTaskModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import TaskDetailModal from "../components/TaskDetailModal";
import Pagination from "../components/Pagination";

const PAGE_SIZE = 6;

const Dashboard = () => {
  const { user } = useAuth();
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [activeFilter, setActiveFilter] = useState<TaskStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("dueDate_desc");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [viewingTaskId, setViewingTaskId] = useState<number | null>(null);
  const [error, setError] = useState("");

  // Client-side pagination state
  const [currentPage, setCurrentPage] = useState(0);

  // Fetch ALL tasks by iterating through every backend page
  const fetchTasks = useCallback(async () => {
    if (!user) return;
    try {
      setError("");
      const tasks = await taskService.getAllTasks(user.id);
      setAllTasks(tasks);
    } catch {
      setError("Failed to load tasks. Please try again.");
      toast.error("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ── Pipeline: allTasks → search → filter → sort ──

  // 1) Search across ALL tasks
  const searchedTasks = useMemo(() => {
    if (!searchQuery.trim()) return allTasks;
    const q = searchQuery.toLowerCase();
    return allTasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
    );
  }, [allTasks, searchQuery]);

  // 2) Filter by status
  const filteredTasks = useMemo(
    () =>
      activeFilter === "ALL"
        ? searchedTasks
        : searchedTasks.filter((t) => t.status === activeFilter),
    [searchedTasks, activeFilter]
  );

  // 3) Sort
  const sortedTasks = useMemo(() => {
    const order: Record<TaskStatus, number> = { TODO: 0, IN_PROGRESS: 1, DONE: 2 };
    return [...filteredTasks].sort((a, b) => {
      switch (sortOption) {
        case "dueDate_desc":
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        case "dueDate_asc":
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case "title_asc":
          return a.title.localeCompare(b.title);
        case "title_desc":
          return b.title.localeCompare(a.title);
        case "status_asc":
          return order[a.status] - order[b.status];
        case "status_desc":
          return order[b.status] - order[a.status];
        default:
          return 0;
      }
    });
  }, [filteredTasks, sortOption]);

  // 4) Client-side pagination
  const totalElements = sortedTasks.length;
  const totalPages = Math.ceil(totalElements / PAGE_SIZE);
  const paginatedTasks = useMemo(
    () => sortedTasks.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE),
    [sortedTasks, currentPage]
  );

  // Reset to page 0 when search, filter, or sort changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, activeFilter, sortOption]);

  // Task counts for filter badges (based on searched tasks — before status filter)
  const taskCounts = useMemo(
    () => ({
      ALL: searchedTasks.length,
      TODO: searchedTasks.filter((t) => t.status === "TODO").length,
      IN_PROGRESS: searchedTasks.filter((t) => t.status === "IN_PROGRESS").length,
      DONE: searchedTasks.filter((t) => t.status === "DONE").length,
    }),
    [searchedTasks]
  );

  // ── Handlers ──

  // Create task
  const handleCreateTask = async (title: string, description: string, dueDate: string) => {
    if (!user) return;
    setCreating(true);
    try {
      const newTask = await taskService.createTask(user.id, {
        title,
        description,
        status: "TODO",
        dueDate,
      });
      // Immediately add the new task to the list so it shows right away
      setAllTasks((prev) => {
        return [newTask, ...prev];
      });
      setActiveFilter("ALL");
      setSearchQuery("");
      setCurrentPage(0);
      toast.success("Task created successfully!");
    } catch {
      toast.error("Failed to create task.");
    } finally {
      setCreating(false);
    }
  };

  // Update status (from TaskCard arrows)
  const handleUpdateStatus = async (taskId: number, newStatus: TaskStatus) => {
    const task = allTasks.find((t) => t.id === taskId);
    if (!task) return;

    // Optimistic update
    setAllTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await taskService.updateTask(taskId, { ...task, status: newStatus });
      toast.success("Status updated!");
    } catch {
      toast.error("Failed to update status.");
      await fetchTasks();
    }
  };

  // Edit task (from modal)
  const handleEditTask = async (
    taskId: number,
    updates: { title: string; description: string; status: TaskStatus; dueDate: string }
  ) => {
    // Optimistic update
    setAllTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    );
    try {
      await taskService.updateTask(taskId, updates);
      toast.success("Task updated successfully!");
    } catch {
      toast.error("Failed to update task.");
      fetchTasks();
    }
  };

  // Open delete confirmation modal
  const handleDeleteTask = (taskId: number) => {
    const task = allTasks.find((t) => t.id === taskId);
    if (task) setDeletingTask(task);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!deletingTask) return;
    setDeleting(true);

    const taskId = deletingTask.id;
    // Optimistic removal
    setAllTasks((prev) => prev.filter((t) => t.id !== taskId));
    setDeletingTask(null);

    try {
      await taskService.deleteTask(taskId);
      toast.success("Task deleted successfully!");
    } catch {
      toast.error("Failed to delete task.");
      fetchTasks();
    } finally {
      setDeleting(false);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <button onClick={() => fetchTasks()} className="text-red-700 font-semibold hover:underline cursor-pointer">
              Retry
            </button>
          </div>
        )}

        {/* Search, Filter & Sort Bar */}
        {!loading && allTasks.length > 0 && (
          <FilterBar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            taskCounts={taskCounts}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortOption={sortOption}
            onSortChange={setSortOption}
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
          ) : paginatedTasks.length === 0 ? (
            <EmptyState
              title={
                searchQuery
                  ? "No matching tasks"
                  : activeFilter === "ALL"
                    ? "No tasks yet"
                    : `No ${activeFilter.replace("_", " ").toLowerCase()} tasks`
              }
              message={
                searchQuery
                  ? "Try a different search term or clear your search."
                  : activeFilter === "ALL"
                    ? "Create your first task above to get started!"
                    : "Tasks with this status will appear here."
              }
            />
          ) : (
            paginatedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDeleteTask}
                onEdit={setEditingTask}
                onView={setViewingTaskId}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && (
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

      {/* Task Detail Modal */}
      <TaskDetailModal
        taskId={viewingTaskId}
        isOpen={viewingTaskId !== null}
        onClose={() => setViewingTaskId(null)}
        onEdit={(task) => { setViewingTaskId(null); setEditingTask(task); }}
        onDelete={(taskId) => { setViewingTaskId(null); handleDeleteTask(taskId); }}
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
