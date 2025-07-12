import React from 'react';
import Logo from './Logo';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Loading CodeVerse..." 
}) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="mb-8 animate-pulse">
          <Logo size="lg" showText={true} />
        </div>
        
        {/* Loading Animation */}
        <div className="mb-6">
          <div className="flex justify-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
        
        {/* Loading Message */}
        <p className="text-gray-400 text-lg font-medium">{message}</p>
        
        {/* Progress Bar */}
        <div className="mt-6 w-64 mx-auto">
          <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-full rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Version Info */}
        <div className="mt-8 text-gray-500 text-sm">
          <p>Professional Code Editor v2.0</p>
          <p className="mt-1">Multi-language • Collaboration • Version Control</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
