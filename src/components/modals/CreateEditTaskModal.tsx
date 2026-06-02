import React, { useState, useEffect } from 'react';
import { useTaskFlow } from '../../context/TaskFlowContext';
import { Task, ChecklistItem } from '../../types';
import { X, Plus, Trash2, Tag, CheckSquare, AlertTriangle } from 'lucide-react';

interface CreateEditTaskModalProps {
  taskIdToEdit?: string | null;
  onClose: () => void;
}

export const CreateEditTaskModal: React.FC<CreateEditTaskModalProps> = ({ taskIdToEdit, onClose }) => {
  const {
    tasks,
    projects,
    users,
    createTask,
    updateTask,
    showToast,
    selectedProjectId
  } = useTaskFlow();

  const isEditing = !!taskIdToEdit;
  const taskToEdit = isEditing ? tasks.find(t => t.id === taskIdToEdit) : null;

  // Form states initialized
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [status, setStatus] = useState('to_do');
  const [priority, setPriority] = useState('medium');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('2026-06-05');
  const [tagsInput, setTagsInput] = useState('');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newCheckItem, setNewCheckItem] = useState('');

  // Validation states
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate data if editing
  useEffect(() => {
    if (isEditing && taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setProjectId(taskToEdit.projectId);
      setStatus(taskToEdit.status);
      setPriority(taskToEdit.priority);
      setAssigneeId(taskToEdit.assigneeId);
      setDueDate(taskToEdit.dueDate);
      setTagsInput(taskToEdit.tags?.join(', ') || '');
      setChecklist(taskToEdit.checklist || []);
    } else {
      // Setup default project from view hierarchy if available
      if (selectedProjectId) {
        setProjectId(selectedProjectId);
      } else if (projects.length > 0) {
        setProjectId(projects[0].id);
      }
      
      if (users.length > 0) {
        setAssigneeId(users[0].id);
      }
    }
  }, [isEditing, taskToEdit, selectedProjectId, projects, users]);

  const handleAddCheckItem = () => {
    if (!newCheckItem.trim()) return;
    const newItem: ChecklistItem = {
      id: `check_${Date.now()}`,
      label: newCheckItem.trim(),
      completed: false
    };
    setChecklist(prev => [...prev, newItem]);
    setNewCheckItem('');
  };

  const handleRemoveCheckItem = (id: string) => {
    setChecklist(prev => prev.filter(c => c.id !== id));
  };

  const handleValidate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) {
      errs.title = 'Task title is required.';
    } else if (title.trim().length > 120) {
      errs.title = 'Title should not exceed 120 characters.';
    }

    if (!projectId) {
      errs.projectId = 'Project selection is required.';
    }

    if (!assigneeId) {
      errs.assigneeId = 'Assignee assignment is required.';
    }

    if (!dueDate) {
      errs.dueDate = 'Due Date is required.';
    } else if (isNaN(Date.parse(dueDate))) {
      errs.dueDate = 'Due date must be a valid date representation.';
    }

    if (!priority) {
      errs.priority = 'Priority selection is required.';
    }

    if (description.length > 1000) {
      errs.description = 'Description should not exceed 1,000 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleValidate()) {
      showToast('Please resolve validation issues in the form.', 'error');
      return;
    }

    // Process tags comma list
    const tagsArray = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const taskFields = {
      projectId,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      assigneeId,
      dueDate,
      tags: tagsArray,
      checklist
    };

    if (isEditing && taskIdToEdit) {
      updateTask(taskIdToEdit, taskFields);
    } else {
      createTask(taskFields);
    }

    onClose();
  };

  return (
    <div id="create-edit-task-overlay" className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      
      {/* Modal Container */}
      <div 
        id="create-edit-task-modal"
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl p-6 relative flex flex-col max-h-[90vh]"
      >
        
        {/* Toggle close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-950 dark:text-white">
            {isEditing ? 'Modify Visual Task' : 'Create New Task'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isEditing ? 'Adjust task deliverables, dates, and ownership records.' : 'Add a clear scope, due date, and ownership markers.'}
          </p>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="space-y-4 overflow-y-auto pr-1 flex-1">
          
          {/* Title input */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="form-task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Set up database credentials"
              className={`w-full px-3 py-2 rounded-lg border text-xs text-slate-900 dark:text-white bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                errors.title ? 'border-red-500 bg-red-50/5' : 'border-slate-300 dark:border-slate-755'
              }`}
            />
            {errors.title && (
              <span className="text-[10px] text-red-500 flex items-center gap-1 mt-0.5 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                {errors.title}
              </span>
            )}
          </div>

          {/* Project Selector */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Assigned Project <span className="text-rose-500">*</span>
            </label>
            <select
              id="form-task-project"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-755 text-xs text-slate-800 dark:text-slate-200 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-505"
            >
              <option value="">-- Choose project --</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            {errors.projectId && (
              <span className="text-[10px] text-red-505 block font-medium mt-0.5">{errors.projectId}</span>
            )}
          </div>

          {/* Row layout for columns: Assignee & Priority */}
          <div className="grid grid-cols-2 gap-3">
            {/* Assignee Selection */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Member Assignee <span className="text-rose-500">*</span>
              </label>
              <select
                id="form-task-assignee"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-755 text-xs text-slate-800 dark:text-slate-250 bg-transparent focus:outline-none focus:ring-1"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} — {u.role}</option>
                ))}
              </select>
              {errors.assigneeId && (
                <span className="text-[10px] text-red-500 block font-medium mt-0.5">{errors.assigneeId}</span>
              )}
            </div>

            {/* Priority option selection */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Urgency Priority <span className="text-rose-500">*</span>
              </label>
              <select
                id="form-task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-755 text-xs text-slate-805 dark:text-slate-200 bg-transparent focus:outline-none focus:ring-1"
              >
                <option value="low">🌱 Low Priority</option>
                <option value="medium">⚡ Medium Priority</option>
                <option value="high">🔴 High Priority</option>
              </select>
            </div>
          </div>

          {/* Row Layout for due date and status */}
          <div className="grid grid-cols-2 gap-3">
            {/* Due Date Picker */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Milestone Due Date <span className="text-rose-500">*</span>
              </label>
              <input
                id="form-task-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-755 text-xs text-slate-800 dark:text-slate-200 bg-transparent focus:outline-none focus:ring-1"
              />
              {errors.dueDate && (
                <span className="text-[10px] text-red-500 block font-medium mt-0.5">{errors.dueDate}</span>
              )}
            </div>

            {/* Status column group */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Task Column Status
              </label>
              <select
                id="form-task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-755 text-xs text-slate-800 dark:text-slate-200 bg-transparent focus:outline-none focus:ring-1"
              >
                <option value="backlog">Backlog</option>
                <option value="to_do">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {/* Description input */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Task Deliverable Scope / Description
            </label>
            <textarea
              id="form-task-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="List out scope of work, relevant repository links, and technical details..."
              className={`w-full px-3 py-2 rounded-lg border text-xs text-slate-800 dark:text-slate-200 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                errors.description ? 'border-red-500 bg-red-50/5' : 'border-slate-300 dark:border-slate-755'
              }`}
            />
            <div className="flex justify-between mt-0.5 text-[9px] text-slate-400">
              <span>Limit: 1,000 chars</span>
              <span>{description.length}/1000</span>
            </div>
            {errors.description && (
              <span className="text-[10px] text-red-500 block font-medium">{errors.description}</span>
            )}
          </div>

          {/* Tags list (comma input) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              Tags / Labels (Comma separated)
            </label>
            <input
              id="form-task-tags-csv"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. frontend, responsive, bug-fix"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-755 text-xs text-slate-800 dark:text-slate-200 bg-transparent focus:outline-none focus:ring-1"
            />
          </div>

          {/* Checklist Area (PRD sections 3.8 and 3.9) */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <label className="text-xs font-semibold text-slate-755 dark:text-slate-200 flex items-center gap-1">
              <CheckSquare className="w-3.5 h-3.5 text-blue-500" />
              Task Deliverable Checklist ({checklist.length})
            </label>

            {/* Checklist lists */}
            {checklist.length > 0 && (
              <div className="space-y-2 max-h-24 overflow-y-auto mb-2 p-2 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800">
                {checklist.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs text-slate-750 dark:text-slate-300">
                    <span className="truncate pr-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                      {item.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCheckItem(item.id)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 text-rose-500 rounded cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add list item */}
            <div className="flex gap-1.5">
              <input
                id="form-task-checklist-adder"
                type="text"
                value={newCheckItem}
                onChange={(e) => setNewCheckItem(e.target.value)}
                placeholder="Add checklist sub-task item..."
                className="w-full px-3 py-1.5 rounded-lg border border-slate-250 dark:border-slate-800 text-[11px] bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCheckItem}
                className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 border border-slate-250 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer flex items-center shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Buttons Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <button
              id="form-task-cancel-btn"
              type="button"
              onClick={onClose}
              className="py-1.5 px-4 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              id="form-task-submit-btn"
              type="submit"
              className="py-1.5 px-5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-xs transition-colors"
            >
              {isEditing ? 'Save Changes' : 'Save Task'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
