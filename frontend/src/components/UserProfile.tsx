import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AccountSettingsModal from './AccountSettingsModal';
import UsageStatsModal from './UsageStatsModal';

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showUsageStats, setShowUsageStats] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-all duration-200 border border-gray-600 hover:border-gray-500"
      >
        <span className="text-lg">{user.avatar || '👤'}</span>
        <span className="text-white text-sm font-medium">{user.name}</span>
        <span className="text-gray-400 text-xs">▼</span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-1 w-64 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 backdrop-blur-sm">
          <div className="p-4">
            {/* User Info */}
            <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-700">
              <div className="text-2xl">{user.avatar || '👤'}</div>
              <div>
                <h3 className="text-white font-semibold">{user.name}</h3>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowAccountSettings(true);
                  setShowDropdown(false);
                }}
                className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors flex items-center space-x-2"
              >
                <span>⚙️</span>
                <span>Account Settings</span>
              </button>

              <button
                onClick={() => {
                  setShowUsageStats(true);
                  setShowDropdown(false);
                }}
                className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors flex items-center space-x-2"
              >
                <span>📊</span>
                <span>Usage Stats</span>
              </button>


              
              <hr className="border-gray-700 my-2" />
              
              <button
                onClick={() => {
                  logout();
                  setShowDropdown(false);
                }}
                className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition-colors flex items-center space-x-2"
              >
                <span>🚪</span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}

      {/* Modals */}
      <AccountSettingsModal
        isOpen={showAccountSettings}
        onClose={() => setShowAccountSettings(false)}
      />

      <UsageStatsModal
        isOpen={showUsageStats}
        onClose={() => setShowUsageStats(false)}
      />


    </div>
  );
};

export default UserProfile;
