import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import { FieldError } from '../../components/common/FieldError';
import { validateCrop } from '../../utils/validation';

/**
 * CropForm — modal form for adding a new crop.
 *
 * Props:
 *   onClose — called when form is dismissed (cancel or after save)
 *
 * On save, calls addCrop() from AppContext which POSTs to the API.
 */
export function CropForm({ onClose }) {
  const { addCrop } = useApp();

  const [form, setForm] = useState({
    name: '',
    quantity: '',
    quality: '',
    harvestDate: '',
    status: '',
    price: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validateCrop(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await addCrop({
        ...form,
        quantity: +form.quantity,
        price: +form.price || 0,
      });
      onClose();
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Add a crop" onClose={onClose}>
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
            aria-invalid={Boolean(errors.quantity)}
            type="number"
            min="0.01"
            step="0.01"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />
          <FieldError>{errors.quantity}</FieldError>
        </label>
        <label>
          Harvest date
          <input
            aria-invalid={Boolean(errors.harvestDate)}
            type="date"
            min="2020-01-01"
            value={form.harvestDate}
            onChange={(e) => setForm({ ...form, harvestDate: e.target.value })}
          />
          <FieldError>{errors.harvestDate}</FieldError>
        </label>
        <label>
          Current price / q
          <input
            aria-invalid={Boolean(errors.price)}
            type="number"
            min="0.01"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <FieldError>{errors.price}</FieldError>
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

        {submitError && (
          <p style={{ color: 'var(--danger, #e53e3e)', fontSize: '0.875rem' }}>
            {submitError}
          </p>
        )}

        <button className="primary" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save crop'}
        </button>
      </form>
    </Modal>
  );
}
