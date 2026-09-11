import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema(
  {
    crop: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    buyer: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: { type: String, required: true, trim: true },
    net: { type: Number, required: true, min: 0 },
    created: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Deal', dealSchema);
