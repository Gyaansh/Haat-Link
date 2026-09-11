import Market from '../models/Market.js';

export async function getMarkets(req, res) {
  try {
    const markets = await Market.find().sort({ crop: 1 });
    res.json(markets);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch market data.', error: err.message });
  }
}

export async function getMarketByCrop(req, res) {
  try {
    const { crop } = req.params;
    const market = await Market.findOne({ crop: new RegExp(`^${crop}$`, 'i') });

    if (!market) {
      return res.status(404).json({ message: `No market data found for crop: ${crop}` });
    }

    res.json(market);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch market data.', error: err.message });
  }
}
