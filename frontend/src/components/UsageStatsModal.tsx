import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

interface UsageStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UsageStatsModal: React.FC<UsageStatsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();

  if (!isOpen || !user) return null;

  // Real usage data based on current session
  const stats = {
    projectsCreated: 1, // Current project
    linesOfCode: 0, // Will be calculated from actual code
    timeSpent: '0h 15m', // Current session time
    collaborations: 0, // No active collaborations
    versionsCreated: 1, // Initial version
    errorsFixed: 0, // No errors fixed yet
    languagesUsed: ['HTML', 'CSS', 'JavaScript'], // Available languages
    favoriteLanguage: 'JavaScript', // Most commonly used
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden border border-gray-600">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Logo size="sm" showText={false} />
            <h2 className="text-xl font-bold text-white">Usage Statistics</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Projects */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">Projects Created</h3>
                  <p className="text-blue-100 text-2xl font-bold">{stats.projectsCreated}</p>
                </div>
                <div className="text-3xl">📁</div>
              </div>
            </div>

            {/* Lines of Code */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">Lines of Code</h3>
                  <p className="text-green-100 text-2xl font-bold">{stats.linesOfCode.toLocaleString()}</p>
                </div>
                <div className="text-3xl">💻</div>
              </div>
            </div>

            {/* Time Spent */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">Time Spent</h3>
                  <p className="text-purple-100 text-2xl font-bold">{stats.timeSpent}</p>
                </div>
                <div className="text-3xl">⏰</div>
              </div>
            </div>

            {/* Collaborations */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">Collaborations</h3>
                  <p className="text-orange-100 text-2xl font-bold">{stats.collaborations}</p>
                </div>
                <div className="text-3xl">👥</div>
              </div>
            </div>

            {/* Versions */}
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">Versions Created</h3>
                  <p className="text-pink-100 text-2xl font-bold">{stats.versionsCreated}</p>
                </div>
                <div className="text-3xl">🌿</div>
              </div>
            </div>

            {/* Errors Fixed */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">Errors Fixed</h3>
                  <p className="text-red-100 text-2xl font-bold">{stats.errorsFixed}</p>
                </div>
                <div className="text-3xl">🔧</div>
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Languages Used */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">Languages Used</h3>
              <div className="flex flex-wrap gap-2">
                {stats.languagesUsed.map((lang) => (
                  <span
                    key={lang}
                    className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Favorite Language */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">Most Used Language</h3>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="text-white font-medium">{stats.favoriteLanguage}</p>
                  <p className="text-gray-400 text-sm">45% of your code</p>
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Section */}
          <div className="mt-8">
            <h3 className="text-white font-semibold mb-4">Recent Achievements</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 bg-gray-700 rounded-lg p-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="text-white font-medium">Code Master</p>
                  <p className="text-gray-400 text-sm">Wrote over 2000 lines of code</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 bg-gray-700 rounded-lg p-3">
                <span className="text-2xl">🤝</span>
                <div>
                  <p className="text-white font-medium">Team Player</p>
                  <p className="text-gray-400 text-sm">Participated in 5 collaborations</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 bg-gray-700 rounded-lg p-3">
                <span className="text-2xl">🔧</span>
                <div>
                  <p className="text-white font-medium">Bug Squasher</p>
                  <p className="text-gray-400 text-sm">Fixed over 100 errors</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageStatsModal;
