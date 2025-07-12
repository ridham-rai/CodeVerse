import React, { useState } from 'react';
import type { VersionHistoryItem } from '../types/index';

interface VersionHistoryProps {
  versions: VersionHistoryItem[];
  onRestore: (version: VersionHistoryItem) => void;
  onClear: () => void;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({ versions, onRestore, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<VersionHistoryItem | null>(null);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(new Date(date));
  };

  const getCodePreview = (version: VersionHistoryItem) => {
    const htmlLines = version.htmlCode.split('\n').length;
    const cssLines = version.cssCode.split('\n').length;
    const jsLines = version.jsCode.split('\n').length;
    return `${htmlLines} HTML, ${cssLines} CSS, ${jsLines} JS lines`;
  };

  const handleRestore = (version: VersionHistoryItem) => {
    onRestore(version);
    setIsOpen(false);
    setSelectedVersion(null);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="toolbar-button"
        title="Version History"
      >
        📚 History ({versions.length})
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden flex">
        {/* Version List */}
        <div className="w-1/2 pr-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">📚 Version History</h2>
            <div className="flex space-x-2">
              <button
                onClick={onClear}
                className="text-red-400 hover:text-red-300 text-sm"
                title="Clear All History"
              >
                🗑️ Clear All
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {versions.length === 0 ? (
              <div className="text-gray-400 text-center py-8">
                No versions saved yet. Use Ctrl+S to save your current work.
              </div>
            ) : (
              versions.map((version, index) => (
                <div
                  key={version.id}
                  onClick={() => setSelectedVersion(version)}
                  className={`p-3 rounded cursor-pointer transition-colors ${
                    selectedVersion?.id === version.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        Version {versions.length - index}
                      </div>
                      <div className="text-sm opacity-75">
                        {formatDate(version.timestamp)}
                      </div>
                      <div className="text-xs opacity-60">
                        {getCodePreview(version)}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestore(version);
                      }}
                      className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded"
                    >
                      Restore
                    </button>
                  </div>
                  {version.description && (
                    <div className="text-xs mt-1 opacity-75">
                      {version.description}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Version Preview */}
        <div className="w-1/2 pl-4 border-l border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
          {selectedVersion ? (
            <div className="space-y-4">
              <div className="bg-gray-700 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Version Details</span>
                  <span className="text-gray-400 text-sm">
                    {formatDate(selectedVersion.timestamp)}
                  </span>
                </div>
                <div className="text-gray-300 text-sm">
                  {getCodePreview(selectedVersion)}
                </div>
                {selectedVersion.description && (
                  <div className="text-gray-400 text-sm mt-2">
                    {selectedVersion.description}
                  </div>
                )}
              </div>

              {/* Code Tabs */}
              <div className="bg-gray-700 rounded overflow-hidden">
                <div className="flex border-b border-gray-600">
                  <div className="px-3 py-2 bg-gray-600 text-white text-sm">HTML</div>
                </div>
                <pre className="p-3 text-gray-300 text-xs overflow-auto max-h-32 bg-gray-800">
                  {selectedVersion.htmlCode || '// No HTML code'}
                </pre>
              </div>

              <div className="bg-gray-700 rounded overflow-hidden">
                <div className="flex border-b border-gray-600">
                  <div className="px-3 py-2 bg-gray-600 text-white text-sm">CSS</div>
                </div>
                <pre className="p-3 text-gray-300 text-xs overflow-auto max-h-32 bg-gray-800">
                  {selectedVersion.cssCode || '/* No CSS code */'}
                </pre>
              </div>

              <div className="bg-gray-700 rounded overflow-hidden">
                <div className="flex border-b border-gray-600">
                  <div className="px-3 py-2 bg-gray-600 text-white text-sm">JavaScript</div>
                </div>
                <pre className="p-3 text-gray-300 text-xs overflow-auto max-h-32 bg-gray-800">
                  {selectedVersion.jsCode || '// No JavaScript code'}
                </pre>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleRestore(selectedVersion)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Restore This Version
                </button>
                <button
                  onClick={() => setSelectedVersion(null)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-center py-8">
              Select a version from the list to preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VersionHistory;
