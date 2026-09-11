import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { validateRequirement } from '../../utils/validation';
import { formatDate } from '../../utils/validation';
import { money } from '../../utils/format';
import { PageTitle } from '../../components/common/PageTitle';
import { Modal } from '../../components/common/Modal';
import { FieldError } from '../../components/common/FieldError';
import { StatusBadge } from '../../components/common/StatusBadge';

export function RequirementsPage() {
  const {
    requirements,
    requirementsLoading,
    requirementsError,
    createRequirement,
  } = useApp();
  const [creating, setCreating] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [form, setForm] = useState({
    crop: '',
    quantity: '',
    quality: '',
    offeredPrice: '',
    requiredBy: '',
    location: '',
    paymentTerms: '',
    notes: '',
  });

  const updateField = (field, value) => setForm({ ...form, [field]: value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateRequirement(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await createRequirement({
        ...form,
        quantity: Number(form.quantity),
        offeredPrice: Number(form.offeredPrice),
        location: form.location.trim(),
        notes: form.notes.trim(),
      });
      setCreating(false);
      setErrors({});
      setForm({
        crop: '',
        quantity: '',
        quality: '',
        offeredPrice: '',
        requiredBy: '',
        location: '',
        paymentTerms: '',
        notes: '',
      });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageTitle
        kicker="BUYER PROCUREMENT"
        title="My Requirements"
        action={
          <button className="primary" onClick={() => setCreating(true)}>
            + New Requirement
          </button>
        }
      />

      {requirementsLoading && <p className="intro">Loading requirements…</p>}

      {requirementsError && (
        <p className="intro" style={{ color: 'var(--danger, #e53e3e)' }}>
          Failed to load requirements: {requirementsError}
        </p>
      )}

      {!requirementsLoading &&
        !requirementsError &&
        requirements.length === 0 && (
          <p className="intro" style={{ opacity: 0.6 }}>
            No requirements yet. Add your first procurement requirement.
          </p>
        )}

      {!requirementsLoading &&
        !requirementsError &&
        requirements.length > 0 && (
          <section className="crop-grid">
            {requirements.map((r) => (
              <article className="card" key={r._id}>
                <StatusBadge>{r.status}</StatusBadge>
                <h2>{r.crop}</h2>
                <p>
                  {r.quality} · Required by {formatDate(r.requiredBy)}
                </p>
                <div className="requirement">
                  <strong>
                    {r.received}/{r.quantity} q received
                  </strong>
                  <i>
                    <b
                      style={{ width: `${(r.received / r.quantity) * 100}%` }}
                    />
                  </i>
                </div>
                <p className="requirement-meta">
                  {money(r.offeredPrice)}/q · {r.location} · {r.paymentTerms}
                </p>
              </article>
            ))}
          </section>
        )}

      {creating && (
        <Modal title="New Requirement" onClose={() => setCreating(false)}>
          <form className="form" onSubmit={handleSubmit}>
            <label>
              Crop
              <select
                aria-invalid={Boolean(errors.crop)}
                value={form.crop}
                onChange={(e) => updateField('crop', e.target.value)}
              >
                <option value="">Select crop</option>
                <option>Onion</option>
                <option>Tomato</option>
                <option>Potato</option>
              </select>
              <FieldError>{errors.crop}</FieldError>
            </label>
            <label>
              Quantity required (quintals)
              <input
                type="number"
                min="0.01"
                step="0.01"
                aria-invalid={Boolean(errors.quantity)}
                value={form.quantity}
                onChange={(e) => updateField('quantity', e.target.value)}
              />
              <FieldError>{errors.quantity}</FieldError>
            </label>
            <label>
              Minimum quality
              <select
                aria-invalid={Boolean(errors.quality)}
                value={form.quality}
                onChange={(e) => updateField('quality', e.target.value)}
              >
                <option value="">Select quality</option>
                <option>Grade A</option>
                <option>Grade B</option>
              </select>
              <FieldError>{errors.quality}</FieldError>
            </label>
            <label>
              Offered price / q
              <input
                type="number"
                min="0.01"
                step="0.01"
                aria-invalid={Boolean(errors.offeredPrice)}
                value={form.offeredPrice}
                onChange={(e) => updateField('offeredPrice', e.target.value)}
              />
              <FieldError>{errors.offeredPrice}</FieldError>
            </label>
            <label>
              Required by
              <input
                type="date"
                aria-invalid={Boolean(errors.requiredBy)}
                value={form.requiredBy}
                onChange={(e) => updateField('requiredBy', e.target.value)}
              />
              <FieldError>{errors.requiredBy}</FieldError>
            </label>
            <label>
              Delivery location
              <input
                type="text"
                aria-invalid={Boolean(errors.location)}
                value={form.location}
                onChange={(e) => updateField('location', e.target.value)}
              />
              <FieldError>{errors.location}</FieldError>
            </label>
            <label>
              Payment terms
              <select
                aria-invalid={Boolean(errors.paymentTerms)}
                value={form.paymentTerms}
                onChange={(e) => updateField('paymentTerms', e.target.value)}
              >
                <option value="">Select terms</option>
                <option>Within 3 days</option>
                <option>Within 7 days</option>
                <option>Within 14 days</option>
                <option>Advance payment</option>
              </select>
              <FieldError>{errors.paymentTerms}</FieldError>
            </label>
            <label>
              Notes (optional)
              <textarea
                maxLength="500"
                value={form.notes}
                onChange={(e) => updateField('notes', e.target.value)}
              />
              <FieldError>{errors.notes}</FieldError>
            </label>

            {submitError && (
              <p
                style={{
                  color: 'var(--danger, #e53e3e)',
                  fontSize: '0.875rem',
                }}
              >
                {submitError}
              </p>
            )}

            <button className="primary" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create requirement'}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
