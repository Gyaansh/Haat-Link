import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { marketData } from '../../data/mockData';
import { PageTitle } from '../../components/common/PageTitle';
import { StatCard } from '../../components/common/StatCard';
import { PriceChart } from '../../components/common/PriceChart';
import { money } from '../../utils/format';

export function MarketPage() {
  const [crop, setCrop] = useState('Onion');
  const d = marketData[crop];

  return (
    <>
      <PageTitle kicker="MARKET INTELLIGENCE" title="Know your market" />
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
              <h2>{crop} price trend</h2>
            </div>
          </div>
          <PriceChart data={d.history} />
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
