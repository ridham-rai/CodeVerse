import React, { useRef, useEffect } from 'react';
import type { ConsoleMessage } from '../types/index';

interface ConsolePaneProps {
  messages: ConsoleMessage[];
  onClear: () => void;
  onClose: () => void;
  isVisible: boolean;
}

const ConsolePane: React.FC<ConsolePaneProps> = ({
  messages,
  onClear,
  onClose,
  isVisible,
}) => {
  const consoleRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [messages]);

  const getMessageIcon = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error': return '❌';
      case 'warn': return '⚠️';
      case 'info': return 'ℹ️';
      case 'log':
      default: return '📝';
    }
  };

  const getMessageColor = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'warn': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
      case 'log':
      default: return 'text-gray-300';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    });
  };

  if (!isVisible) return null;

  return (
    <div className="h-48 bg-gray-800 border-t border-gray-700 flex flex-col">
      {/* Console Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-300">🖥️ Console</span>
          <span className="text-xs text-gray-500">
            ({messages.length} message{messages.length !== 1 ? 's' : ''})
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onClear}
            className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
            title="Clear Console"
          >
            🗑️ Clear
          </button>
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
            title="Close Console"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Console Content */}
      <div
        ref={consoleRef}
        className="flex-1 overflow-y-auto bg-gray-900 font-mono text-sm"
      >
        {messages.length === 0 ? (
          <div className="p-4 text-gray-500 text-center">
            Console output will appear here...
          </div>
        ) : (
          <div className="p-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className="flex items-start space-x-2 py-1 px-2 hover:bg-gray-800 rounded group"
              >
                {/* Timestamp */}
                <span className="text-xs text-gray-500 font-mono shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {formatTimestamp(message.timestamp)}
                </span>
                
                {/* Icon */}
                <span className="shrink-0 text-xs">
                  {getMessageIcon(message.type)}
                </span>
                
                {/* Message */}
                <div className={`flex-1 ${getMessageColor(message.type)} break-words`}>
                  <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed">
                    {message.message}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Console Footer */}
      <div className="px-3 py-1 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {messages.filter(m => m.type === 'error').length} errors, {' '}
            {messages.filter(m => m.type === 'warn').length} warnings
          </span>
          <span>
            Press Ctrl+` to toggle console
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConsolePane;
