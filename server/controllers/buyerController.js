import Buyer from '../models/Buyer.js';

export async function getBuyers(req, res) {
  try {
    const filter = {};
    if (req.query.crop) {
      filter.crop = req.query.crop;
    }
    const buyers = await Buyer.find(filter).sort({ trust: -1 });
    res.json(buyers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch buyers.', error: err.message });
  }
}
