import Memory from '../models/Memory.js';
import User from '../models/User.js';

// Create a memory
export const createMemory = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const { title, description } = req.body;
    const image = req.file ? req.file.path : null;

    // Verify user exists
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create memory
    const newMemory = await Memory.create({
      title,
      description,
      image,
      creator: req.userId
    });

    // Populate the creator field with username
    const populatedMemory = await Memory.findById(newMemory._id)
      .populate('creator', 'username');

    console.log('Created Memory:', populatedMemory);
    res.status(201).json(populatedMemory);
  } catch (err) {
    console.error('Create Memory Error:', err);
    // Handle specific MongoDB errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Error creating memory' });
  }
};

// Get all memories
export const getMemories = async (req, res) => {
  try {
    const memories = await Memory.find()
      .populate('creator', 'username')
      .sort({ createdAt: -1 });
    res.status(200).json(memories);
  } catch (err) {
    console.error('Get Memories Error:', err);
    res.status(500).json({ message: 'Error fetching memories' });
  }
};

// Delete a memory (only if user owns it)
export const deleteMemory = async (req, res) => {
  const { id } = req.params;

  try {
    const memory = await Memory.findById(id);
    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    if (memory.creator.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this memory' });
    }

    await memory.deleteOne();
    res.status(200).json({ message: 'Memory deleted successfully' });
  } catch (err) {
    console.error('Delete Memory Error:', err);
    res.status(500).json({ message: 'Error deleting memory' });
  }
};
