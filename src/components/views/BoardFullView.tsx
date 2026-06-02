import React, { useState } from 'react';
import { useTaskFlow, TaskFilters } from '../../context/TaskFlowContext';
import { ChevronRight, Calendar, MessageSquare, CheckSquare, Layers, Trash2, ArrowLeftRight } from 'lucide-react';
import { Avatar } from '../Avatar';

export const BoardFullView: React.FC = () => {
  const { 
    tasks, 
    projects, 
    users, 
    moveTaskStatus, 
    deleteTask, 
    setSelectedTaskId, 
    preferences 
  } = useTaskFlow();

  const [projectSelector, setProjectSelector] = useState('all');
  const [assigneeSelector, setAssigneeSelector] = useState('all');
  const [draggedOverCol, setDraggedOverCol] = useState<string | null>(null);

  const columns = [
    { id: 'backlog', label: 'Backlog', colors: 'border-t-slate-400 bg-slate-50/50 dark:bg-slate-900/10' },
    { id: 'to_do', label: 'To Do', colors: 'border-t-sky-400 bg-slate-50/50 dark:bg-slate-900/10' },
    { id: 'in_progress', label: 'In Progress', colors: 'border-t-indigo-500 bg-slate-50/50 dark:bg-slate-900/10' },
    { id: 'review', label: 'Review', colors: 'border-t-purple-400 bg-slate-50/50 dark:bg-slate-900/10' },
    { id: 'done', label: 'Done', colors: 'border-t-emerald-400 bg-slate-50/50 dark:bg-slate-900/10' }
  ];

  // Filter tasks based on selected Project or Assignee context
  const filteredTasks = tasks.filter(t => {
    const matchesProj = projectSelector === 'all' ? true : t.projectId === projectSelector;
    const matchesUser = assigneeSelector === 'all' ? true : t.assigneeId === assigneeSelector;
    return matchesProj && matchesUser;
  });

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    if (draggedOverCol !== colId) {
      setDraggedOverCol(colId);
    }
  };

  const handleDrop = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    setDraggedOverCol(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      moveTaskStatus(taskId, colId);
    }
  };

  const getPriorityTheme = (p: string) => {
    switch (p) {
      case 'high': return 'bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400';
      case 'medium': return 'bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-955/20 dark:text-amber-400';
      default: return 'bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div id="full-kanban-board-page" className="space-y-6 font-sans">
      
      {/* Intro section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-205 dark:border-slate-800/85">
        <div>
          <h2 className="text-xl font-black text-slate-850 dark:text-white flex items-center gap-2">
            Kanban Board Centralizer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Complete tasks stream overview • Drag and drop cards to translate statuses in real time.
          </p>
        </div>

        {/* Dynamic drop-down selectors */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Project Focus */}
          <select
            value={projectSelector}
            onChange={(e) => setProjectSelector(e.target.value)}
            className="text-xs font-semibold text-slate-705 dark:text-slate-300 px-3.5 py-2 rounded-xl border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none cursor-pointer"
          >
            <option value="all">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* User Focus */}
          <select
            value={assigneeSelector}
            onChange={(e) => setAssigneeSelector(e.target.value)}
            className="text-xs font-semibold text-slate-705 dark:text-slate-300 px-3.5 py-2 rounded-xl border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none cursor-pointer"
          >
            <option value="all">All Assignees</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Horizontal grid list columns */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1000px]">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);
            const isOverThisCol = draggedOverCol === col.id;

            return (
              <div
                key={col.id}
                id={`full-board-col-${col.id}`}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={() => setDraggedOverCol(null)}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`w-1/5 shrink-0 p-3 rounded-2xl border-t-4 border border-slate-200/60 dark:border-slate-800/80 transition-all ${col.colors} ${
                  isOverThisCol ? 'ring-2 ring-indigo-500 bg-indigo-50/10 dark:bg-indigo-900/10 border-indigo-400' : ''
                }`}
              >
                
                {/* Status Column title */}
                <div className="flex items-center justify-between mb-4 px-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wide">
                    {col.label}
                  </span>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-slate-200/55 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400">
                    {colTasks.length}
                  </span>
                </div>

                {/* Sub-cards */}
                <div className="space-y-3 min-h-[420px]">
                  {colTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center p-8 text-slate-400 border border-dashed border-slate-200/50 dark:border-slate-800/70 rounded-xl min-h-[140px]">
                      <span className="text-[10px]">No deliverables</span>
                    </div>
                  ) : (
                    colTasks.map((t) => {
                      const assignee = users.find(u => u.id === t.assigneeId);
                      const proj = projects.find(p => p.id === t.projectId);
                      const isTaskOverdue = t.dueDate < "2026-06-02" && t.status !== 'done';

                      return (
                        <div
                          key={t.id}
                          id={`full-board-task-${t.id}`}
                          draggable={true}
                          onDragStart={(e) => handleDragStart(e, t.id)}
                          onClick={() => setSelectedTaskId(t.id)}
                          className={`group bg-white dark:bg-slate-900 border rounded-xl hover:border-indigo-500 p-3.5 space-y-3 shadow-xs hover:shadow-md hover:-translate-y-0.5 cursor-grab active:cursor-grabbing transition-all ${
                            t.status === 'done'
                              ? 'border-slate-100 opacity-75'
                              : isTaskOverdue
                              ? 'border-rose-250 dark:border-rose-900/40 ring-1 ring-rose-500/15'
                              : 'border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            {/* Project tag identifier */}
                            <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 truncate max-w-[110px]" title={proj?.name}>
                              {proj?.name}
                            </span>
                            
                            {/* Priority */}
                            <span className={`text-[8px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded border ${getPriorityTheme(t.priority)}`}>
                              {t.priority}
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className={`text-xs font-bold leading-normal text-slate-850 dark:text-white line-clamp-2 ${
                            t.status === 'done' ? 'line-through text-slate-400 font-medium' : ''
                          }`}>
                            {t.title}
                          </h4>

                          {/* Footer details */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/50 mt-1">
                            <span className={`text-[9px] font-mono flex items-center gap-1 ${
                              isTaskOverdue ? 'text-rose-500 font-semibold' : 'text-slate-400'
                            }`}>
                              <Calendar className="w-3.5 h-3.5 text-slate-300" />
                              {t.dueDate}
                            </span>

                            {assignee && (
                              <Avatar userId={assignee.id} name={assignee.name} size="xs" />
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

    </div>
  );
};
