import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
