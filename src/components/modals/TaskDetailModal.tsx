import React, { useState } from 'react';
import { useTaskFlow } from '../../context/TaskFlowContext';
import { Avatar } from '../Avatar';
import { 
  X, 
  Edit3, 
  Trash2, 
  Calendar, 
  MessageSquare, 
  CheckSquare, 
  Paperclip, 
  Circle,
  CheckCircle2,
  Send,
  Sparkles,
  ClipboardList
} from 'lucide-react';

interface TaskDetailModalProps {
  taskId: string;
  onClose: () => void;
  onEditClick: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ taskId, onClose, onEditClick }) => {
  const {
    tasks,
    projects,
    users,
    comments,
    currentUser,
    toggleChecklistItem,
    addComment,
    addChecklistItem,
    deleteTask,
    getCommentsForTask,
    showToast
  } = useTaskFlow();

  const task = tasks.find(t => t.id === taskId);
  const [commentText, setCommentText] = useState('');
  const [newCheckText, setNewCheckText] = useState('');

  if (!task) return null;

  const project = projects.find(p => p.id === task.projectId);
  const assignee = users.find(u => u.id === task.assigneeId);
  const taskComments = getCommentsForTask(task.id);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (commentText.length > 500) {
      showToast('Comment should not exceed 500 characters.', 'error');
      return;
    }
    if (!currentUser) {
      showToast('You must be logged in as a demo user to post comments.', 'error');
      return;
    }

    addComment(task.id, currentUser.id, commentText.trim());
    setCommentText('');
    showToast('Comment appended is successful!', 'success');
  };

  const handleChecklistKeyAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newCheckText.trim()) {
      addChecklistItem(task.id, newCheckText.trim());
      setNewCheckText('');
      showToast('Checklist item added!', 'info');
    }
  };

  const handleDeleteTrigger = () => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      deleteTask(task.id);
      onClose();
    }
  };

  const getPriorityTheme = (p: string) => {
    switch (p) {
      case 'high': return 'bg-rose-50 border-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-450';
      case 'medium': return 'bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-955/20 dark:text-amber-400';
      default: return 'bg-slate-150 border-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div id="task-detail-overlay" className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      
      {/* Container */}
      <div 
        id="task-detail-modal-box"
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl flex flex-col md:flex-row max-h-[90vh] overflow-hidden"
      >
        
        {/* Main Details Section (Left on Desktop, Top on Mobile) */}
        <div className="flex-1 p-6 overflow-y-auto max-h-[50vh] md:max-h-none border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 space-y-5">
          {/* Project Breadcrumb & Operations */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase truncate max-w-[200px]">
              {project?.name || 'Workspace Root'}
            </span>
            
            <div className="flex items-center gap-1 shrink-0">
              {/* Edit task button */}
              <button
                id="task-detail-edit-m"
                onClick={onEditClick}
                className="p-1 px-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-755 text-slate-655 hover:text-blue-600 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                title="Edit Task deliverables"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </button>
              
              {/* Trash */}
              <button
                id="task-detail-trash-m"
                onClick={handleDeleteTrigger}
                className="p-1 text-slate-400 hover:text-rose-500 rounded-lg cursor-pointer"
                title="Delete task permanently"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Task Title */}
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white leading-normal">
              {task.title}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getPriorityTheme(task.priority)}`}>
                {task.priority} Priority
              </span>
              <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md">
                Status: {task.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Task description */}
          <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Scope Details</h4>
            <div className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
              {task.description || (
                <p className="text-slate-405 italic">No technical scope description was specified for this task.</p>
              )}
            </div>
          </div>

          {/* Checklist subtasks */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1">
              <CheckSquare className="w-4 h-4 text-slate-350" />
              Subtasks Checklist ({task.checklist.filter(c => c.completed).length}/{task.checklist.length})
            </h4>

            <div className="space-y-2">
              {task.checklist.map((item) => (
                <div
                  key={item.id}
                  id={`checklist-item-${item.id}`}
                  onClick={() => toggleChecklistItem(task.id, item.id)}
                  className="flex items-center gap-2.5 py-1 text-xs text-slate-800 dark:text-slate-250 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg px-1"
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 shrink-0 hover:text-blue-500" />
                  )}
                  <span className={item.completed ? 'line-through text-slate-400' : ''}>
                    {item.label}
                  </span>
                </div>
              ))}

              {/* Directly add checkpoint item inside detail view */}
              <div className="pt-1 flex gap-2">
                <input
                  id="detail-add-check-quick-field"
                  type="text"
                  value={newCheckText}
                  onChange={(e) => setNewCheckText(e.target.value)}
                  onKeyDown={handleChecklistKeyAdd}
                  placeholder="Type subtask and press Enter..."
                  className="w-full text-[11px] bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Tags list */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {task.tags.map((tg) => (
                <span key={tg} className="text-[9px] bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded font-mono border border-slate-100 dark:border-slate-800">
                  #{tg}
                </span>
              ))}
            </div>
          )}

          {/* Dates metadata info */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400 space-y-1 font-mono">
            <div>Created Date: {task.createdAt}</div>
            <div>Last Updated: {task.updatedAt}</div>
          </div>
        </div>

        {/* Sidebar/Right-side pane containing Assignee details & Comments column (Right on Desktop, Bottom on Mobile) */}
        <div className="w-full md:w-80 bg-slate-50 dark:bg-slate-900/40 p-6 flex flex-col justify-between max-h-[40vh] md:max-h-none overflow-hidden">
          
          <div className="flex flex-col space-y-5 flex-1 min-h-0 overflow-hidden">
            {/* Owner Assignee detail summary section */}
            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3 shadow-xs">
              {assignee ? (
                <>
                  <Avatar userId={assignee.id} name={assignee.name} size="sm" />
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold font-mono">Teammate Assignee</span>
                    <span className="block text-xs font-bold text-slate-905 dark:text-white leading-tight">{assignee.name}</span>
                    <span className="block text-[10px] text-slate-400">{assignee.role}</span>
                  </div>
                </>
              ) : (
                <span className="text-xs text-slate-400 italic">No assigned owner</span>
              )}
            </div>

            {/* Target Deadline */}
            <div className="flex items-center gap-2 px-1 text-xs text-slate-655 dark:text-slate-300 font-medium">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Due: <strong className="text-blue-600 dark:text-blue-400 font-mono select-all">{task.dueDate}</strong></span>
            </div>

            {/* Comments column section header (PRD Section 3.8 / 5.5) */}
            <div className="flex-1 flex flex-col min-h-0 pt-2 pb-1 border-t border-slate-200/55 dark:border-slate-800/80 overflow-hidden">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5 mb-2.5 shrink-0">
                <MessageSquare className="w-3.5 h-3.5" />
                Collaboration Comments ({taskComments.length})
              </h4>

              {/* Comments stream scroll lists */}
              <div id="comments-thread-stream" className="flex-1 overflow-y-auto space-y-3.5 pr-1 mb-2.5">
                {taskComments.length === 0 ? (
                  <div className="text-center py-6 text-slate-400">
                    <p className="text-[10px] italic">No visual comments yet. Be the first to start collaboration!</p>
                  </div>
                ) : (
                  taskComments.map((comment) => {
                    const author = users.find(u => u.id === comment.authorId);
                    // Standard timestamp resolution
                    const commentTimeStr = comment.createdAt.includes('T') 
                      ? comment.createdAt.split('T')[1].slice(0, 5) 
                      : comment.createdAt;

                    return (
                      <div key={comment.id} id={`comment-block-${comment.id}`} className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-bold text-slate-700 dark:text-slate-300">{author?.name || 'Teammate'}</span>
                          <span className="font-mono">{commentTimeStr}</span>
                        </div>
                        <p className="text-xs bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-2.5 rounded-lg text-slate-700 dark:text-slate-250 leading-relaxed shadow-xs">
                          {comment.message}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input tool form to add comment */}
              <form onSubmit={handlePostComment} className="flex gap-1.5 shrink-0">
                <input
                  id="detail-comment-input-field"
                  type="text"
                  required
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Post brief teammate update..."
                  className="w-full text-xs min-h-[34px] px-3 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-none"
                />
                <button
                  id="detail-post-comment-btn"
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg cursor-pointer flex items-center justify-center shrink-0"
                  title="Submit Comment"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Modal close footer trigger */}
          <div className="pt-3 border-t border-slate-200/55 dark:border-slate-800/80 flex justify-end shrink-0">
            <button
              id="detail-close-modal-btn"
              onClick={onClose}
              className="py-1.5 px-4 rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-semibold cursor-pointer text-center"
            >
              Close Detailed view
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
