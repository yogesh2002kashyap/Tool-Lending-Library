const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema(
  {
    toolName: {
      type: String,
      required: [true, 'Tool name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    condition: {
      type: String,
      required: [true, 'Condition is required'],
      enum: {
        values: ['Excellent', 'Good', 'Fair', 'Damaged'],
        message: '{VALUE} is not a valid condition',
      },
      default: 'Good',
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['Available', 'Borrowed', 'Maintenance'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Available',
    },
    borrower: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Tool', toolSchema);
