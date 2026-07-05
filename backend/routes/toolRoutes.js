const express = require('express');
const router = express.Router();
const {
  getTools,
  getToolById,
  createTool,
  updateTool,
  deleteTool,
} = require('../controllers/toolController');

router.route('/').get(getTools).post(createTool);
router.route('/:id').get(getToolById).put(updateTool).delete(deleteTool);

// Catch-all 404 for unknown routes under /api/tools
router.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found in tool routes' });
});

module.exports = router;
