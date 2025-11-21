import React, { useEffect, useState } from 'react';
import { getLinks, createLink, getMe } from '../api.js';
import AddLinkForm from './AddLinkForm.jsx';
import LinkList from './LinkList.jsx';

function Dashboard({ auth, onLogout }) {
  const { token, user } = auth;

  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [currentUser, setCurrentUser] = useState(user || null);
  const [userLoading, setUserLoading] = useState(true);

  const loadUser = async () => {
    setUserLoading(true);
    try {
      const me = await getMe(token);
      setCurrentUser(me);
    } catch (err) {
      console.error('Failed to load user info', err);
    } finally {
      setUserLoading(false);
    }
  };

  const loadLinks = async (pageToLoad = page) => {
    setLoading(true);
    setError('');
    try {
      const data = await getLinks(token, {
        page: pageToLoad,
        pageSize,
      });

      setLinks(data.items);
      setPage(data.page);
      setTotalItems(data.totalItems);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
    loadLinks(1);
  }, [token]);

  const handleAddLink = async ({ title, url }) => {
    setCreating(true);
    setError('');
    try {
      await createLink(token, { title, url });
      await loadLinks(1);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create link');
    } finally {
      setCreating(false);
    }
  };

  const displayEmail =
    currentUser?.email || (user && user.email) || (userLoading ? 'Loading…' : 'User');

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="dashboard-shell">
      <div className="dashboard-inner">
        <header className="dashboard-header">
          <div>
            <h1 className="app-title">LinkBin</h1>
            <p className="app-subtitle">Your private bookmark collection</p>
          </div>
          <div className="dashboard-header-right">
            <span className="user-pill">{displayEmail}</span>
            <button className="secondary-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </header>

        <main className="dashboard-main">
          <section className="dashboard-card">
            <h2 className="section-title">Add a new link</h2>
            <AddLinkForm onSubmit={handleAddLink} loading={creating} />
          </section>

          <section className="dashboard-card">
            <div className="links-top-row">
              <h2 className="section-title">Your saved links</h2>
              <button
                className="secondary-btn small"
                onClick={() => loadLinks(page)}
                disabled={loading}
              >
                ⟳ Refresh
              </button>
            </div>

            {error && <div className="error-box">{error}</div>}

            <div className="links-content">
              <LinkList links={links} loading={loading} />

              <div className="pagination-row">
                <button
                  className="secondary-btn small"
                  onClick={() => canPrev && loadLinks(page - 1)}
                  disabled={!canPrev || loading}
                >
                  ← Previous
                </button>
                <span className="pagination-info">
                  Page {page} of {totalPages}{' '}
                  {totalItems ? `(total ${totalItems} links)` : ''}
                </span>
                <button
                  className="secondary-btn small"
                  onClick={() => canNext && loadLinks(page + 1)}
                  disabled={!canNext || loading}
                >
                  Next →
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
