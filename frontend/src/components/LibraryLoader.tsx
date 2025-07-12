import React, { useState } from 'react';

interface Library {
  name: string;
  description: string;
  css?: string;
  js?: string;
  category: string;
}

interface LibraryLoaderProps {
  onLibraryAdd: (library: Library) => void;
  onLibraryRemove: (library: Library) => void;
  loadedLibraries: Library[];
}

const POPULAR_LIBRARIES: Library[] = [
  {
    name: 'Bootstrap 5',
    description: 'Popular CSS framework',
    css: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    js: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
    category: 'CSS Framework'
  },
  {
    name: 'jQuery',
    description: 'Fast, small, and feature-rich JavaScript library',
    js: 'https://code.jquery.com/jquery-3.7.0.min.js',
    category: 'JavaScript Library'
  },
  {
    name: 'Vue.js 3',
    description: 'Progressive JavaScript framework',
    js: 'https://unpkg.com/vue@3/dist/vue.global.js',
    category: 'JavaScript Framework'
  },
  {
    name: 'Lodash',
    description: 'Modern JavaScript utility library',
    js: 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js',
    category: 'JavaScript Library'
  },
  {
    name: 'Chart.js',
    description: 'Simple yet flexible JavaScript charting',
    js: 'https://cdn.jsdelivr.net/npm/chart.js',
    category: 'Data Visualization'
  },
  {
    name: 'Font Awesome',
    description: 'Icon library and toolkit',
    css: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    category: 'Icons'
  },
  {
    name: 'Tailwind CSS',
    description: 'Utility-first CSS framework',
    css: 'https://cdn.tailwindcss.com',
    category: 'CSS Framework'
  }
];

const LibraryLoader: React.FC<LibraryLoaderProps> = ({ onLibraryAdd, onLibraryRemove, loadedLibraries }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'browse' | 'loaded'>('browse');

  const categories = ['All', ...Array.from(new Set(POPULAR_LIBRARIES.map(lib => lib.category)))];

  const filteredLibraries = POPULAR_LIBRARIES.filter(library => {
    const matchesSearch = library.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         library.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || library.category === selectedCategory;
    const notLoaded = !loadedLibraries.some(loaded => loaded.name === library.name);
    
    return matchesSearch && matchesCategory && notLoaded;
  });

  const handleAddLibrary = (library: Library) => {
    onLibraryAdd(library);
    console.log('Added library:', library.name);
  };

  const handleRemoveLibrary = (library: Library) => {
    onLibraryRemove(library);
    console.log('Removed library:', library.name);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="toolbar-button"
        title="Add External Libraries"
      >
        📚 Libraries ({loadedLibraries.length})
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-0 w-full max-w-5xl mx-4 max-h-[85vh] overflow-hidden flex flex-col border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              📚
            </div>
            <h2 className="text-xl font-bold text-white">External Libraries</h2>
            <span className="bg-white bg-opacity-20 text-white text-xs px-2 py-1 rounded-full">
              {loadedLibraries.length} loaded
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-300 text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 bg-gray-800">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'browse'
                ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-750'
                : 'text-gray-400 hover:text-white hover:bg-gray-750'
            }`}
          >
            📦 Browse Libraries
          </button>
          <button
            onClick={() => setActiveTab('loaded')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'loaded'
                ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-750'
                : 'text-gray-400 hover:text-white hover:bg-gray-750'
            }`}
          >
            ✅ Loaded Libraries ({loadedLibraries.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden p-6">
          {activeTab === 'browse' ? (
            <>
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">🔍</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Search libraries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                  />
                </div>
                <div className="sm:w-48">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none transition-all"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Available Libraries Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
                {filteredLibraries.map((library, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-5 border border-gray-600 hover:border-blue-500 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-white group-hover:text-blue-300 transition-colors">{library.name}</h4>
                      <span className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full">
                        {library.category}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">{library.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {library.css && (
                          <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full flex items-center">
                            🎨 CSS
                          </span>
                        )}
                        {library.js && (
                          <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full flex items-center">
                            ⚡ JS
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddLibrary(library)}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                ))}
                {filteredLibraries.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <div className="text-gray-400 text-lg mb-2">📦</div>
                    <p className="text-gray-400">No libraries found matching your criteria</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Loaded Libraries Tab */
            <div className="space-y-4">
              {loadedLibraries.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">No Libraries Loaded</h3>
                  <p className="text-gray-400 mb-4">Browse and add libraries to get started</p>
                  <button
                    onClick={() => setActiveTab('browse')}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all"
                  >
                    Browse Libraries
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
                  {loadedLibraries.map((library, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-5 border border-green-500 shadow-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-green-200">✅</span>
                          <h4 className="font-semibold text-white">{library.name}</h4>
                        </div>
                        <button
                          onClick={() => handleRemoveLibrary(library)}
                          className="text-green-200 hover:text-white hover:bg-red-500 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                          title="Remove library"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="text-green-100 text-sm mb-3">{library.description}</p>
                      <div className="flex space-x-2">
                        {library.css && (
                          <span className="text-xs bg-green-800 text-green-100 px-2 py-1 rounded-full">
                            🎨 CSS
                          </span>
                        )}
                        {library.js && (
                          <span className="text-xs bg-green-800 text-green-100 px-2 py-1 rounded-full">
                            ⚡ JS
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-700 bg-gray-800">
          <div className="text-gray-400 text-sm">
            {loadedLibraries.length > 0 && (
              <span>✅ {loadedLibraries.length} libraries active in your project</span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-2 rounded-lg transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LibraryLoader;
