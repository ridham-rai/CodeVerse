import React, { useState, useEffect } from 'react';
import type { GitLikeVersion, CommitMessage } from '../types/index';

interface GitLikeVersionControlProps {
  isOpen: boolean;
  onClose: () => void;
  versions: GitLikeVersion[];
  onVersionRestore: (version: GitLikeVersion) => void;
  onVersionClear: () => void;
  onCommit: (message: string) => void;
  currentCode: {
    htmlCode: string;
    cssCode: string;
    jsCode: string;
    pythonCode?: string;
    javaCode?: string;
    cCode?: string;
    cppCode?: string;
  };
}

const GitLikeVersionControl: React.FC<GitLikeVersionControlProps> = ({
  isOpen,
  onClose,
  versions,
  onVersionRestore,
  onVersionClear,
  onCommit,
  currentCode,
}) => {
  const [commitMessage, setCommitMessage] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<GitLikeVersion | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'diff' | 'branches'>('timeline');
  const [currentBranch, setCurrentBranch] = useState('main');

  if (!isOpen) return null;

  const handleCommit = () => {
    if (commitMessage.trim()) {
      onCommit(commitMessage.trim());
      setCommitMessage('');
    }
  };

  const calculateChanges = (version: GitLikeVersion) => {
    if (versions.length === 0) return { added: 0, deleted: 0, modified: 0 };
    
    const prevIndex = versions.findIndex(v => v.id === version.id) + 1;
    const prevVersion = versions[prevIndex];
    
    if (!prevVersion) return { added: 10, deleted: 0, modified: 5 }; // First commit
    
    // Simple line-based diff calculation
    const currentLines = (version.htmlCode + version.cssCode + version.jsCode).split('\n').length;
    const prevLines = (prevVersion.htmlCode + prevVersion.cssCode + prevVersion.jsCode).split('\n').length;
    
    return {
      added: Math.max(0, currentLines - prevLines),
      deleted: Math.max(0, prevLines - currentLines),
      modified: Math.min(currentLines, prevLines) / 10, // Rough estimate
    };
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden flex flex-col border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gradient-to-r from-green-600 to-blue-600">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              🌿
            </div>
            <h2 className="text-xl font-bold text-white">Git-like Version Control</h2>
            <span className="bg-white bg-opacity-20 text-white text-xs px-2 py-1 rounded-full">
              {currentBranch}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-700 bg-gray-800">
          {[
            { id: 'timeline', label: '📅 Timeline', icon: '📅' },
            { id: 'diff', label: '🔍 Diff View', icon: '🔍' },
            { id: 'branches', label: '🌿 Branches', icon: '🌿' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id as any)}
              className={`px-6 py-3 font-medium transition-all ${
                viewMode === tab.id
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-750'
                  : 'text-gray-400 hover:text-white hover:bg-gray-750'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-6">
          {viewMode === 'timeline' && (
            <div className="space-y-6">
              {/* Commit Section */}
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl p-6 border border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  💾 Create New Commit
                </h3>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="Enter commit message..."
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && handleCommit()}
                  />
                  <button
                    onClick={handleCommit}
                    disabled={!commitMessage.trim()}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:cursor-not-allowed"
                  >
                    Commit
                  </button>
                </div>
              </div>

              {/* Version Timeline */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {versions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No Commits Yet</h3>
                    <p className="text-gray-400">Create your first commit to start tracking changes</p>
                  </div>
                ) : (
                  versions.map((version, index) => {
                    const changes = calculateChanges(version);
                    return (
                      <div
                        key={version.id}
                        className={`bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl p-5 border transition-all duration-300 cursor-pointer ${
                          selectedVersion?.id === version.id
                            ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                        onClick={() => setSelectedVersion(version)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <h4 className="font-semibold text-white">
                                {version.commitMessage || `Version ${versions.length - index}`}
                              </h4>
                              <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded-full">
                                {version.id.slice(0, 7)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                              <span>👤 {version.author || 'You'}</span>
                              <span>🕒 {formatTimeAgo(version.timestamp)}</span>
                              <span>🌿 {version.branch || 'main'}</span>
                            </div>
                            <div className="flex items-center space-x-4 text-xs">
                              <span className="text-green-400">+{changes.added} additions</span>
                              <span className="text-red-400">-{changes.deleted} deletions</span>
                              <span className="text-yellow-400">~{Math.floor(changes.modified)} modifications</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onVersionRestore(version);
                              }}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-all"
                            >
                              Restore
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewMode('diff');
                                setSelectedVersion(version);
                              }}
                              className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-xs font-medium transition-all"
                            >
                              View Diff
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {viewMode === 'diff' && selectedVersion && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Diff View: {selectedVersion.commitMessage || 'Unnamed Commit'}
                </h3>
                <button
                  onClick={() => setViewMode('timeline')}
                  className="text-gray-400 hover:text-white"
                >
                  ← Back to Timeline
                </button>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  {/* HTML Diff */}
                  <div>
                    <h4 className="text-blue-400 font-semibold mb-2">📄 HTML Changes</h4>
                    <div className="bg-gray-800 rounded p-3">
                      <div className="text-green-400">+ {selectedVersion.htmlCode.split('\n').length} lines</div>
                      <pre className="text-gray-300 text-xs mt-2 overflow-auto max-h-24" style={{ scrollbarWidth: 'thin' }}>
                        {selectedVersion.htmlCode.slice(0, 200)}...
                      </pre>
                    </div>
                  </div>
                  
                  {/* CSS Diff */}
                  <div>
                    <h4 className="text-purple-400 font-semibold mb-2">🎨 CSS Changes</h4>
                    <div className="bg-gray-800 rounded p-3">
                      <div className="text-green-400">+ {selectedVersion.cssCode.split('\n').length} lines</div>
                      <pre className="text-gray-300 text-xs mt-2 overflow-auto max-h-24" style={{ scrollbarWidth: 'thin' }}>
                        {selectedVersion.cssCode.slice(0, 200)}...
                      </pre>
                    </div>
                  </div>
                  
                  {/* JS Diff */}
                  <div>
                    <h4 className="text-yellow-400 font-semibold mb-2">⚡ JavaScript Changes</h4>
                    <div className="bg-gray-800 rounded p-3">
                      <div className="text-green-400">+ {selectedVersion.jsCode.split('\n').length} lines</div>
                      <pre className="text-gray-300 text-xs mt-2 overflow-auto max-h-24" style={{ scrollbarWidth: 'thin' }}>
                        {selectedVersion.jsCode.slice(0, 200)}...
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'branches' && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🌿</div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">Branch Management</h3>
                <p className="text-gray-400 mb-6">Advanced branching features coming soon!</p>
                <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl p-6 max-w-md mx-auto">
                  <h4 className="text-white font-semibold mb-3">Current Branch</h4>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className="text-green-400 font-mono">{currentBranch}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-700 bg-gray-800">
          <div className="text-gray-400 text-sm">
            {versions.length > 0 && (
              <span>📊 {versions.length} commits • Latest: {formatTimeAgo(versions[0]?.timestamp)}</span>
            )}
          </div>
          <div className="flex space-x-3">
            {versions.length > 0 && (
              <button
                onClick={onVersionClear}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
              >
                Clear History
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-medium transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitLikeVersionControl;
