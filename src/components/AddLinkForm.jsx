import React, { useState } from 'react';

function AddLinkForm({ onSubmit, loading }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    onSubmit({ title: title.trim(), url: url.trim() });
    setTitle('');
    setUrl('');
  };

  return (
    <form className="add-link-form" onSubmit={handleSubmit}>
      <label className="field">
        <span>Title</span>
        <input
          type="text"
          placeholder="My favorite article"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>

      <label className="field">
        <span>URL</span>
        <input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </label>

      <button type="submit" className="primary-btn" disabled={loading}>
        {loading ? 'Saving…' : 'Save link'}
      </button>
    </form>
  );
}

export default AddLinkForm;
