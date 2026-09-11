import mongoose from 'mongoose';

const nearbyMarketSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    distance: { type: String, required: true },
  },
  { _id: false }
);

const marketSchema = new mongoose.Schema(
  {
    crop: { type: String, required: true, unique: true, trim: true },
    average: { type: Number, required: true },
    change: { type: Number, required: true },
    predicted: { type: Number, required: true },
    demand: { type: String, required: true, trim: true },
    markets: [nearbyMarketSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Market', marketSchema);
