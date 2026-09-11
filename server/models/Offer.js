import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    farmer: { type: String, required: true, trim: true },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    crop: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    quality: { type: String, default: 'Grade A', trim: true },
    price: { type: Number, required: true, min: 0 },
    buyer: { type: String, default: '', trim: true },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    requirement: { type: mongoose.Schema.Types.ObjectId, ref: 'Requirement' },
    message: { type: String, default: '', trim: true },
    status: { type: String, default: 'Pending', trim: true },
  },
  { timestamps: true }
);

export default mongoose.model('Offer', offerSchema);
