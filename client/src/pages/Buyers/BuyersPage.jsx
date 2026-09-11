import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { buyers } from '../../data/mockData';
import { rankedBuyers } from '../../utils/recommendation';
import { validateOffer } from '../../utils/validation';
import { money } from '../../utils/format';
import { PageTitle } from '../../components/common/PageTitle';
import { Modal } from '../../components/common/Modal';
import { FieldError } from '../../components/common/FieldError';

export function BuyersPage() {
  const { crops, selectedCrop, setSelectedCrop, createOffer } = useApp(),
    n = useNavigate(),
    [params] = useSearchParams(),
    cropId = params.get('crop') || selectedCrop,
    crop = crops.find((c) => c.id === cropId) || crops[0],
    [detail, setDetail] = useState(null),
    [offer, setOffer] = useState(null),
    [form, setForm] = useState({
      quantity: crop?.quantity || 80,
      price: '2700',
      message: 'I can supply Grade A produce from Nashik.',
    }),
    [errors, setErrors] = useState({});

  const ranked = rankedBuyers(crop, buyers);

  const submitOffer = (e) => {
    e.preventDefault();
    const nextErrors = validateOffer(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    createOffer({
      ...form,
      buyer: offer.name,
      crop: crop.name,
      quantity: +form.quantity,
      price: +form.price,
    });
    setOffer(null);
    setErrors({});
  };

  return (
    <>
      <PageTitle
        kicker="BUYER MARKETPLACE"
        title={`Buyers for ${crop.name}`}
        action={
          <select
            value={crop.id}
            onChange={(e) => {
              setSelectedCrop(e.target.value);
              n(`/buyers?crop=${e.target.value}`);
            }}
          >
            {crops.map((c) => (
              <option value={c.id} key={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        }
      />
      <p className="intro">
        Ranked by price, quantity fit, distance, quality, pickup and payment
        reliability.
      </p>
      <section className="buyer-grid">
        {ranked.map((b) => (
          <article className="card buyer-card" key={b.id}>
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
            <button className="primary">Submit offer</button>
          </form>
        </Modal>
      )}
    </>
  );
}
