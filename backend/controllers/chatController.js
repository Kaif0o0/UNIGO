const Chat = require('../models/Chat');
const Message = require('../models/Message');

// @desc    Get or create a chat between user and mentor
// @route   POST /api/chats
// @access  Private
const getOrCreateChat = async (req, res) => {
  try {
    const { mentorId, participantId } = req.body;

    // Check if chat already exists
    let chat = await Chat.findOne({
      mentor: mentorId,
      participants: { $all: [req.user._id, participantId] }
    }).populate('participants', 'name email').populate('mentor', 'name');

    if (!chat) {
      chat = new Chat({
        mentor: mentorId,
        participants: [req.user._id, participantId]
      });
      await chat.save();
      chat = await Chat.findById(chat._id).populate('participants', 'name email').populate('mentor', 'name');
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error('GET OR CREATE CHAT ERROR:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get messages for a chat
// @route   GET /api/chats/:id/messages
// @access  Private
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.id })
      .sort({ createdAt: 1 })
      .populate('sender', 'name');
    res.json(messages);
  } catch (error) {
    console.error('GET MESSAGES ERROR:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Send a message
// @route   POST /api/chats/:id/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const message = new Message({
      chat: req.params.id,
      sender: req.user._id,
      text
    });

    await message.save();

    // Update last message in Chat
    await Chat.findByIdAndUpdate(req.params.id, { lastMessage: message._id });

    const populatedMessage = await Message.findById(message._id).populate('sender', 'name');
    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('SEND MESSAGE ERROR:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all chats for the logged in user
// @route   GET /api/chats
// @access  Private
const getMyChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate('participants', 'name email')
      .populate('mentor', 'name')
      .populate({
        path: 'lastMessage',
        select: 'text createdAt sender'
      })
      .sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) {
    console.error('GET MY CHATS ERROR:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a chat and all its messages
// @route   DELETE /api/chats/:id
// @access  Private
const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Only participants can delete the chat
    const isParticipant = chat.participants.some(
      (p) => p.toString() === req.user._id.toString()
    );
    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete all messages in this chat
    await Message.deleteMany({ chat: req.params.id });

    // Delete the chat
    await Chat.findByIdAndDelete(req.params.id);

    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('DELETE CHAT ERROR:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getOrCreateChat,
  getMessages,
  sendMessage,
  getMyChats,
  deleteChat
};
