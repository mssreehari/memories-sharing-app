import mongoose from 'mongoose';

const memorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: String,
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Memory = mongoose.model('Memory', memorySchema);
export default Memory;
