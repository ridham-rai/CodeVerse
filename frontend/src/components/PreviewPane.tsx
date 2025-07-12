import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { ConsoleMessage } from '../types/index';

interface PreviewPaneProps {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  onConsoleMessage?: (message: ConsoleMessage) => void;
  externalLibraries?: any[];
}

const PreviewPane: React.FC<PreviewPaneProps> = ({
  htmlCode,
  cssCode,
  jsCode,
  onConsoleMessage,
  externalLibraries = [],
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate the preview content
  const generatePreviewContent = useCallback(() => {
    console.log('Generating preview with libraries:', externalLibraries);
    // Extract body content from HTML, removing html/head/body tags
    let bodyContent = htmlCode;
    
    // Remove DOCTYPE declaration
    bodyContent = bodyContent.replace(/<!DOCTYPE[^>]*>/i, '');
    
    // Extract content between body tags, or use full content if no body tags
    const bodyMatch = bodyContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      bodyContent = bodyMatch[1];
    } else {
      // Remove html, head, and body tags if they exist
      bodyContent = bodyContent
        .replace(/<\/?html[^>]*>/gi, '')
        .replace(/<head[\s\S]*?<\/head>/gi, '')
        .replace(/<\/?body[^>]*>/gi, '');
    }

    // Generate external library links
    const externalCSSLinks = externalLibraries
      .filter(lib => lib.css)
      .map(lib => `<link rel="stylesheet" href="${lib.css}">`)
      .join('\n    ');

    const externalJSLinks = externalLibraries
      .filter(lib => lib.js)
      .map(lib => `<script src="${lib.js}"></script>`)
      .join('\n    ');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    ${externalCSSLinks}
    <style>
        /* Reset some default styles for better preview */
        * {
            box-sizing: border-box;
        }

        /* User CSS */
        ${cssCode}
    </style>
</head>
<body>
    ${bodyContent}
    
    <script>
        // Console capture and error handling
        (function() {
            const originalConsole = {
                log: console.log,
                error: console.error,
                warn: console.warn,
                info: console.info,
                clear: console.clear
            };
            
            function postMessage(type, method, args) {
                try {
                    window.parent.postMessage({
                        type: type,
                        method: method,
                        args: args,
                        timestamp: new Date().toISOString()
                    }, '*');
                } catch (e) {
                    // Fallback if postMessage fails
                    originalConsole.error('Failed to post message:', e);
                }
            }
            
            // Clear console on reload
            postMessage('console', 'clear', []);
            
            // Override console methods
            console.log = function(...args) {
                postMessage('console', 'log', args.map(arg => 
                    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                ));
                originalConsole.log.apply(console, args);
            };
            
            console.error = function(...args) {
                postMessage('console', 'error', args.map(arg => 
                    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                ));
                originalConsole.error.apply(console, args);
            };
            
            console.warn = function(...args) {
                postMessage('console', 'warn', args.map(arg => 
                    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                ));
                originalConsole.warn.apply(console, args);
            };
            
            console.info = function(...args) {
                postMessage('console', 'info', args.map(arg => 
                    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                ));
                originalConsole.info.apply(console, args);
            };
            
            // Handle runtime errors
            window.addEventListener('error', function(event) {
                postMessage('console', 'error', [
                    \`Error: \${event.message}\`,
                    \`File: \${event.filename || 'unknown'}\`,
                    \`Line: \${event.lineno || 'unknown'}\`,
                    \`Column: \${event.colno || 'unknown'}\`
                ]);
            });
            
            // Handle unhandled promise rejections
            window.addEventListener('unhandledrejection', function(event) {
                postMessage('console', 'error', [
                    'Unhandled Promise Rejection:',
                    event.reason ? String(event.reason) : 'Unknown error'
                ]);
            });
            
            // Execute user JavaScript
            try {
                ${jsCode}
            } catch (error) {
                postMessage('console', 'error', [
                    'JavaScript Execution Error:',
                    error.message || String(error),
                    error.stack || 'No stack trace available'
                ]);
            }
        })();
    </script>
    ${externalJSLinks}
</body>
</html>`;
  }, [htmlCode, cssCode, jsCode, externalLibraries]);

  // Handle messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'console' && onConsoleMessage) {
        const message: ConsoleMessage = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          type: event.data.method as 'log' | 'error' | 'warn' | 'info',
          message: Array.isArray(event.data.args) ? event.data.args.join(' ') : String(event.data.args),
          timestamp: new Date(event.data.timestamp || Date.now()),
        };
        onConsoleMessage(message);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onConsoleMessage]);

  // Update iframe content when code changes
  useEffect(() => {
    if (!iframeRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const content = generatePreviewContent();
      const iframe = iframeRef.current;
      
      // Use srcdoc for better security and performance
      iframe.srcdoc = content;
      
      // Handle iframe load
      const handleLoad = () => {
        setIsLoading(false);
      };
      
      const handleError = () => {
        setIsLoading(false);
        setError('Failed to load preview');
      };

      iframe.addEventListener('load', handleLoad);
      iframe.addEventListener('error', handleError);

      return () => {
        iframe.removeEventListener('load', handleLoad);
        iframe.removeEventListener('error', handleError);
      };
    } catch (err) {
      setIsLoading(false);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  }, [generatePreviewContent]);

  const refreshPreview = () => {
    if (iframeRef.current) {
      const content = generatePreviewContent();
      iframeRef.current.srcdoc = content;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Preview Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-300">🔍 Live Preview</span>
          {isLoading && (
            <div className="flex items-center space-x-1">
              <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-500"></div>
              <span className="text-xs text-gray-400">Loading...</span>
            </div>
          )}
          {error && (
            <span className="text-xs text-red-400">⚠️ {error}</span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={refreshPreview}
            className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
            title="Refresh Preview"
          >
            🔄
          </button>
          <button
            onClick={() => {
              if (iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.location.reload();
              }
            }}
            className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
            title="Hard Refresh"
          >
            ↻
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 relative">
        <iframe
          ref={iframeRef}
          className="w-full h-full border-none"
          title="Code Preview"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          // Note: allow-same-origin is needed for preview functionality
          loading="lazy"
        />
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <div className="text-sm text-gray-600">Loading preview...</div>
            </div>
          </div>
        )}
        
        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 bg-red-50 flex items-center justify-center">
            <div className="text-center p-4">
              <div className="text-red-500 text-4xl mb-2">⚠️</div>
              <div className="text-red-700 font-medium mb-2">Preview Error</div>
              <div className="text-red-600 text-sm">{error}</div>
              <button
                onClick={refreshPreview}
                className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPane;
