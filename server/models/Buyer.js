import mongoose from 'mongoose';

const buyerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    crop: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    required: { type: Number, required: true, min: 0 },
    quality: { type: String, required: true, trim: true },
    pickup: { type: Boolean, default: false },
    paymentDays: { type: Number, required: true, min: 0 },
    trust: { type: Number, required: true, min: 0, max: 100 },
    distance: { type: Number, required: true, min: 0 },
    transport: { type: Number, required: true, min: 0 },
    handling: { type: Number, required: true, min: 0 },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Buyer', buyerSchema);
