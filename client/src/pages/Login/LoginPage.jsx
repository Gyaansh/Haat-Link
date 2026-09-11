import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export function LoginPage() {
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
        <footer>✓ Built for India's growers and buyers</footer>
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
