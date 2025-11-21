const API_BASE_URL =import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function handleResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  let data = null;

  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = { message: text };
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    if (data) {
      if (Array.isArray(data.detail)) {
        const msgs = data.detail
          .map((d) => d.msg || JSON.stringify(d))
          .join('; ');
        if (msgs) message = msgs;
      } else if (typeof data.detail === 'string') {
        message = data.detail;
      } else if (typeof data.message === 'string') {
        message = data.message;
      }
    }

    throw new Error(message);
  }

  return data;
}


export async function signup(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  return await handleResponse(res);
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  return await handleResponse(res);
}

export async function getMe(token) {
  const res = await fetch(`${API_BASE_URL}/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await handleResponse(res);
}


export async function getLinks(token, { page = 1, pageSize = 10 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });

  const res = await fetch(`${API_BASE_URL}/api/links?${params.toString()}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const raw = await handleResponse(res);

  return {
    items: raw.items ?? [],
    page,
    pageSize,
    totalItems: raw.total_items ?? 0,
    totalPages: raw.total_pages ?? 1,
  };
}

export async function createLink(token, { title, url }) {
  const res = await fetch(`${API_BASE_URL}/api/links`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, url }),
  });

  return await handleResponse(res);
}
