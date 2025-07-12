import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { FileType, EditorSettings, VersionHistoryItem, UseCodeEditorReturn } from '../types/index';

const DEFAULT_HTML = ``;

const DEFAULT_CSS = ``;

const DEFAULT_JS = ``;

const DEFAULT_SETTINGS: EditorSettings = {
  theme: 'vs-dark',
  fontSize: 14,
  fontFamily: 'Fira Code, Monaco, Cascadia Code, Ubuntu Mono, monospace',
  tabSize: 2,
  wordWrap: false,
  minimap: true,
  lineNumbers: true,
};

export const useCodeEditor = (): UseCodeEditorReturn => {
  const [htmlCode, setHtmlCode] = useState<string>(DEFAULT_HTML);
  const [cssCode, setCssCode] = useState<string>(DEFAULT_CSS);
  const [jsCode, setJsCode] = useState<string>(DEFAULT_JS);
  const [activeTab, setActiveTab] = useState<FileType>('html');
  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_SETTINGS);
  const [versionHistory, setVersionHistory] = useState<VersionHistoryItem[]>([]);

  // Load saved data on mount
  useEffect(() => {
    const loadSavedData = () => {
      try {
        // Clear any old template data and start fresh
        const savedCode = localStorage.getItem('codeEditor_code');
        if (savedCode) {
          const data = JSON.parse(savedCode);
          // Only load if there's actual user content, not default templates
          if (data.htmlCode && data.htmlCode.trim() && !data.htmlCode.includes('Welcome to Code Editor!')) {
            setHtmlCode(data.htmlCode);
          }
          if (data.cssCode && data.cssCode.trim() && !data.cssCode.includes('font-family: \'Segoe UI\'')) {
            setCssCode(data.cssCode);
          }
          if (data.jsCode && data.jsCode.trim() && !data.jsCode.includes('Welcome to the JavaScript editor!')) {
            setJsCode(data.jsCode);
          }
          setActiveTab(data.activeTab || 'html');
        }

        // Load settings
        const savedSettings = localStorage.getItem('codeEditor_settings');
        if (savedSettings) {
          const data = JSON.parse(savedSettings);
          setSettings({ ...DEFAULT_SETTINGS, ...data });
        }

        // Load version history
        const savedHistory = localStorage.getItem('codeEditor_history');
        if (savedHistory) {
          const data = JSON.parse(savedHistory);
          setVersionHistory(data);
        }
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    };

    loadSavedData();
  }, []);

  // Auto-save code changes
  useEffect(() => {
    const saveData = {
      htmlCode,
      cssCode,
      jsCode,
      activeTab,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem('codeEditor_code', JSON.stringify(saveData));
  }, [htmlCode, cssCode, jsCode, activeTab]);

  // Save settings changes
  useEffect(() => {
    localStorage.setItem('codeEditor_settings', JSON.stringify(settings));
  }, [settings]);

  // Save version history changes
  useEffect(() => {
    localStorage.setItem('codeEditor_history', JSON.stringify(versionHistory));
  }, [versionHistory]);

  const updateSettings = useCallback((newSettings: Partial<EditorSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const saveToHistory = useCallback(() => {
    const historyItem: VersionHistoryItem = {
      id: uuidv4(),
      timestamp: new Date(),
      htmlCode,
      cssCode,
      jsCode,
      description: `Saved at ${new Date().toLocaleString()}`,
    };

    setVersionHistory(prev => {
      const newHistory = [historyItem, ...prev];
      // Keep only the last 20 versions
      return newHistory.slice(0, 20);
    });
  }, [htmlCode, cssCode, jsCode]);

  const loadFromHistory = useCallback((item: VersionHistoryItem) => {
    setHtmlCode(item.htmlCode);
    setCssCode(item.cssCode);
    setJsCode(item.jsCode);
  }, []);

  const clearHistory = useCallback(() => {
    setVersionHistory([]);
    localStorage.removeItem('codeEditor_history');
  }, []);

  return {
    htmlCode,
    cssCode,
    jsCode,
    setHtmlCode,
    setCssCode,
    setJsCode,
    activeTab,
    setActiveTab,
    settings,
    updateSettings,
    saveToHistory,
    loadFromHistory,
    versionHistory,
    clearHistory,
  };
};
