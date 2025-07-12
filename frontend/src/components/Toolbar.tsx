import React, { useState } from 'react';
import type { EditorSettings, EditorTheme, FileType, VersionHistoryItem } from '../types/index';
import { useTheme } from '../contexts/ThemeContext';
import LibraryLoader from './LibraryLoader';
import AIHelper from './AIHelper';
import VersionHistory from './VersionHistory';
import Logo from './Logo';
import UserProfile from './UserProfile';

interface ToolbarProps {
  settings: EditorSettings;
  onSettingsChange: (settings: Partial<EditorSettings>) => void;
  onSave: () => void;
  onShare: () => void;
  onDownload: () => void;
  onFormat: () => void;
  showConsole: boolean;
  onToggleConsole: () => void;
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
  onLibraryAdd: (library: any) => void;
  onLibraryRemove: (library: any) => void;
  loadedLibraries: any[];
  activeTab: FileType;
  currentCode: string;
  onCodeSuggestion: (code: string) => void;
  versionHistory: VersionHistoryItem[];
  onVersionRestore: (version: VersionHistoryItem) => void;
  onVersionClear: () => void;
  // New advanced features
  onShowGitVersionControl?: () => void;

  onShowCollaborationPanel?: () => void;
  onToggleErrorExplanation?: () => void;
  showErrorExplanation?: boolean;
  errorCount?: number;
}

const Toolbar: React.FC<ToolbarProps> = ({
  settings,
  onSettingsChange,
  onSave,
  onShare,
  onDownload,
  onFormat,
  showConsole,
  onToggleConsole,
  saveStatus = 'idle',
  onLibraryAdd,
  onLibraryRemove,
  loadedLibraries,
  activeTab,
  currentCode,
  onCodeSuggestion,
  versionHistory,
  onVersionRestore,
  onVersionClear,
  onShowGitVersionControl,

  onShowCollaborationPanel,
  onToggleErrorExplanation,
  showErrorExplanation = true,
  errorCount = 0,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const { theme: appTheme, setTheme: setAppTheme, isDark } = useTheme();

  const themes: { value: EditorTheme; label: string }[] = [
    { value: 'vs-dark', label: 'Dark' },
    { value: 'vs-light', label: 'Light' },
    { value: 'hc-black', label: 'High Contrast' },
    { value: 'monokai', label: 'Monokai' },
    { value: 'dracula', label: 'Dracula' },
  ];

  const fontSizes = [10, 12, 14, 16, 18, 20, 24];

  const getSaveButtonText = () => {
    switch (saveStatus) {
      case 'saving': return '💾 Saving...';
      case 'saved': return '✅ Saved';
      case 'error': return '❌ Error';
      default: return '💾 Save';
    }
  };

  const getSaveButtonClass = () => {
    const baseClass = 'toolbar-button';
    switch (saveStatus) {
      case 'saving': return `${baseClass} opacity-75 cursor-not-allowed`;
      case 'saved': return `${baseClass} bg-green-600 border-green-500`;
      case 'error': return `${baseClass} bg-red-600 border-red-500`;
      default: return baseClass;
    }
  };

  return (
    <div className="bg-gray-800 border-b border-gray-700 p-4 shadow-lg" style={{
      backgroundColor: 'var(--bg-secondary)',
      borderColor: 'var(--border-color)'
    }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Logo size="md" showText={true} />

          {/* Quick Theme Toggle */}
          <button
            onClick={() => {
              console.log('Theme toggle clicked, current isDark:', isDark);
              setAppTheme(isDark ? 'light' : 'dark');
            }}
            className="toolbar-button"
            title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {/* Settings Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`toolbar-button ${showSettings ? 'active' : ''}`}
              title="Editor Settings"
            >
              ⚙️ Settings
            </button>
            
            {showSettings && (
              <div className="absolute right-0 top-full mt-1 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 backdrop-blur-sm max-h-96 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                <div className="p-4 space-y-4">
                  {/* App Theme */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      App Theme
                    </label>
                    <select
                      value={appTheme}
                      onChange={(e) => setAppTheme(e.target.value as any)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm"
                    >
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="auto">Auto (System)</option>
                    </select>
                  </div>
                  {/* Theme */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Theme
                    </label>
                    <select
                      value={settings.theme}
                      onChange={(e) => onSettingsChange({ theme: e.target.value as EditorTheme })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm"
                    >
                      {themes.map(theme => (
                        <option key={theme.value} value={theme.value}>
                          {theme.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Font Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Font Size
                    </label>
                    <select
                      value={settings.fontSize}
                      onChange={(e) => onSettingsChange({ fontSize: parseInt(e.target.value) })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm"
                    >
                      {fontSizes.map(size => (
                        <option key={size} value={size}>
                          {size}px
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tab Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Tab Size
                    </label>
                    <select
                      value={settings.tabSize}
                      onChange={(e) => onSettingsChange({ tabSize: parseInt(e.target.value) })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm"
                    >
                      <option value={2}>2 spaces</option>
                      <option value={4}>4 spaces</option>
                      <option value={8}>8 spaces</option>
                    </select>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.wordWrap}
                        onChange={(e) => onSettingsChange({ wordWrap: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-300">Word Wrap</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.minimap}
                        onChange={(e) => onSettingsChange({ minimap: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-300">Minimap</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.lineNumbers}
                        onChange={(e) => onSettingsChange({ lineNumbers: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-300">Line Numbers</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onToggleConsole}
            className={`toolbar-button ${showConsole ? 'active' : ''}`}
          >
            🖥️ Console
          </button>

          <button
            onClick={() => {
              console.log('Format button clicked');
              onFormat();
            }}
            className="toolbar-button"
            title="Format Code (Shift+Alt+F)"
          >
            ✨ Format
          </button>

          <LibraryLoader
            onLibraryAdd={onLibraryAdd}
            onLibraryRemove={onLibraryRemove}
            loadedLibraries={loadedLibraries}
          />

          <VersionHistory
            versions={versionHistory}
            onRestore={onVersionRestore}
            onClear={onVersionClear}
          />

          <AIHelper
            currentCode={currentCode}
            activeTab={activeTab}
            onCodeSuggestion={onCodeSuggestion}
          />

          {/* Advanced Features Separator */}
          <div className="w-px h-6 bg-gray-600 mx-2"></div>

          {/* Git-like Version Control */}
          {onShowGitVersionControl && (
            <button
              onClick={onShowGitVersionControl}
              className="toolbar-button"
              title="Git-like Version Control"
            >
              🌿 Git
            </button>
          )}



          {/* Live Collaboration */}
          {onShowCollaborationPanel && (
            <button
              onClick={onShowCollaborationPanel}
              className="toolbar-button"
              title="Live Collaboration"
            >
              👥 Collaborate
            </button>
          )}

          {/* Error Explanation Toggle */}
          {onToggleErrorExplanation && (
            <button
              onClick={onToggleErrorExplanation}
              className={`toolbar-button ${showErrorExplanation ? 'active' : ''}`}
              title="Toggle Error Explanation"
            >
              🔍 Errors {errorCount > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs px-1 rounded-full">
                  {errorCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={onSave}
            className={getSaveButtonClass()}
            disabled={saveStatus === 'saving'}
            title="Save to History (Ctrl+S)"
          >
            {getSaveButtonText()}
          </button>

          <button
            onClick={onDownload}
            className="toolbar-button"
            title="Download Project (Ctrl+D)"
          >
            📥 Download
          </button>

          <button
            onClick={onShare}
            className="toolbar-button"
            title="Share Project"
          >
            🔗 Share
          </button>

          {/* User Profile */}
          <UserProfile />
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
