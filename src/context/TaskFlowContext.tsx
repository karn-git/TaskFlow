import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Project, Task, Comment, AppPreferences } from '../types';
import {
  INITIAL_CURRENT_USER,
  INITIAL_TEAM_MEMBERS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_COMMENTS
} from '../data/mockData';

// Filter state definition
export interface TaskFilters {
  status: string;
  assigneeId: string;
  priority: string;
  projectId: string;
  dueDate: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface TaskFlowContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  projects: Project[];
  tasks: Task[];
  comments: Comment[];
  activeTab: string; // 'dashboard' | 'projects' | 'tasks' | 'board' | 'team' | 'settings' | 'login'
  setActiveTab: (tab: string) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: TaskFilters;
  setFilters: React.Dispatch<React.SetStateAction<TaskFilters>>;
  clearAllFilters: () => void;
  preferences: AppPreferences;
  updatePreference: <K extends keyof AppPreferences>(key: K, value: AppPreferences[K]) => void;
  
  // Actions
  createProject: (name: string, description: string, memberIds: string[]) => Project;
  createTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'commentIds'>) => void;
  updateTask: (taskId: string, updatedFields: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  moveTaskStatus: (taskId: string, targetStatus: string) => void;
  addComment: (taskId: string, authorId: string, message: string) => void;
  toggleChecklistItem: (taskId: string, itemId: string) => void;
  addChecklistItem: (taskId: string, label: string) => void;
  deleteChecklistItem: (taskId: string, itemId: string) => void;
  
  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;
  
  // Helpers
  getProjectById: (id: string) => Project | undefined;
  getUserById: (id: string) => User | undefined;
  getTasksByProject: (projectId: string) => Task[];
  getCommentsForTask: (taskId: string) => Comment[];
}

const TaskFlowContext = createContext<TaskFlowContextType | undefined>(undefined);

