import React, { useState } from 'react';
import { useTaskFlow } from '../../context/TaskFlowContext';
import { Search, FolderPlus, Calendar, Layers, Users2, CheckSquare } from 'lucide-react';
import { Avatar } from '../Avatar';

export const ProjectsScreen: React.FC<{ onCreateProjectClick: () => void }> = ({ onCreateProjectClick }) => {
  const { projects, tasks, users, setSelectedProjectId, setActiveTab } = useTaskFlow();
  const [searchWord, setSearchWord] = useState('');

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchWord.toLowerCase()) || 
    p.description.toLowerCase().includes(searchWord.toLowerCase())
  );

  const handleProjectSelect = (id: string) => {
    setSelectedProjectId(id);
    setActiveTab('projects_detail'); // Custom detail tab
  };

  return (
    <div id="projects-container" className="space-y-6 font-sans">
      
      {/* Header operations bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-205 dark:border-slate-800/85">
        <div>
          <h2 className="text-xl font-black text-slate-850 dark:text-white">Workspace Projects</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-sans">Overview of active initiatives, team allotments, and relative progress metrics</p>
        </div>
        <button
          id="btn-create-project"
          onClick={onCreateProjectClick}
          className="flex items-center gap-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-full shadow-lg shadow-indigo-100 dark:shadow-none transition-colors cursor-pointer"
        >
          <FolderPlus className="w-4 h-4" />
          Create Project
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="flex bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-205 dark:border-slate-800/85 items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          id="project-search-input"
          type="text"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          placeholder="Search projects by name or keywords..."
          className="bg-transparent border-none text-xs text-slate-800 dark:text-slate-200 w-full focus:outline-none focus:ring-0 placeholder:text-slate-400"
        />
        {searchWord && (
          <button
            onClick={() => setSearchWord('')}
            className="text-[10px] text-slate-400 hover:text-slate-600 underline font-semibold px-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Empty visual state */}
      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 bg-white dark:bg-slate-900 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-800">
          <Layers className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">No project nodes found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            Try correcting your search term or create a new active project from the top right button.
          </p>
        </div>
      ) : (
        /* Project Grid */
        <div id="projects-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => {
            const projTasks = tasks.filter(t => t.projectId === proj.id);
            const totalTasksCount = projTasks.length;
            const completedCount = projTasks.filter(t => t.status === 'done').length;

            return (
              <div
                key={proj.id}
                id={`project-card-${proj.id}`}
                onClick={() => handleProjectSelect(proj.id)}
                className="group flex flex-col justify-between bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-50 dark:hover:shadow-none transition-all duration-300 cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                      {proj.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {proj.createdAt}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-905 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {proj.name}
                  </h3>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  {/* Milestones count */}
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <CheckSquare className="w-3.5 h-3.5 text-indigo-555" />
                      {completedCount} of {totalTasksCount} completed
                    </span>
                    <span className="font-semibold font-mono text-indigo-600 dark:text-indigo-400">{proj.progress}%</span>
                  </div>

                  {/* Progress Line */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>

                  {/* Avatars summary row */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                      <Users2 className="w-3.5 h-3.5 text-slate-300" />
                      <span className="text-[10px]">Team Allotment</span>
                    </div>

                    <div className="flex -space-x-1.5 overflow-hidden">
                      {proj.memberIds.map((memberId) => {
                        const m = users.find(u => u.id === memberId);
                        return m ? (
                          <Avatar
                            key={memberId}
                            userId={memberId}
                            name={m.name}
                            size="sm"
                            className="ring-2 ring-white dark:ring-slate-900"
                          />
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
