const asyncHandler = require('../utils/asyncHandler');
const Tool = require('../models/Tool');
const mongoose = require('mongoose');
const xss = require('xss');

const TOOL_TEXT_FIELDS = ['toolName', 'category', 'description', 'borrower'];
const TOOL_REQUIRED_FIELDS = ['toolName', 'category', 'condition', 'description'];
const TOOL_CONDITION_VALUES = ['Excellent', 'Good', 'Fair', 'Damaged'];
const TOOL_STATUS_VALUES = ['Available', 'Borrowed', 'Maintenance'];
const TOOL_UPDATE_FIELDS = [...TOOL_TEXT_FIELDS, 'condition', 'status'];
const sanitizeToolValue = (value) => xss(value.trim(), {
  whiteList: {},
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script'],
});

const buildToolData = (payload, { requireAllFields = false } = {}) => {
  if (!payload || Array.isArray(payload) || typeof payload !== 'object') {
    return {
      error: 'Request body must be a JSON object',
    };
  }

  const updateData = {};
  const invalidFields = Object.keys(payload).filter(
    (field) => !TOOL_UPDATE_FIELDS.includes(field)
  );

  if (invalidFields.length > 0) {
    return {
      error: `Invalid update field(s): ${invalidFields.join(', ')}`,
    };
  }

  for (const field of TOOL_UPDATE_FIELDS) {
    if (payload[field] === undefined) {
      if (requireAllFields && TOOL_REQUIRED_FIELDS.includes(field)) {
        return {
          error: 'Please provide all required fields',
        };
      }

      continue;
    }

    if (field === 'borrower') {
      if (typeof payload[field] !== 'string') {
        return {
          error: `${field} must be a string`,
        };
      }

      updateData[field] = payload[field].trim() ? sanitizeToolValue(payload[field]) : '';
      continue;
    }

    if (typeof payload[field] !== 'string' || payload[field].trim() === '') {
      return {
        error: `${field} must be a non-empty string`,
      };
    }

    updateData[field] = sanitizeToolValue(payload[field]);
  }

  if (updateData.condition && !TOOL_CONDITION_VALUES.includes(updateData.condition)) {
    return {
      error: `${updateData.condition} is not a valid condition`,
    };
  }

  if (updateData.status && !TOOL_STATUS_VALUES.includes(updateData.status)) {
    return {
      error: `${updateData.status} is not a valid status`,
    };
  }

  if (Object.keys(updateData).length === 0) {
    return {
      error: 'Please provide at least one field to update',
    };
  }

  return { updateData };
};

const buildToolCreateData = (payload) => {
  const { updateData, error } = buildToolData(payload, {
    requireAllFields: true,
  });

  if (error) {
    return { error };
  }

  return {
    createData: {
      ...updateData,
      condition: updateData.condition || 'Good',
      status: updateData.status || 'Available',
    },
  };
};

// @desc    Get all tools
// @route   GET /api/tools
// @access  Public
const getTools = asyncHandler(async (req, res) => {
  const tools = await Tool.find({}).sort({ createdAt: -1 });
  res.status(200).json(tools);
});

// @desc    Get tool by ID
// @route   GET /api/tools/:id
// @access  Public
const getToolById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({ message: 'Invalid tool ID' });
  }

  const tool = await Tool.findById(id);

  if (!tool) {
    return res.status(404).json({ message: 'Tool not found' });
  }

  return res.status(200).json(tool);
});

// @desc    Create a tool
// @route   POST /api/tools
// @access  Public
const createTool = asyncHandler(async (req, res) => {
  const { createData, error } = buildToolCreateData(req.body);

  if (error) {
    return res.status(400).json({ message: error });
  }

  const tool = await Tool.create(createData);

  console.log('[Analytics] User interacted with Tool Lending Library');

  res.status(201).json(tool);
});

// @desc    Update a tool
// @route   PUT /api/tools/:id
// @access  Public
const updateTool = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({ message: 'Invalid tool ID' });
  }

  const { updateData, error } = buildToolData(req.body);

  if (error) {
    return res.status(400).json({ message: error });
  }

  const tool = await Tool.findByIdAndUpdate(id, updateData, {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!tool) {
    return res.status(404).json({ message: 'Tool not found' });
  }

  console.log('[Analytics] User interacted with Tool Lending Library');

  return res.status(200).json(tool);
});

// @desc    Delete a tool
// @route   DELETE /api/tools/:id
// @access  Public
const deleteTool = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({ message: 'Invalid tool ID' });
  }

  const tool = await Tool.findByIdAndDelete(id);

  if (!tool) {
    return res.status(404).json({ message: 'Tool not found' });
  }

  console.log('[Analytics] User interacted with Tool Lending Library');

  return res.status(200).json({ message: 'Tool deleted successfully' });
});

module.exports = {
  getTools,
  getToolById,
  createTool,
  updateTool,
  deleteTool,
};
