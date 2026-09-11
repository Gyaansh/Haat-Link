import Notification from '../models/Notification.js';

export async function getNotifications(req, res) {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications.', error: err.message });
  }
}
