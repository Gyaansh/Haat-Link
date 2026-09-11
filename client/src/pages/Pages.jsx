import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  marketData,
  buyers,
  incomingOffers,
} from '../data/mockData';
import { rankedBuyers } from '../utils/recommendation';
import {
  formatDate,
  validateCrop,
  validateOffer,
  validateRequirement,
} from '../utils/validation';
const money = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
const Title = ({ kicker, title, action }) => (
  <section className="title">
    <div>
      <small>{kicker}</small>
      <h1>{title}</h1>
    </div>
    {action}
  </section>
);
const Modal = ({ title, children, onClose }) => (
  <div className="modal-wrap" onMouseDown={onClose}>
    <section className="modal" onMouseDown={(e) => e.stopPropagation()}>
      <button className="modal-close" onClick={onClose}>
        ×
      </button>
      <h2>{title}</h2>
      {children}
    </section>
  </div>
);
const Status = ({ children }) => <b className="status">{children}</b>;
const FieldError = ({ children }) =>
  children ? <small className="field-error">{children}</small> : null;
export function Login() {
  const { setRole } = useApp(),
    n = useNavigate();
  const enter = (r) => {
    setRole(r);
    n(r === 'buyer' ? '/buyer/dashboard' : '/dashboard');
  };
  return (
    <main className="login-page">
      <section className="login-intro">
        <div className="brand">
          <i>🌿</i> Agri<span>Link</span>
        </div>
        <div>
          <small>MARKET INTELLIGENCE FOR FARMERS</small>
          <h1>
            Sell smarter.
            <br />
            <em>Grow stronger.</em>
          </h1>
          <p>
            Transparent market intelligence, buyer matching, and better selling
            decisions for every harvest.
          </p>
        </div>
        <footer>✓ Built for India’s growers and buyers</footer>
      </section>
      <section className="login-panel">
        <div className="login-card">
          <small>WELCOME TO AGRILINK</small>
          <h2>Your farm, in focus.</h2>
          <p>Choose a prototype workspace to begin the demo.</p>
          <button className="primary full" onClick={() => enter('farmer')}>
            🌱 Continue as Farmer <b>→</b>
          </button>
          <button className="secondary full" onClick={() => enter('buyer')}>
            ▦ Continue as Buyer <b>→</b>
          </button>
          <aside>For SIH demonstration · No password required</aside>
        </div>
      </section>
    </main>
  );
}
export function Dashboard() {
  const { farmer, crops, deals, notifications } = useApp(),
    n = useNavigate();
  const onion = crops.find((c) => c.id === 'onion') || crops[0],
    total = crops.reduce((s, c) => s + c.quantity, 0);
  return (
    <>
      <Title
        kicker="THURSDAY, 11 SEPTEMBER"
        title={`Good morning, ${farmer.name.split(' ')[0]} 👋`}
        action={
          <button className="secondary" onClick={() => n('/crops')}>
            View my crops
          </button>
        }
      />
      <p className="intro">
        Here’s how your harvest is positioned in the market today.
      </p>
      <section className="stats">
        <Stat
          icon="🌱"
          label="Total crops"
          value={crops.length}
          detail={`${total} quintals in total`}
        />
        <Stat
          icon="▣"
          label="Best available price"
          value="₹2,700/q"
          detail="Mumbai Market · Onion"
        />
        <Stat
          icon="⌘"
          label="Active deals"
          value={deals.length}
          detail="Pickup scheduled"
        />
        <Stat
          icon="₹"
          label="Pending payment"
          value="₹72,000"
          detail="Expected in 3 days"
        />
      </section>
      <section className="grid">
        <div className="stack">
          <article className="card rec">
            <div className="card-title">
              <div>
                <small>SMART SELLING RECOMMENDATION</small>
                <h2>Sell {onion.name} to ABC Foods</h2>
              </div>
              <b>94% Match</b>
            </div>
            <div className="rec-data">
              <div>
                <small>RECOMMENDATION</small>
                <strong>SELL NOW</strong>
                <em>Strong market signals today</em>
              </div>
              <aside>
                <small>EXPECTED NET REALIZATION</small>
                <strong>
                  ₹2,520<i> / quintal</i>
                </strong>
                <p>Listed price: ₹2,700/q</p>
              </aside>
            </div>
            <ul>
              <li>✓ High current demand</li>
              <li>✓ Verified buyer</li>
              <li>✓ Pickup available</li>
            </ul>
            <button className="primary" onClick={() => n('/recommendation')}>
              View recommendation →
            </button>
          </article>
          <MarketPreview />
        </div>
        <div className="stack">
          <article className="card">
            <div className="card-title">
              <div>
                <small>RECENT ACTIVITY</small>
                <h2>Stay on top of your farm</h2>
              </div>
            </div>
            {notifications.map((x) => (
              <div className="activity" key={x.id}>
                <i>✦</i>
                <span>
                  <strong>{x.title}</strong>
                  <small>
                    {x.text} · {x.time}
                  </small>
                </span>
              </div>
            ))}
          </article>
          <article className="card">
            <div className="card-title">
              <div>
                <small>CURRENT HARVEST</small>
                <h2>Ready for market</h2>
              </div>
              <b>🧅</b>
            </div>
            <div className="crop-mini">
              <span>
                <strong>{onion.name}</strong>
                <small>
                  {onion.quality} · {onion.status}
                </small>
              </span>
              <strong>
                {onion.quantity}
                <i> quintals</i>
              </strong>
            </div>
            <button className="text" onClick={() => n('/buyers?crop=onion')}>
              Find matching buyers →
            </button>
          </article>
        </div>
      </section>
    </>
  );
}
function Stat(p) {
  return (
    <article>
      <i>{p.icon}</i>
      <div>
        <p>{p.label}</p>
        <strong>{p.value}</strong>
        <small>{p.detail}</small>
      </div>
    </article>
  );
}
function MarketPreview() {
  return (
    <article className="card">
      <div className="card-title">
        <div>
          <small>MARKET PULSE</small>
          <h2>Onion price trend</h2>
        </div>
        <Link className="text" to="/market">
          View market →
        </Link>
      </div>
      <div className="price">
        <strong>₹2,480</strong>
        <span>↑ 8.4% vs. last week</span>
      </div>
      <Chart data={marketData.Onion.history} />
    </article>
  );
}
export function Crops() {
  const { crops, addCrop, setSelectedCrop } = useApp(),
    n = useNavigate(),
    [add, setAdd] = useState(false),
    [form, setForm] = useState({
      name: '',
      quantity: '',
      quality: '',
      harvestDate: '',
      status: '',
      price: '',
    }),
    [errors, setErrors] = useState({});
  const submit = (e) => {
    e.preventDefault();
    const nextErrors = validateCrop(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    addCrop({ ...form, quantity: +form.quantity, price: +form.price || 0 });
    setAdd(false);
    setErrors({});
  };
  return (
    <>
      <Title
        kicker="FARM INVENTORY"
        title="My Crops"
        action={
          <button className="primary" onClick={() => setAdd(true)}>
            + Add Crop
          </button>
        }
      />
      <section className="crop-grid">
        {crops.map((c) => (
          <article className="card crop-card" key={c.id}>
            <div className="crop-head">
              <b>{c.emoji}</b>
              <Status>{c.status}</Status>
            </div>
            <h2>{c.name}</h2>
            <p>
              {c.quality} · Harvest: {formatDate(c.harvestDate)}
            </p>
            <div className="crop-numbers">
              <span>
                <strong>{c.quantity}</strong>
                <small>quintals</small>
              </span>
              <span>
                <strong>{money(c.price)}</strong>
                <small>market price / q</small>
              </span>
            </div>
            <div className="actions">
              <button
                className="secondary"
                onClick={() =>
                  alert(`${c.name}: ${c.quantity} quintals, ${c.quality}`)
                }
              >
                View
              </button>
              <button
                className="secondary"
                onClick={() =>
                  alert('Edit is available in the production workflow.')
                }
              >
                Edit
              </button>
              <button
                className="primary"
                onClick={() => {
                  setSelectedCrop(c.id);
                  n(`/buyers?crop=${c.id}`);
                }}
              >
                Find Buyers
              </button>
            </div>
          </article>
        ))}
      </section>
      {add && (
        <Modal title="Add a crop" onClose={() => setAdd(false)}>
          <form className="form" onSubmit={submit}>
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
                onChange={(e) =>
                  setForm({ ...form, harvestDate: e.target.value })
                }
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
            <button className="primary">Save crop</button>
          </form>
        </Modal>
      )}
    </>
  );
}
export function Market() {
  const [crop, setCrop] = useState('Onion');
  const d = marketData[crop];
  return (
    <>
      <Title kicker="MARKET INTELLIGENCE" title="Know your market" />
      <div className="filters">
        <label>
          Crop
          <select value={crop} onChange={(e) => setCrop(e.target.value)}>
            {Object.keys(marketData).map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          Location
          <select>
            <option>Nashik, Maharashtra</option>
            <option>Pune, Maharashtra</option>
          </select>
        </label>
      </div>
      <section className="stats market-stats">
        <Stat
          icon="₹"
          label="Current average"
          value={`${money(d.average)}/q`}
          detail="Across nearby markets"
        />
        <Stat
          icon="↗"
          label="7-day change"
          value={`${d.change > 0 ? '+' : ''}${d.change}%`}
          detail="Compared with last week"
        />
        <Stat
          icon="⌁"
          label="Predicted price"
          value={`${money(d.predicted)}/q`}
          detail="Next 7 days"
        />
        <Stat
          icon="●"
          label="Demand"
          value={d.demand}
          detail="Buyer interest"
        />
      </section>
      <section className="grid">
        <article className="card">
          <div className="card-title">
            <div>
              <small>7-DAY MARKET MOVEMENT</small>
              <h2>{crop} price trend</h2>
            </div>
          </div>
          <Chart data={d.history} />
        </article>
        <article className="card">
          <div className="card-title">
            <div>
              <small>NEARBY MARKETS</small>
              <h2>Compare selling locations</h2>
            </div>
          </div>
          {d.markets.map(([name, price, distance]) => (
            <div className="market" key={name}>
              <i />
              <span>
                <strong>{name}</strong>
                <small>{distance} away</small>
              </span>
              <b>
                {money(price)}
                <small>/q</small>
              </b>
            </div>
          ))}
        </article>
      </section>
    </>
  );
}
function Chart({ data }) {
  const w = 640,
    h = 180,
    min = Math.min(...data.map((x) => x[1])) - 80,
    max = Math.max(...data.map((x) => x[1])) + 80,
    pts = data
      .map(
        (x, i) =>
          `${(i * w) / (data.length - 1)},${h - 20 - ((x[1] - min) / (max - min)) * 125}`
      )
      .join(' ');
  return (
    <div className="chart">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <path d={`M0,${h} ${pts} ${w},${h}Z`} />
        <polyline points={pts} />
      </svg>
      <div>
        {data.map((x) => (
          <span key={x[0]}>{x[0].slice(0, 3)}</span>
        ))}
      </div>
    </div>
  );
}
export function Buyers() {
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
  const submit = (e) => {
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
      <Title
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
          <form className="form" onSubmit={submit}>
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
export function Recommendation() {
  const { crops, selectedCrop, createDeal } = useApp(),
    n = useNavigate(),
    crop = crops.find((c) => c.id === selectedCrop) || crops[0],
    ranked = rankedBuyers(crop, buyers),
    best = ranked[0],
    [confirm, setConfirm] = useState(false);

  if (!best) {
    return (
      <>
        <Title
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
      <Title
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
export function Deals() {
  const { deals } = useApp();
  return (
    <>
      <Title kicker="DEAL TRACKING" title="My Deals" />
      <section className="deals">
        {deals.map((d) => (
          <article className="card deal" key={d.id}>
            <div className="card-title">
              <div>
                <small>{d.id}</small>
                <h2>
                  {d.crop} · {d.quantity} quintals
                </h2>
              </div>
              <Status>{d.status}</Status>
            </div>
            <div className="deal-data">
              <span>
                Buyer<b>{d.buyer}</b>
              </span>
              <span>
                Price<b>{money(d.price)}/q</b>
              </span>
              <span>
                Total value<b>{money(d.total)}</b>
              </span>
              <span>
                Net realization<b>{money(d.net)}/q</b>
              </span>
            </div>
            <div className="timeline">
              {[
                'Deal Created',
                'Pickup Scheduled',
                'In Transit',
                'Delivered',
                'Payment Received',
              ].map((x, i) => {
                const state =
                  ['Deal Created', 'Pickup Scheduled'].indexOf(d.status) >= i ||
                  d.status === x;
                return (
                  <span className={state ? 'done' : ''} key={x}>
                    <i>{state ? '✓' : '○'}</i>
                    {x}
                  </span>
                );
              })}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
export function BuyerDashboard() {
  const { offers, requirements } = useApp();
  return (
    <>
      <Title kicker="PROCUREMENT OVERVIEW" title="Buyer Dashboard" />
      <section className="stats">
        <Stat
          icon="⌘"
          label="Active requirements"
          value={requirements.length}
          detail="Across 2 crops"
        />
        <Stat
          icon="↗"
          label="Incoming offers"
          value={incomingOffers.length + offers.length}
          detail="Awaiting review"
        />
        <Stat
          icon="♙"
          label="Recommended farmers"
          value="8"
          detail="High quality match"
        />
        <Stat icon="▣" label="Open orders" value="3" detail="In procurement" />
      </section>
      <section className="grid">
        <article className="card">
          <div className="card-title">
            <div>
              <small>ACTIVE REQUIREMENTS</small>
              <h2>Procurement progress</h2>
            </div>
            <Link className="text" to="/buyer/requirements">
              Manage →
            </Link>
          </div>
          {requirements.map((r) => (
            <div className="requirement" key={r.id}>
              <span>
                <b>{r.crop}</b>
                <small>
                  {r.quality} · Deadline {formatDate(r.requiredBy)}
                </small>
              </span>
              <strong>
                {r.received}/{r.quantity} q
              </strong>
              <i>
                <b style={{ width: `${(r.received / r.quantity) * 100}%` }} />
              </i>
            </div>
          ))}
        </article>
        <article className="card">
          <small>TOP RECOMMENDATION</small>
          <h2>Nashik FPO</h2>
          <p>100 quintals · Grade A Onion</p>
          <strong className="big">96% match</strong>
          <button className="primary">View farmer</button>
        </article>
      </section>
    </>
  );
}
export function Requirements() {
  const { requirements, createRequirement } = useApp();
  const [creating, setCreating] = useState(false);
  const [errors, setErrors] = useState({});
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
  const submit = (event) => {
    event.preventDefault();
    const nextErrors = validateRequirement(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    createRequirement({
      ...form,
      quantity: Number(form.quantity),
      offeredPrice: Number(form.offeredPrice),
      location: form.location.trim(),
      notes: form.notes.trim(),
    });
    setCreating(false);
    setErrors({});
  };

  return (
    <>
      <Title
        kicker="BUYER PROCUREMENT"
        title="My Requirements"
        action={
          <button className="primary" onClick={() => setCreating(true)}>
            + New Requirement
          </button>
        }
      />
      <section className="crop-grid">
        {requirements.map((r) => (
          <article className="card" key={r.id}>
            <Status>{r.status}</Status>
            <h2>{r.crop}</h2>
            <p>
              {r.quality} · Required by {r.deadline}
            </p>
            <div className="requirement">
              <strong>
                {r.received}/{r.quantity} q received
              </strong>
              <i>
                <b style={{ width: `${(r.received / r.quantity) * 100}%` }} />
              </i>
            </div>
            <p className="requirement-meta">
              {money(r.offeredPrice)}/q · {r.location} · {r.paymentTerms}
            </p>
          </article>
        ))}
      </section>
    </>
  );
}
export function Orders() {
  const { deals } = useApp();
  return (
    <>
      <Title kicker="BUYER PROCUREMENT" title="Orders" />
      <section className="deals">
        {deals.map((d) => (
          <article className="card deal" key={d.id}>
            <div className="card-title">
              <div>
                <small>{d.id}</small>
                <h2>
                  {d.crop} from{' '}
                  {d.buyer === 'ABC Foods' ? 'Ramesh Patil' : d.buyer}
                </h2>
              </div>
              <Status>{d.status}</Status>
            </div>
            <div className="deal-data">
              <span>
                Quantity<b>{d.quantity} quintals</b>
              </span>
              <span>
                Rate<b>{money(d.price)}/q</b>
              </span>
              <span>
                Order value<b>{money(d.total)}</b>
              </span>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
