import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

function EyeIcon({ show }) {
  return show ? (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function LoginPage() {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password visibility state
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regUsername, setRegUsername] = useState('');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState('farmer');
  const [regPassword, setRegPassword] = useState('');

  const { login, register } = useAuth();
  const { setRole } = useApp();
  const navigate = useNavigate();

  // Password strength calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'None', className: '' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd) || /[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', className: 'weak' };
    if (score === 2) return { score: 2, label: 'Fair', className: 'fair' };
    if (score === 3) return { score: 3, label: 'Good', className: 'good' };
    return { score: 4, label: 'Strong', className: 'strong' };
  };

  const strength = getPasswordStrength(regPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!loginIdentifier.trim() || !loginPassword) {
      setError('Please enter your username/phone and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(loginIdentifier.trim(), loginPassword);
      const userRole = res.user?.role || 'farmer';
      setRole(userRole);
      navigate(userRole === 'buyer' ? '/buyer/dashboard' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!regUsername.trim() || !regPhone.trim() || !regPassword) {
      setError('Username, phone number, and password are required.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        username: regUsername.trim(),
        name: regName.trim() || regUsername.trim(),
        phone: regPhone.trim(),
        role: regRole,
        password: regPassword,
      });
      const userRole = res.user?.role || regRole;
      setRole(userRole);
      navigate(userRole === 'buyer' ? '/buyer/dashboard' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check input.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-intro">
        <div className="brand">
          <i>🌿</i> Haat<span>Link</span>
        </div>
        <div>
          <small>MARKET INTELLIGENCE FOR GROWERS & BUYERS</small>
          <h1>
            Sell smarter.
            <br />
            <em>Grow stronger.</em>
          </h1>
          <p>
            Transparent market intelligence, direct buyer matching, and secure
            real-time trade decisions for agricultural produce.
          </p>
        </div>
        <footer>✓ Built for India's growers and institutional buyers</footer>
      </section>

      <section className="login-panel">
        <div className="login-card">
          <small>SECURE ACCESS</small>
          <h2>{tab === 'login' ? 'Welcome back' : 'Create an account'}</h2>
          <p>
            {tab === 'login'
              ? 'Log in to manage your harvest listings and trade deals.'
              : 'Join HaatLink to access market rates and verified partners.'}
          </p>

          <div className="auth-tabs" role="tablist">
            <button
              type="button"
              className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
              onClick={() => {
                setTab('login');
                setError('');
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
              onClick={() => {
                setTab('register');
                setError('');
              }}
            >
              Register
            </button>
          </div>

          {error && <div className="auth-error-badge">{error}</div>}

          {tab === 'login' ? (
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="auth-field">
                <label htmlFor="login-id">Username or Phone</label>
                <input
                  id="login-id"
                  type="text"
                  placeholder="e.g. ramesh or 9876543210"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  disabled={loading}
                  autoComplete="username"
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="login-pwd">Password</label>
                <div className="password-input-wrap">
                  <input
                    id="login-pwd"
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    disabled={loading}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                    aria-label={
                      showLoginPassword ? 'Hide password' : 'Show password'
                    }
                    title={
                      showLoginPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    <EyeIcon show={showLoginPassword} />
                  </button>
                </div>
              </div>

              <button type="submit" className="primary full" disabled={loading}>
                {loading ? 'Authenticating...' : 'Sign In →'}
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleRegister}>
              <div className="auth-field">
                <label htmlFor="reg-user">Username</label>
                <input
                  id="reg-user"
                  type="text"
                  placeholder="e.g. suresh_patil"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  disabled={loading}
                  autoComplete="username"
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="reg-name">Full Name</label>
                <input
                  id="reg-name"
                  type="text"
                  placeholder="e.g. Suresh Patil"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  disabled={loading}
                  autoComplete="name"
                />
              </div>

              <div className="auth-field">
                <label htmlFor="reg-phone">Phone Number</label>
                <input
                  id="reg-phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  disabled={loading}
                  autoComplete="tel"
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="reg-role">Account Type</label>
                <select
                  id="reg-role"
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  disabled={loading}
                >
                  <option value="farmer">Farmer (Sell produce)</option>
                  <option value="buyer">
                    Institutional Buyer (Procure crops)
                  </option>
                </select>
              </div>

              <div className="auth-field">
                <label htmlFor="reg-pwd">Password</label>
                <div className="password-input-wrap">
                  <input
                    id="reg-pwd"
                    type={showRegPassword ? 'text' : 'password'}
                    placeholder="Minimum 6 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    disabled={loading}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowRegPassword((prev) => !prev)}
                    aria-label={
                      showRegPassword ? 'Hide password' : 'Show password'
                    }
                    title={showRegPassword ? 'Hide password' : 'Show password'}
                  >
                    <EyeIcon show={showRegPassword} />
                  </button>
                </div>
                {regPassword && (
                  <div className="password-strength">
                    <progress
                      max="4"
                      value={strength.score}
                      className={strength.className}
                    />
                    <div className="strength-label">
                      <span>Password strength</span>
                      <b className={strength.className}>{strength.label}</b>
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" className="primary full" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account →'}
              </button>
            </form>
          )}

          <aside>
            Powered by MongoDB & Express Auth · Session stored in secure cookie
          </aside>
        </div>
      </section>
    </main>
  );
}
