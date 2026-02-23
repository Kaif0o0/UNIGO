const express = require('express');
const router = express.Router();
const { 
  getOrCreateChat, 
  getMessages, 
  sendMessage, 
  getMyChats,
  deleteChat
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getMyChats);
router.post('/', protect, getOrCreateChat);
router.delete('/:id', protect, deleteChat);
router.get('/:id/messages', protect, getMessages);
router.post('/:id/messages', protect, sendMessage);

module.exports = router;
