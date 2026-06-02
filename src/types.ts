export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  avatarUrl: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'planning' | 'completed' | string;
  progress: number;
  memberIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  message: string;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'backlog' | 'to_do' | 'in_progress' | 'review' | 'done' | string;
  priority: 'low' | 'medium' | 'high' | string;
  assigneeId: string;
  dueDate: string;
  tags: string[];
  checklist: ChecklistItem[];
  commentIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StatusColumn {
  id: string;
  label: string;
}

export interface PriorityOption {
  id: string;
  label: string;
}

export interface AppPreferences {
  theme: 'light' | 'dark' | 'system';
  boardDensity: 'comfortable' | 'compact';
  defaultView: 'kanban' | 'list';
}
