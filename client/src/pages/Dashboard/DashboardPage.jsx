import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getDashboardStats } from '../../services/dashboardService';
import { getMarketByCrop } from '../../services/marketService';
import { PageTitle } from '../../components/common/PageTitle';
import { StatCard } from '../../components/common/StatCard';
import { PriceChart } from '../../components/common/PriceChart';
import { money } from '../../utils/format';

/**
 * PRICE CHART EXCEPTION:
 * The 7-day price history arrays below are intentionally hard-coded illustrative
 * data. They are isolated here so they can be connected to a real historical
 * price API in the future without touching anything else.
 */
const CHART_HISTORY = {
  Onion: [
    ['Monday', 2280],
    ['Tuesday', 2320],
    ['Wednesday', 2350],
    ['Thursday', 2410],
    ['Friday', 2420],
    ['Saturday', 2450],
    ['Sunday', 2480],
  ],
};

export function DashboardPage() {
  const { farmer, crops, cropsLoading } = useApp();
  const n = useNavigate();

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  const [onionMarket, setOnionMarket] = useState(null);
  const [marketLoading, setMarketLoading] = useState(true);

  // Featured crop for the dashboard card — prefer Onion, fallback to first
  const featuredCrop = crops.find((c) => c.name === 'Onion') || crops[0];

  useEffect(() => {
    async function load() {
      setStatsLoading(true);
      setStatsError(null);
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setStatsError(err.message);
      } finally {
        setStatsLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    async function loadMarket() {
      setMarketLoading(true);
      try {
        const data = await getMarketByCrop('Onion');
        setOnionMarket(data);
      } catch {
        setOnionMarket(null);
      } finally {
        setMarketLoading(false);
      }
    }
    loadMarket();
  }, []);

  const today = new Date()
    .toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
    .toUpperCase();

  if (statsLoading || cropsLoading) {
    return (
      <>
        <PageTitle
          kicker={today}
          title={`Good morning, ${farmer.name.split(' ')[0]} 👋`}
        />
        <p className="intro">Loading dashboard…</p>
      </>
    );
  }

  if (statsError) {
    return (
      <>
        <PageTitle kicker={today} title="Dashboard" />
        <p className="intro" style={{ color: 'var(--danger, #e53e3e)' }}>
          Failed to load dashboard: {statsError}
        </p>
      </>
    );
  }

  const notifications = stats?.notifications ?? [];

  // Best buyer price from Onion market data
  const bestPrice = onionMarket
    ? Math.max(...(onionMarket.markets?.map((m) => m.price) ?? [0]))
    : null;

  return (
    <>
      <PageTitle
        kicker={today}
        title={`Good morning, ${farmer.name.split(' ')[0]} 👋`}
        action={
          <button className="secondary" onClick={() => n('/crops')}>
            View my crops
          </button>
        }
      />
      <p className="intro">
        Here&apos;s how your harvest is positioned in the market today.
      </p>
      <section className="stats">
        <StatCard
          icon="🌱"
          label="Total crops"
          value={stats.cropCount}
          detail={`${stats.totalQuantity} quintals in total`}
        />
        <StatCard
          icon="▣"
          label="Best available price"
          value={bestPrice ? `${money(bestPrice)}/q` : '—'}
          detail={
            onionMarket
              ? `${onionMarket.markets?.[onionMarket.markets.length - 1]?.name ?? ''} · Onion`
              : 'Loading…'
          }
        />
        <StatCard
          icon="⌘"
          label="Active deals"
          value={stats.dealCount}
          detail="Pickup scheduled"
        />
        <StatCard
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
                <h2>
                  Sell {featuredCrop ? featuredCrop.name : 'your crop'} to ABC
                  Foods
                </h2>
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
          <MarketPulseCard
            market={onionMarket}
            loading={marketLoading}
            chartData={CHART_HISTORY.Onion}
          />
        </div>
        <div className="stack">
          <article className="card">
            <div className="card-title">
              <div>
                <small>RECENT ACTIVITY</small>
                <h2>Stay on top of your farm</h2>
              </div>
            </div>
            {notifications.length === 0 ? (
              <p style={{ opacity: 0.6 }}>No recent activity.</p>
            ) : (
              notifications.map((x) => (
                <div className="activity" key={x._id}>
                  <i>✦</i>
                  <span>
                    <strong>{x.title}</strong>
                    <small>
                      {x.text} · {x.time}
                    </small>
                  </span>
                </div>
              ))
            )}
          </article>
          {featuredCrop && (
            <article className="card">
              <div className="card-title">
                <div>
                  <small>CURRENT HARVEST</small>
                  <h2>Ready for market</h2>
                </div>
                <b>{featuredCrop.emoji}</b>
              </div>
              <div className="crop-mini">
                <span>
                  <strong>{featuredCrop.name}</strong>
                  <small>
                    {featuredCrop.quality} · {featuredCrop.status}
                  </small>
                </span>
                <strong>
                  {featuredCrop.quantity}
                  <i> quintals</i>
                </strong>
              </div>
              <button
                className="text"
                onClick={() => n(`/buyers?crop=${featuredCrop._id}`)}
              >
                Find matching buyers →
              </button>
            </article>
          )}
        </div>
      </section>
    </>
  );
}

function MarketPulseCard({ market, loading, chartData }) {
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
      {loading ? (
        <p style={{ opacity: 0.6 }}>Loading market data…</p>
      ) : market ? (
        <>
          <div className="price">
            <strong>{money(market.average)}</strong>
            <span>
              {market.change > 0 ? '↑' : '↓'} {Math.abs(market.change)}% vs.
              last week
            </span>
          </div>
          <PriceChart data={chartData} />
        </>
      ) : (
        <p style={{ opacity: 0.6 }}>Market data unavailable.</p>
      )}
    </article>
  );
}
