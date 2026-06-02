import React, { useState } from 'react';
import { useTaskFlow, TaskFilters } from '../../context/TaskFlowContext';
import { 
  ArrowLeft, 
  Search, 
  Grid2X2, 
  AlignJustify, 
  Plus, 
  X, 
  Calendar, 
  Flame, 
  CheckSquare, 
  ChevronDown, 
  ChevronUp, 
  MoreHorizontal, 
  Trash2,
  Lock,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { Avatar } from '../Avatar';
import { Task } from '../../types';

interface ProjectDetailScreenProps {
  onAddTaskClick: () => void;
}

export const ProjectDetailScreen: React.FC<ProjectDetailScreenProps> = ({ onAddTaskClick }) => {
  const {
    projects,
    tasks,
    users,
    selectedProjectId,
    setSelectedProjectId,
    setActiveTab,
    selectedTaskId,
    setSelectedTaskId,
    moveTaskStatus,
    deleteTask,
    preferences,
    updatePreference,
    showToast
  } = useTaskFlow();

  // Local sorting states for the List Table
  const [listSortColumn, setListSortColumn] = useState<'dueDate' | 'priority' | 'status'>('dueDate');
  const [listSortDirection, setListSortDirection] = useState<'asc' | 'desc'>('asc');

  // Drag over column tracking state
  const [draggedOverCol, setDraggedOverCol] = useState<string | null>(null);

  // Filters state (bind directly to a local or global state. Let's maintain local copy or use global filters)
  const [localFilters, setLocalFilters] = useState<TaskFilters>({
    status: 'all',
    assigneeId: 'all',
    priority: 'all',
    projectId: 'all',
    dueDate: 'all'
  });
  const [localSearch, setLocalSearch] = useState('');

  // 1. Resolve Active Project
  const activeProj = projects.find(p => p.id === selectedProjectId) || projects[0];
  if (!activeProj) {
    return (
      <div className="flex flex-col items-center justify-center h-96 font-sans">
        <Lock className="w-8 h-8 text-slate-350 mb-2" />
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">No active project selected</h3>
        <button
          onClick={() => setActiveTab('projects')}
          className="text-xs text-blue-600 dark:text-blue-400 mt-2 hover:underline font-bold"
        >
          Go back to Projects list
        </button>
      </div>
    );
  }

  // 2. Filter tasks by project first
  const projectTasks = tasks.filter(t => t.projectId === activeProj.id);

  // 3. Apply status, assignee, priority, search text filters
  const processedTasks = projectTasks.filter(t => {
    const matchesStatus = localFilters.status === 'all' ? true : t.status === localFilters.status;
    const matchesAssignee = localFilters.assigneeId === 'all' ? true : t.assigneeId === localFilters.assigneeId;
    const matchesPriority = localFilters.priority === 'all' ? true : t.priority === localFilters.priority;
    const matchesSearch = t.title.toLowerCase().includes(localSearch.toLowerCase()) || 
                          t.description.toLowerCase().includes(localSearch.toLowerCase());
    return matchesStatus && matchesAssignee && matchesPriority && matchesSearch;
  });

  // Calculate project completion counts
  const totalInProj = projectTasks.length;
  const completedInProj = projectTasks.filter(t => t.status === 'done').length;

  const handleClearFilters = () => {
    setLocalFilters({
      status: 'all',
      assigneeId: 'all',
      priority: 'all',
      projectId: 'all',
      dueDate: 'all'
    });
    setLocalSearch('');
    showToast('Filters cleared', 'info');
  };

  // Drag and Drop implementation
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    if (draggedOverCol !== colId) {
      setDraggedOverCol(colId);
    }
  };

  const handleDragLeave = () => {
    setDraggedOverCol(null);
  };

  const handleDrop = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    setDraggedOverCol(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      moveTaskStatus(taskId, colId);
    }
  };

  // Sorting helper for List View
  const handleSort = (column: 'dueDate' | 'priority' | 'status') => {
    if (listSortColumn === column) {
      setListSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setListSortColumn(column);
      setListSortDirection('asc');
    }
  };

  const sortedTasks = [...processedTasks].sort((a, b) => {
    const dirFactor = listSortDirection === 'asc' ? 1 : -1;
    
    if (listSortColumn === 'dueDate') {
      return a.dueDate.localeCompare(b.dueDate) * dirFactor;
    }
    if (listSortColumn === 'priority') {
      const priorityWeights: Record<string, number> = { low: 1, medium: 2, high: 3 };
      const wA = priorityWeights[a.priority] || 0;
      const wB = priorityWeights[b.priority] || 0;
      return (wA - wB) * dirFactor;
    }
    if (listSortColumn === 'status') {
      return a.status.localeCompare(b.status) * dirFactor;
    }
    return 0;
  });

  const columns = [
    { id: 'backlog', label: 'Backlog', color: 'border-t-slate-400 bg-slate-100/50 dark:bg-slate-950/20' },
    { id: 'to_do', label: 'To Do', color: 'border-t-sky-450 bg-slate-100/50 dark:bg-slate-950/20' },
    { id: 'in_progress', label: 'In Progress', color: 'border-t-indigo-500 bg-slate-100/50 dark:bg-slate-950/20' },
    { id: 'review', label: 'Review', color: 'border-t-purple-400 bg-slate-100/50 dark:bg-slate-950/20' },
    { id: 'done', label: 'Done', color: 'border-t-emerald-400 bg-slate-100/50 dark:bg-slate-950/20' }
  ];

  const getPriorityClasses = (p: string) => {
    switch (p) {
      case 'high': return 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/40 dark:text-rose-400';
      case 'medium': return 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/40 dark:text-amber-400';
      default: return 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const isDensityCompact = preferences.boardDensity === 'compact';

  return (
    <div id="project-detail-layout" className="space-y-6 font-sans">
      
      {/* Return & Project Header summary */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-205 dark:border-slate-800/85">
        <button
          onClick={() => {
            setSelectedProjectId(null);
            setActiveTab('projects');
          }}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-250 font-bold mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Projects overview
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-2">
          {/* Describe */}
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-850 dark:text-white shadow-xs">{activeProj.name}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">{activeProj.description}</p>
          </div>

          {/* Members & Add Task buttons */}
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            {/* Project Members avatars */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-semibold font-mono uppercase">Assigned:</span>
              <div className="flex -space-x-1.5 overflow-hidden">
                {activeProj.memberIds.map(mId => {
                  const u = users.find(x => x.id === mId);
                  return u ? (
                    <Avatar key={mId} userId={mId} name={u.name} size="sm" className="ring-2 ring-white dark:ring-slate-900" />
                  ) : null;
                })}
              </div>
            </div>

            {/* View Switchers */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <button
                id="switcher-kanban"
                onClick={() => updatePreference('defaultView', 'kanban')}
                className={`flex items-center gap-1.5 py-1 px-2.5 rounded text-xs font-semibold cursor-pointer ${
                  preferences.defaultView === 'kanban' 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Grid2X2 className="w-3.5 h-3.5" />
                Board
              </button>
              <button
                id="switcher-list"
                onClick={() => updatePreference('defaultView', 'list')}
                className={`flex items-center gap-1.5 py-1 px-2.5 rounded text-xs font-semibold cursor-pointer ${
                  preferences.defaultView === 'list' 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <AlignJustify className="w-3.5 h-3.5" />
                List
              </button>
            </div>
            
            {/* Quick add task */}
            <button
              id="proj-detail-add-task-btn"
              onClick={onAddTaskClick}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 px-6 rounded-full shadow-lg shadow-indigo-100 dark:shadow-none transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>
        </div>

        {/* Mini progress line info */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-4 text-xs">
          <span className="font-semibold text-slate-600 dark:text-slate-300">Project Progress:</span>
          <div className="w-48 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full transition-all duration-300" style={{ width: `${activeProj.progress}%` }} />
          </div>
          <span className="font-mono text-indigo-650 dark:text-indigo-400 font-bold">{activeProj.progress}% ({completedInProj}/{totalInProj} tasks)</span>
        </div>
      </div>

      {/* Operations Panel (Search, Assignee dropdown, Priority Dropdown, Clear) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-205 dark:border-slate-800">
        
        {/* Search */}
        <div className="md:col-span-4 flex items-center gap-2.5 bg-slate-50 dark:bg-slate-950/40 px-3 py-1.5 rounded-xl border border-slate-200/30 dark:border-slate-800/40">
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input
            id="proj-tasks-search-filter"
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full text-xs bg-transparent border-none focus:outline-none focus:ring-0 text-slate-850 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>

        {/* Action filter dropdown 1 (Assignee) */}
        <div className="md:col-span-3">
          <select
            value={localFilters.assigneeId}
            onChange={(e) => setLocalFilters(prev => ({ ...prev, assigneeId: e.target.value }))}
            className="w-full text-xs text-slate-705 dark:text-slate-300 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer font-semibold"
          >
            <option value="all">Any Assignee</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
            ))}
          </select>
        </div>

        {/* Action filter dropdown 2 (Priority) */}
        <div className="md:col-span-3">
          <select
            value={localFilters.priority}
            onChange={(e) => setLocalFilters(prev => ({ ...prev, priority: e.target.value }))}
            className="w-full text-xs text-slate-705 dark:text-slate-300 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer font-semibold"
          >
            <option value="all">Any Priority</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>

        {/* Action filter dropdown 3 (Status filter in case list layout) */}
        <div className="md:col-span-2 flex items-center justify-between gap-1.5">
          <select
            value={localFilters.status}
            onChange={(e) => setLocalFilters(prev => ({ ...prev, status: e.target.value }))}
            className="w-full text-xs text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Any Status</option>
            {columns.map(col => (
              <option key={col.id} value={col.id}>{col.label}</option>
            ))}
          </select>

          {/* Quick Clear triggers */}
          {(localSearch || localFilters.assigneeId !== 'all' || localFilters.priority !== 'all' || localFilters.status !== 'all') && (
            <button
              onClick={handleClearFilters}
              className="p-1.5 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg shrink-0 cursor-pointer"
              title="Clear Active Filters"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main layout container depending on Preferences switch */}
      {preferences.defaultView === 'kanban' ? (
        /* ================= KANBAN BOARD VIEW ================= */
        <div 
          id="kanban-scrollable-container" 
          className="overflow-x-auto pb-4"
        >
          <div className="flex gap-4 min-w-[1000px] items-start">
            {columns.map((col) => {
              // Get tasks specifically in this Kanban Column
              const colTasks = processedTasks.filter(t => t.status === col.id);
              const isOverThisCol = draggedOverCol === col.id;

              return (
                <div
                  key={col.id}
                  id={`kanban-column-${col.id}`}
                  onDragOver={(e) => handleDragOver(e, col.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, col.id)}
                  className={`w-1/5 shrink-0 rounded-2xl border-t-4 p-3 border border-slate-200/50 dark:border-slate-800/80 transition-all ${col.color} ${
                    isOverThisCol 
                      ? 'ring-2 ring-blue-500 bg-blue-50/10 dark:bg-blue-900/10 border-blue-400' 
                      : ''
                  }`}
                >
                  {/* Column Label */}
                  <div className="flex items-center justify-between mb-3.5 px-1 font-sans">
                    <span className="text-xs font-bold text-slate-850 dark:text-slate-200">
                      {col.label}
                    </span>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-slate-200/50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400">
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Tasks Cards stack */}
                  <div className="space-y-3 min-h-[350px]">
                    {colTasks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center p-8 text-slate-400 border border-dashed border-slate-200/50 dark:border-slate-800/70 rounded-xl min-h-[140px]">
                        <CheckSquare className="w-6 h-6 text-slate-300 dark:text-slate-700 mb-1" />
                        <p className="text-[10px]">No tasks are here</p>
                      </div>
                    ) : (
                      colTasks.map((t) => {
                        const assignee = users.find(u => u.id === t.assigneeId);
                        const isTaskOverdue = t.dueDate < "2026-06-02" && t.status !== 'done';
                        const checkTotal = t.checklist.length;
                        const checkCompleted = t.checklist.filter(c => c.completed).length;

                        return (
                          <div
                            key={t.id}
                            id={`kanban-card-${t.id}`}
                            draggable={true}
                            onDragStart={(e) => handleDragStart(e, t.id)}
                            onClick={() => setSelectedTaskId(t.id)}
                            className={`group relative bg-white dark:bg-slate-900 border rounded-xl hover:border-blue-500 dark:hover:border-blue-500/85 hover:shadow-md hover:-translate-y-0.5 cursor-grab active:cursor-grabbing transition-all ${
                              t.status === 'done' 
                                ? 'border-slate-100 dark:border-slate-800/65 opacity-75' 
                                : isTaskOverdue
                                ? 'border-rose-200 dark:border-rose-900/40 ring-1 ring-rose-500/10'
                                : 'border-slate-200/80 dark:border-slate-800'
                            } ${isDensityCompact ? 'p-2.5 space-y-2' : 'p-4 space-y-3'}`}
                          >
                            {/* Priority & Delete triggers */}
                            <div className="flex items-center justify-between">
                              <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${getPriorityClasses(t.priority)}`}>
                                {t.priority}
                              </span>

                              {/* Manual Trash icons on hover */}
                              <button
                                id={`delete-task-sh-${t.id}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm('Are you sure you want to delete this task?')) {
                                    deleteTask(t.id);
                                  }
                                }}
                                className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-rose-500 rounded transition-opacity cursor-pointer"
                                title="Delete Task"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Title */}
                            <h4 className={`text-xs font-bold leading-normal text-slate-900 dark:text-white line-clamp-2 ${
                              t.status === 'done' ? 'line-through text-slate-400 dark:text-slate-500 font-medium' : ''
                            }`}>
                              {t.title}
                            </h4>

                            {/* Checklist mini indicator */}
                            {checkTotal > 0 && (
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-medium bg-slate-50 dark:bg-slate-950/40 px-1.5 py-0.5 rounded-md w-fit">
                                <CheckSquare className="w-3 h-3 text-slate-400" />
                                <span>{checkCompleted}/{checkTotal} Items</span>
                              </div>
                            )}

                            {/* Lower metadata (assignee + due) */}
                            <div className="flex items-center justify-between pt-1 border-t border-slate-50 dark:border-slate-800/60 mt-1">
                              {/* Due Date */}
                              <div className="flex items-center gap-1 text-[9px] text-slate-400 font-mono">
                                <Calendar className="w-3 h-3 text-slate-300" />
                                <span className={isTaskOverdue ? 'text-rose-600 font-bold' : ''}>
                                  {t.dueDate}
                                </span>
                              </div>

                              {/* Comments count badge */}
                              {t.commentIds.length > 0 && (
                                <div className="flex items-center gap-0.5 text-[9px] text-slate-400">
                                  <MessageSquare className="w-3 h-3 text-slate-305" />
                                  <span>{t.commentIds.length}</span>
                                </div>
                              )}

                              {/* Assignee Avatar */}
                              {assignee ? (
                                <Avatar userId={assignee.id} name={assignee.name} size="xs" />
                              ) : (
                                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[8px] text-slate-400 font-bold border border-slate-200">
                                  ?
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ================= GRID LIST VIEW ================= */
        <div id="list-view-table-wrapper" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800/85 overflow-x-auto shadow-sm">
          {sortedTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-16 text-slate-400 dark:text-slate-500 border-none">
              <AlertCircle className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-2" />
              <h4 className="text-sm font-semibold">No filtered entries match</h4>
              <p className="text-xs mt-1">Try to clear the search bar filters or select other parameters.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[720px] font-sans">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-mono uppercase font-bold tracking-wider text-slate-400 bg-slate-50/40 dark:bg-slate-900/40">
                  <th className="px-5 py-3 ml-2">Task Title</th>
                  <th 
                    className="px-3 py-3 w-32 cursor-pointer hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {listSortColumn === 'status' && (listSortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                    </div>
                  </th>
                  <th 
                    className="px-3 py-3 w-28 cursor-pointer hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 transition-colors"
                    onClick={() => handleSort('priority')}
                  >
                    <div className="flex items-center gap-1">
                      Priority
                      {listSortColumn === 'priority' && (listSortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                    </div>
                  </th>
                  <th className="px-3 py-3 w-36">Assignee</th>
                  <th 
                    className="px-3 py-3 w-32 cursor-pointer hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 transition-colors"
                    onClick={() => handleSort('dueDate')}
                  >
                    <div className="flex items-center gap-1">
                      Due Date
                      {listSortColumn === 'dueDate' && (listSortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                    </div>
                  </th>
                  <th className="px-5 py-3 w-28 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedTasks.map((t) => {
                  const assignee = users.find(u => u.id === t.assigneeId);
                  const isTaskOverdue = t.dueDate < "2026-06-02" && t.status !== 'done';
                  const isCompleted = t.status === 'done';

                  return (
                    <tr
                      key={t.id}
                      id={`list-task-row-${t.id}`}
                      onClick={() => setSelectedTaskId(t.id)}
                      className="border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-150 cursor-pointer group"
                    >
                      {/* Title & Description */}
                      <td className="px-5 py-3">
                        <span className={`text-xs font-semibold text-slate-800 dark:text-slate-100 block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${
                          isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
                        }`}>
                          {t.title}
                        </span>
                        {t.description && (
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate max-w-sm mt-0.5">
                            {t.description}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3">
                        <span className={`text-[10px] font-mono py-0.5 px-2 rounded-md ${
                          isCompleted ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-450' 
                          : t.status === 'in_progress' ? 'bg-blue-105 text-blue-600 dark:bg-blue-950/30'
                          : t.status === 'review' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {t.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="px-3 py-3">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border inline-block ${getPriorityClasses(t.priority)}`}>
                          {t.priority}
                        </span>
                      </td>

                      {/* Assignee */}
                      <td className="px-3 py-3">
                        {assignee ? (
                          <div className="flex items-center gap-2">
                            <Avatar userId={assignee.id} name={assignee.name} size="xs" />
                            <span className="text-[11px] text-slate-600 dark:text-slate-350 font-medium truncate max-w-[100px]" title={assignee.name}>
                              {assignee.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">Unassigned</span>
                        )}
                      </td>

                      {/* Due Date */}
                      <td className="px-3 py-3 text-xs font-mono text-slate-500 dark:text-slate-400">
                        <span className={isTaskOverdue ? 'text-rose-600 font-bold' : ''}>
                          {t.dueDate}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTaskId(t.id);
                            }}
                            className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline bg-transparent"
                          >
                            Edit
                          </button>
                          <span className="text-slate-205">|</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Are you sure you want to delete this task?')) {
                                deleteTask(t.id);
                              }
                            }}
                            className="text-xs text-rose-500 hover:underline bg-transparent"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};
