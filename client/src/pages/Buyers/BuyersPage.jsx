import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { validateOffer, formatDate } from '../../utils/validation';
import { money } from '../../utils/format';
import { PageTitle } from '../../components/common/PageTitle';
import { Modal } from '../../components/common/Modal';
import { FieldError } from '../../components/common/FieldError';

/**
 * Remove presentation suffix like "(buyer)" or "(Buyer)"
 * without altering backend MongoDB records.
 */
const formatBuyerName = (name) => {
  if (!name) return 'ABC Foods';
  return name.replace(/\s*\(buyer\)/gi, '').trim() || 'ABC Foods';
};

export function BuyersPage() {
  const {
    requirements,
    requirementsLoading,
    requirementsError,
    fetchRequirements,
    createOffer,
  } = useApp();

  const [selectedBuyer, setSelectedBuyer] = useState('all');
  const [selectedCrop, setSelectedCrop] = useState('all');

  const [detail, setDetail] = useState(null);
  const [offer, setOffer] = useState(null);
  const [form, setForm] = useState({
    quantity: 80,
    price: '2700',
    quality: 'Grade A',
    message: 'I can supply Grade A produce.',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Fetch requirements on mount to guarantee fresh MongoDB data
  useEffect(() => {
    fetchRequirements();
  }, [fetchRequirements]);

  // Extract unique buyers from backend data without duplicates and without (buyer) suffix
  const uniqueBuyers = Array.from(
    new Set(
      requirements
        .map((r) => formatBuyerName(r.buyer || r.buyerId?.name))
        .filter(Boolean)
    )
  ).sort();

  // Extract unique crops from requirements
  const uniqueCrops = Array.from(
    new Set(requirements.map((r) => r.crop).filter(Boolean))
  ).sort();

  // Filter requirements based on selected buyer and crop
  const filteredRequirements = requirements.filter((r) => {
    const buyerName = formatBuyerName(r.buyer || r.buyerId?.name);
    const matchesBuyer = selectedBuyer === 'all' || buyerName === selectedBuyer;
    const matchesCrop = selectedCrop === 'all' || r.crop === selectedCrop;
    return matchesBuyer && matchesCrop;
  });

  const submitOffer = async (e) => {
    e.preventDefault();
    const nextErrors = validateOffer(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await createOffer({
        requirementId: offer._id,
        crop: offer.crop,
        cropId: offer.cropId,
        buyer: formatBuyerName(offer.buyer || offer.buyerId?.name),
        buyerId: offer.buyerId?._id || offer.buyerId,
        quality: form.quality || offer.quality || 'Grade A',
        quantity: +form.quantity,
        price: +form.price,
        message: form.message,
      });
      setOffer(null);
      setErrors({});
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageTitle
        kicker="BUYER MARKETPLACE"
        title={
          selectedBuyer === 'all'
            ? 'Buyer Requirements'
            : `${selectedBuyer} Requirements`
        }
        action={
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select
              value={selectedBuyer}
              onChange={(e) => setSelectedBuyer(e.target.value)}
              aria-label="Filter by buyer"
            >
              <option value="all">All</option>
              {uniqueBuyers.map((bName) => (
                <option value={bName} key={bName}>
                  {bName}
                </option>
              ))}
            </select>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              aria-label="Filter by crop"
            >
              <option value="all">All Crops</option>
              {uniqueCrops.map((cName) => (
                <option value={cName} key={cName}>
                  {cName}
                </option>
              ))}
            </select>
          </div>
        }
      />
      <p className="intro">
        Browse active procurement requirements from verified institutional
        buyers and submit direct supply offers.
      </p>

      {requirementsLoading && (
        <p className="intro">Loading buyer requirements…</p>
      )}

      {requirementsError && (
        <p className="intro" style={{ color: 'var(--danger, #e53e3e)' }}>
          Failed to load requirements: {requirementsError}
        </p>
      )}

      {!requirementsLoading &&
        !requirementsError &&
        filteredRequirements.length === 0 && (
          <p className="intro" style={{ opacity: 0.6 }}>
            No requirements found for the selected filter.
          </p>
        )}

      {!requirementsLoading &&
        !requirementsError &&
        filteredRequirements.length > 0 && (
          <section className="buyer-grid">
            {filteredRequirements.map((r) => {
              const buyerName = formatBuyerName(r.buyer || r.buyerId?.name);
              const initials = buyerName.slice(0, 2).toUpperCase();

              return (
                <article className="card buyer-card" key={r._id}>
                  <div className="buyer-head">
                    <span>
                      <b>{initials}</b>
                      <strong>{buyerName}</strong>
                      <small>{r.status || 'Active'} requirement</small>
                    </span>
                    <span className="status">{r.status || 'Active'}</span>
                  </div>

                  <div style={{ margin: '14px 0 6px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        color: '#6e857a',
                        fontWeight: 600,
                      }}
                    >
                      Requested Crop:
                    </span>
                    <h2
                      style={{
                        font: '700 22px Fraunces, serif',
                        color: '#163300',
                        margin: '2px 0 0',
                      }}
                    >
                      {r.crop}
                    </h2>
                  </div>

                  <div className="offer-price">
                    {money(r.offeredPrice)}
                    <small>/ quintal</small>
                  </div>
                  <div className="buyer-meta">
                    <span>
                      Required <b>{r.quantity} q</b>
                    </span>
                    <span>
                      Quality <b>{r.quality || 'Grade A'}</b>
                    </span>
                    <span>
                      Location <b>{r.location || 'Maharashtra'}</b>
                    </span>
                    <span>
                      Payment <b>{r.paymentTerms || 'Within 7 days'}</b>
                    </span>
                    <span>
                      Required by <b>{formatDate(r.requiredBy)}</b>
                    </span>
                  </div>
                  <div className="actions">
                    <button className="secondary" onClick={() => setDetail(r)}>
                      View Details
                    </button>
                    <button
                      className="primary"
                      onClick={() => {
                        setForm((prev) => ({
                          ...prev,
                          quantity: r.quantity,
                          price: r.offeredPrice || prev.price,
                          quality: r.quality || prev.quality || 'Grade A',
                        }));
                        setOffer(r);
                      }}
                    >
                      Submit Offer
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )}

      {detail && (
        <Modal
          title={
            formatBuyerName(detail.buyer || detail.buyerId?.name) ||
            'Requirement Details'
          }
          onClose={() => setDetail(null)}
        >
          <div className="detail">
            <p>
              <b>{detail.crop} Requirement</b> · Status:{' '}
              <strong>{detail.status || 'Active'}</strong>
            </p>
            <p>
              Offered price: <strong>{money(detail.offeredPrice)}/q</strong>
            </p>
            <p>
              Required quantity: <strong>{detail.quantity} quintals</strong>
              {detail.received > 0 && ` (${detail.received} q fulfilled)`}
            </p>
            <p>
              Quality specification:{' '}
              <strong>{detail.quality || 'Grade A'}</strong>
            </p>
            <p>
              Delivery location:{' '}
              <strong>{detail.location || 'Maharashtra'}</strong>
            </p>
            <p>
              Payment terms:{' '}
              <strong>{detail.paymentTerms || 'Within 7 days'}</strong>
            </p>
            <p>
              Required by deadline:{' '}
              <strong>{formatDate(detail.requiredBy)}</strong>
            </p>
            {detail.notes && (
              <p>
                Procurement notes: <em>"{detail.notes}"</em>
              </p>
            )}
            <button
              className="primary"
              onClick={() => {
                const target = detail;
                setForm((prev) => ({
                  ...prev,
                  quantity: target.quantity,
                  price: target.offeredPrice || prev.price,
                  quality: target.quality || prev.quality || 'Grade A',
                }));
                setDetail(null);
                setOffer(target);
              }}
            >
              Submit Offer
            </button>
          </div>
        </Modal>
      )}

      {offer && (
        <Modal
          title={`Offer to ${formatBuyerName(offer.buyer || offer.buyerId?.name)}`}
          onClose={() => setOffer(null)}
        >
          <form className="form" onSubmit={submitOffer}>
            <label>
              Crop
              <input type="text" value={offer.crop} disabled />
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
              Quality
              <input
                type="text"
                value={form.quality || offer.quality || 'Grade A'}
                onChange={(e) => setForm({ ...form, quality: e.target.value })}
              />
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
              {submitting ? 'Submitting…' : 'Submit Offer'}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
