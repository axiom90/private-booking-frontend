import React from 'react';

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString();
}

function LinkList({ links, loading }) {
  return (
    <div className="links-table-container">
      <table className="links-table">
        <thead>
          <tr>
            <th style={{ width: '40%' }}>Title</th>
            <th style={{ width: '40%' }}>URL</th>
            <th style={{ width: '20%' }}>Saved at</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={3} className="links-table-empty">
                Loading links…
              </td>
            </tr>
          ) : links.length === 0 ? (
            <tr>
              <td colSpan={3} className="links-table-empty">
                No links to show yet. Add your first one above.
              </td>
            </tr>
          ) : (
            links.map((link) => (
              <tr key={link.id}>
                <td className="links-table-title">
                  {link.title || '(No title)'}
                </td>
                <td className="links-table-url">
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.url}
                  </a>
                </td>
                <td className="links-table-date">
                  {formatDate(link.created_at)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default LinkList;
