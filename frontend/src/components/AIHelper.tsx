import React, { useState, useRef, useEffect } from 'react';
import type { FileType } from '../types/index';

interface AIHelperProps {
  currentCode: string;
  activeTab: FileType;
  onCodeSuggestion: (code: string) => void;
}

const AIHelper: React.FC<AIHelperProps> = ({ currentCode, activeTab, onCodeSuggestion }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    try {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setTranscript(prev => prev + ' ' + finalTranscript);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      } else {
        console.warn('Speech recognition not supported in this browser');
      }
    } catch (error) {
      console.error('Failed to initialize speech recognition:', error);
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        setIsListening(true);
        setTranscript('');
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        setIsListening(false);
        alert('Speech recognition failed to start. Please check your microphone permissions.');
      }
    } else {
      alert('Speech recognition is not supported in your browser. Try using Chrome or Edge.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (error) {
        console.error('Failed to stop speech recognition:', error);
        setIsListening(false);
      }
    }
  };

  const convertSpeechToCode = () => {
    if (!transcript.trim()) return;

    setIsLoading(true);
    
    // Simple voice-to-code conversion (this would be enhanced with actual AI)
    let generatedCode = '';
    const lowerTranscript = transcript.toLowerCase();

    if (activeTab === 'html') {
      if (lowerTranscript.includes('create a button')) {
        generatedCode = '<button class="btn">Click me</button>';
      } else if (lowerTranscript.includes('create a div')) {
        generatedCode = '<div class="container">\n  <!-- Content here -->\n</div>';
      } else if (lowerTranscript.includes('create a form')) {
        generatedCode = `<form>
  <div class="form-group">
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>
  </div>
  <button type="submit">Submit</button>
</form>`;
      } else {
        generatedCode = `<!-- Generated from: "${transcript}" -->\n<div>\n  <!-- Add your content here -->\n</div>`;
      }
    } else if (activeTab === 'css') {
      if (lowerTranscript.includes('center')) {
        generatedCode = `.center {
  display: flex;
  justify-content: center;
  align-items: center;
}`;
      } else if (lowerTranscript.includes('button style')) {
        generatedCode = `.btn {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #0056b3;
}`;
      } else {
        generatedCode = `/* Generated from: "${transcript}" */\n.element {\n  /* Add your styles here */\n}`;
      }
    } else if (activeTab === 'javascript') {
      if (lowerTranscript.includes('function')) {
        const functionName = lowerTranscript.match(/function (\w+)/)?.[1] || 'myFunction';
        generatedCode = `function ${functionName}() {
  // Add your code here
  console.log('${functionName} called');
}`;
      } else if (lowerTranscript.includes('event listener')) {
        generatedCode = `document.addEventListener('DOMContentLoaded', function() {
  // Add your event listeners here
  console.log('Page loaded');
});`;
      } else {
        generatedCode = `// Generated from: "${transcript}"\nconsole.log('Hello from voice command!');`;
      }
    }

    setTimeout(() => {
      setAiResponse(generatedCode);
      setIsLoading(false);
    }, 1000);
  };

  const getAIHelp = async () => {
    setIsLoading(true);
    
    // Simulate AI analysis (in real implementation, this would call an AI API)
    const suggestions = {
      html: [
        "Consider adding semantic HTML5 elements like <header>, <main>, <section>",
        "Add alt attributes to images for accessibility",
        "Use proper heading hierarchy (h1, h2, h3...)",
        "Consider adding ARIA labels for better accessibility"
      ],
      css: [
        "Use CSS Grid or Flexbox for better layouts",
        "Consider using CSS custom properties (variables)",
        "Add responsive design with media queries",
        "Use consistent spacing and typography scales"
      ],
      javascript: [
        "Consider using const/let instead of var",
        "Add error handling with try-catch blocks",
        "Use modern ES6+ features like arrow functions",
        "Consider breaking large functions into smaller ones"
      ]
    };

    setTimeout(() => {
      const randomSuggestion = suggestions[activeTab][Math.floor(Math.random() * suggestions[activeTab].length)];
      setAiResponse(randomSuggestion);
      setIsLoading(false);
    }, 1500);
  };

  const applySuggestion = () => {
    if (aiResponse && aiResponse.includes('```')) {
      // Extract code from markdown-style code blocks
      const codeMatch = aiResponse.match(/```[\w]*\n([\s\S]*?)\n```/);
      if (codeMatch) {
        onCodeSuggestion(codeMatch[1]);
      }
    } else if (aiResponse && (aiResponse.includes('<') || aiResponse.includes('{') || aiResponse.includes('function'))) {
      // Direct code suggestion
      onCodeSuggestion(aiResponse);
    }
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="toolbar-button"
        title="AI Assistant & Voice Commands"
      >
        🤖 AI Helper
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">🤖 AI Assistant</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* Voice Commands */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">🎤 Voice to Code</h3>
          <div className="flex items-center space-x-2 mb-2">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`px-4 py-2 rounded transition-colors ${
                isListening 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isListening ? '🛑 Stop' : '🎤 Start Listening'}
            </button>
            <button
              onClick={convertSpeechToCode}
              disabled={!transcript.trim() || isLoading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded transition-colors"
            >
              Convert to Code
            </button>
          </div>
          {transcript && (
            <div className="bg-gray-700 p-3 rounded mb-2">
              <p className="text-gray-300 text-sm">Transcript: {transcript}</p>
            </div>
          )}
        </div>

        {/* AI Analysis */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">💡 Code Analysis</h3>
          <button
            onClick={getAIHelp}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded transition-colors"
          >
            {isLoading ? 'Analyzing...' : 'Get AI Suggestions'}
          </button>
        </div>

        {/* AI Response */}
        {aiResponse && (
          <div className="flex-1 overflow-y-auto mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">🎯 Suggestion</h3>
            <div className="bg-gray-700 p-4 rounded">
              <pre className="text-gray-300 text-sm whitespace-pre-wrap">{aiResponse}</pre>
            </div>
            {(aiResponse.includes('<') || aiResponse.includes('{') || aiResponse.includes('function')) && (
              <button
                onClick={applySuggestion}
                className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
              >
                Apply to Editor
              </button>
            )}
          </div>
        )}

        <div className="pt-4 border-t border-gray-600">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIHelper;
