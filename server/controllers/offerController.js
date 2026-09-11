import Offer from '../models/Offer.js';

export async function getOffers(req, res) {
  try {
    const filter = {};
    if (req.query.crop) {
      filter.crop = req.query.crop;
    }
    if (req.query.buyer) {
      filter.buyer = req.query.buyer;
    }

    const offers = await Offer.find(filter)
      .populate('farmerId', 'name username phone')
      .populate('requirement')
      .sort({ createdAt: -1 });

    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch offers.', error: err.message });
  }
}

export async function createOffer(req, res) {
  try {
    const {
      farmer,
      crop,
      quantity,
      quality,
      price,
      buyer,
      buyerId,
      requirementId,
      message,
    } = req.body;

    if (!crop || !quantity || price == null) {
      return res.status(400).json({ message: 'crop, quantity, and price are required.' });
    }

    // Determine farmer identity from authenticated session first, then request body
    const farmerName =
      (req.user && (req.user.name || req.user.username)) ||
      (farmer && farmer.trim()) ||
      'Ramesh Patil';

    const farmerId = req.user?.id || null;

    const offer = await Offer.create({
      farmer: farmerName,
      ...(farmerId && { farmerId }),
      crop: crop.trim(),
      quantity: Number(quantity),
      quality: (quality && quality.trim()) || 'Grade A',
      price: Number(price),
      buyer: (buyer && buyer.trim()) || 'ABC Foods',
      ...(buyerId && { buyerId }),
      ...(requirementId && { requirement: requirementId }),
      message: message ? message.trim() : '',
      status: 'Pending',
    });

    res.status(201).json(offer);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create offer.', error: err.message });
  }
}
