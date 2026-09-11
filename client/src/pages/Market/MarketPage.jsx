import { useState, useEffect } from 'react';
import { getMarkets } from '../../services/marketService';
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
  Tomato: [
    ['Monday', 1710],
    ['Tuesday', 1735],
    ['Wednesday', 1750],
    ['Thursday', 1780],
    ['Friday', 1805],
    ['Saturday', 1820],
    ['Sunday', 1850],
  ],
  Potato: [
    ['Monday', 2010],
    ['Tuesday', 1990],
    ['Wednesday', 1980],
    ['Thursday', 1975],
    ['Friday', 1960],
    ['Saturday', 1955],
    ['Sunday', 1950],
  ],
};

export function MarketPage() {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState('Onion');

  useEffect(() => {
    setLoading(true);
    setError(null);
    getMarkets()
      .then((data) => {
        setMarkets(data);
        if (data.length > 0 && !data.find((m) => m.crop === selectedCrop)) {
          setSelectedCrop(data[0].crop);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const d = markets.find((m) => m.crop === selectedCrop);
  const chartData = CHART_HISTORY[selectedCrop] ?? [];

  if (loading) {
    return (
      <>
        <PageTitle kicker="MARKET INTELLIGENCE" title="Know your market" />
        <p className="intro">Loading market data…</p>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageTitle kicker="MARKET INTELLIGENCE" title="Know your market" />
        <p className="intro" style={{ color: 'var(--danger, #e53e3e)' }}>
          Failed to load market data: {error}
        </p>
      </>
    );
  }

  return (
    <>
      <PageTitle kicker="MARKET INTELLIGENCE" title="Know your market" />
      <div className="filters">
        <label>
          Crop
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
          >
            {markets.map((m) => (
              <option key={m.crop}>{m.crop}</option>
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

      {d ? (
        <>
          <section className="stats market-stats">
            <StatCard
              icon="₹"
              label="Current average"
              value={`${money(d.average)}/q`}
              detail="Across nearby markets"
            />
            <StatCard
              icon="↗"
              label="7-day change"
              value={`${d.change > 0 ? '+' : ''}${d.change}%`}
              detail="Compared with last week"
            />
            <StatCard
              icon="⌁"
              label="Predicted price"
              value={`${money(d.predicted)}/q`}
              detail="Next 7 days"
            />
            <StatCard
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
                  <h2>{selectedCrop} price trend</h2>
                </div>
              </div>
              {chartData.length > 0 ? (
                <PriceChart data={chartData} />
              ) : (
                <p style={{ opacity: 0.6 }}>Chart data not available.</p>
              )}
            </article>
            <article className="card">
              <div className="card-title">
                <div>
                  <small>NEARBY MARKETS</small>
                  <h2>Compare selling locations</h2>
                </div>
              </div>
              {d.markets && d.markets.length > 0 ? (
                d.markets.map((m) => (
                  <div className="market" key={m.name}>
                    <i />
                    <span>
                      <strong>{m.name}</strong>
                      <small>{m.distance} away</small>
                    </span>
                    <b>
                      {money(m.price)}
                      <small>/q</small>
                    </b>
                  </div>
                ))
              ) : (
                <p style={{ opacity: 0.6 }}>No nearby markets listed.</p>
              )}
            </article>
          </section>
        </>
      ) : (
        <p className="intro" style={{ opacity: 0.6 }}>
          No market data available for {selectedCrop}.
        </p>
      )}
    </>
  );
}
