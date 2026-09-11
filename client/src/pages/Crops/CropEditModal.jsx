import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import { FieldError } from '../../components/common/FieldError';
import { validateCrop } from '../../utils/validation';

/**
 * CropEditModal — pre-filled edit form for an existing crop.
 *
 * Props:
 *   crop    — current crop object (used to populate initial form state)
 *   onClose — called on Cancel and after a successful save
 *
 * On Save Changes:
 *   - validates all fields
 *   - calls updateCrop from AppContext
 *   - shows toast "Crop updated successfully."
 *   - closes the modal
 *
 * On Cancel:
 *   - closes without modifying any data
 */
export function CropEditModal({ crop, onClose }) {
  const { updateCrop, setToast } = useApp();

  const [form, setForm] = useState({
    name: crop.name || '',
    quantity: String(crop.quantity ?? ''),
    quality: crop.quality || '',
    harvestDate: crop.harvestDate || '',
    status: crop.status || '',
    price: String(crop.price ?? ''),
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validateCrop(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    updateCrop(crop.id, {
      name: form.name,
      quantity: Number(form.quantity),
      quality: form.quality,
      harvestDate: form.harvestDate,
      status: form.status,
      price: Number(form.price) || 0,
    });
    setToast('Crop updated successfully.');
    onClose();
  };

  return (
    <Modal title={`Edit ${crop.name}`} onClose={onClose}>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Crop
          <select
            aria-invalid={Boolean(errors.name)}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          >
            <option value="">Select crop</option>
            <option>Onion</option>
            <option>Tomato</option>
            <option>Potato</option>
            <option>Other</option>
          </select>
          <FieldError>{errors.name}</FieldError>
        </label>
        <label>
          Quantity (quintals)
          <input
            type="number"
            min="0.01"
            step="0.01"
            aria-invalid={Boolean(errors.quantity)}
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />
          <FieldError>{errors.quantity}</FieldError>
        </label>
        <label>
          Quality
          <select
            aria-invalid={Boolean(errors.quality)}
            value={form.quality}
            onChange={(e) => setForm({ ...form, quality: e.target.value })}
          >
            <option value="">Select quality</option>
            <option>Grade A</option>
            <option>Grade B</option>
          </select>
          <FieldError>{errors.quality}</FieldError>
        </label>
        <label>
          Harvest date
          <input
            type="date"
            min="2020-01-01"
            aria-invalid={Boolean(errors.harvestDate)}
            value={form.harvestDate}
            onChange={(e) => setForm({ ...form, harvestDate: e.target.value })}
          />
          <FieldError>{errors.harvestDate}</FieldError>
        </label>
        <label>
          Status
          <select
            aria-invalid={Boolean(errors.status)}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="">Select status</option>
            <option>Ready to Sell</option>
            <option>Growing</option>
          </select>
          <FieldError>{errors.status}</FieldError>
        </label>
        <label>
          Current price / q
          <input
            type="number"
            min="0.01"
            step="0.01"
            aria-invalid={Boolean(errors.price)}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <FieldError>{errors.price}</FieldError>
        </label>
        <div className="actions">
          <button type="button" className="secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="primary">
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}
