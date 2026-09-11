import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getBuyers } from '../../services/buyerService';
import { getCropTypes } from '../../services/cropService';
import { rankedBuyers } from '../../utils/recommendation';
import { validateOffer } from '../../utils/validation';
import { money } from '../../utils/format';
import { PageTitle } from '../../components/common/PageTitle';
import { Modal } from '../../components/common/Modal';
import { FieldError } from '../../components/common/FieldError';

export function BuyersPage() {
  const { crops, selectedCrop, setSelectedCrop, createOffer } = useApp();
  const n = useNavigate();
  const [params] = useSearchParams();

  const [cropTypes, setCropTypes] = useState([]);

  useEffect(() => {
    let mounted = true;
    getCropTypes()
      .then((types) => {
        if (mounted && Array.isArray(types)) {
          setCropTypes(types);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const paramCrop = params.get('crop') || selectedCrop;
  // Match by id or by name
  const crop =
    crops.find(
      (c) =>
        c._id === paramCrop || c.name.toLowerCase() === paramCrop?.toLowerCase()
    ) || crops[0];

  const [buyers, setBuyers] = useState([]);
  const [buyersLoading, setBuyersLoading] = useState(true);
  const [buyersError, setBuyersError] = useState(null);

  const [detail, setDetail] = useState(null);
  const [offer, setOffer] = useState(null);
  const [form, setForm] = useState({
    quantity: crop?.quantity || 80,
    price: '2700',
    message: 'I can supply Grade A produce from Nashik.',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Fetch buyers whenever the selected crop changes
  useEffect(() => {
    if (!crop) return;
    setBuyersLoading(true);
    setBuyersError(null);
    getBuyers(crop.name)
      .then((data) => setBuyers(data))
      .catch((err) => setBuyersError(err.message))
      .finally(() => setBuyersLoading(false));
  }, [crop?.name]);

  const ranked = rankedBuyers(crop, buyers);

  const submitOffer = async (e) => {
    e.preventDefault();
    const nextErrors = validateOffer(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await createOffer({
        ...form,
        buyer: offer.name,
        crop: crop.name,
        quantity: +form.quantity,
        price: +form.price,
      });
      setOffer(null);
      setErrors({});
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!crop) {
    return (
      <>
        <PageTitle kicker="BUYER MARKETPLACE" title="Buyers" />
        <p className="intro">No crops found. Add a crop first.</p>
      </>
    );
  }

  const availableCropTypes =
    cropTypes.length > 0
      ? cropTypes
      : Array.from(new Set(crops.map((c) => c.name)));

  return (
    <>
      <PageTitle
        kicker="BUYER MARKETPLACE"
        title={`Buyers for ${crop.name}`}
        action={
          <select
            value={crop.name}
            onChange={(e) => {
              setSelectedCrop(e.target.value);
              n(`/buyers?crop=${encodeURIComponent(e.target.value)}`);
            }}
          >
            {availableCropTypes.map((name) => (
              <option value={name} key={name}>
                {name}
              </option>
            ))}
          </select>
        }
      />
      <p className="intro">
        Ranked by price, quantity fit, distance, quality, pickup and payment
        reliability.
      </p>

      {buyersLoading && <p className="intro">Loading buyers…</p>}

      {buyersError && (
        <p className="intro" style={{ color: 'var(--danger, #e53e3e)' }}>
          Failed to load buyers: {buyersError}
        </p>
      )}

      {!buyersLoading && !buyersError && ranked.length === 0 && (
        <p className="intro" style={{ opacity: 0.6 }}>
          No buyers found for {crop.name}.
        </p>
      )}

      {!buyersLoading && !buyersError && ranked.length > 0 && (
        <section className="buyer-grid">
          {ranked.map((b) => (
            <article className="card buyer-card" key={b._id}>
              <div className="buyer-head">
                <span>
                  <b>{b.name.slice(0, 2).toUpperCase()}</b>
                  <strong>{b.name}</strong>
                  <small>{b.verified ? 'Verified buyer' : 'New buyer'}</small>
                </span>
                <em>{b.match}% Match</em>
              </div>
              <div className="offer-price">
                {money(b.price)}
                <small>/ quintal</small>
              </div>
              <div className="buyer-meta">
                <span>
                  Required <b>{b.required} q</b>
                </span>
                <span>
                  Quality <b>{b.quality}</b>
                </span>
                <span>
                  Pickup <b>{b.pickup ? 'Available' : 'Not available'}</b>
                </span>
                <span>
                  Payment <b>{b.paymentDays} days</b>
                </span>
                <span>
                  Trust <b>{b.trust}/100</b>
                </span>
              </div>
              <div className="actions">
                <button className="secondary" onClick={() => setDetail(b)}>
                  View Details
                </button>
                <button className="primary" onClick={() => setOffer(b)}>
                  Make Offer
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {detail && (
        <Modal title={detail.name} onClose={() => setDetail(null)}>
          <div className="detail">
            <p>
              <b>{detail.verified ? '✓ Verified buyer' : 'Buyer profile'}</b>
            </p>
            <p>
              Listed price: <strong>{money(detail.price)}/q</strong>
            </p>
            <p>
              Estimated transport: {money(detail.transport)}/q · Handling:{' '}
              {money(detail.handling)}/q
            </p>
            <p>
              Trust score: {detail.trust}/100 · Payment in {detail.paymentDays}{' '}
              days
            </p>
            <button
              className="primary"
              onClick={() => {
                setDetail(null);
                setOffer(detail);
              }}
            >
              Make offer
            </button>
          </div>
        </Modal>
      )}

      {offer && (
        <Modal title={`Offer to ${offer.name}`} onClose={() => setOffer(null)}>
          <form className="form" onSubmit={submitOffer}>
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
              Offer price / q
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
            <label>
              Message
              <textarea
                maxLength="500"
                aria-invalid={Boolean(errors.message)}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <FieldError>{errors.message}</FieldError>
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
              {submitting ? 'Submitting…' : 'Submit offer'}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
