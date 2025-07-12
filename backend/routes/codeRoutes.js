const express = require('express');
const { v4: uuidv4 } = require('uuid');
const CodeSnippet = require('../models/CodeSnippet');

const router = express.Router();

// POST /api/code/save - Save a new code snippet
router.post('/save', async (req, res) => {
  try {
    const { htmlCode, cssCode, jsCode, title, description } = req.body;
    
    // Generate unique ID
    const id = uuidv4();
    
    // Create new code snippet
    const codeSnippet = new CodeSnippet({
      id,
      htmlCode: htmlCode || '',
      cssCode: cssCode || '',
      jsCode: jsCode || '',
      title: title || 'Untitled Project',
      description: description || ''
    });
    
    await codeSnippet.save();
    
    res.status(201).json({
      success: true,
      id: id,
      message: 'Code snippet saved successfully',
      shareUrl: `${req.protocol}://${req.get('host')}/api/code/${id}`
    });
  } catch (error) {
    console.error('Error saving code snippet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save code snippet'
    });
  }
});

// GET /api/code/:id - Retrieve a code snippet by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const codeSnippet = await CodeSnippet.findOne({ id });
    
    if (!codeSnippet) {
      return res.status(404).json({
        success: false,
        error: 'Code snippet not found'
      });
    }
    
    // Increment view count
    codeSnippet.views += 1;
    await codeSnippet.save();
    
    res.json({
      success: true,
      data: {
        id: codeSnippet.id,
        htmlCode: codeSnippet.htmlCode,
        cssCode: codeSnippet.cssCode,
        jsCode: codeSnippet.jsCode,
        title: codeSnippet.title,
        description: codeSnippet.description,
        createdAt: codeSnippet.createdAt,
        views: codeSnippet.views
      }
    });
  } catch (error) {
    console.error('Error retrieving code snippet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve code snippet'
    });
  }
});

// PUT /api/code/:id - Update an existing code snippet
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { htmlCode, cssCode, jsCode, title, description } = req.body;
    
    const codeSnippet = await CodeSnippet.findOne({ id });
    
    if (!codeSnippet) {
      return res.status(404).json({
        success: false,
        error: 'Code snippet not found'
      });
    }
    
    // Update fields
    if (htmlCode !== undefined) codeSnippet.htmlCode = htmlCode;
    if (cssCode !== undefined) codeSnippet.cssCode = cssCode;
    if (jsCode !== undefined) codeSnippet.jsCode = jsCode;
    if (title !== undefined) codeSnippet.title = title;
    if (description !== undefined) codeSnippet.description = description;
    
    codeSnippet.updatedAt = new Date();
    
    await codeSnippet.save();
    
    res.json({
      success: true,
      message: 'Code snippet updated successfully',
      data: {
        id: codeSnippet.id,
        htmlCode: codeSnippet.htmlCode,
        cssCode: codeSnippet.cssCode,
        jsCode: codeSnippet.jsCode,
        title: codeSnippet.title,
        description: codeSnippet.description,
        updatedAt: codeSnippet.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating code snippet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update code snippet'
    });
  }
});

// GET /api/code - Get recent code snippets (optional feature)
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    
    const codeSnippets = await CodeSnippet.find()
      .select('id title description createdAt views')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    
    const total = await CodeSnippet.countDocuments();
    
    res.json({
      success: true,
      data: codeSnippets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error retrieving code snippets:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve code snippets'
    });
  }
});

module.exports = router;
