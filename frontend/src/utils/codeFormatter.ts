// Simple and reliable code formatting utilities
export const formatHTML = (code: string): string => {
  try {
    // Simple HTML formatting - just add line breaks and basic indentation
    let formatted = code
      .replace(/></g, '>\n<')
      .replace(/^\s+|\s+$/g, '') // trim
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map((line, index, array) => {
        let indent = 0;

        // Count opening tags before this line
        for (let i = 0; i < index; i++) {
          const prevLine = array[i];
          const openTags = (prevLine.match(/<(?!\/)[\w\s="'-]*>/g) || []).length;
          const closeTags = (prevLine.match(/<\/[\w\s]*>/g) || []).length;
          const selfClosing = (prevLine.match(/<[\w\s="'-]*\/>/g) || []).length;
          indent += openTags - closeTags - selfClosing;
        }

        // Adjust for closing tag on current line
        if (line.startsWith('</')) {
          indent = Math.max(0, indent - 1);
        }

        return '  '.repeat(Math.max(0, indent)) + line;
      })
      .join('\n');

    return formatted;
  } catch (error) {
    console.error('HTML formatting error:', error);
    return code;
  }
};

export const formatCSS = (code: string): string => {
  try {
    // Simple CSS formatting
    let formatted = code
      .replace(/\s*{\s*/g, ' {\n')
      .replace(/;\s*/g, ';\n')
      .replace(/\s*}\s*/g, '\n}\n')
      .replace(/,\s*/g, ',\n')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map((line, index, array) => {
        let indent = 0;

        // Count braces before this line
        for (let i = 0; i < index; i++) {
          const prevLine = array[i];
          if (prevLine.includes('{')) indent++;
          if (prevLine.includes('}')) indent--;
        }

        // Adjust for closing brace on current line
        if (line.includes('}')) {
          indent = Math.max(0, indent - 1);
        }

        return '  '.repeat(Math.max(0, indent)) + line;
      })
      .join('\n');

    return formatted;
  } catch (error) {
    console.error('CSS formatting error:', error);
    return code;
  }
};

export const formatJavaScript = (code: string): string => {
  try {
    // Simple JavaScript formatting
    let formatted = code
      .replace(/;\s*(?=\w)/g, ';\n')
      .replace(/{\s*/g, ' {\n')
      .replace(/}\s*/g, '\n}\n')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map((line, index, array) => {
        let indent = 0;

        // Count braces before this line
        for (let i = 0; i < index; i++) {
          const prevLine = array[i];
          if (prevLine.includes('{')) indent++;
          if (prevLine.includes('}')) indent--;
        }

        // Adjust for closing brace on current line
        if (line.includes('}')) {
          indent = Math.max(0, indent - 1);
        }

        return '  '.repeat(Math.max(0, indent)) + line;
      })
      .join('\n');

    return formatted;
  } catch (error) {
    console.error('JavaScript formatting error:', error);
    return code;
  }
};

export const formatCode = (code: string, language: string): string => {
  switch (language.toLowerCase()) {
    case 'html':
      return formatHTML(code);
    case 'css':
      return formatCSS(code);
    case 'javascript':
    case 'js':
      return formatJavaScript(code);
    default:
      return code;
  }
};
