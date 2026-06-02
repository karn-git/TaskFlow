import React, { useState } from 'react';
import { useTaskFlow } from '../../context/TaskFlowContext';
import { X, FolderHeart, Check } from 'lucide-react';

interface CreateProjectModalProps {
  onClose: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose }) => {
  const { users, createProject, showToast } = useTaskFlow();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [memberIds, setMemberIds] = useState<string[]>(['user_001']); // Default with PM Maya Chen

  const handleToggleMember = (userId: string) => {
    setMemberIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Project Name is a strict requirement.', 'error');
      return;
    }
    if (memberIds.length === 0) {
      showToast('Please select at least one teammate to assign to this project.', 'error');
      return;
    }

    createProject(name.trim(), description.trim() || 'No descriptions specified.', memberIds);
    onClose();
  };

  return (
    <div id="create-project-overlay" className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      
      {/* Container */}
      <div 
        id="create-project-modal-box"
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 relative"
      >
        {/* Toggle close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Head */}
        <div className="mb-5 flex gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-955 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
            <FolderHeart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-950 dark:text-white">Create Project</h3>
            <p className="text-xs text-slate-505 dark:text-slate-400 leading-normal mt-0.5">Initialize a brand new team roadmap with active scope constraints.</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          
          {/* Project Name */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Project Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="form-project-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Android App Release"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Description Scope / Aim
            </label>
            <textarea
              id="form-project-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Aim of this initiative, core repositories, design schemas..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Teammates Checked allotment */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Assign Teammates <span className="text-rose-500">*</span>
            </label>
            <p className="text-[10px] text-slate-400">Select which members belong to this project context.</p>

            <div className="space-y-2 max-h-36 overflow-y-auto p-2.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-850">
              {users.map((member) => {
                const isSelected = memberIds.includes(member.id);

                return (
                  <div
                    key={member.id}
                    id={`assign-project-member-${member.id}`}
                    onClick={() => handleToggleMember(member.id)}
                    className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-white dark:hover:bg-slate-900 cursor-pointer text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                      <span className="font-medium text-slate-800 dark:text-slate-200">{member.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({member.role})</span>
                    </div>

                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isSelected 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'border-slate-300 dark:border-slate-700'
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              id="form-project-cancel"
              type="button"
              onClick={onClose}
              className="py-1.5 px-4 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850 cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="form-project-save"
              type="submit"
              className="py-1.5 px-5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-xs"
            >
              Save Project
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
