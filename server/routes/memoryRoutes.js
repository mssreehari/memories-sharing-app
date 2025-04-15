import express from 'express';
import {
  createMemory,
  getMemories,
  deleteMemory
} from '../controllers/memoryController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.get('/', getMemories); // Public
router.post('/', authMiddleware, upload.single('image'), createMemory); // Auth required
router.delete('/:id', authMiddleware, deleteMemory); // Auth + ownership required

export default router;
