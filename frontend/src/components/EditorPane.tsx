import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import type { FileType, EditorSettings } from '../types/index';

interface EditorPaneProps {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  activeTab: FileType;
  settings: EditorSettings;
  onHtmlChange: (value: string) => void;
  onCssChange: (value: string) => void;
  onJsChange: (value: string) => void;
  onTabChange: (tab: FileType) => void;
}

const EditorPane: React.FC<EditorPaneProps> = ({
  htmlCode,
  cssCode,
  jsCode,
  activeTab,
  settings,
  onHtmlChange,
  onCssChange,
  onJsChange,
  onTabChange,
}) => {
  const editorRef = useRef<any>(null);

  const tabs = [
    { type: 'html' as FileType, label: 'HTML', icon: '🌐' },
    { type: 'css' as FileType, label: 'CSS', icon: '🎨' },
    { type: 'javascript' as FileType, label: 'JS', icon: '⚡' },
  ];

  const getCurrentCode = () => {
    switch (activeTab) {
      case 'html': return htmlCode;
      case 'css': return cssCode;
      case 'javascript': return jsCode;
      default: return '';
    }
  };

  const getCurrentLanguage = () => {
    switch (activeTab) {
      case 'html': return 'html';
      case 'css': return 'css';
      case 'javascript': return 'javascript';
      default: return 'plaintext';
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined) return;

    switch (activeTab) {
      case 'html':
        onHtmlChange(value);
        break;
      case 'css':
        onCssChange(value);
        break;
      case 'javascript':
        onJsChange(value);
        break;
    }
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Enhanced HTML IntelliSense
    monaco.languages.html.htmlDefaults.setOptions({
      format: {
        tabSize: settings.tabSize,
        insertSpaces: true,
        wrapLineLength: 120,
        unformatted: 'default": "a, abbr, acronym, b, bdo, big, br, button, cite, code, dfn, em, i, img, input, kbd, label, map, object, q, samp, script, select, small, span, strong, sub, sup, textarea, tt, var',
        contentUnformatted: 'pre',
        indentInnerHtml: false,
        preserveNewLines: true,
        maxPreserveNewLines: undefined,
        indentHandlebars: false,
        endWithNewline: false,
        extraLiners: 'head, body, /html',
        wrapAttributes: 'auto'
      },
      suggest: {
        html5: true,
        angular1: false,
        ionic: false
      }
    });

    // Enhanced CSS IntelliSense
    monaco.languages.css.cssDefaults.setOptions({
      validate: true,
      lint: {
        compatibleVendorPrefixes: 'ignore',
        vendorPrefix: 'warning',
        duplicateProperties: 'warning',
        emptyRules: 'warning',
        importStatement: 'ignore',
        boxModel: 'ignore',
        universalSelector: 'ignore',
        zeroUnits: 'ignore',
        fontFaceProperties: 'warning',
        hexColorLength: 'error',
        argumentsInColorFunction: 'error',
        unknownProperties: 'warning',
        ieHack: 'ignore',
        unknownVendorSpecificProperties: 'ignore',
        propertyIgnoredDueToDisplay: 'warning',
        important: 'ignore',
        float: 'ignore',
        idSelector: 'ignore'
      }
    });

    // Enhanced JavaScript IntelliSense
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types'],
      lib: ['ES2020', 'DOM']
    });

    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      noSuggestionDiagnostics: false
    });

    // Add common JavaScript libraries
    monaco.languages.typescript.javascriptDefaults.addExtraLib(`
      declare var console: {
        log(...args: any[]): void;
        error(...args: any[]): void;
        warn(...args: any[]): void;
        info(...args: any[]): void;
      };
      declare var document: any;
      declare var window: any;
      declare var alert: (message: string) => void;
    `, 'global.d.ts');

    // Configure Monaco Editor themes
    monaco.editor.defineTheme('monokai', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '75715e', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'f92672' },
        { token: 'string', foreground: 'e6db74' },
        { token: 'number', foreground: 'ae81ff' },
        { token: 'type', foreground: '66d9ef' },
        { token: 'class', foreground: 'a6e22e' },
        { token: 'function', foreground: 'a6e22e' },
      ],
      colors: {
        'editor.background': '#272822',
        'editor.foreground': '#f8f8f2',
        'editor.lineHighlightBackground': '#3e3d32',
        'editor.selectionBackground': '#49483e',
        'editorCursor.foreground': '#f8f8f0',
        'editorWhitespace.foreground': '#3b3a32',
      }
    });

    monaco.editor.defineTheme('dracula', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'ff79c6' },
        { token: 'string', foreground: 'f1fa8c' },
        { token: 'number', foreground: 'bd93f9' },
        { token: 'type', foreground: '8be9fd' },
        { token: 'class', foreground: '50fa7b' },
        { token: 'function', foreground: '50fa7b' },
      ],
      colors: {
        'editor.background': '#282a36',
        'editor.foreground': '#f8f8f2',
        'editor.lineHighlightBackground': '#44475a',
        'editor.selectionBackground': '#44475a',
        'editorCursor.foreground': '#f8f8f2',
        'editorWhitespace.foreground': '#6272a4',
      }
    });

    // Set up keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Trigger save action
      window.dispatchEvent(new CustomEvent('editor-save'));
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      // Trigger run action
      window.dispatchEvent(new CustomEvent('editor-run'));
    });

    // Configure editor options
    editor.updateOptions({
      fontSize: settings.fontSize,
      fontFamily: settings.fontFamily,
      tabSize: settings.tabSize,
      wordWrap: settings.wordWrap ? 'on' : 'off',
      minimap: {
        enabled: settings.minimap,
        size: 'proportional',
        maxColumn: 120,
        renderCharacters: true,
        showSlider: 'always'
      },
      lineNumbers: settings.lineNumbers ? 'on' : 'off',
      automaticLayout: true,
      scrollBeyondLastLine: false,
      renderWhitespace: 'selection',
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
      suggest: {
        showKeywords: true,
        showSnippets: true,
        showFunctions: true,
        showConstructors: true,
        showFields: true,
        showVariables: true,
        showClasses: true,
        showStructs: true,
        showInterfaces: true,
        showModules: true,
        showProperties: true,
        showEvents: true,
        showOperators: true,
        showUnits: true,
        showValues: true,
        showConstants: true,
        showEnums: true,
        showEnumMembers: true,
        showColors: true,
        showFiles: true,
        showReferences: true,
        showFolders: true,
        showTypeParameters: true,
      },
    });
  };

  // Update editor options when settings change
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        fontSize: settings.fontSize,
        fontFamily: settings.fontFamily,
        tabSize: settings.tabSize,
        wordWrap: settings.wordWrap ? 'on' : 'off',
        minimap: {
          enabled: settings.minimap,
          size: 'proportional',
          maxColumn: 120,
          renderCharacters: true,
          showSlider: 'always'
        },
        lineNumbers: settings.lineNumbers ? 'on' : 'off',
      });
    }
  }, [settings]);

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Tab Bar */}
      <div className="flex bg-gray-800 border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.type}
            onClick={() => onTabChange(tab.type)}
            className={`editor-tab flex items-center space-x-2 ${
              activeTab === tab.type ? 'active' : ''
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={getCurrentLanguage()}
          value={getCurrentCode()}
          theme={settings.theme}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: 'line',
            automaticLayout: true,
            glyphMargin: true,
            useTabStops: false,
            fontSize: settings.fontSize,
            fontFamily: settings.fontFamily,
            tabSize: settings.tabSize,
            wordWrap: settings.wordWrap ? 'on' : 'off',
            minimap: {
              enabled: settings.minimap,
              size: 'proportional',
              maxColumn: 120,
              renderCharacters: true,
              showSlider: 'always'
            },
            lineNumbers: settings.lineNumbers ? 'on' : 'off',
            scrollBeyondLastLine: false,
            renderWhitespace: 'selection',
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true,
            },
          }}
          loading={
            <div className="flex items-center justify-center h-full bg-gray-900 text-gray-400">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <div>Loading Editor...</div>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default EditorPane;
