import React, { useState } from 'react';
import { useTaskFlow } from '../../context/TaskFlowContext';
import { 
  Settings, 
  Moon, 
  Sun, 
  Monitor, 
  Sliders, 
  Grid2X2, 
  AlignJustify,
  Bell,
  Palette,
  Check
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const { preferences, updatePreference, showToast } = useTaskFlow();
  
  // Local static states for non-persisted illustrative settings
  const [accentColor, setAccentColor] = useState('blue');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(false);
  const [desktopNotify, setDesktopNotify] = useState(true);

  const colorsList = [
    { id: 'blue', colorHex: 'bg-blue-600', label: 'Classic Cobalt' },
    { id: 'emerald', colorHex: 'bg-emerald-600', label: 'Zesty Emerald' },
    { id: 'indigo', colorHex: 'bg-indigo-600', label: 'Intellectual Indigo' },
    { id: 'purple', colorHex: 'bg-purple-600', label: 'Vibrant Amethyst' },
    { id: 'amber', colorHex: 'bg-amber-600', label: 'Fired Amber' },
  ];

  const handleAccentChange = (colorId: string) => {
    setAccentColor(colorId);
    showToast(`Accent color preview updated to ${colorId}!`, 'info');
  };

  return (
    <div id="settings-viewport" className="space-y-6 font-sans">
      {/* Intro header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/85">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-800 dark:text-slate-100">
            <Settings className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Workspace Settings</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Customize TaskFlow layouts, UI density, visual accents, and offline preferences</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Visual Settings Columns (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Appearance Theme */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-950 dark:text-white mb-4 flex items-center gap-2">
              <Sun className="w-4 h-4 text-slate-400" />
              Interface Theme Mode
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Adjust how TaskFlow displays in your environment. Dark themes reduce glare on nighttime devices.
            </p>

            <div className="grid grid-cols-3 gap-3">
              {/* Light button */}
              <button
                id="theme-light-btn"
                onClick={() => updatePreference('theme', 'light')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center gap-2 cursor-pointer transition-all ${
                  preferences.theme === 'light'
                    ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/10 text-blue-600 dark:text-blue-400 font-semibold ring-1 ring-blue-500'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <Sun className="w-5 h-5" />
                <span className="text-xs">Light</span>
              </button>

              {/* Dark button */}
              <button
                id="theme-dark-btn"
                onClick={() => updatePreference('theme', 'dark')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center gap-2 cursor-pointer transition-all ${
                  preferences.theme === 'dark'
                    ? 'border-blue-500 bg-blue-950/10 dark:bg-slate-800/60 text-blue-400 font-semibold ring-1 ring-blue-500'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <Moon className="w-5 h-5" />
                <span className="text-xs">Dark</span>
              </button>

              {/* System button */}
              <button
                id="theme-system-btn"
                onClick={() => updatePreference('theme', 'system')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center gap-2 cursor-pointer transition-all ${
                  preferences.theme === 'system'
                    ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 font-semibold ring-1 ring-blue-500'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <Monitor className="w-5 h-5" />
                <span className="text-xs">System</span>
              </button>
            </div>
          </div>

          {/* Section 2: Layout Density and Default Views */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-950 dark:text-white mb-4 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-slate-400" />
              Board Spacing and Density Options
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Spacing Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Layout Density
                </label>
                <p className="text-[11px] text-slate-400 mb-2">Adjust padding and item heights.</p>
                <div className="flex gap-2">
                  <button
                    id="density-comf-btn"
                    onClick={() => updatePreference('boardDensity', 'comfortable')}
                    className={`flex-1 py-2 px-3 border text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                      preferences.boardDensity === 'comfortable'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Comfortable (Standard)
                  </button>
                  <button
                    id="density-compact-btn"
                    onClick={() => updatePreference('boardDensity', 'compact')}
                    className={`flex-1 py-2 px-3 border text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                      preferences.boardDensity === 'compact'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Compact (Dense info)
                  </button>
                </div>
              </div>

              {/* Default task view choice */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Default Board View
                </label>
                <p className="text-[11px] text-slate-400 mb-2">Configure standard loading screen view.</p>
                <div className="flex gap-2">
                  <button
                    id="view-kanban-btn"
                    onClick={() => updatePreference('defaultView', 'kanban')}
                    className={`flex-1 py-2 px-3 border text-xs font-semibold rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                      preferences.defaultView === 'kanban'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Grid2X2 className="w-3.5 h-3.5" />
                    Kanban Board
                  </button>
                  <button
                    id="view-list-btn"
                    onClick={() => updatePreference('defaultView', 'list')}
                    className={`flex-1 py-2 px-3 border text-xs font-semibold rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                      preferences.defaultView === 'list'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <AlignJustify className="w-3.5 h-3.5" />
                    List View
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Accent Highlights */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-950 dark:text-white mb-4 flex items-center gap-2">
              <Palette className="w-4 h-4 text-slate-400" />
              Prototype Accent Highlight Colors
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              (Static Preview) Choose a brand tint that matches your organization guidelines.
            </p>

            <div className="flex flex-wrap gap-4">
              {colorsList.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleAccentChange(item.id)}
                  className={`w-14 h-11 rounded-lg relative cursor-pointer hover:scale-105 active:scale-95 transition-transform flex flex-col items-center justify-center text-white ${item.colorHex}`}
                  title={item.label}
                >
                  {accentColor === item.id && (
                    <span className="bg-white/15 p-1 rounded-full text-white">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar Static preferences (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Notifications Controls (Static UI Controls) */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-950 dark:text-white mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4 text-slate-400" />
              Notifications
            </h3>
            
            <div className="space-y-4">
              {/* Toggle 1 */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-xs font-semibold text-slate-755 dark:text-slate-200">Email Alerts</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">Send daily workload digests.</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* Toggle 2 */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-xs font-semibold text-slate-755 dark:text-slate-200">Push Notifications</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">Instantly ping on commentary.</span>
                </div>
                <input
                  type="checkbox"
                  checked={pushAlerts}
                  onChange={(e) => setPushAlerts(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* Toggle 3 */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-xs font-semibold text-slate-755 dark:text-slate-200">Desktop Banners</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">Show native browser triggers.</span>
                </div>
                <input
                  type="checkbox"
                  checked={desktopNotify}
                  onChange={(e) => setDesktopNotify(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Core System information block */}
          <div className="bg-slate-50 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-900 text-xs space-y-3">
            <h4 className="font-bold text-slate-800 dark:text-slate-250 uppercase font-mono tracking-wider">Workspace Node</h4>
            <div className="space-y-1 text-slate-500 font-mono text-[11px]">
              <p>Platform: React 18 + SPA</p>
              <p>Local Storage: Active</p>
              <p>HMR Status: Suspended</p>
              <p>Ref Time: June 2, 2026</p>
            </div>
            <p className="text-[10px] text-slate-400 italic mt-2">
              Any changes are synchronized directly to your browser's persistent sandbox.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
