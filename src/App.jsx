import React, { useState } from 'react';
import AuthPage from './components/AuthPage.jsx';
import Dashboard from './components/Dashboard.jsx';

const LOCAL_STORAGE_KEY = 'linkbin_auth';

function App() {
  const [auth, setAuth] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error('Failed to parse auth from localStorage', e);
      return null;
    }
  });

  const handleAuthSuccess = (authData) => {
    setAuth(authData);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(authData));
  };

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <div className="app-root">
      {!auth ? (
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      ) : (
        <Dashboard auth={auth} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
