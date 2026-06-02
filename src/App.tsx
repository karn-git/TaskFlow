import React, { useState } from 'react';
import { TaskFlowProvider, useTaskFlow } from './context/TaskFlowContext';
import { LoginScreen } from './components/views/LoginScreen';
import { DashboardScreen } from './components/views/DashboardScreen';
import { ProjectsScreen } from './components/views/ProjectsScreen';
import { ProjectDetailScreen } from './components/views/ProjectDetailScreen';
import { MyTasksScreen } from './components/views/MyTasksScreen';
import { TeamScreen } from './components/views/TeamScreen';
import { SettingsScreen } from './components/views/SettingsScreen';
import { BoardFullView } from './components/views/BoardFullView';

// Modals
import { CreateEditTaskModal } from './components/modals/CreateEditTaskModal';
import { TaskDetailModal } from './components/modals/TaskDetailModal';
import { CreateProjectModal } from './components/modals/CreateProjectModal';
import { ToastContainer } from './components/ToastContainer';

// Icons
import {
  Layers,
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Columns4,
  Users2,
  Settings,
  LogOut,
  Menu,
  X,
  PlusCircle,
  FolderPlus,
  Search,
  Bell
} from 'lucide-react';
import { Avatar } from './components/Avatar';

const SidebarContents: React.FC<{ 
  onAddTask: () => void; 
  onAddProject: () => void; 
  closeMobileMenu?: () => void;
}> = ({ onAddTask, onAddProject, closeMobileMenu }) => {
  const { 
    currentUser, 
    setCurrentUser, 
    activeTab, 
    setActiveTab, 
    setSelectedProjectId,
    tasks
  } = useTaskFlow();

  if (!currentUser) return null;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-4 h-4" /> },
    { id: 'tasks', label: 'My Tasks', icon: <CheckSquare className="w-4 h-4" />, badge: tasks.filter(t => t.assigneeId === currentUser.id && t.status !== 'done').length },
    { id: 'board_full_view', label: 'Kanban Board', icon: <Columns4 className="w-4 h-4" /> },
    { id: 'team', label: 'Team Workloads', icon: <Users2 className="w-4 h-4" /> },
    { id: 'settings', label: 'Preferences', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleNavigate = (tabId: string) => {
    // Clear project selection if navigating away from project contexts (except if staying on details or list focus)
    if (tabId !== 'projects' && tabId !== 'projects_detail') {
      setSelectedProjectId(null);
    }
    setActiveTab(tabId);
    if (closeMobileMenu) closeMobileMenu();
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out of this demo session?')) {
      setCurrentUser(null);
      if (closeMobileMenu) closeMobileMenu();
    }
  };

  return (
    <div id="sidebar-layout-panel" className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-350 font-sans z-40 select-none">
      {/* Brand area */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800 shrink-0">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-white uppercase flex items-center">
            TaskFlow<span className="text-indigo-400 font-extrabold lowercase">.ai</span>
          </h1>
          <span className="text-[9px] text-slate-500 font-mono tracking-wider font-semibold block">v1.0.0 (Sleek Sync)</span>
        </div>
      </div>

      {/* Primary Links */}
      <nav id="nav-sidebar-items" className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest px-2.5 mb-2">
          Management
        </div>
        
        {menuItems.map((item) => {
          const isActive = activeTab === item.id || (item.id === 'projects' && activeTab === 'projects_detail');
          return (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => handleNavigate(item.id)}
              className={`w-full flex items-center justify-between py-2 px-3.5 text-xs font-semibold rounded-xl cursor-pointer hover:bg-slate-800/60 hover:text-white transition-all ${
                isActive 
                  ? 'bg-indigo-600/10 text-indigo-400 font-bold border-l-2 border-indigo-500 rounded-l-none' 
                  : ''
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold font-mono bg-indigo-900/40 text-indigo-400">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Separator */}
        <div className="pt-4 border-t border-slate-800/80 my-4">
          <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest px-2.5 mb-2">
            Control center
          </div>
          <button
            onClick={() => {
              onAddTask();
              if (closeMobileMenu) closeMobileMenu();
            }}
            className="w-full text-left py-2 px-3.5 text-xs hover:bg-slate-800/60 hover:text-white rounded-xl flex items-center gap-3 cursor-pointer text-indigo-400/80 font-medium font-sans"
          >
            <PlusCircle className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Create Task...</span>
          </button>
          <button
            onClick={() => {
              onAddProject();
              if (closeMobileMenu) closeMobileMenu();
            }}
            className="w-full text-left py-2 px-3.5 text-xs hover:bg-slate-800/60 hover:text-white rounded-xl flex items-center gap-3 cursor-pointer text-emerald-450/80 font-medium font-sans"
          >
            <FolderPlus className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Create Project...</span>
          </button>
        </div>
      </nav>

      {/* User profile capsule */}
      <div id="sidebar-user-footer" className="p-4 border-t border-slate-800 bg-slate-950/40 shrink-0">
        <div className="flex items-center gap-3 mb-2.5">
          <Avatar userId={currentUser.id} name={currentUser.name} size="sm" className="ring-1 ring-slate-800" />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
            <div className="text-[10px] text-slate-500 truncate">{currentUser.role}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left py-1.5 px-2 text-[11px] font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Session</span>
        </button>
      </div>
    </div>
  );
};

const WorkspaceShell: React.FC = () => {
  const { 
    currentUser, 
    activeTab, 
    selectedTaskId, 
    setSelectedTaskId,
    searchQuery,
    setSearchQuery,
    showToast
  } = useTaskFlow();

  // Dialog triggers
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!currentUser) {
    return <LoginScreen />;
  }

  // Handle opening task details editing sequence
  const handleTriggerEditTask = () => {
    if (selectedTaskId) {
      setEditingTaskId(selectedTaskId);
      setSelectedTaskId(null); // Close detail modal
    }
  };

  // Safe checks for task creations
  const handleTriggerCreateTask = () => {
    setIsCreateTaskOpen(true);
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'projects': return 'Workspace Projects';
      case 'projects_detail': return 'Project Details Panel';
      case 'tasks': return 'My Task Scheduler';
      case 'board_full_view': return 'Kanban Board Centralizer';
      case 'team': return 'Teammates & Capacity';
      case 'settings': return 'UI Settings';
      default: return 'TaskFlow';
    }
  };

  return (
    <div id="applet-viewport" className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200 overflow-hidden">
      
      {/* 1. DESKTOP SIDEBAR PANEL (Always on left, hidden on mobile) */}
      <aside className="w-64 shrink-0 h-full hidden lg:block">
        <SidebarContents 
          onAddTask={handleTriggerCreateTask} 
          onAddProject={() => setIsCreateProjectOpen(true)} 
        />
      </aside>

      {/* 2. MAIN CORE COVIES VIEWPORTS */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP ROW CONTROL HEADER */}
        <header id="workspace-top-bar" className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between shrink-0 select-none z-30">
          
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger toggle */}
            <button
              id="mobile-hamburger-trigger"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-550 dark:text-slate-350 rounded-lg cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Current title bar */}
            <h1 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest font-sans flex items-center gap-3">
              <span>{getPageTitle()}</span>
            </h1>

            {/* AI/Sync Active Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-slate-500 py-1 px-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-full border border-slate-200/50 dark:border-slate-800/40">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full absolute"></span>
              <span>Sync Mode Online</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Minimal static utility icons */}
            <button 
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer relative"
              onClick={() => showToast('Offline Sync and notifications are operational.', 'info')}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-indigo-650 dark:bg-indigo-500 rounded-full" />
            </button>

            {/* Mini user identity pill */}
            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-4 select-none">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-300">{currentUser.name}</span>
              <Avatar userId={currentUser.id} name={currentUser.name} size="xs" />
            </div>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main id="view-viewport-container" className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/70 dark:bg-slate-950/30">
          <div className="max-w-7xl mx-auto h-full">
            
            {activeTab === 'dashboard' && (
              <DashboardScreen onCreateTaskClick={handleTriggerCreateTask} />
            )}
            
            {activeTab === 'projects' && (
              <ProjectsScreen onCreateProjectClick={() => setIsCreateProjectOpen(true)} />
            )}
            
            {activeTab === 'projects_detail' && (
              <ProjectDetailScreen onAddTaskClick={handleTriggerCreateTask} />
            )}
            
            {activeTab === 'tasks' && (
              <MyTasksScreen />
            )}
            
            {activeTab === 'board_full_view' && (
              <BoardFullView />
            )}
            
            {activeTab === 'team' && (
              <TeamScreen />
            )}
            
            {activeTab === 'settings' && (
              <SettingsScreen />
            )}

          </div>
        </main>

      </div>

      {/* 3. MOBILE MENU SLIDE-IN OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Blackout clickout */}
          <div 
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Sidebar Drawer panel */}
          <div className="relative w-72 h-full flex flex-col justify-between">
            <SidebarContents 
              onAddTask={handleTriggerCreateTask} 
              onAddProject={() => setIsCreateProjectOpen(true)}
              closeMobileMenu={() => setIsMobileMenuOpen(false)}
            />
            {/* Close touch overlay */}
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-slate-300 p-1 bg-slate-950/30 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ================= GLOBAL DIALOG MODALS OVERLAYS ================= */}
      
      {/* Task Creation Form Modal */}
      {isCreateTaskOpen && (
        <CreateEditTaskModal 
          onClose={() => setIsCreateTaskOpen(false)} 
        />
      )}

      {/* Task Editing Form Modal */}
      {editingTaskId && (
        <CreateEditTaskModal 
          taskIdToEdit={editingTaskId} 
          onClose={() => setEditingTaskId(null)} 
        />
      )}

      {/* Task Detail View Modal */}
      {selectedTaskId && (
        <TaskDetailModal 
          taskId={selectedTaskId} 
          onClose={() => setSelectedTaskId(null)}
          onEditClick={handleTriggerEditTask}
        />
      )}

      {/* Project Creation Form Modal */}
      {isCreateProjectOpen && (
        <CreateProjectModal 
          onClose={() => setIsCreateProjectOpen(false)} 
        />
      )}

      {/* Master feedback toast notifications */}
      <ToastContainer />

    </div>
  );
};

export default function App() {
  return (
    <TaskFlowProvider>
      <WorkspaceShell />
    </TaskFlowProvider>
  );
}
