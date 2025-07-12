import type { FileType, ExecutionResult } from '../types/index';

// Execute JavaScript code (already supported in browser)
export const executeJavaScript = async (code: string): Promise<ExecutionResult> => {
  const startTime = performance.now();
  
  try {
    // Create a sandboxed execution environment
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    const iframeWindow = iframe.contentWindow;
    if (!iframeWindow) throw new Error('Failed to create sandbox');
    
    // Capture console output
    let output = '';
    const originalLog = iframeWindow.console.log;
    iframeWindow.console.log = (...args: any[]) => {
      output += args.map(arg => String(arg)).join(' ') + '\n';
    };
    
    // Execute code
    iframeWindow.eval(code);
    
    // Cleanup
    document.body.removeChild(iframe);
    
    const executionTime = performance.now() - startTime;
    
    return {
      output: output || 'Code executed successfully (no output)',
      executionTime,
      language: 'javascript'
    };
  } catch (error: any) {
    const executionTime = performance.now() - startTime;
    return {
      output: '',
      error: error.message || 'JavaScript execution failed',
      executionTime,
      language: 'javascript'
    };
  }
};

// Main execution function - only supports JavaScript now
export const executeCode = async (code: string, language: FileType, inputs: string[] = []): Promise<ExecutionResult> => {
  switch (language) {
    case 'javascript':
      return executeJavaScript(code);
    default:
      return {
        output: '',
        error: `Language '${language}' is not supported for execution. Only JavaScript can be executed.`,
        executionTime: 0,
        language
      };
  }
};

// Simple code analysis function for error detection
export const analyzeCode = async (code: string, language: FileType): Promise<any[]> => {
  // Basic analysis - can be enhanced with real linters
  const errors = [];
  
  if (language === 'javascript') {
    // Basic JavaScript syntax checks
    try {
      new Function(code);
    } catch (error: any) {
      errors.push({
        id: 'js-syntax-error',
        message: error.message,
        line: 1,
        column: 1,
        severity: 'error',
        language: 'javascript'
      });
    }
  }
  
  return errors;
};
