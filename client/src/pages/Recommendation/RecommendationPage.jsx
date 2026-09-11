import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { buyers } from '../../data/mockData';
import { rankedBuyers } from '../../utils/recommendation';
import { money } from '../../utils/format';
import { PageTitle } from '../../components/common/PageTitle';
import { Modal } from '../../components/common/Modal';

export function RecommendationPage() {
  const { crops, selectedCrop, createDeal } = useApp(),
    n = useNavigate(),
    crop = crops.find((c) => c.id === selectedCrop) || crops[0],
    ranked = rankedBuyers(crop, buyers),
    best = ranked[0],
    [confirm, setConfirm] = useState(false);

  if (!best) {
    return (
      <>
        <PageTitle
          kicker="TRANSPARENT SMART MATCHING"
          title="Smart selling recommendation"
        />
        <article className="card empty-state">
          <span>⌁</span>
          <h2>No matching buyers for {crop.name} yet</h2>
          <p>
            AgriLink does not have a compatible buyer requirement for this crop
            in the current mock marketplace.
          </p>
          <Link className="primary" to="/buyers?crop=onion">
            View Onion buyers
          </Link>
        </article>
      </>
    );
  }

  return (
    <>
      <PageTitle
        kicker="TRANSPARENT SMART MATCHING"
        title="Smart selling recommendation"
      />
      <section className="recommendation-page">
        <article className="card recommendation-hero">
          <div>
            <small>
              {crop.name.toUpperCase()} · {crop.quantity} QUINTALS ·{' '}
              {crop.quality.toUpperCase()}
            </small>
            <h2>Sell now to {best.name}</h2>
            <p>
              Best overall deal after accounting for selling costs and buyer
              reliability.
            </p>
          </div>
          <b>
            {best.match}%<small>match score</small>
          </b>
        </article>
        <section className="recommendation-grid">
          <article className="card">
            <h2>Net realization</h2>
            <div className="calculation">
              <span>
                Listed price <b>{money(best.price)}/q</b>
              </span>
              <span>
                Transport cost <b>− {money(best.transport)}/q</b>
              </span>
              <span>
                Handling cost <b>− {money(best.handling)}/q</b>
              </span>
              <strong>
                Expected net <b>{money(best.net)}/q</b>
              </strong>
            </div>
            <button className="primary" onClick={() => setConfirm(true)}>
              Create deal →
            </button>
          </article>
          <article className="card">
            <h2>Why this wins</h2>
            <ul className="reason">
              <li>✓ Highest weighted match across six transparent factors</li>
              <li>✓ Required quantity supports your entire harvest</li>
              <li>
                ✓ Pickup is available and payment is expected in{' '}
                {best.paymentDays} days
              </li>
              <li>✓ Quality requirement exactly matches {crop.quality}</li>
            </ul>
            <p className="formula">
              Price 30% · Quantity 20% · Distance 15% · Quality 15% · Pickup 10%
              · Payment 10%
            </p>
          </article>
        </section>
        <article className="card">
          <div className="card-title">
            <div>
              <small>ALTERNATIVE BUYERS</small>
              <h2>How other options compare</h2>
            </div>
          </div>
          {ranked.slice(1).map((b) => (
            <div className="alternative" key={b.id}>
              <span>
                <b>{b.name}</b>
                <small>{money(b.net)}/q net realization</small>
              </span>
              <strong>{b.match}% match</strong>
              <em>
                {b.pickup ? 'Pickup available' : 'No pickup'} · Payment{' '}
                {b.paymentDays} days
              </em>
            </div>
          ))}
        </article>
      </section>

      {confirm && (
        <Modal title="Confirm new deal" onClose={() => setConfirm(false)}>
          <div className="confirm">
            <p>
              <b>Crop</b>
              <span>
                {crop.name} · {crop.quantity} quintals
              </span>
            </p>
            <p>
              <b>Buyer</b>
              <span>{best.name}</span>
            </p>
            <p>
              <b>Listed price</b>
              <span>{money(best.price)}/q</span>
            </p>
            <p>
              <b>Estimated net realization</b>
              <span>{money(best.net)}/q</span>
            </p>
            <p>
              <b>Estimated total value</b>
              <span>{money(best.price * crop.quantity)}</span>
            </p>
            <button
              className="primary"
              onClick={() => {
                createDeal({
                  crop: crop.name,
                  quantity: crop.quantity,
                  buyer: best.name,
                  price: best.price,
                  total: best.price * crop.quantity,
                  status: 'Deal Created',
                  created: '11 Sep 2026',
                  net: best.net,
                });
                setConfirm(false);
                n('/deals');
              }}
            >
              Confirm Deal
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
