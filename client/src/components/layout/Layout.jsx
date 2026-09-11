import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';

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
  const { farmer, buyerUser, setRole, toast, setToast } = useApp();
  const { user: authUser, logout } = useAuth();
  const nav = useNavigate();

  const [showProfile, setShowProfile] = useState(false);

  const displayUser = buyer ? buyerUser : farmer;
  const items = buyer ? buyerLinks : farmerLinks;

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setRole('farmer');
      nav('/login');
    }
  };

  const handlePerspectiveChange = (targetRole) => {
    setRole(targetRole);
    nav(targetRole === 'buyer' ? '/buyer/dashboard' : '/dashboard');
  };

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <i>🌿</i> Haat<span>Link</span>
        </div>
        <small>{buyer ? 'BUYER WORKSPACE' : 'FARMER WORKSPACE'}</small>

        <div className="perspective-switch" title="Switch workspace view">
          <button
            type="button"
            className={!buyer ? 'active' : ''}
            onClick={() => handlePerspectiveChange('farmer')}
          >
            🌾 Farmer
          </button>
          <button
            type="button"
            className={buyer ? 'active' : ''}
            onClick={() => handlePerspectiveChange('buyer')}
          >
            🏢 Buyer
          </button>
        </div>

        <nav>
          {items.map(([to, icon, label]) => (
            <NavLink key={to} to={to}>
              {icon}
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="side-bottom">
          <button type="button" onClick={() => setShowProfile(true)}>
            ● Profile
          </button>
          <button
            type="button"
            onClick={() => setToast('Language set to English (Default)')}
          >
            ◎ Language <em>EN</em>
          </button>
          <button type="button" onClick={handleLogout}>
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
          <div
            onClick={() => setShowProfile(true)}
            style={{ cursor: 'pointer' }}
            title="Click to view profile details"
          >
            ● <strong>{displayUser.initials}</strong>
            <small>
              {displayUser.name}
              <em>{displayUser.location}</em>
            </small>
          </div>
        </header>

        <div className="page">
          <Outlet />
        </div>
      </main>

      {showProfile && (
        <Modal title="User Profile" onClose={() => setShowProfile(false)}>
          <div
            className="detail"
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            <p>
              <strong>Name:</strong> {authUser?.name || displayUser.name}
            </p>
            <p>
              <strong>Username:</strong> {authUser?.username || '—'}
            </p>
            <p>
              <strong>Phone:</strong> {authUser?.phone || displayUser.phone}
            </p>
            <p>
              <strong>Registered Role:</strong>{' '}
              <span style={{ textTransform: 'capitalize' }}>
                {authUser?.role || (buyer ? 'buyer' : 'farmer')}
              </span>
            </p>
            <p>
              <strong>Active Workspace:</strong>{' '}
              {buyer ? 'Institutional Buyer' : 'Producer / Farmer'}
            </p>
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="secondary"
                onClick={() => setShowProfile(false)}
              >
                Close
              </button>
              <button type="button" className="primary" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          </div>
        </Modal>
      )}

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
