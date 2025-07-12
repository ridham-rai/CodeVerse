// Core types for the code editor
export interface CodeSnippet {
  id?: string;
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  title?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  views?: number;
}

export interface EditorSettings {
  theme: EditorTheme;
  fontSize: number;
  fontFamily: string;
  tabSize: number;
  wordWrap: boolean;
  minimap: boolean;
  lineNumbers: boolean;
}

export type EditorTheme = 'vs-dark' | 'vs-light' | 'hc-black' | 'monokai' | 'dracula';

export type FileType = 'html' | 'css' | 'javascript';

export interface FileTab {
  type: FileType;
  label: string;
  icon?: string;
  active: boolean;
}

export interface ConsoleMessage {
  id: string;
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: Date;
}

export interface VersionHistoryItem {
  id: string;
  timestamp: Date;
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  description?: string;
}

export interface ShareResponse {
  success: boolean;
  id?: string;
  shareUrl?: string;
  message?: string;
  error?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Layout and UI types
export interface PaneSize {
  width?: number;
  height?: number;
}

export interface LayoutConfig {
  editorWidth: number;
  previewWidth: number;
  consoleHeight: number;
  showConsole: boolean;
}

// Hook types
export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
}

export interface UseCodeEditorReturn {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  setHtmlCode: (code: string) => void;
  setCssCode: (code: string) => void;
  setJsCode: (code: string) => void;
  activeTab: FileType;
  setActiveTab: (tab: FileType) => void;
  settings: EditorSettings;
  updateSettings: (settings: Partial<EditorSettings>) => void;
  saveToHistory: () => void;
  loadFromHistory: (item: VersionHistoryItem) => void;
  versionHistory: VersionHistoryItem[];
  clearHistory: () => void;
}

// Advanced features types
export interface CollaborationUser {
  id: string;
  name: string;
  color: string;
  cursor?: {
    line: number;
    column: number;
  };
  selection?: {
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
  };
}

export interface CollaborationState {
  users: CollaborationUser[];
  isConnected: boolean;
  roomId?: string;
}

export interface CodeError {
  id: string;
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  suggestion?: string;
  explanation?: string;
  fixCode?: string;
}

export interface ExecutionResult {
  output: string;
  error?: string;
  executionTime: number;
  language: FileType;
}

export interface CommitMessage {
  id: string;
  message: string;
  timestamp: Date;
  author: string;
  changes: {
    added: number;
    deleted: number;
    modified: number;
  };
}

export interface GitLikeVersion extends VersionHistoryItem {
  commitMessage: string;
  author: string;
  branch: string;
  parentId?: string;
  diff?: string;
}

// Re-export all types to ensure they're available
export type {
  CodeSnippet,
  EditorSettings,
  EditorTheme,
  FileType,
  FileTab,
  ConsoleMessage,
  VersionHistoryItem,
  ShareResponse,
  ApiResponse,
  PaneSize,
  LayoutConfig,
  UseLocalStorageReturn,
  UseCodeEditorReturn,
  CollaborationUser,
  CollaborationState,
  CodeError,
  ExecutionResult,
  CommitMessage,
  GitLikeVersion
};
