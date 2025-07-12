import React, { useState, useEffect } from 'react';
import type { CollaborationUser } from '../types/index';
import { collaborationService, generateRoomId, generateUserColor, isValidRoomId } from '../services/collaboration';

interface CollaborationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCollaborationStart: (roomId: string, users: CollaborationUser[]) => void;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  isOpen,
  onClose,
  onCollaborationStart,
}) => {
  const [mode, setMode] = useState<'join' | 'create' | 'active'>('join');
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const [userColor, setUserColor] = useState(generateUserColor());
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [connectedUsers, setConnectedUsers] = useState<CollaborationUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);

  useEffect(() => {
    // Load saved user preferences
    const savedUserName = localStorage.getItem('collaboration-username');
    const savedUserColor = localStorage.getItem('collaboration-usercolor');
    
    if (savedUserName) setUserName(savedUserName);
    if (savedUserColor) setUserColor(savedUserColor);

    // Set up collaboration event listeners
    const handleUserJoined = (user: CollaborationUser) => {
      setConnectedUsers(prev => [...prev.filter(u => u.id !== user.id), user]);
    };

    const handleUserLeft = (userId: string) => {
      setConnectedUsers(prev => prev.filter(u => u.id !== userId));
    };

    const handleConnectionChange = (connection: { isConnected: boolean; roomId: string | null }) => {
      setIsConnected(connection.isConnected);
      setCurrentRoomId(connection.roomId);
      
      if (connection.isConnected && connection.roomId) {
        setMode('active');
        onCollaborationStart(connection.roomId, connectedUsers);
      } else {
        setMode('join');
        setConnectedUsers([]);
      }
    };

    collaborationService.on('userJoined', handleUserJoined);
    collaborationService.on('userLeft', handleUserLeft);
    collaborationService.on('connectionChange', handleConnectionChange);

    return () => {
      collaborationService.off('userJoined', handleUserJoined);
      collaborationService.off('userLeft', handleUserLeft);
      collaborationService.off('connectionChange', handleConnectionChange);
    };
  }, [onCollaborationStart, connectedUsers]);

  if (!isOpen) return null;

  const handleCreateRoom = async () => {
    if (!userName.trim()) {
      setConnectionError('Please enter your name');
      return;
    }

    setIsConnecting(true);
    setConnectionError('');

    try {
      const newRoomId = generateRoomId();
      
      // Save user preferences
      localStorage.setItem('collaboration-username', userName);
      localStorage.setItem('collaboration-usercolor', userColor);

      await collaborationService.connect(newRoomId, {
        name: userName,
        color: userColor,
      });

      setRoomId(newRoomId);
    } catch (error: any) {
      setConnectionError(error.message || 'Failed to create room');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!userName.trim()) {
      setConnectionError('Please enter your name');
      return;
    }

    if (!roomId.trim()) {
      setConnectionError('Please enter a room ID');
      return;
    }

    if (!isValidRoomId(roomId.toUpperCase())) {
      setConnectionError('Invalid room ID format');
      return;
    }

    setIsConnecting(true);
    setConnectionError('');

    try {
      // Save user preferences
      localStorage.setItem('collaboration-username', userName);
      localStorage.setItem('collaboration-usercolor', userColor);

      await collaborationService.connect(roomId.toUpperCase(), {
        name: userName,
        color: userColor,
      });
    } catch (error: any) {
      setConnectionError(error.message || 'Failed to join room');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    collaborationService.disconnect();
    setMode('join');
    setRoomId('');
    setConnectedUsers([]);
  };

  const copyRoomId = () => {
    if (currentRoomId) {
      navigator.clipboard.writeText(currentRoomId);
      // You could add a toast notification here
    }
  };

  const generateNewColor = () => {
    const newColor = generateUserColor();
    setUserColor(newColor);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden flex flex-col border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gradient-to-r from-green-600 to-blue-600">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              👥
            </div>
            <h2 className="text-xl font-bold text-white">Live Collaboration</h2>
            {isConnected && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                Connected
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {mode === 'join' && (
            <div className="space-y-6">
              {/* User Setup */}
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl p-6 border border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  👤 Your Identity
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name..."
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Your Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-12 h-12 rounded-lg border-2 border-gray-600"
                        style={{ backgroundColor: userColor }}
                      ></div>
                      <button
                        onClick={generateNewColor}
                        className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                      >
                        🎲 Random Color
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connection Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Create Room */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 border border-blue-500">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    🆕 Create New Room
                  </h3>
                  <p className="text-blue-100 text-sm mb-4">
                    Start a new collaboration session and invite others
                  </p>
                  <button
                    onClick={handleCreateRoom}
                    disabled={isConnecting || !userName.trim()}
                    className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 disabled:bg-opacity-10 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-medium transition-all"
                  >
                    {isConnecting ? '🔄 Creating...' : '🚀 Create Room'}
                  </button>
                </div>

                {/* Join Room */}
                <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 border border-green-500">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    🔗 Join Existing Room
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Enter Room ID..."
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                      className="w-full bg-white bg-opacity-20 text-white placeholder-green-200 px-3 py-2 rounded-lg border border-green-400 focus:border-white focus:outline-none"
                      maxLength={8}
                    />
                    <button
                      onClick={handleJoinRoom}
                      disabled={isConnecting || !userName.trim() || !roomId.trim()}
                      className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 disabled:bg-opacity-10 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-medium transition-all"
                    >
                      {isConnecting ? '🔄 Joining...' : '🚪 Join Room'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {connectionError && (
                <div className="bg-red-900 bg-opacity-50 border border-red-500 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-400">❌</span>
                    <span className="text-red-300">{connectionError}</span>
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="bg-gray-750 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">ℹ️ How it works</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Create a room or join with a Room ID</li>
                  <li>• See live cursors and selections from other users</li>
                  <li>• Code changes are synchronized in real-time</li>
                  <li>• Share the Room ID with your collaborators</li>
                </ul>
              </div>
            </div>
          )}

          {mode === 'active' && (
            <div className="space-y-6">
              {/* Room Info */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 border border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      🎉 Collaboration Active
                    </h3>
                    <p className="text-green-100 text-sm">
                      Room ID: <span className="font-mono font-bold">{currentRoomId}</span>
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={copyRoomId}
                      className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    >
                      📋 Copy ID
                    </button>
                    <button
                      onClick={handleDisconnect}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    >
                      🚪 Leave
                    </button>
                  </div>
                </div>
              </div>

              {/* Connected Users */}
              <div className="bg-gray-750 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  👥 Connected Users ({connectedUsers.length + 1})
                </h3>
                <div className="space-y-3">
                  {/* Current User */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg border-2 border-blue-500">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white"
                      style={{ backgroundColor: userColor }}
                    ></div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{userName} (You)</div>
                      <div className="text-xs text-gray-400">Host</div>
                    </div>
                    <span className="text-green-400 text-sm">🟢 Online</span>
                  </div>

                  {/* Other Users */}
                  {connectedUsers.map(user => (
                    <div key={user.id} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                      <div
                        className="w-8 h-8 rounded-full border-2 border-gray-500"
                        style={{ backgroundColor: user.color }}
                      ></div>
                      <div className="flex-1">
                        <div className="font-medium text-white">{user.name}</div>
                        <div className="text-xs text-gray-400">
                          {user.cursor ? `Line ${user.cursor.line}, Col ${user.cursor.column}` : 'Idle'}
                        </div>
                      </div>
                      <span className="text-green-400 text-sm">🟢 Online</span>
                    </div>
                  ))}

                  {connectedUsers.length === 0 && (
                    <div className="text-center py-6">
                      <div className="text-gray-400 text-4xl mb-2">👤</div>
                      <p className="text-gray-400">Waiting for collaborators...</p>
                      <p className="text-gray-500 text-sm mt-1">
                        Share the Room ID: <span className="font-mono">{currentRoomId}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Collaboration Features */}
              <div className="bg-gray-750 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">✨ Active Features</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">✅</span>
                    <span className="text-gray-300">Live cursors</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">✅</span>
                    <span className="text-gray-300">Code sync</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">✅</span>
                    <span className="text-gray-300">User presence</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400">🔄</span>
                    <span className="text-gray-300">Auto-save</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-700 bg-gray-800">
          <div className="text-gray-400 text-sm">
            💡 Collaboration is simulated for demo purposes
          </div>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-medium transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollaborationPanel;
