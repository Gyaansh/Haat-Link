import Crop from '../models/Crop.js';

export async function getCrops(req, res) {
  try {
    const crops = await Crop.find().sort({ createdAt: -1 });
    res.json(crops);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch crops.', error: err.message });
  }
}

export async function getCropTypes(req, res) {
  try {
    const types = await Crop.distinct('name');
    res.json(types.sort());
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch crop types.', error: err.message });
  }
}

export async function createCrop(req, res) {
  try {
    const { name, quantity, quality, harvestDate, status, price, emoji } = req.body;

    if (!name || !quantity || !quality || !harvestDate || !status || price == null) {
      return res.status(400).json({ message: 'All crop fields are required.' });
    }

    const crop = await Crop.create({
      name,
      quantity: Number(quantity),
      quality,
      harvestDate,
      status,
      price: Number(price),
      emoji: emoji || '🌾',
    });

    res.status(201).json(crop);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create crop.', error: err.message });
  }
}

export async function updateCrop(req, res) {
  try {
    const { id } = req.params;
    const { name, quantity, quality, harvestDate, status, price, emoji } = req.body;

    const crop = await Crop.findByIdAndUpdate(
      id,
      {
        ...(name != null && { name }),
        ...(quantity != null && { quantity: Number(quantity) }),
        ...(quality != null && { quality }),
        ...(harvestDate != null && { harvestDate }),
        ...(status != null && { status }),
        ...(price != null && { price: Number(price) }),
        ...(emoji != null && { emoji }),
      },
      { new: true, runValidators: true }
    );

    if (!crop) {
      return res.status(404).json({ message: 'Crop not found.' });
    }

    res.json(crop);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update crop.', error: err.message });
  }
}

export async function deleteCrop(req, res) {
  try {
    const { id } = req.params;
    const crop = await Crop.findByIdAndDelete(id);

    if (!crop) {
      return res.status(404).json({ message: 'Crop not found.' });
    }

    res.json({ message: 'Crop deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete crop.', error: err.message });
  }
}
