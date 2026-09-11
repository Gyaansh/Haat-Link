import Offer from '../models/Offer.js';

export async function getOffers(req, res) {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch offers.', error: err.message });
  }
}

export async function createOffer(req, res) {
  try {
    const { farmer, crop, quantity, quality, price, buyer, message } = req.body;

    if (!crop || !quantity || price == null) {
      return res.status(400).json({ message: 'crop, quantity, and price are required.' });
    }

    const offer = await Offer.create({
      farmer: farmer || 'Ramesh Patil',
      crop,
      quantity: Number(quantity),
      quality: quality || '',
      price: Number(price),
      buyer: buyer || '',
      message: message || '',
      status: 'Pending',
    });

    res.status(201).json(offer);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create offer.', error: err.message });
  }
}
