import React, { useState } from 'react';
import { useTaskFlow } from '../../context/TaskFlowContext';
import { 
  CheckCircle, 
  Circle, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Search, 
  Grid, 
  List, 
  UserCheck,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Avatar } from '../Avatar';

export const MyTasksScreen: React.FC = () => {
  const { 
    currentUser, 
    tasks, 
    projects, 
    updateTask, 
    setSelectedTaskId 
  } = useTaskFlow();

  const [activeSubTab, setActiveSubTab] = useState<'today' | 'upcoming' | 'overdue' | 'completed'>('today');
  const [layoutStyle, setLayoutStyle] = useState<'card' | 'list'>('card');
  const [textSearch, setTextSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center h-96 font-sans">
        <Lock className="w-8 h-8 text-slate-300 mb-2" />
        <p className="text-sm text-slate-500">Sign in to view your assigned task list.</p>
      </div>
    );
  }

  const TODAY_STR = "2026-06-02";

  // Filter tasks to only those assigned to the current user
  const myTasks = tasks.filter(t => t.assigneeId === currentUser.id);

  // Grouping
  const todayTasks = myTasks.filter(t => t.dueDate === TODAY_STR && t.status !== 'done');
  const upcomingTasks = myTasks.filter(t => t.dueDate > TODAY_STR && t.status !== 'done');
  const overdueTasks = myTasks.filter(t => t.dueDate < TODAY_STR && t.status !== 'done');
  const completedTasks = myTasks.filter(t => t.status === 'done');

  // Switch based on tab selection
  let tabSelectedTasks = todayTasks;
  if (activeSubTab === 'upcoming') tabSelectedTasks = upcomingTasks;
  if (activeSubTab === 'overdue') tabSelectedTasks = overdueTasks;
  if (activeSubTab === 'completed') tabSelectedTasks = completedTasks;

  // Filter further by user input parameters
  const finalTasks = tabSelectedTasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(textSearch.toLowerCase()) || 
                          t.description.toLowerCase().includes(textSearch.toLowerCase());
    const matchesPriority = priorityFilter === 'all' ? true : t.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const handleToggleDone = (taskId: string, currentStatus: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening the detail modal
    const nextStatus = currentStatus === 'done' ? 'to_do' : 'done';
    updateTask(taskId, { status: nextStatus });
  };

  const getPriorityBadgeColor = (p: string) => {
    switch (p) {
      case 'high': return 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/45';
      case 'medium': return 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/40';
      default: return 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-800';
    }
  };

  return (
    <div id="mytasks-container" className="space-y-6 font-sans">
      
      {/* Banner bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-205 dark:border-slate-800/85">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-650 dark:text-indigo-400 rounded-2xl">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-850 dark:text-white">My Tasks Portal</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Personal workspace for <strong>{currentUser.name}</strong> • {myTasks.length} overall tasks allocated
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => setLayoutStyle('card')}
            className={`p-1.5 rounded-md cursor-pointer ${layoutStyle === 'card' ? 'bg-white dark:bg-slate-700 shadow-xs text-slate-800 dark:text-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
            title="Card Grid Layout"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLayoutStyle('list')}
            className={`p-1.5 rounded-md cursor-pointer ${layoutStyle === 'list' ? 'bg-white dark:bg-slate-700 shadow-xs text-slate-800 dark:text-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
            title="Table List Layout"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs list with counters */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1.5 overflow-x-auto pb-px">
        {/* Today tab */}
        <button
          onClick={() => setActiveSubTab('today')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
            activeSubTab === 'today'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 dark:hover:text-slate-350'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Today
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 font-mono">
            {todayTasks.length}
          </span>
        </button>

        {/* Overdue tab */}
        <button
          onClick={() => setActiveSubTab('overdue')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
            activeSubTab === 'overdue'
              ? 'border-red-500 text-red-500 dark:text-red-400 dark:border-red-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 dark:hover:text-slate-350'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Overdue
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 font-mono font-bold">
            {overdueTasks.length}
          </span>
        </button>

        {/* Upcoming tab */}
        <button
          onClick={() => setActiveSubTab('upcoming')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
            activeSubTab === 'upcoming'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 dark:hover:text-slate-350'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Upcoming
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 font-mono">
            {upcomingTasks.length}
          </span>
        </button>

        {/* Completed tab */}
        <button
          onClick={() => setActiveSubTab('completed')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
            activeSubTab === 'completed'
              ? 'border-emerald-500 text-emerald-500 dark:text-emerald-400 dark:border-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 dark:hover:text-slate-350'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Completed
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 font-mono">
            {completedTasks.length}
          </span>
        </button>
      </div>      {/* Searching / Filtering operations */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search */}
        <div className="md:col-span-8 flex items-center gap-2.5 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 px-3 py-2.5 rounded-2xl focus-within:ring-1 focus-within:ring-indigo-500">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            id="mytasks-search-filter"
            type="text"
            value={textSearch}
            onChange={(e) => setTextSearch(e.target.value)}
            placeholder="Search keywords in title or descriptions..."
            className="w-full text-xs bg-transparent border-none focus:outline-none focus:ring-0 text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
          />
        </div>

        {/* Priority Filter */}
        <div className="md:col-span-4 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-2.5 rounded-2xl">
          <select
            id="mytasks-priority-selector"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full text-xs text-slate-705 dark:text-slate-300 bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer font-semibold"
          >
            <option value="all">Any Priority</option>
            <option value="high">🔥 High Priority</option>
            <option value="medium">⚡ Medium Priority</option>
            <option value="low">🌱 Low Priority</option>
          </select>
        </div>
      </div>

      {/* Empty States */}
      {finalTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-16 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <CheckCircle className="w-12 h-12 text-slate-300 dark:text-slate-750 mb-3" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">No tasks in this section</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            Everything looks dry and clean here. Try modifying your queries OR check other sub-tabs.
          </p>
        </div>
      ) : (
        /* Layout Rendering */
        <div>
          {layoutStyle === 'card' ? (
            /* Cards layout */
            <div id="mytasks-cards-list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {finalTasks.map((t) => {
                const proj = projects.find(p => p.id === t.projectId);
                const isCompleted = t.status === 'done';
                const checklistTotal = t.checklist.length;
                const checklistDone = t.checklist.filter(c => c.completed).length;

                return (
                  <div
                    key={t.id}
                    id={`mytask-card-${t.id}`}
                    onClick={() => setSelectedTaskId(t.id)}
                    className={`group relative p-4 rounded-xl border bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                      isCompleted 
                        ? 'border-slate-100 dark:border-slate-800/65 opacity-75' 
                        : 'border-slate-200/60 dark:border-slate-800'
                    }`}
                  >
                    {/* Upper project reference and action check */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide truncate max-w-[140px]">
                        {proj ? proj.name : 'Unknown project'}
                      </span>

                      {/* Manual checkbox toggle */}
                      <button
                        onClick={(e) => handleToggleDone(t.id, t.status, e)}
                        className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-blue-500 transition-colors cursor-pointer"
                        title={isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300 shrink-0 hover:border-blue-400" />
                        )}
                      </button>
                    </div>

                    {/* Task Title */}
                    <h3 className={`text-xs font-bold leading-normal text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                      {t.title}
                    </h3>

                    {/* Task Description snippet */}
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {t.description || 'No descriptions supplied.'}
                    </p>

                    {/* Lower badges and dates */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getPriorityBadgeColor(t.priority)}`}>
                          {t.priority}
                        </span>
                        
                        {checklistTotal > 0 && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
                            ✓ {checklistDone}/{checklistTotal}
                          </span>
                        )}
                      </div>

                      <span className={`text-[10px] font-mono ${
                        t.dueDate < TODAY_STR && !isCompleted ? 'text-red-500 font-semibold' : 'text-slate-400'
                      }`}>
                        {t.dueDate}
                      </span>
                    </div>

                    {/* Tag chips */}
                    {t.tags && t.tags.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {t.tags.map(tg => (
                          <span key={tg} className="text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-400 px-1 py-0.5 rounded font-mono">
                            #{tg}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table list layout */
            <div id="mytasks-table" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800/85 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                    <th className="px-5 py-3 w-12 text-center">Status</th>
                    <th className="px-3 py-3">Task Title</th>
                    <th className="px-3 py-3 w-40">Project</th>
                    <th className="px-3 py-3 w-28">Priority</th>
                    <th className="px-3 py-3 w-32">Due Date</th>
                    <th className="px-5 py-3 w-24 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {finalTasks.map((t) => {
                    const proj = projects.find(p => p.id === t.projectId);
                    const isCompleted = t.status === 'done';

                    return (
                      <tr
                        key={t.id}
                        id={`mytask-row-${t.id}`}
                        onClick={() => setSelectedTaskId(t.id)}
                        className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
                      >
                        {/* Check status column */}
                        <td className="px-5 py-3 text-center" onClick={(e) => handleToggleDone(t.id, t.status, e)}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto transform active:scale-95" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-350 hover:text-blue-500 hover:border-blue-500 mx-auto transform active:scale-95" />
                          )}
                        </td>

                        {/* Title & Desc */}
                        <td className="px-3 py-3">
                          <span className={`text-xs font-semibold text-slate-800 dark:text-slate-200 block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${
                            isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
                          }`}>
                            {t.title}
                          </span>
                          {t.description && (
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 block line-clamp-1 mt-0.5">
                              {t.description}
                            </span>
                          )}
                        </td>

                        {/* Project Name */}
                        <td className="px-3 py-3 text-xs text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                          {proj ? proj.name : 'Unknown'}
                        </td>

                        {/* Priority Badge */}
                        <td className="px-3 py-3">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border inline-block select-none ${getPriorityBadgeColor(t.priority)}`}>
                            {t.priority}
                          </span>
                        </td>

                        {/* Due Calendar */}
                        <td className="px-3 py-3 text-xs font-mono text-slate-500 dark:text-slate-400">
                          <span className={t.dueDate < TODAY_STR && !isCompleted ? 'text-red-500 font-semibold' : ''}>
                            {t.dueDate}
                          </span>
                        </td>

                        {/* Actions link */}
                        <td className="px-5 py-3 text-right">
                          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                            Inspect
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
