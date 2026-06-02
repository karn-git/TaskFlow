import React, { useState } from 'react';
import { useTaskFlow } from '../../context/TaskFlowContext';
import { Mail, CheckSquare, Sparkles, Filter, Briefcase, Activity } from 'lucide-react';
import { Avatar } from '../Avatar';

export const TeamScreen: React.FC = () => {
  const { users, tasks, projects, setFilters, setActiveTab } = useTaskFlow();
  const [selectedInvolvement, setSelectedInvolvement] = useState<string>('all');

  const getWorkloadLevel = (count: number) => {
    if (count === 0) return { label: 'Idle', color: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-800', percentage: 5 };
    if (count <= 1) return { label: 'Optimal', color: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-950', percentage: 30 };
    if (count <= 2) return { label: 'Moderate', color: 'bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-950/20 dark:text-sky-450 dark:border-sky-950', percentage: 55 };
    if (count <= 3) return { label: 'High Activity', color: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900', percentage: 80 };
    return { label: 'Overloaded', color: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900', percentage: 100 };
  };

  // Filter members by dynamic team involvement selections
  const filteredTeammates = users.filter((u) => {
    if (selectedInvolvement === 'all') return true;
    const proj = projects.find(p => p.id === selectedInvolvement);
    return proj ? proj.memberIds.includes(u.id) : true;
  });

  // Action flow - filter and jump to project
  const handleInspectWork = (memberId: string) => {
    setFilters((prev) => ({
      ...prev,
      assigneeId: memberId
    }));
    setActiveTab('board_full_view'); // Navigate to full Board full view or project details
  };

  return (
    <div id="team-screen-container" className="space-y-6 font-sans">
      
      {/* Intro bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/85">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Teammates & Workloads
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Evaluate resource distribution, core capacities, and assign active milestones
          </p>
        </div>

        {/* Dynamic selector to filter teammates who belong to specific projects */}
        <div id="teammate-involvement-filter" className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 font-mono hidden sm:inline">Project:</span>
          <select
            value={selectedInvolvement}
            onChange={(e) => setSelectedInvolvement(e.target.value)}
            className="text-xs text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Any Involvements</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Team grid */}
      <div id="team-member-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeammates.map((member) => {
          // Count distinct active tasks
          const memberTasks = tasks.filter((t) => t.assigneeId === member.id);
          const activeTasks = memberTasks.filter(t => t.status !== 'done');
          const completedCount = memberTasks.filter(t => t.status === 'done').length;
          
          const loadInfo = getWorkloadLevel(activeTasks.length);

          return (
            <div
              key={member.id}
              id={`team-member-card-${member.id}`}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Status Indicator & Top Header */}
                <div className="flex items-start justify-between">
                  <Avatar userId={member.id} name={member.name} size="lg" className="shadow-inner" />
                  
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${loadInfo.color}`}>
                    {loadInfo.label}
                  </span>
                </div>

                {/* Profile info */}
                <div className="mt-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium font-mono mt-0.5">
                    {member.role}
                  </p>
                  
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mt-2.5">
                    <Mail className="w-3.5 h-3.5 text-slate-300" />
                    <span className="truncate">{member.email}</span>
                  </div>
                </div>
              </div>

              {/* Task statistics and progress indicators */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
                <div className="grid grid-cols-2 gap-2 text-center bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-mono">Assigned</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-1 mt-0.5">
                      <CheckSquare className="w-3.5 h-3.5 text-blue-500" />
                      {memberTasks.length}
                    </span>
                  </div>
                  <div className="border-l border-slate-200 dark:border-slate-800">
                    <span className="block text-[10px] text-slate-400 uppercase font-mono">Completed</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-1 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                      {completedCount}
                    </span>
                  </div>
                </div>

                {/* Workload intensity bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Activity className="w-3 h-3 text-slate-350" />
                      Workload Intensity
                    </span>
                    <span>{loadInfo.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        activeTasks.length > 3
                          ? 'bg-rose-500'
                          : activeTasks.length > 2
                          ? 'bg-amber-400'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${loadInfo.percentage}%` }}
                    />
                  </div>
                </div>

                {/* Focus inspection trigger */}
                <button
                  id={`btn-inspect-work-${member.id}`}
                  onClick={() => handleInspectWork(member.id)}
                  className="w-full mt-1.5 py-2 px-3 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                >
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  Inspect Member Workload
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
