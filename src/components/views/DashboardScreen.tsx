import React from 'react';
import { useTaskFlow } from '../../context/TaskFlowContext';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Briefcase, 
  CalendarDays, 
  ChevronRight,
  Plus,
  Compass
} from 'lucide-react';
import { Avatar } from '../Avatar';

export const DashboardScreen: React.FC<{ onCreateTaskClick: () => void }> = ({ onCreateTaskClick }) => {
  const { 
    currentUser, 
    tasks, 
    projects, 
    users, 
    activeTab, 
    setActiveTab, 
    setSelectedProjectId,
    setSelectedTaskId,
    getProjectById
  } = useTaskFlow();

  if (!currentUser) return null;

  // Overdue threshold is 2026-06-02
  const TODAY_STR = "2026-06-02";

  // Calculations
  const totalTasksCount = tasks.length;
  
  const assignedToMe = tasks.filter(t => t.assigneeId === currentUser.id);
  const assignedToMeCount = assignedToMe.length;

  const overdueTasks = tasks.filter(t => {
    return t.dueDate < TODAY_STR && t.status !== 'done';
  });
  const overdueCount = overdueTasks.length;

  const highPriorityTasks = tasks.filter(t => t.priority === 'high' && t.status !== 'done');
  const highPriorityCount = highPriorityTasks.length;

  const completedThisWeek = tasks.filter(t => t.status === 'done');
  const completedThisWeekCount = completedThisWeek.length;

  // Upcoming deadlines (assigned to me and incomplete, sorted by closest due date)
  const myUpcomingDeadlines = assignedToMe
    .filter(t => t.status !== 'done' && t.dueDate >= TODAY_STR)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);

  // Overdue tasks assigned to me
  const myOverdueTasks = assignedToMe
    .filter(t => t.status !== 'done' && t.dueDate < TODAY_STR)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const handleProjectClick = (projId: string) => {
    setSelectedProjectId(projId);
    setActiveTab('projects');
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  return (
    <div id="dashboard-container" className="space-y-6 font-sans">
      {/* Hello bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200/80 dark:border-slate-800/85">
        <div>
          <h2 className="text-2xl font-black text-slate-850 dark:text-white flex items-center gap-2">
            Welcome back, {currentUser.name}! 
            <span className="text-xl animate-bounce">👋</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-xs">
            Here's what is happening with the <strong className="text-indigo-600 dark:text-indigo-400">{projects.length} active initiatives</strong> today.
          </p>
        </div>
        <button
          id="dash-create-task"
          onClick={onCreateTaskClick}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-full shadow-lg shadow-indigo-100 dark:shadow-none transition-transform hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      </div>

      {/* Metrics Row */}
      <div id="dashboard-metrics" className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase tracking-widest font-bold font-mono">Total Tasks</span>
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <Briefcase className="w-4 h-4 text-slate-650 dark:text-slate-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-slate-950 dark:text-white select-all">{totalTasksCount}</span>
            <p className="text-[10px] text-slate-400 mt-1">Across all workspaces</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase tracking-widest font-bold font-mono text-indigo-500">My Workload</span>
            <div className="p-2 bg-indigo-55 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg">
              <Compass className="w-4 h-4 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-slate-950 dark:text-white select-all">{assignedToMeCount}</span>
            <p className="text-[10px] text-slate-400 mt-1">Assigned directly to you</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between ring-1 ring-red-500/20">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase tracking-widest font-bold font-mono text-rose-500">Overdue</span>
            <div className="p-2 bg-rose-50 dark:bg-rose-950/40 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-rose-600 dark:text-rose-450 select-all">{overdueCount}</span>
            <p className="text-[10px] text-rose-500 dark:text-rose-400 mt-1 font-semibold">Require immediate action</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase tracking-widest font-bold font-mono text-amber-500">High Priority</span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/40 rounded-lg">
              <Clock className="w-4 h-4 text-amber-550" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-500 select-all">{highPriorityCount}</span>
            <p className="text-[10px] text-slate-400 mt-1">Active high-priority tasks</p>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase tracking-widest font-bold font-mono text-emerald-500">Completed</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-500 select-all">{completedThisWeekCount}</span>
            <p className="text-[10px] text-slate-400 mt-1 font-semibold pt-0.5">Ready or shipped</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Projects & Upcoming tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Projects (8 columns) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800/85">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-550" />
              Active Projects
            </h3>
            <button
              onClick={() => setActiveTab('projects')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center cursor-pointer"
            >
              See all
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {projects.map((proj) => {
              const projTasks = tasks.filter(t => t.projectId === proj.id);
              const completedTasksCount = projTasks.filter(t => t.status === 'done').length;
              
              return (
                <div
                  key={proj.id}
                  id={`dash-project-${proj.id}`}
                  onClick={() => handleProjectClick(proj.id)}
                  className="group p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-400/50 dark:hover:border-indigo-500/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {proj.name}
                      </h4>
                      <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 line-clamp-1">
                        {proj.description}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-medium rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 mt-0.5">
                      {proj.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>Progress: {proj.progress}%</span>
                      <span>{completedTasksCount} / {projTasks.length} Done</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Member avatars */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {proj.memberIds.map((mId) => {
                        const m = users.find((u) => u.id === mId);
                        return m ? (
                          <Avatar key={mId} userId={mId} name={m.name} size="xs" className="ring-2 ring-white dark:ring-slate-900" />
                        ) : null;
                      })}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Updated: {proj.updatedAt}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deadlines & High Urgent (5 columns) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
                  {/* Overdue Items list if there are any assigned to me */}
          {myOverdueTasks.length > 0 && (
            <div className="bg-rose-500/5 dark:bg-rose-950/10 p-6 rounded-[32px] border border-rose-200/60 dark:border-rose-900/40">
              <h3 className="text-sm font-bold text-rose-700 dark:text-rose-455 flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4" />
                My Overdue Actions ({myOverdueTasks.length})
              </h3>
              <div className="space-y-3">
                {myOverdueTasks.slice(0, 3).map((task) => {
                  const proj = getProjectById(task.projectId);
                  return (
                    <div
                      key={task.id}
                      onClick={() => handleTaskClick(task.id)}
                      className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-rose-200/60 dark:border-rose-950/45 hover:border-rose-400 dark:hover:border-rose-600 shadow-xs cursor-pointer transition-colors"
                    >
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {task.title}
                      </h4>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/80 px-2 py-0.5 rounded font-semibold font-mono">
                          Due {task.dueDate}
                        </span>
                        <span className="text-[10px] text-slate-400 line-clamp-1 max-w-[140px]">
                          {proj?.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upcoming deadlines */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-205 dark:border-slate-800/85 flex-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <CalendarDays className="w-4 h-4 text-indigo-550" />
              My Upcoming Milestones
            </h3>

            {myUpcomingDeadlines.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-8 text-slate-400 dark:text-slate-500 h-48 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <CheckCircle className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
                <p className="text-xs font-medium">All caught up!</p>
                <p className="text-[10px] mt-0.5">No upcoming incomplete task blockades.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myUpcomingDeadlines.map((task) => {
                  const proj = getProjectById(task.projectId);
                  return (
                    <div
                      key={task.id}
                      onClick={() => handleTaskClick(task.id)}
                      className="group p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500 hover:bg-slate-50/40 dark:hover:bg-slate-800/40 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 flex-1">
                          {task.title}
                        </h4>
                        <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                          task.priority === 'high' 
                            ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400' 
                            : task.priority === 'medium'
                            ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {task.priority}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-3 text-[10px] text-slate-400">
                        <span className="font-mono bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                          Due: {task.dueDate}
                        </span>
                        <span className="line-clamp-1 max-w-[120px] font-medium text-slate-500">
                          {proj?.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
