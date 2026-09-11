import Deal from '../models/Deal.js';

export async function getDeals(req, res) {
  try {
    const deals = await Deal.find().sort({ createdAt: -1 });
    res.json(deals);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch deals.', error: err.message });
  }
}

export async function createDeal(req, res) {
  try {
    const { crop, quantity, buyer, price, total, status, net, created } = req.body;

    if (!crop || !quantity || !buyer || price == null || !total || !status || net == null) {
      return res.status(400).json({ message: 'All deal fields are required.' });
    }

    const deal = await Deal.create({
      crop,
      quantity: Number(quantity),
      buyer,
      price: Number(price),
      total: Number(total),
      status,
      net: Number(net),
      created: created || new Date().toISOString().slice(0, 10),
    });

    res.status(201).json(deal);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create deal.', error: err.message });
  }
}
