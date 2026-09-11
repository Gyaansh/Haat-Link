import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { marketData } from '../../data/mockData';
import { PageTitle } from '../../components/common/PageTitle';
import { StatCard } from '../../components/common/StatCard';
import { PriceChart } from '../../components/common/PriceChart';
import { money } from '../../utils/format';

export function DashboardPage() {
  const { farmer, crops, deals, notifications } = useApp(),
    n = useNavigate();

  const onion = crops.find((c) => c.id === 'onion') || crops[0],
    total = crops.reduce((s, c) => s + c.quantity, 0);

  return (
    <>
      <PageTitle
        kicker="THURSDAY, 11 SEPTEMBER"
        title={`Good morning, ${farmer.name.split(' ')[0]} 👋`}
        action={
          <button className="secondary" onClick={() => n('/crops')}>
            View my crops
          </button>
        }
      />
      <p className="intro">
        Here's how your harvest is positioned in the market today.
      </p>
      <section className="stats">
        <StatCard
          icon="🌱"
          label="Total crops"
          value={crops.length}
          detail={`${total} quintals in total`}
        />
        <StatCard
          icon="▣"
          label="Best available price"
          value="₹2,700/q"
          detail="Mumbai Market · Onion"
        />
        <StatCard
          icon="⌘"
          label="Active deals"
          value={deals.length}
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
          <MarketPulseCard />
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

function MarketPulseCard() {
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
      <PriceChart data={marketData.Onion.history} />
    </article>
  );
}
