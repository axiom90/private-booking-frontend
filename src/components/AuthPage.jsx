import React, { useState, useEffect } from 'react';
import { login, signup } from '../api.js';

const AUTH_STORAGE_KEY = 'linkbin_auth';

function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const isLogin = mode === 'login';

  useEffect(() => {
    const parseTokenFromUrl = () => {
      let tokenParamsString = '';

      if (window.location.hash && window.location.hash.length > 1) {
        tokenParamsString = window.location.hash.substring(1);
      } else if (window.location.search && window.location.search.length > 1) {
        tokenParamsString = window.location.search.substring(1);
      }

      if (!tokenParamsString) return;

      const params = new URLSearchParams(tokenParamsString);

      const urlError = params.get('error') || params.get('error_code');
      const urlErrorDescription = params.get('error_description');

      if (urlError || urlErrorDescription) {
        setInfo('');
        setError(
          urlErrorDescription ||
            'Login link is invalid or has expired. Please request a new one.'
        );

        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        return;
      }

      const token =
        params.get('access_token') ||
        params.get('token') ||
        params.get('session') ||
        params.get('login');

      const emailFromUrl = params.get('email');

      if (!token) return;

      const authData = {
        token,
        user: { email: emailFromUrl || email },
      };

      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
      } catch (e) {
        console.error('Failed to persist auth', e);
      }

      onAuthSuccess(authData);

      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    };

    parseTokenFromUrl();
  }, [onAuthSuccess, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      if (isLogin) {
        const result = await login(email, password);

        if (!result || !result.access_token) {
          throw new Error('Invalid response from server');
        }

        const authData = {
          token: result.access_token,
          user: result.user || { email },
        };

        try {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
        } catch (e) {
          console.error('Failed to persist auth', e);
        }

        onAuthSuccess(authData);
      } else {
        const result = await signup(email, password);

        if (result && result.error) {
          throw new Error(result.error);
        }

        setInfo(
          'Almost done! We just sent you a confirmation link. Open your email and click the link to finish creating your account.'
        );

        setMode('login');
        setPassword('');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="app-title">LinkBin</h1>
        <p className="app-subtitle">Private bookmarking for your favorite links</p>

        <div className="auth-toggle">
          <button
            type="button"
            className={isLogin ? 'toggle-btn active' : 'toggle-btn'}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={!isLogin ? 'toggle-btn active' : 'toggle-btn'}
            onClick={() => setMode('signup')}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
          </label>

          {error && <div className="error-box">{error}</div>}
          {info && <div className="info-box">{info}</div>}

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;
