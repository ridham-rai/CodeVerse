import React, { useState } from 'react';
import type { CodeError, FileType } from '../types/index';

interface ErrorExplanationProps {
  errors: CodeError[];
  activeTab: FileType;
  onFixApply: (error: CodeError) => void;
  onErrorDismiss: (errorId: string) => void;
}

const ErrorExplanation: React.FC<ErrorExplanationProps> = ({
  errors,
  activeTab,
  onFixApply,
  onErrorDismiss,
}) => {
  const [expandedError, setExpandedError] = useState<string | null>(null);
  const [showOnlyCurrentTab, setShowOnlyCurrentTab] = useState(true);

  const getErrorContext = (error: CodeError): FileType => {
    if (error.id.startsWith('html-')) return 'html';
    if (error.id.startsWith('css-')) return 'css';
    if (error.id.startsWith('js-')) return 'javascript';
    if (error.id.startsWith('py-')) return 'python';
    if (error.id.startsWith('java-')) return 'java';
    if (error.id.startsWith('c-')) return 'c';
    return activeTab;
  };

  const filteredErrors = showOnlyCurrentTab 
    ? errors.filter(error => {
        const errorContext = getErrorContext(error);
        return errorContext === activeTab;
      })
    : errors;

  const getSeverityIcon = (severity: CodeError['severity']) => {
    switch (severity) {
      case 'error': return '🚨';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📝';
    }
  };

  const getSeverityColor = (severity: CodeError['severity']) => {
    switch (severity) {
      case 'error': return 'from-red-500 to-red-600';
      case 'warning': return 'from-yellow-500 to-yellow-600';
      case 'info': return 'from-blue-500 to-blue-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (filteredErrors.length === 0) {
    return (
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 m-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">✅</span>
          <div>
            <h3 className="text-white font-semibold">No Issues Found!</h3>
            <p className="text-green-100 text-sm">Your code looks clean and error-free.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border-t border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <h3 className="text-white font-semibold">🔍 Code Analysis</h3>
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {filteredErrors.length} issue{filteredErrors.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={showOnlyCurrentTab}
              onChange={(e) => setShowOnlyCurrentTab(e.target.checked)}
              className="rounded"
            />
            <span>Current tab only</span>
          </label>
        </div>
      </div>

      {/* Error List */}
      <div className="max-h-64 overflow-y-auto">
        {filteredErrors.map((error) => {
          const isExpanded = expandedError === error.id;
          
          return (
            <div key={error.id} className="border-b border-gray-700 last:border-b-0">
              {/* Error Summary */}
              <div
                className="p-4 hover:bg-gray-750 cursor-pointer transition-colors"
                onClick={() => setExpandedError(isExpanded ? null : error.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <span className="text-xl">{getSeverityIcon(error.severity)}</span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-white font-medium">{error.message}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${getSeverityColor(error.severity)} text-white`}>
                          {error.severity}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">
                        Line {error.line}, Column {error.column}
                      </p>
                      {error.suggestion && (
                        <p className="text-blue-400 text-sm mt-1">
                          💡 {error.suggestion}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {error.fixCode && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onFixApply(error);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-all"
                      >
                        🔧 Quick Fix
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onErrorDismiss(error.id);
                      }}
                      className="text-gray-400 hover:text-white p-1"
                    >
                      ✕
                    </button>
                    <span className="text-gray-500 text-xs">
                      {isExpanded ? '▼' : '▶'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expanded Error Details */}
              {isExpanded && (
                <div className="bg-gray-900 p-4 border-t border-gray-700">
                  <div className="space-y-4">
                    {/* Explanation */}
                    {error.explanation && (
                      <div>
                        <h5 className="text-yellow-400 font-semibold mb-2">📚 Explanation</h5>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {error.explanation}
                        </p>
                      </div>
                    )}

                    {/* Suggested Fix */}
                    {error.fixCode && (
                      <div>
                        <h5 className="text-green-400 font-semibold mb-2">🔧 Suggested Fix</h5>
                        <div className="bg-gray-800 rounded-lg p-3 border border-gray-600">
                          <pre className="text-green-300 text-sm font-mono overflow-x-auto">
                            {error.fixCode}
                          </pre>
                        </div>
                        <button
                          onClick={() => onFixApply(error)}
                          className="mt-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                        >
                          Apply This Fix
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 bg-gray-750">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-red-400">
              🚨 {filteredErrors.filter(e => e.severity === 'error').length} errors
            </span>
            <span className="text-yellow-400">
              ⚠️ {filteredErrors.filter(e => e.severity === 'warning').length} warnings
            </span>
            <span className="text-blue-400">
              ℹ️ {filteredErrors.filter(e => e.severity === 'info').length} info
            </span>
          </div>
          <button
            onClick={() => filteredErrors.forEach(error => onErrorDismiss(error.id))}
            className="text-gray-400 hover:text-white text-xs"
          >
            Dismiss All
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorExplanation;
