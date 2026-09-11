import Requirement from '../models/Requirement.js';

export async function getRequirements(req, res) {
  try {
    const requirements = await Requirement.find().sort({ createdAt: -1 });
    res.json(requirements);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch requirements.', error: err.message });
  }
}

export async function createRequirement(req, res) {
  try {
    const { crop, quantity, quality, offeredPrice, requiredBy, location, paymentTerms, notes } =
      req.body;

    if (!crop || !quantity || !quality || !offeredPrice || !requiredBy || !location || !paymentTerms) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }

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
    });

    res.status(201).json(requirement);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create requirement.', error: err.message });
  }
}