export const TaskFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial values from localStorage or fallback
  const [currentUser, setCurrentUserRaw] = useState<User | null>(() => {
    const saved = localStorage.getItem('tf_currentUser');
    return saved ? JSON.parse(saved) : null; // Start with null to show the Login Screen as per visual entry point requirements, or Maya Chen as default in demo session
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('tf_users');
    return saved ? JSON.parse(saved) : INITIAL_TEAM_MEMBERS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('tf_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tf_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('tf_comments');
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    const saved = localStorage.getItem('tf_activeTab');
    return saved ? saved : (localStorage.getItem('tf_currentUser') ? 'dashboard' : 'login');
  });

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'all',
    assigneeId: 'all',
    priority: 'all',
    projectId: 'all',
    dueDate: 'all'
  });

  const [preferences, setPreferences] = useState<AppPreferences>(() => {
    const saved = localStorage.getItem('tf_preferences');
    return saved ? JSON.parse(saved) : {
      theme: 'light',
      boardDensity: 'comfortable',
      defaultView: 'kanban'
    };
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // LocalStorage synchronizers
  useEffect(() => {
    localStorage.setItem('tf_currentUser', currentUser ? JSON.stringify(currentUser) : '');
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('tf_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('tf_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('tf_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('tf_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('tf_activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('tf_preferences', JSON.stringify(preferences));
    // Apply theme to document
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (preferences.theme === 'dark') {
      root.classList.add('dark');
    } else if (preferences.theme === 'light') {
      root.classList.add('light');
    } else {
      // System
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    }
  }, [preferences]);

  // SetCurrentUser with auto-rerouting helper
  const setCurrentUser = (user: User | null) => {
    setCurrentUserRaw(user);
    if (user) {
      setActiveTab('dashboard');
    } else {
      setActiveTab('login');
    }
  };

  // Toast helper
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => dismissToast(id), 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const clearAllFilters = () => {
    setFilters({
      status: 'all',
      assigneeId: 'all',
      priority: 'all',
      projectId: 'all',
      dueDate: 'all'
    });
    setSearchQuery('');
    showToast('Filters cleared', 'info');
  };

  const updatePreference = <K extends keyof AppPreferences>(key: K, value: AppPreferences[K]) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value
    }));
    showToast(`Preferences updated`, 'success');
  };

  // Helper selectors
  const getProjectById = (id: string) => projects.find((p) => p.id === id);
  const getUserById = (id: string) => users.find((u) => u.id === id);
  const getTasksByProject = (projectId: string) => tasks.filter((t) => t.projectId === projectId);
  const getCommentsForTask = (taskId: string) => comments.filter((c) => c.taskId === taskId);

  // Actions
  const createProject = (name: string, description: string, memberIds: string[]) => {
    const newProj: Project = {
      id: `project_${Date.now()}`,
      name,
      description,
      status: 'active',
      progress: 0,
      memberIds,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setProjects((prev) => [newProj, ...prev]);
    showToast(`Project "${name}" created successfully!`, 'success');
    return newProj;
  };

  // Recalculates project progress percentage when tasks change
  const updateProjectProgress = (projectId: string, currentTasks: Task[]) => {
    const projTasks = currentTasks.filter((t) => t.projectId === projectId);
    if (projTasks.length === 0) return;
    const completedCount = projTasks.filter((t) => t.status === 'done').length;
    const percentage = Math.round((completedCount / projTasks.length) * 100);

    setProjects((prevProjects) =>
      prevProjects.map((p) =>
        p.id === projectId
          ? { ...p, progress: percentage, updatedAt: new Date().toISOString().split('T')[0] }
          : p
      )
    );
  };

  const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'commentIds'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      commentIds: []
    };
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    updateProjectProgress(newTask.projectId, updatedTasks);
    showToast(`Task "${taskData.title}" created!`, 'success');
  };

  const updateTask = (taskId: string, updatedFields: Partial<Task>) => {
    let affectedProjectId = '';
    const updatedTasks = tasks.map((t) => {
      if (t.id === taskId) {
        affectedProjectId = t.projectId;
        return {
          ...t,
          ...updatedFields,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return t;
    });
    setTasks(updatedTasks);
    
    // If the project changed, update both projects' progress
    if (updatedFields.projectId && updatedFields.projectId !== affectedProjectId) {
      updateProjectProgress(affectedProjectId, updatedTasks);
      updateProjectProgress(updatedFields.projectId, updatedTasks);
    } else if (affectedProjectId) {
      updateProjectProgress(affectedProjectId, updatedTasks);
    }

    showToast(`Task updated successfully`, 'success');
  };

  const deleteTask = (taskId: string) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    if (!taskToDelete) return;
    
    const updatedTasks = tasks.filter((t) => t.id !== taskId);
    setTasks(updatedTasks);
    updateProjectProgress(taskToDelete.projectId, updatedTasks);
    
    // Also cleanup comments for that task
    setComments((prev) => prev.filter((c) => c.taskId !== taskId));
    
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
    }
    showToast(`Task deleted`, 'info');
  };

  const moveTaskStatus = (taskId: string, targetStatus: string) => {
    const oldTask = tasks.find((t) => t.id === taskId);
    if (!oldTask) return;
    if (oldTask.status === targetStatus) return;

    const updatedTasks = tasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          status: targetStatus,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return t;
    });

    setTasks(updatedTasks);
    updateProjectProgress(oldTask.projectId, updatedTasks);
    
    const statusLabels: Record<string, string> = {
      backlog: 'Backlog',
      to_do: 'To Do',
      in_progress: 'In Progress',
      review: 'Review',
      done: 'Done'
    };
    
    showToast(`Moved to ${statusLabels[targetStatus] || targetStatus}`, 'success');
  };

  const addComment = (taskId: string, authorId: string, message: string) => {
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      taskId,
      authorId,
      message,
      createdAt: new Date().toISOString()
    };

    setComments((prev) => [...prev, newComment]);
    
    // Append to task's commentIds list
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === taskId ? { ...t, commentIds: [...t.commentIds, newComment.id] } : t
      )
    );
  };

  const toggleChecklistItem = (taskId: string, itemId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.id === taskId) {
          const updatedChecklist = t.checklist.map((item) =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          );
          return { ...t, checklist: updatedChecklist };
        }
        return t;
      })
    );
  };

  const addChecklistItem = (taskId: string, label: string) => {
    const newItem = {
      id: `check_${Date.now()}`,
      label,
      completed: false
    };

    setTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.id === taskId) {
          return { ...t, checklist: [...t.checklist, newItem] };
        }
        return t;
      })
    );
  };

  const deleteChecklistItem = (taskId: string, itemId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.id === taskId) {
          return { ...t, checklist: t.checklist.filter((item) => item.id !== itemId) };
        }
        return t;
      })
    );
  };

  return (
    <TaskFlowContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        projects,
        tasks,
        comments,
        activeTab,
        setActiveTab,
        selectedProjectId,
        setSelectedProjectId,
        selectedTaskId,
        setSelectedTaskId,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        clearAllFilters,
        preferences,
        updatePreference,
        
        createProject,
        createTask,
        updateTask,
        deleteTask,
        moveTaskStatus,
        addComment,
        toggleChecklistItem,
        addChecklistItem,
        deleteChecklistItem,
        
        toasts,
        showToast,
        dismissToast,
        getProjectById,
        getUserById,
        getTasksByProject,
        getCommentsForTask
      }}
    >
      {children}
    </TaskFlowContext.Provider>
  );
};

export const useTaskFlow = () => {
  const context = useContext(TaskFlowContext);
  if (!context) {
    throw new Error('useTaskFlow must be used within a TaskFlowProvider');
  }
  return context;
};
