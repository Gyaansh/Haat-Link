import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const farmerLinks = [
  ['/dashboard', '▦', 'Dashboard'],
  ['/crops', '⌘', 'My Crops'],
  ['/market', '⌁', 'Market Intelligence'],
  ['/buyers', '♙', 'Buyers'],
  ['/recommendation', '✦', 'Smart Recommendation'],
  ['/deals', '▣', 'My Deals'],
];

const buyerLinks = [
  ['/buyer/dashboard', '▦', 'Dashboard'],
  ['/buyer/requirements', '⌘', 'Requirements'],
  ['/buyer/orders', '▣', 'Orders'],
];

function Frame({ buyer = false }) {
  const { farmer, buyerUser, setRole, toast, setToast } = useApp(),
    nav = useNavigate(),
    user = buyer ? buyerUser : farmer,
    items = buyer ? buyerLinks : farmerLinks;

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <i>🌿</i> Agri<span>Link</span>
        </div>
        <small>{buyer ? 'BUYER WORKSPACE' : 'FARMER WORKSPACE'}</small>
        <nav>
          {items.map(([to, icon, label]) => (
            <NavLink key={to} to={to}>
              {icon}
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="side-bottom">
          <button onClick={() => alert(`${user.name}\n${user.phone}`)}>
            ● Profile
          </button>
          <button onClick={() => alert('Language: English')}>
            ◎ Language <em>EN</em>
          </button>
          <button
            onClick={() => {
              setRole('');
              nav('/login');
            }}
          >
            × Logout
          </button>
        </div>
      </aside>
      <main className="content">
        <header>
          <span>
            {buyer ? 'Buyer' : 'Farmer'} workspace <b>/</b>{' '}
            {buyer ? 'Procurement' : 'Market intelligence'}
          </span>
          <div>
            ● <strong>{user.initials}</strong>
            <small>
              {user.name}
              <em>{user.location}</em>
            </small>
          </div>
        </header>
        <div className="page">
          <Outlet />
        </div>
      </main>
      {toast && (
        <div className="toast">
          ✓ {toast}
          <button onClick={() => setToast(null)}>×</button>
        </div>
      )}
    </div>
  );
}

export function Layout() {
  return <Frame />;
}

export function BuyerLayout() {
  return <Frame buyer />;
}
