const mongoose = require('mongoose');

const codeSnippetSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  htmlCode: {
    type: String,
    default: ''
  },
  cssCode: {
    type: String,
    default: ''
  },
  jsCode: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: 'Untitled Project'
  },
  description: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
codeSnippetSchema.index({ createdAt: -1 });
codeSnippetSchema.index({ id: 1 });

module.exports = mongoose.model('CodeSnippet', codeSnippetSchema);
