import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    quality: { type: String, required: true, trim: true },
    harvestDate: { type: String, required: true },
    status: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    emoji: { type: String, default: '🌾' },
  },
  { timestamps: true }
);

export default mongoose.model('Crop', cropSchema);
