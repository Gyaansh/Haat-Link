import Requirement from '../models/Requirement.js';

export async function getRequirements(req, res) {
  try {
    const filter = {};
    if (req.query.crop && req.query.crop !== 'all') {
      filter.crop = req.query.crop;
    }
    if (req.query.buyer && req.query.buyer !== 'all') {
      filter.buyer = req.query.buyer;
    }

    const requirements = await Requirement.find(filter)
      .populate('buyerId', 'name username phone')
      .sort({ createdAt: -1 });

    res.json(requirements);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch requirements.', error: err.message });
  }
}

export async function createRequirement(req, res) {
  try {
    const {
      crop,
      quantity,
      quality,
      offeredPrice,
      requiredBy,
      location,
      paymentTerms,
      notes,
      buyer,
      buyerId,
    } = req.body;

    if (!crop || !quantity || !quality || !offeredPrice || !requiredBy || !location || !paymentTerms) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    // Determine buyer display name from request body, authenticated user, or fallback
    const buyerName =
      (buyer && buyer.trim()) ||
      (req.user && (req.user.name || req.user.username)) ||
      'ABC Foods';

    const finalBuyerId = buyerId || (req.user && req.user.id) || null;

    const requirement = await Requirement.create({
      crop,
      quantity: Number(quantity),
      received: 0,
      quality,
      offeredPrice: Number(offeredPrice),
      requiredBy,
      location: location.trim(),
      paymentTerms,
      notes: notes ? notes.trim() : '',
      status: 'Active',
      buyer: buyerName,
      ...(finalBuyerId && { buyerId: finalBuyerId }),
    });

    res.status(201).json(requirement);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create requirement.', error: err.message });
  }
}
