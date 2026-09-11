import Crop from '../models/Crop.js';
import Deal from '../models/Deal.js';
import Notification from '../models/Notification.js';

export async function getDashboardStats(req, res) {
  try {
    const [crops, deals, notifications] = await Promise.all([
      Crop.find(),
      Deal.find(),
      Notification.find().sort({ createdAt: -1 }),
    ]);

    const totalQuantity = crops.reduce((sum, c) => sum + c.quantity, 0);

    const activeDeals = deals.filter((d) =>
      ['Deal Created', 'Pickup Scheduled', 'In Transit'].includes(d.status)
    );

    res.json({
      cropCount: crops.length,
      totalQuantity,
      dealCount: deals.length,
      activeDeals: activeDeals.length,
      notifications,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch dashboard stats.', error: err.message });
  }
}
