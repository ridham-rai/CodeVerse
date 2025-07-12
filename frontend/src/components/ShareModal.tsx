import React, { useState } from 'react';
import type { CodeSnippet, ShareResponse } from '../types/index';
import Logo from './Logo';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  codeSnippet: CodeSnippet;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, codeSnippet }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/code/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(codeSnippet),
      });

      const data: ShareResponse = await response.json();

      if (data.success && data.shareUrl) {
        setShareUrl(data.shareUrl);
      } else {
        // Fallback to local sharing if backend fails
        const localShareData = {
          ...codeSnippet,
          timestamp: new Date().toISOString(),
        };
        const encodedData = btoa(JSON.stringify(localShareData));
        const localUrl = `${window.location.origin}${window.location.pathname}?share=${encodedData}`;
        setShareUrl(localUrl);
        setError('Database unavailable. Generated local share link (data embedded in URL).');
      }
    } catch (err) {
      // Fallback to local sharing
      const localShareData = {
        ...codeSnippet,
        timestamp: new Date().toISOString(),
      };
      const encodedData = btoa(JSON.stringify(localShareData));
      const localUrl = `${window.location.origin}${window.location.pathname}?share=${encodedData}`;
      setShareUrl(localUrl);
      setError('Backend unavailable. Generated local share link (data embedded in URL).');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Logo size="sm" showText={false} />
            <h2 className="text-xl font-bold text-white">Share Your Code</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {!shareUrl ? (
          <div className="space-y-4">
            <p className="text-gray-300">
              Create a shareable link for your code that others can view and edit.
            </p>
            
            {error && (
              <div className="bg-red-900 border border-red-700 text-red-300 px-3 py-2 rounded">
                {error}
              </div>
            )}
            
            <div className="flex space-x-3">
              <button
                onClick={handleShare}
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-4 py-2 rounded transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </span>
                ) : (
                  '🔗 Create Share Link'
                )}
              </button>
              
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-300">
              Your code has been saved! Share this link with others:
            </p>
            
            <div className="bg-gray-900 border border-gray-600 rounded p-3">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 bg-transparent text-white text-sm outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                >
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => window.open(shareUrl, '_blank')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
              >
                🔗 Open Link
              </button>
              
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareModal;
