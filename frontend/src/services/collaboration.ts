import React from 'react';
import type { CollaborationUser, CollaborationState } from '../types/index';

// Mock WebSocket connection for collaboration
class CollaborationService {
  private ws: WebSocket | null = null;
  private roomId: string | null = null;
  private currentUser: CollaborationUser | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor() {
    this.initializeEventListeners();
  }

  private initializeEventListeners() {
    // Initialize empty listener arrays
    this.listeners.set('userJoined', []);
    this.listeners.set('userLeft', []);
    this.listeners.set('codeChange', []);
    this.listeners.set('cursorMove', []);
    this.listeners.set('connectionChange', []);
  }

  // Connect to collaboration room
  async connect(roomId: string, user: Omit<CollaborationUser, 'id'>): Promise<void> {
    this.roomId = roomId;
    this.currentUser = {
      ...user,
      id: this.generateUserId(),
    };

    try {
      // In a real implementation, this would connect to a WebSocket server
      // For now, we'll simulate the connection
      await this.simulateConnection();
      
      this.emit('connectionChange', { isConnected: true, roomId });
      console.log(`✅ Connected to collaboration room: ${roomId}`);
    } catch (error) {
      console.error('❌ Failed to connect to collaboration room:', error);
      this.emit('connectionChange', { isConnected: false, roomId: null });
    }
  }

  // Disconnect from collaboration room
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.roomId = null;
    this.currentUser = null;
    this.emit('connectionChange', { isConnected: false, roomId: null });
    console.log('🔌 Disconnected from collaboration room');
  }

  // Send code changes to other users
  sendCodeChange(fileType: string, code: string, cursor?: { line: number; column: number }): void {
    if (!this.isConnected()) return;

    const change = {
      type: 'codeChange',
      fileType,
      code,
      cursor,
      user: this.currentUser,
      timestamp: Date.now(),
    };

    this.sendMessage(change);
  }

  // Send cursor position to other users
  sendCursorPosition(line: number, column: number): void {
    if (!this.isConnected() || !this.currentUser) return;

    const cursorUpdate = {
      type: 'cursorMove',
      user: {
        ...this.currentUser,
        cursor: { line, column },
      },
      timestamp: Date.now(),
    };

    this.sendMessage(cursorUpdate);
  }

  // Send selection to other users
  sendSelection(startLine: number, startColumn: number, endLine: number, endColumn: number): void {
    if (!this.isConnected() || !this.currentUser) return;

    const selectionUpdate = {
      type: 'selectionChange',
      user: {
        ...this.currentUser,
        selection: { startLine, startColumn, endLine, endColumn },
      },
      timestamp: Date.now(),
    };

    this.sendMessage(selectionUpdate);
  }

  // Add event listener
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  // Remove event listener
  off(event: string, callback: Function): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  // Check if connected
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  // Get current room info
  getRoomInfo(): { roomId: string | null; user: CollaborationUser | null } {
    return {
      roomId: this.roomId,
      user: this.currentUser,
    };
  }

  // Private methods
  private async simulateConnection(): Promise<void> {
    // Simulate WebSocket connection
    return new Promise((resolve, reject) => {
      try {
        // Create a mock WebSocket-like object
        this.ws = {
          readyState: 1, // OPEN
          send: (data: string) => {
            // Simulate sending data
            console.log('📤 Sending collaboration data:', JSON.parse(data));
          },
          close: () => {
            this.ws = null;
          },
        } as any;

        // Simulate successful connection
        setTimeout(() => {
          this.simulateInitialUsers();
          resolve();
        }, 500);
      } catch (error) {
        reject(error);
      }
    });
  }

  private simulateInitialUsers(): void {
    // Simulate other users in the room
    const mockUsers: CollaborationUser[] = [
      {
        id: 'user-2',
        name: 'Alice',
        color: '#ff6b6b',
        cursor: { line: 5, column: 10 },
      },
      {
        id: 'user-3',
        name: 'Bob',
        color: '#4ecdc4',
        cursor: { line: 12, column: 5 },
      },
    ];

    // Emit user joined events
    mockUsers.forEach(user => {
      setTimeout(() => {
        this.emit('userJoined', user);
      }, Math.random() * 1000);
    });

    // Simulate periodic cursor movements
    this.simulateCursorMovements(mockUsers);
  }

  private simulateCursorMovements(users: CollaborationUser[]): void {
    setInterval(() => {
      if (!this.isConnected()) return;

      users.forEach(user => {
        const newCursor = {
          line: Math.floor(Math.random() * 20) + 1,
          column: Math.floor(Math.random() * 50) + 1,
        };

        this.emit('cursorMove', {
          ...user,
          cursor: newCursor,
        });
      });
    }, 3000 + Math.random() * 2000); // Random interval between 3-5 seconds
  }

  private sendMessage(message: any): void {
    if (this.ws && this.isConnected()) {
      this.ws.send(JSON.stringify(message));
    }
  }

  private emit(event: string, data: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  private generateUserId(): string {
    return 'user-' + Math.random().toString(36).substr(2, 9);
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

    console.log(`🔄 Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      if (this.roomId && this.currentUser) {
        this.connect(this.roomId, this.currentUser);
      }
    }, delay);
  }
}

// Singleton instance
export const collaborationService = new CollaborationService();

// Utility functions for collaboration
export const generateRoomId = (): string => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

export const generateUserColor = (): string => {
  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', 
    '#ffeaa7', '#dda0dd', '#98d8c8', '#f7dc6f',
    '#bb8fce', '#85c1e9', '#f8c471', '#82e0aa'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const isValidRoomId = (roomId: string): boolean => {
  return /^[A-Z0-9]{8}$/.test(roomId);
};

// React hook for collaboration
export const useCollaboration = () => {
  const [state, setState] = React.useState<CollaborationState>({
    users: [],
    isConnected: false,
    roomId: undefined,
  });

  React.useEffect(() => {
    const handleUserJoined = (user: CollaborationUser) => {
      setState(prev => ({
        ...prev,
        users: [...prev.users.filter(u => u.id !== user.id), user],
      }));
    };

    const handleUserLeft = (userId: string) => {
      setState(prev => ({
        ...prev,
        users: prev.users.filter(u => u.id !== userId),
      }));
    };

    const handleCursorMove = (user: CollaborationUser) => {
      setState(prev => ({
        ...prev,
        users: prev.users.map(u => u.id === user.id ? user : u),
      }));
    };

    const handleConnectionChange = (connection: { isConnected: boolean; roomId: string | null }) => {
      setState(prev => ({
        ...prev,
        isConnected: connection.isConnected,
        roomId: connection.roomId || undefined,
      }));
    };

    // Subscribe to events
    collaborationService.on('userJoined', handleUserJoined);
    collaborationService.on('userLeft', handleUserLeft);
    collaborationService.on('cursorMove', handleCursorMove);
    collaborationService.on('connectionChange', handleConnectionChange);

    return () => {
      // Cleanup listeners
      collaborationService.off('userJoined', handleUserJoined);
      collaborationService.off('userLeft', handleUserLeft);
      collaborationService.off('cursorMove', handleCursorMove);
      collaborationService.off('connectionChange', handleConnectionChange);
    };
  }, []);

  return {
    ...state,
    connect: collaborationService.connect.bind(collaborationService),
    disconnect: collaborationService.disconnect.bind(collaborationService),
    sendCodeChange: collaborationService.sendCodeChange.bind(collaborationService),
    sendCursorPosition: collaborationService.sendCursorPosition.bind(collaborationService),
    sendSelection: collaborationService.sendSelection.bind(collaborationService),
  };
};
