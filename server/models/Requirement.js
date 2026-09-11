import mongoose from 'mongoose';

const requirementSchema = new mongoose.Schema(
  {
    crop: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    received: { type: Number, default: 0, min: 0 },
    quality: { type: String, required: true, trim: true },
    offeredPrice: { type: Number, required: true, min: 0 },
    requiredBy: { type: String, required: true },
    location: { type: String, required: true, trim: true },
    paymentTerms: { type: String, required: true, trim: true },
    notes: { type: String, default: '', trim: true },
    status: { type: String, default: 'Active', trim: true },
    buyer: { type: String, required: true, trim: true, default: 'ABC Foods' },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Requirement', requirementSchema);
