// import JSZip from 'jszip'; // Commented out for now

export const downloadAsHTML = (htmlCode: string, cssCode: string, jsCode: string) => {
  const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Editor Export</title>
    <style>
${cssCode}
    </style>
</head>
<body>
${htmlCode.replace(/<head>[\s\S]*?<\/head>/i, '').replace(/<\/?html[^>]*>/gi, '').replace(/<\/?body[^>]*>/gi, '')}
    <script>
${jsCode}
    </script>
</body>
</html>`;

  const blob = new Blob([fullHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'code-editor-export.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const downloadAsZip = async (htmlCode: string, cssCode: string, jsCode: string) => {
  // Fallback: Download individual files since JSZip might not be available
  try {
    // Try to use dynamic import for JSZip
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    // Add HTML file
    const cleanHTML = htmlCode.replace(/<head>[\s\S]*?<\/head>/i, '').replace(/<\/?html[^>]*>/gi, '').replace(/<\/?body[^>]*>/gi, '');
    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Editor Export</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
${cleanHTML}
    <script src="script.js"></script>
</body>
</html>`;

    zip.file('index.html', fullHTML);
    zip.file('style.css', cssCode);
    zip.file('script.js', jsCode);

    // Add README
    const readme = `# Code Editor Export

This project was exported from the Online Code Editor.

## Files:
- index.html - Main HTML file
- style.css - CSS styles
- script.js - JavaScript code

## Usage:
Open index.html in your web browser to view the project.

Generated on: ${new Date().toLocaleString()}
`;

    zip.file('README.md', readme);

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code-editor-project.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('JSZip not available, downloading HTML only:', error);
    // Fallback to HTML download
    downloadAsHTML(htmlCode, cssCode, jsCode);
    alert('ZIP download not available. Downloaded as HTML file instead.');
  }
};
