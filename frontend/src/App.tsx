import React, { useState, useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import type { FileType, ConsoleMessage, CodeError, CollaborationUser, GitLikeVersion } from './types/index';
import { useCodeEditor } from './hooks/useCodeEditor';
import EditorPane from './components/EditorPane';
import PreviewPane from './components/PreviewPane';
import ConsolePane from './components/ConsolePane';
import Toolbar from './components/Toolbar';
import ShareModal from './components/ShareModal';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import LibraryLoader from './components/LibraryLoader';
import GitLikeVersionControl from './components/GitLikeVersionControl';
import ErrorExplanation from './components/ErrorExplanation';

import CollaborationPanel from './components/CollaborationPanel';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { downloadAsHTML, downloadAsZip } from './utils/download';
import { formatCode } from './utils/codeFormatter';
import { analyzeCode } from './services/codeExecution';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const {
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
  } = useCodeEditor();

  const [showConsole, setShowConsole] = useState<boolean>(false);
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [loadedLibraries, setLoadedLibraries] = useState<any[]>([]);

  // Advanced features state
  const [showGitVersionControl, setShowGitVersionControl] = useState<boolean>(false);
  const [showErrorExplanation, setShowErrorExplanation] = useState<boolean>(true);

  const [showCollaborationPanel, setShowCollaborationPanel] = useState<boolean>(false);
  const [codeErrors, setCodeErrors] = useState<CodeError[]>([
    {
      id: 'html-1',
      message: 'Missing closing tag for <div>',
      severity: 'error',
      line: 5,
      column: 1,
      explanation: 'HTML elements must have matching opening and closing tags. This helps maintain proper document structure.',
      suggestion: 'Add a closing </div> tag',
      fixCode: '</div>',
    },
    {
      id: 'css-1',
      message: 'Unknown property "colour"',
      severity: 'warning',
      line: 3,
      column: 5,
      explanation: 'The correct CSS property is "color", not "colour". This is a common spelling mistake.',
      suggestion: 'Change "colour" to "color"',
      fixCode: 'color: red;',
    },
    {
      id: 'js-1',
      message: 'Undefined variable "consol"',
      severity: 'error',
      line: 2,
      column: 1,
      explanation: 'The correct object is "console", not "consol". This is likely a typo.',
      suggestion: 'Change "consol" to "console"',
      fixCode: 'console.log("Hello World");',
    }
  ]);
  const [collaborationUsers, setCollaborationUsers] = useState<CollaborationUser[]>([]);
  const [isCollaborating, setIsCollaborating] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(!isAuthenticated);

  // Handle save action
  useEffect(() => {
    const handleSave = async () => {
      setSaveStatus('saving');
      try {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate save delay
        saveToHistory();
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error) {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    };

    window.addEventListener('editor-save', handleSave);
    return () => window.removeEventListener('editor-save', handleSave);
  }, [saveToHistory]);

  // Load shared code from URL
  useEffect(() => {
    const loadSharedCode = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const shareParam = urlParams.get('share');
      const idParam = urlParams.get('id');

      if (shareParam) {
        // Load from URL-encoded data
        try {
          const decodedData = JSON.parse(atob(shareParam));
          if (decodedData.htmlCode !== undefined) setHtmlCode(decodedData.htmlCode);
          if (decodedData.cssCode !== undefined) setCssCode(decodedData.cssCode);
          if (decodedData.jsCode !== undefined) setJsCode(decodedData.jsCode);

          // Clear URL parameters after loading
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (error) {
          console.error('Failed to load shared code from URL:', error);
        }
      } else if (idParam) {
        // Load from backend API
        try {
          const response = await fetch(`http://localhost:5000/api/code/${idParam}`);
          const data = await response.json();

          if (data.success && data.data) {
            setHtmlCode(data.data.htmlCode || '');
            setCssCode(data.data.cssCode || '');
            setJsCode(data.data.jsCode || '');

            // Clear URL parameters after loading
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } catch (error) {
          console.error('Failed to load shared code from API:', error);
        }
      }
    };

    loadSharedCode();
  }, [setHtmlCode, setCssCode, setJsCode]);

  // Code analysis effect
  useEffect(() => {
    const analyzeCurrentCode = () => {
      const currentCode = getCurrentCode();
      if (currentCode.trim()) {
        const errors = analyzeCode(currentCode, activeTab);
        setCodeErrors(errors);
      } else {
        setCodeErrors([]);
      }
    };

    // Debounce analysis to avoid excessive calls
    const timeoutId = setTimeout(analyzeCurrentCode, 1000);
    return () => clearTimeout(timeoutId);
  }, [htmlCode, cssCode, jsCode, activeTab]);

  // Handle console messages from preview
  const handleConsoleMessage = (message: ConsoleMessage) => {
    setConsoleMessages(prev => [...prev, message]);
  };

  const clearConsole = () => {
    setConsoleMessages([]);
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate save delay
      saveToHistory();
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleDownload = () => {
    downloadAsHTML(htmlCode, cssCode, jsCode);
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  // Authentication handlers
  const { login, signup } = useAuth();

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    const success = await login(email, password);
    if (success) {
      setShowAuthModal(false);
    }
    return success;
  };

  const handleSignup = async (email: string, password: string, name: string): Promise<boolean> => {
    const success = await signup(email, password, name);
    if (success) {
      setShowAuthModal(false);
    }
    return success;
  };

  const handleFormat = () => {
    console.log('Format function called, active tab:', activeTab);

    const getCurrentLanguage = () => {
      switch (activeTab) {
        case 'html': return 'html';
        case 'css': return 'css';
        case 'javascript': return 'javascript';
        default: return 'html';
      }
    };

    const currentCode = getCurrentCode();

    console.log('Current code before formatting:', currentCode.substring(0, 100));

    const formattedCode = formatCode(currentCode, getCurrentLanguage());

    console.log('Formatted code:', formattedCode.substring(0, 100));

    if (activeTab === 'html') setHtmlCode(formattedCode);
    else if (activeTab === 'css') setCssCode(formattedCode);
    else if (activeTab === 'javascript') setJsCode(formattedCode);
  };

  const handleLibraryAdd = (library: any) => {
    setLoadedLibraries(prev => [...prev, library]);
    console.log('Library added to app:', library.name);
  };

  const handleLibraryRemove = (library: any) => {
    setLoadedLibraries(prev => prev.filter(lib => lib.name !== library.name));
    console.log('Library removed from app:', library.name);
  };

  const handleCodeSuggestion = (code: string) => {
    if (activeTab === 'html') setHtmlCode(prev => prev + '\n' + code);
    else if (activeTab === 'css') setCssCode(prev => prev + '\n' + code);
    else if (activeTab === 'javascript') setJsCode(prev => prev + '\n' + code);
  };

  const getCurrentCode = () => {
    switch (activeTab) {
      case 'html': return htmlCode;
      case 'css': return cssCode;
      case 'javascript': return jsCode;
      default: return '';
    }
  };

  // Advanced features handlers
  const handleGitCommit = (message: string) => {
    const gitVersion: GitLikeVersion = {
      id: `commit-${Date.now()}`,
      timestamp: new Date(),
      htmlCode,
      cssCode,
      jsCode,
      description: message,
      commitMessage: message,
      author: 'You',
      branch: 'main',
    };

    // Add to version history (this would be enhanced in a real implementation)
    saveToHistory();
  };

  const handleErrorFix = (error: CodeError) => {
    if (error.fixCode) {
      // Apply the suggested fix
      const currentCode = getCurrentCode();
      const lines = currentCode.split('\n');
      lines[error.line - 1] = error.fixCode;
      const fixedCode = lines.join('\n');

      // Update the appropriate code
      if (activeTab === 'html') setHtmlCode(fixedCode);
      else if (activeTab === 'css') setCssCode(fixedCode);
      else if (activeTab === 'javascript') setJsCode(fixedCode);
    }
  };

  const handleErrorDismiss = (errorId: string) => {
    setCodeErrors(prev => prev.filter(error => error.id !== errorId));
  };

  const handleCollaborationStart = (roomId: string, users: CollaborationUser[]) => {
    setIsCollaborating(true);
    setCollaborationUsers(users);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+` to toggle console
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setShowConsole(prev => !prev);
      }
      // Ctrl+Shift+C to clear console
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        clearConsole();
      }
      // Ctrl+D to download
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        handleDownload();
      }
      // Shift+Alt+F to format code
      if (e.shiftKey && e.altKey && e.key === 'F') {
        e.preventDefault();
        handleFormat();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);





  // Show loading screen while checking authentication
  if (isLoading) {
    return <div className="h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white text-xl">Loading CodeVerse...</div>
    </div>;
  }

  // Show authentication modal if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <AuthModal
          isOpen={true}
          onClose={() => {}} // Can't close without authenticating
          onLogin={handleLogin}
          onSignup={handleSignup}
        />
      </div>
    );
  }
  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col transition-colors duration-300" style={{
      backgroundColor: 'var(--bg-primary, #1a1a1a)',
      color: 'var(--text-primary, #ffffff)'
    }}>
      {/* Toolbar */}
      <Toolbar
        settings={settings}
        onSettingsChange={updateSettings}
        onSave={handleSave}
        onShare={handleShare}
        onDownload={handleDownload}
        onFormat={handleFormat}
        showConsole={showConsole}
        onToggleConsole={() => setShowConsole(!showConsole)}
        saveStatus={saveStatus}
        onLibraryAdd={handleLibraryAdd}
        onLibraryRemove={handleLibraryRemove}
        loadedLibraries={loadedLibraries}
        activeTab={activeTab}
        currentCode={getCurrentCode()}
        onCodeSuggestion={handleCodeSuggestion}
        versionHistory={versionHistory}
        onVersionRestore={loadFromHistory}
        onVersionClear={clearHistory}
        onShowGitVersionControl={() => setShowGitVersionControl(true)}

        onShowCollaborationPanel={() => setShowCollaborationPanel(true)}
        onToggleErrorExplanation={() => setShowErrorExplanation(!showErrorExplanation)}
        showErrorExplanation={showErrorExplanation}
        errorCount={codeErrors.length}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal" className="h-full">
          {/* Editor Section */}
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col border-r border-gray-700">
              <EditorPane
                htmlCode={htmlCode}
                cssCode={cssCode}
                jsCode={jsCode}
                activeTab={activeTab}
                settings={settings}
                onHtmlChange={setHtmlCode}
                onCssChange={setCssCode}
                onJsChange={setJsCode}
                onTabChange={setActiveTab}
              />
            </div>
          </Panel>

          <PanelResizeHandle className="w-2 bg-gray-700 hover:bg-gray-600 transition-colors cursor-col-resize" />

          {/* Preview Section */}
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col">
              {showConsole ? (
                <PanelGroup direction="vertical" className="h-full">
                  <Panel defaultSize={70} minSize={40}>
                    <PreviewPane
                      htmlCode={htmlCode}
                      cssCode={cssCode}
                      jsCode={jsCode}
                      onConsoleMessage={handleConsoleMessage}
                      externalLibraries={loadedLibraries}
                    />
                  </Panel>

                  <PanelResizeHandle className="h-2 bg-gray-700 hover:bg-gray-600 transition-colors cursor-row-resize" />

                  <Panel defaultSize={30} minSize={20}>
                    <ConsolePane
                      messages={consoleMessages}
                      onClear={clearConsole}
                      onClose={() => setShowConsole(false)}
                      isVisible={true}
                    />
                  </Panel>
                </PanelGroup>
              ) : (
                <PreviewPane
                  htmlCode={htmlCode}
                  cssCode={cssCode}
                  jsCode={jsCode}
                  onConsoleMessage={handleConsoleMessage}
                  externalLibraries={loadedLibraries}
                />
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>

      {/* Error Explanation Panel */}
      {showErrorExplanation && codeErrors.length > 0 && (
        <ErrorExplanation
          errors={codeErrors}
          activeTab={activeTab}
          onFixApply={handleErrorFix}
          onErrorDismiss={handleErrorDismiss}
        />
      )}

      {/* Advanced Feature Modals */}
      <GitLikeVersionControl
        isOpen={showGitVersionControl}
        onClose={() => setShowGitVersionControl(false)}
        versions={versionHistory.map(v => ({
          ...v,
          commitMessage: v.description || 'Unnamed commit',
          author: 'You',
          branch: 'main',
        }))}
        onVersionRestore={loadFromHistory}
        onVersionClear={clearHistory}
        onCommit={handleGitCommit}
        currentCode={{
          htmlCode,
          cssCode,
          jsCode,
        }}
      />



      <CollaborationPanel
        isOpen={showCollaborationPanel}
        onClose={() => setShowCollaborationPanel(false)}
        onCollaborationStart={handleCollaborationStart}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        codeSnippet={{
          htmlCode,
          cssCode,
          jsCode,
          title: 'Code Editor Project',
          description: 'Created with Online Code Editor'
        }}
      />
    </div>
  );
};

// Main App component with AuthProvider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
